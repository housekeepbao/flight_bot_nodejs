'use strict';


const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
/*
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
*/
const config = require('./lineconfig.js').lineAccoessTokenConfig

// create LINE SDK client
const client = new line.Client(config);

// call the other function 
const dialogFunction = require('./dialogfunction.js')
const questionnaireFunction = require('./questionnairefunction.js')
const lineapi = require('./lineapi.js')
const api = require('./api.js')
const menufunction = require('./menufunction.js')
const adsfunction = require('./adsfunction.js')
const socketIoFunction = require('./socketIoFunction.js')
// create Express app
// about Express itself: https://expressjs.com/
const app = express();
var askMemberInfoSessionDict = {};
var askUserFavoriteSessionDict = {};
var typeOfReturn = "type = return"
var typeOfDepart = "type = depart"
var datetimeType = { typeOfDepart: 'depart_date', typeOfReturn: 'return_date' }

//======================socket=========================
var events = {
  "newMessage": "new message",
  "typing": "typing",
  "stopTyping": "stop typing",
  "disconnect": "disconnect",
  "connection": "connection",
  "userLeft": "user left",
  "userJoined": "user joined",
  "customerServiceJoined": "customer service joined",
  "customerServiceLeft": "customer service left",
  "pickUp": "pick up",
  "resumeBotMode": "resume bot mode"
}
var socketClient = require('socket.io-client')('https://www.flightgoai-service.com:9103');
var usersManager = {};
var chatRoomManager = {}
//=====================================================
//======================parameter======================
const travelKindDict = {
  'china': '中國旅遊',
  'Oceania': '紐澳旅遊',
  'America_Canada': '美加旅遊',
  'Europe': '歐洲旅遊',
  'south_asia': '南北亞旅遊',
  'southeast_asia': '東南亞旅遊',
  'Central_Eastern_Africa': '中東非旅遊',
  'Cruiseship': '郵輪旅遊',
  'JP_Korea': '日韓旅遊',
  'Islands': '島嶼度假'
}
//=====================================================

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event);
        case 'image':
          return handleImage(message, event);
        case 'video':
          return handleVideo(message, event);
        case 'audio':
          return handleAudio(message, event);
        case 'location':
          return handleLocation(message, event);
        case 'sticker':
          return handleSticker(message, event);
        case 'postback':
          return handlePostback(message, event);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return followEvent(event);

    case 'unfollow':
      return unfollowEvent(event);

    case 'join':
      return joinEvent(event);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return handlePostback(event);

    case 'beacon':
      return replyText(event, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}
function handleText(message, event) {
  console.log('#MessageEvent#')
  console.log(event)
  var userKey = event.source.userId
  api.getLineUser(event.source.userId, function (user) {
    console.log('user data', user)
    if (user == null) {
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: '您尚未加入，請重新加入或解除封鎖'
      });
    }
    usersManager[user.userId] = user
    chatRoomManager[user.userId] = {
      userId: user.userId,
      customerServiceId: user.customerServiceId,
      chatRoomId: user.chatRoomId,
    }
    if (usersManager[user.userId].isBotMode) {
      if ((userKey in askMemberInfoSessionDict) && askMemberInfoSessionDict[userKey][0] === "ask_session_start") {
        dialogFunction.askPaperMemberInfo(askMemberInfoSessionDict, event, function (sessionDict, isFinish) {
          if (isFinish != true) {
            askMemberInfoSessionDict = sessionDict
          }
          else {
            askMemberInfoSessionDict = sessionDict
            askUserFavoriteSessionDict = questionnaireFunction.askUserFavoriteTravel(userKey, askUserFavoriteSessionDict)
            askMemberInfoSessionDict[userKey]
            api.createLineUser(userKey, askMemberInfoSessionDict[userKey][4], askMemberInfoSessionDict[userKey][3], askMemberInfoSessionDict[userKey][2], askMemberInfoSessionDict[userKey][5], function (response) {
              console.log("response is", response)
            });
          }
        })
      }
      else if (message.text.indexOf("[menu]") != -1) {
        var tmpList = ["ask_session_start"]
        askMemberInfoSessionDict[user.userId] = tmpList
        menufunction.menuFeature(event, askMemberInfoSessionDict)
      }
      else {
        switch (message.text) {
          case ("喜好問卷"):
            askUserFavoriteSessionDict = questionnaireFunction.askUserFavoriteTravel(userKey, askUserFavoriteSessionDict)
            break;
          case ("廣告"):
            adsfunction.getAdsInfoCarousel(userKey)
            break;
          case ("Flex"):
            adsfunction.getFlexTemplate(userKey)
            break;
          case "客服":
          case ("請求客服"):
            user.type = "user"
            socketClient.emit(events.userJoined, user);
            //save message to db
            api.storeChatMessage(event.message.text, usersManager[user.userId].chatRoomId, false,
              usersManager[user.userId].userId, null, function () {
                console.log('event.message.text inserted', event.message.text)
              });
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: "轉接客服中.."
            });
            break;
          default:
            api.storeChatMessage(event.message.text, usersManager[user.userId].chatRoomId, true,
              usersManager[user.userId].userId, null, function () {
                console.log('event.message.text inserted', event.message.text)
              });
            dialogFunction.otherSession(event)
        }
      }
    }
    else {
      console.log('客服模式 message:', event.message.text);
      switch (event.message.text) {
        case "斷線":
        case "離開":
        case "結束":
        case "結束客服":
          // disconnect this user

          socketClient.emit(events.userLeft, user);
          break;
        default:

          console.log('chatRoomManager:', chatRoomManager[user.userId])

          //SEND MESSAGE TO CUSTOMER SERVICE
          socketClient.emit(events.newMessage, {
            type: "user",
            providerId: user.providerId,
            userId: user.userId,
            customerServiceId: chatRoomManager[user.userId],
            chatRoomId: chatRoomManager[user.userId].chatRoomId,
            name: user.name,
            message: event.message.text
          });
      }

      //save message to db
      api.storeChatMessage(event.message.text, usersManager[user.userId].chatRoomId, false,
        usersManager[user.userId].userId, null, function () {
          console.log('event.message.text inserted', event.message.text)
        });
    }
  })
}

function handleImage(message, event) {

}

function handleVideo(message, event) {

}

function handleAudio(message, event) {

}

function handleLocation(message, event) {

}

function handleSticker(message, event) {

}

function handlePostback(event) {
  console.log("#PostbackEvent#")
  console.log(event)
  var userKey = event.source.userId
  console.log(event.postback.data)
  var dataContent = event.postback.data
  if (dataContent.indexOf("travel") != -1) {
    if (dataContent.indexOf("Done") != -1) {
      console.log(askUserFavoriteSessionDict[userKey])
      messageTextTmp = "太好了，已經完成喜好旅遊類型問卷囉。"
      var messageText = { type: 'text', text: messageTextTmp };
      var messageSlicker = {
        type: "sticker",
        packageId: '1',
        stickerId: '134'
      }
      lineapi.pushText(userKey, [messageText, messageSlicker]).then(() => {
        questionnaireFunction.saveFavoriteQuestionnaire(
          userKey, askUserFavoriteSessionDict[userKey])
      }).catch(() => {
        // error handling
        console.log('sent message failed so dont ask questionnaire ')
      });
    }
    else if (dataContent.indexOf("ask") != -1) {
      askUserFavoriteSessionDict = questionnaireFunction.askUserFavoriteTravel(userKey, askUserFavoriteSessionDict)
    }
    else {
      var tmpList = askUserFavoriteSessionDict[userKey]
      var contentTmp = event.postback.data.split(",")
      console.log("favorite is " + contentTmp[-1])
      tmpList.push(contentTmp[-1])
      askUserFavoriteSessionDict[userKey] = tmpList
      var messageTextTmp = "選擇喜好旅遊類型:" +
        travelKindDict[contentTmp[-1]] + "\n\n"
      messageTextTmp += "可繼續點選喜好的旅遊類型，也可點擊完成問卷按鈕"
      var message = { type: 'text', text: messageTextTmp };
      ticketsText = {
        "type": "template",
        "altText": '確認按鈕',
        "template": {
          "type": "confirm",
          "title": '是否完成喜好旅遊問卷',
          "text": '如完成喜好問卷，請點選已完成，如還未選完可繼續點擊喜好旅遊類型',
          "actions": [
            {
              "type": "postback",
              "label": "已完成",
              "data": "travel Done"
            },
            {
              "type": "postback",
              "label": "喜好旅遊類型",
              "data": "travel ask"
            }
          ]
        }
      }
      lineapi.pushText(userKey, message)
    }
  }
  else {
    if (dataContent === 'reSearch = true') {
      /*  
      session_dict[user_key] = ['重新搜尋航班']
      session_second_list = list(session_dict[user_key])
      */
    }
    else if (dataContent == typeOfDepart) {
      /*
      time = event.postback.params
      session_second_list = list(session_dict[user_key])
      //session_second_list.push({datetime_type[type_of_depart] : time['date']})
      session_dict[user_key] = session_second_list
      message_text_tmp = "你選擇的日期為:" + time['date']
      message = TextSendMessage(text=message_text_tmp)
      push_message(user_key, message)
      push_message(event.source.user_id, choice_datatime(type_of_return))
      */
    }
    else if (dataContent === typeOfReturn) {
      /*
      time = event.postback.params
      session_second_list = list(session_dict[user_key])
      //time_tmp = {datetime_type[type_of_return]: time['date']}
      console.log(session_dict[user_key])
      if (time['date'] >= session_dict[user_key][-1][datetime_type[type_of_depart]]){
          session_second_list.append(time_tmp)
          session_dict[user_key] = list(session_second_list)
          message_text_tmp = "你選擇的回國日期為:" + time['date']
          message = TextSendMessage(text=message_text_tmp)
          push_message(user_key, message)
          message_text_tmp = "搜尋中，請稍後"
          message = TextSendMessage(text=message_text_tmp)
          push_message(event.source.user_id, message)
          search_air_ticket_in_travel4(session_dict, user_key)
      }    
      else{
          message_text_tmp = "你選擇的回國日期小於出國日期，請重新選擇"
          message = TextSendMessage(text=message_text_tmp)
          push_message(event.source.user_id, message)
          push_message(event.source.user_id,
                        choice_datatime(type_of_return))
      }
      */
    }
  }
}

function followEvent(event) {
  console.log("#Follow Event#")
  var userKey = event.source.userId
  menufunction.getRichId(userKey)
  api.getLineUserProfile(userKey, function (user) {
    console.log('user data', user)
    api.isFirstLogin(userKey, function (isFirstLoginFlag) {
      if (isFirstLoginFlag) {
        var messageTextTmp = "Hi " + user.displayName + "\n"
        messageTextTmp += "歡迎加入FlightGo 旅行社!!\n\n"
        messageTextTmp += "我是旅遊小幫手:小高。\n\n 小高我可以幫忙查詢旅遊行程，會員資料等相關問題\n 也可以洽詢真人客服，小高會立即通知真人客服來為您服務喔\n\n"
        messageTextTmp += "可以從選單內點選如何使用來獲取功能說明喔\n\n"
        messageTextTmp += "為了提供更好的服務，請先填入以下基本資訊~"
        var message = { type: 'text', text: messageTextTmp }
        var tmpList = ["ask_session_start"]
        askMemberInfoSessionDict[user.userId] = tmpList
        var messageSlicker = {
          type: "sticker",
          packageId: '1',
          stickerId: '4'
        }
        lineapi.replyText(event, [message, messageSlicker]).then(() => {
          console.log("replyText sucess")
          dialogFunction.askPaperMemberInfo(askMemberInfoSessionDict, event, function (sessionDict, isFinish) {
            if (isFinish != true) {
              askMemberInfoSessionDict = sessionDict
            }
            else {
              askMemberInfoSessionDict = sessionDict
              askUserFavoriteSessionDict = questionnaireFunction.askUserFavoriteTravel(userKey, askUserFavoriteSessionDict)
            }
          })
        }).catch(function (error) { console.log('replayTest error', error) });
      }
      else {
        var messageTextTmp = "Hi " + user.displayName + "\n"
        messageTextTmp += "歡迎回來!!\n\n"
        messageTextTmp += "在你離開的這段日子，我好無聊呢!!\n\n"
        messageTextTmp += "我是旅遊小幫手:小高。\n\n 我可以幫忙查詢旅遊行程，會員資料等相關問題\n 也可以洽詢真人客服，小高會立即通知真人客服來為您服務喔\n\n"
        messageTextTmp += "可以從選單內點選如何使用來獲取功能說明喔\n\n"
        messageTextTmp += "為了提供更好的服務，請先填入以下基本資訊~"
        var message = { type: 'text', text: messageTextTmp }
        var messageSlicker = {
          type: "sticker",
          packageId: '1',
          stickerId: '4'
        }
        lineapi.replyText(event, [message, messageSlicker])
      }
    }
    )
  }
  )
}
function unfollowEvent(event) {
  console.log("#unfollow Event#")
}
function join_Event(event) {
  console.log("#join Event#")
}
function leave_Event(event) {
  console.log("#leave Event#")
}

// listen on port
const port = process.env.PORT || 9005;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});