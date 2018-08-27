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

// create Express app
// about Express itself: https://expressjs.com/
const app = express();
var ask_member_Info_session_dict = {};
var ask_user_favorite_session_dict = {};
var datetime_type = {type_of_depart: 'depart_date', type_of_return: 'return_date'}
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
      return replyText(event, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return replyText(event, `Got postback: ${data}`);

    case 'beacon':
      return replyText(event, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}
function handleText(message, event) {
  console.log('#MessageEvent#')
  console.log(event)
  var user_key = event.source.user_id
  if (ask_member_Info_session_dict.indexOf(user_key) != -1 && ask_member_Info_session_dict[user_key][0] === "ask_session_start") {
    pushText(dialog_function.ask_paper_memberInfo(ask_member_Info_session_dict,event))
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

function handlePostback(message, event) {
  console.log("#PostbackEvent#")
  console.log(event)
  user_key = event.source.user_id
  console.log(event.postback.data)
  var data_content = event.postback.data
  if(data_content.indexOf("travel") != -1) {
      if("Done" in data_content){
        console.log(ask_user_favorite_session_dict[user_key])
        message_text_tmp = "太好了，已經完成喜好旅遊類型問卷囉。"
        var message_text = { type: 'text', text: message_text_tmp};
        var message_slicker = {
          type: "sticker",
          packageId: '1',
          stickerId: '134'
        }
        pushText(user_key, [message_text, message_slicker])
        questionnaire_function.saveFavoriteQuestionnaire(
            user_key,ask_user_favorite_session_dict[user_key])
        }        
      else if (data_content.indexOf("ask") != -1){
          ask_user_favorite_travel(user_key)
      }
      else{
          tmp_list = list(ask_user_favorite_session_dict[user_key])
          content_tmp = event.postback.data.split(",")
          console.log("favorite is " + content_tmp[-1])
          tmp_list.append(content_tmp[-1])
          ask_user_favorite_session_dict[user_key] = list(tmp_list)
          message_text_tmp = "選擇喜好旅遊類型:" + 
              travel_kind_dict[content_tmp[-1]] + "\n\n"
          message_text_tmp += "可繼續點選喜好的旅遊類型，也可點擊完成問卷按鈕"
          message = TextSendMessage(text=message_text_tmp)
          tickets_text = TemplateSendMessage(
              alt_text='確認按鈕',
              template=ConfirmTemplate(
                  title='是否完成喜好旅遊問卷',
                  text='如完成喜好問卷，請點選已完成，如還未選完可繼續點擊喜好旅遊類型',
                  actions=[
                      PostbackTemplateAction(
                          label='已完成',
                          data='travel Done'
                      ),
                      PostbackTemplateAction(
                          label='喜好旅遊類型',
                          data='travel ask'
                      )
                  ]
              )
          )
          push_message(user_key,message)
      }
  }
  else{
      if (data_content === 'reSearch = true') {
          session_dict[user_key] = ['重新搜尋航班']
          session_second_list = list(session_dict[user_key])
      }    
      else if (data_content == type_of_depart) {
          time = event.postback.params
          session_second_list = list(session_dict[user_key])
          //session_second_list.push({datetime_type[type_of_depart] : time['date']})
          session_dict[user_key] = session_second_list
          message_text_tmp = "你選擇的日期為:" + time['date']
          message = TextSendMessage(text=message_text_tmp)
          push_message(user_key, message)
          push_message(event.source.user_id, choice_datatime(type_of_return))
      }
      else if (data_content === type_of_return){
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
      }            
  }
}
function replyText(event,replay_text) {
  client.replyMessage(event.replyToken, replay_text)
      .then(() => {
        console.log('reply message success', message)
      })
      .catch((err) => {
          // error handling
          console.log('reply message failed', err)
      });
}

function pushText(user_key,push_text) {
  client.pushMessage(user_key, push_text)
      .then(() => {
        console.log('sent message success', message)
      })
      .catch((err) => {
          // error handling
          console.log('sent message failed', err)
      });
}


// listen on port
const port = process.env.PORT || 9005;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});