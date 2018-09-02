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

module.exports = {}
module.exports.replyText = function (event, replayText) {
    return new Promise((resolve, reject) => {
        var flag = false
        client.replyMessage(event.replyToken, replayText)
            .then(() => {
                console.log('reply message success', replayText)
                flag = true
            })
            .catch((err) => {
                // error handling
                console.log('reply message failed', err)
            });
        if (flag) {
            resolve(true)
        }
        else {
            reject(false)
            console.log("pushText fail")
        }
    })
}

module.exports.pushText = function (userKey, pushText) {
    return new Promise((resolve, reject) => {
        var flag = false
        client.pushMessage(userKey, pushText)
            .then(() => {
                console.log('sent message success', pushText)
                flag = true
            })
            .catch((err) => {
                // error handling
                console.log('sent message failed', err)
            });
        if (flag) {
            resolve(true)
        }
        else {
            reject(false)
            console.log("pushText fail")
        }
    })
}

