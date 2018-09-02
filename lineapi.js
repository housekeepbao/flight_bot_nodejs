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
    process.on('unhandledRejection', (reason, p) => {
        console.log('未處理 rejection：', p, '原因：', reason);
      });
    return new Promise((resolve, reject) => {
        var flag = false
        client.replyMessage(event.replyToken, replayText,resolve,reject)
            .then(() => {
                console.log('reply message success', replayText)
                resolve(true)
            })
            .catch((err) => {
                // error handling
                console.log('reply message failed', err)
                reject(false)
            });
    }).catch(()=>{})
}

module.exports.pushText = function (userKey, pushText) {
    process.on('unhandledRejection', (reason, p) => {
        console.log('未處理 rejection：', p, '原因：', reason);
        // 记录日志、抛出错误、或其他逻辑。
      });
    return new Promise((resolve, reject) => {
        var flag = false
        client.pushMessage(userKey, pushText, replayText,resolve,reject)
            .then(() => {
                console.log('sent message success', pushText)
                resolve(true)
            })
            .catch((err) => {
                // error handling
                console.log('sent message failed', err)
                reject(false)
            });
    }).catch(()=>{})
}

