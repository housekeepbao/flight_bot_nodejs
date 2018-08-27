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

const dialog_function = require('./dialog_function.js') 
// create Express app
// about Express itself: https://expressjs.com/
const app = express();
var ask_member_Info_session_dict = [];
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
    pushmessage(dialog_function.ask_paper_memberInfo(ask_member_Info_session_dict,event))
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

}
function replymessage(event,message_text) {
  const replay_text = { type: 'text', text: message_text };
  client.replyMessage(event.replyToken, replay_text)
}

function pushmessage(user_key,message_text) {
  const push_text = { type: 'text', text: message_text };
  client.pushMessage(user_key, push_text)
}


// listen on port
const port = process.env.PORT || 9005;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});