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
const config = require('./lineConfig.js').lineAccoessTokenConfig

// create LINE SDK client
const client = new line.Client(config);

// call the other function 
const dialog_function = require('./dialog_function.js')
const questionnaire_function = require('./questionnaire_function.js')
const lineapi = require('./lineapi.js')
const api = require('./api.js')
// create Express app
// about Express itself: https://expressjs.com/
const app = express();
var ask_member_Info_session_dict = {};
var ask_user_favorite_session_dict = {};
var datetime_type = { type_of_depart: 'depart_date', type_of_return: 'return_date' }
var type_of_return = "type = return"
var type_of_depart = "type = depart"
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
      return follow_Event(event);

    case 'unfollow':
      return unfollow_Event(event);

    case 'join':
      return join_Event(event);

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
  var user_key = event.source.userId
  if ( !(user_key in ask_member_Info_session_dict)  && ask_member_Info_session_dict[user_key][0] === "ask_session_start") {
    dialog_function.ask_paper_memberInfo(ask_member_Info_session_dict, event, function (session_dict, isFinish) {
      if (isFinish != true) {
        ask_member_Info_session_dict = session_dict
      }
      else {
        ask_member_Info_session_dict = session_dict
        ask_user_favorite_session_dict = questionnaire_function.askUserFavoriteTravel(user_key, ask_user_favorite_session_dict)
      }
    })
  }
  else {
    dialog_function.other_session(event)
  }

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
  var user_key = event.source.userId
  console.log(event.postback.data)
  var data_content = event.postback.data
  if (data_content.indexOf("travel") != -1) {
    if ("Done" in data_content) {
      console.log(ask_user_favorite_session_dict[user_key])
      message_text_tmp = "太好了，已經完成喜好旅遊類型問卷囉。"
      var message_text = { type: 'text', text: message_text_tmp };
      var message_slicker = {
        type: "sticker",
        packageId: '1',
        stickerId: '134'
      }
      lineapi.pushText(user_key, [message_text, message_slicker])
      questionnaire_function.saveFavoriteQuestionnaire(
        user_key, ask_user_favorite_session_dict[user_key])
    }
    else if (data_content.indexOf("ask") != -1) {
      ask_user_favorite_session_dict = questionnaire_function.askUserFavoriteTravel(user_key, ask_user_favorite_session_dict)
    }
    else {
      tmp_list = list(ask_user_favorite_session_dict[user_key])
      content_tmp = event.postback.data.split(",")
      console.log("favorite is " + content_tmp[-1])
      tmp_list.push(content_tmp[-1])
      ask_user_favorite_session_dict[user_key] = tmp_list
      message_text_tmp = "選擇喜好旅遊類型:" +
        travel_kind_dict[content_tmp[-1]] + "\n\n"
      message_text_tmp += "可繼續點選喜好的旅遊類型，也可點擊完成問卷按鈕"
      var message = { type: 'text', text: message_text_tmp };
      tickets_text = {
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
      lineapi.pushText(user_key, message)
    }
  }
  else {
    if (data_content === 'reSearch = true') {
      /*  
      session_dict[user_key] = ['重新搜尋航班']
      session_second_list = list(session_dict[user_key])
      */
    }
    else if (data_content == type_of_depart) {
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
    else if (data_content === type_of_return) {
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

function follow_Event(event) {
  console.log("#Follow Event#")
  var user_key = event.source.userId
  api.getLineUserProfile(user_key, function (user) {
    console.log('user data', user)
    api.isFirstLogin(user_key, function (isFirstLoginFlag) {
      if (isFirstLoginFlag) {
        var message_text_tmp = "Hi " + user.displayName + "\n"
        message_text_tmp += "歡迎加入FlightGo 旅行社!!\n\n"
        message_text_tmp += "，我是旅遊小幫手:小高。\n 小高我可以幫忙查詢旅遊行程，會員資料等相關問題\n 也可以洽詢真人客服，小高會立即通知我老大來為您服務喔\n\n"
        message_text_tmp += "可以從選單內點選如何使用來獲取功能說明喔\n\n"
        message_text_tmp += "為了提供更好的服務，請先填入以下基本資訊~"
        var message = { type: 'text', text: message_text_tmp }
        var tmp_list = ["ask_session_start"]
        ask_member_Info_session_dict[user.userId] = tmp_list
        var message_slicker = {
          type: "sticker",
          packageId: '1',
          stickerId: '4'
        }
        lineapi.replyText(event, [message, message_slicker])
        dialog_function.ask_paper_memberInfo(ask_member_Info_session_dict, event, function (session_dict, isFinish) {
          if (isFinish != true) {
            ask_member_Info_session_dict = session_dict
          }
          else {
            ask_member_Info_session_dict = session_dict
            ask_user_favorite_session_dict = questionnaire_function.askUserFavoriteTravel(user_key, ask_user_favorite_session_dict)
          }
        })
      }
    }
    )
  }
  )
}
function unfollow_Event(event) {
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