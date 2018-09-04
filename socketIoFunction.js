
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
const api = require('./api.js')
const line = require('@line/bot-sdk');
const config = require('./lineconfig.js').lineAccoessTokenConfig

// create LINE SDK client
const client = new line.Client(config);

module.exports = {}
module.exports.socketChatConnect = function (event) {
    api.getLineUser(event.source.userId, function (user) {
        console.log('user data', user)
        if (user == null) {
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: '您尚未加入，請重新加入或解除封鎖'
            });
        }
        usersManager[user.userId] = user

        // console.log('usersManager', usersManager)
        if (event.type !== 'message' || event.message.type !== 'text') {
            // ignore non-text-messageuser event
            return Promise.resolve(null);
        }

        //userId: 'U7d9b155b96a70afe8607c227b9768677, jackal
        //userId: 'Ucbd48498cf2763c248f367837b5d6d9a , yi ching
        if (usersManager[user.userId].isBotMode) {
            console.log('BOT模式 message:', event.message.text);
            switch (event.message.text) {
                case "客服":
                case "請求客服":
                    user.type = "user"
                    socketClient.emit(events.userJoined, user);
                    //save message to db
                    api.storeChatMessage(event.message.text, usersManager[user.userId].chatRoomId, true,
                        usersManager[user.userId].userId, null, function () {
                            console.log('event.message.text inserted', event.message.text)
                        });
                    return client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: "轉接客服中.."
                    });
                default:
                    //save message to db
                    api.storeChatMessage(event.message.text, usersManager[user.userId].chatRoomId, true,
                        usersManager[user.userId].userId, null, function () {
                            console.log('event.message.text inserted', event.message.text)
                        });

                    // ECHO to user for now
                    return client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: event.message.text
                    });
            }

        } else {
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
    });
}