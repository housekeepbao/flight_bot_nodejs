module.exports = {}
module.exports.replyText = function (event, replay_text) {
    client.replyMessage(event.replyToken, replay_text)
        .then(() => {
            console.log('reply message success', message)
        })
        .catch((err) => {
            // error handling
            console.log('reply message failed', err)
        });
}

module.exports.pushText = function (user_key, push_text) {
    client.pushMessage(user_key, push_text)
        .then(() => {
            console.log('sent message success', message)
        })
        .catch((err) => {
            // error handling
            console.log('sent message failed', err)
        });
}

