const lineapi = require('./lineapi.js')
const config = require('./lineconfig.js').lineAccoessTokenConfig
// create LINE SDK client
const line = require('@line/bot-sdk');
const client = new line.Client(config);
var fs = require("fs");
const api = require('./api.js')
const dialogFunction = require('./dialogfunction.js')
module.exports = {}

module.exports.getRichId = function (userKey) {
    var shareString = '不是好東西，就不會跟你分享，這FlightGO超好用的，聰明又貼心，快加它玩看看。\n FlightGO:line://ti/p/@bee6285z'
    var shareStringEncode = encodeURIComponent(shareString)
    var richMenuToCreate = {
        "size": {
            "width": 2500,
            "height": 1686
        },
        "selected": false,
        "name": "Nice richmenu",
        "chatBarText": "更多功能",
        "areas": [
            {
                "bounds": {
                    "x": 0,
                    "y": 0,
                    "width": 800,
                    "height": 840
                },
                "action": {
                    "type": "postback",
                    "label": '專屬優惠',
                    "text": "[menu]專屬優惠",
                    "data": "menu,benefits"
                }
            },
            {
                "bounds": {
                    "x": 833,
                    "y": 0,
                    "width": 800,
                    "height": 840
                },
                "action": {
                    "type": "uri",
                    "label": "網站連結",
                    "uri": "line://app/1580838292-qVDJebpZ"
                }
            },
            {
                "bounds": {
                    "x": 1666,
                    "y": 0,
                    "width": 800,
                    "height": 840
                },
                "action": {
                    "type": "postback",
                    "label": '使用教學',
                    "text": "[menu]使用教學",
                    "data": "menu,teaching"
                }
            },
            {
                "bounds": {
                    "x": 0,
                    "y": 833,
                    "width": 800,
                    "height": 840
                },
                "action": {
                    "type": "postback",
                    "label": '會員資料',
                    "text": "[menu]會員資料",
                    "data": "menu,member_info"
                }
            },
            {
                "bounds": {
                    "x": 833,
                    "y": 833,
                    "width": 800,
                    "height": 840
                },
                "action": {
                    "type": "postback",
                    "label": '轉接客服',
                    "text": "[menu]轉接客服",
                    "data": "menu,customer_service"
                }
            },
            {
                "bounds": {
                    "x": 1666,
                    "y": 833,
                    "width": 800,
                    "height": 840
                },
                "action": {
                    "type": "uri",
                    "label": 'share_friend',
                    "uri": "line://msg/text/?" + shareStringEncode
                }
            }
        ]
    }
    client.createRichMenu(richMenuToCreate).then(function (response) {
        var contentType = 'image/jpeg'
        var imgPath = "images/rich_background.png"
        console.log(response)
        client.setRichMenuImage(response, fs.createReadStream(imgPath), contentType).then(() => {
            client.linkRichMenuToUser(userKey, response)
        }).catch(function (error) {
            console.log(error);
        });
    })
}
module.exports.menuFeature = function (event,askMemberInfoSessionDict) {
    var userKey = event.source.userId
    api.getLineUserProfile(userKey, function (user) {
        switch (event.message.text) {
            case ("[menu]使用教學"):
                teachingStep(userKey)
                break;
            case ("[menu]會員資料"):
                memberInfo(userKey)
                break;
            case ("[menu]修改會員資料"):
                dialogFunction.askPaperMemberInfo(askMemberInfoSessionDict, event, function (sessionDict, isFinish) {
                    if (isFinish != true) {
                        askMemberInfoSessionDict = sessionDict
                    }
                    else {
                        askMemberInfoSessionDict = sessionDict
                        askUserFavoriteSessionDict = questionnaireFunction.askUserFavoriteTravel(userKey, askUserFavoriteSessionDict)
                    }
                })
                break;
            case ("[menu]轉接客服"):
                var messageText = { type: 'text', text: "轉接客服中，請稍後..." };
                var messageSlicker = {
                    type: "sticker",
                    packageId: '1',
                    stickerId: '124'
                }
                lineapi.pushText(userKey, [messageText, messageSlicker])
                break;
            case ("[menu]專屬優惠"):
                var messageContent = "Hi " + user.displayName + "\n"
                messageContent += "這是專屬於您的優惠，日本旅遊線，所有行程第二人折2000元!!\n"
                messageContent += "直接按下方選單，轉接客服，線上下單折2000元"
                var messageText = { type: 'text', text:messageContent };
                var messageSlicker = {
                    type: "sticker",
                    packageId: '2',
                    stickerId: '166'
                }
                lineapi.pushText(userKey, [messageText, messageSlicker])
                break;
        }
    })
}

function teachingStep(userKey) {
    var messageText = { type: 'text', text: "目前功能有:" };
    var buttonsTemplateMessage = {
        type: "template",
        altText: '功能清單',
        template: {
            type: "buttons",
            thumbnail_image_url: 'https://raw.githubusercontent.com/housekeepbao/flight_bot/master/images/FLIGHTGO_test.jpg',
            title: '目前功能',
            text: '目前有以下功能，可直接點擊，也可打出文字',
            actions: [
                {
                    type: "message",
                    label: "廣告",
                    text: '廣告',
                },
                {
                    type: "message",
                    label: "喜好問卷",
                    text: '喜好問卷',
                },
                {
                    type: "message",
                    label: "客服問卷",
                    text: '客服問卷',
                },
                {
                    type: "message",
                    label: "Flex",
                    text: 'Flex',
                },
            ],
        }
    }
    lineapi.pushText(userKey, [messageText, buttonsTemplateMessage])
}

function memberInfo(userKey) {
    api.getLineUser(userKey, function (memberInfo) {
        console.log("memberInfo ", memberInfo)
        memberInfo.userId
        memberInfo.name
        memberInfo.pictureUrl
        memberInfo.email
        memberInfo.gender
        if (memberInfo.gender) {
            genderAttributes = "男性"
        }
        else {
            genderAttributes = "女性"
        }
        memberInfo.phoneNumber
        memberInfo.age
        memberInfo.favorite
        var bubble = {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "會員中心",
                        "size": "lg",
                        "weight": "bold",
                        "align": "center"
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "會員資料",
                        "weight": "bold",
                        "size": "xl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": 'lg',
                        "spacing": 'sm',
                        "contents": [
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": 'sm',
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": '姓 名:  ',
                                        "color": '#aaaaaa',
                                        "size": 'md',
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": memberInfo.name,
                                        "wrap": true,
                                        "color": '#666666',
                                        "size": 'md',
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": 'sm',
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": 'Email:  ',
                                        "color": '#aaaaaa',
                                        "size": 'md',
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": memberInfo.email,
                                        "wrap": true,
                                        "color": '#666666',
                                        "size": 'md',
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": 'sm',
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": '電話:  ',
                                        "color": '#aaaaaa',
                                        "size": 'md',
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": memberInfo.phoneNumber.toString(),
                                        "wrap": true,
                                        "color": '#666666',
                                        "size": 'md',
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": 'sm',
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": '性別:  ',
                                        "color": '#aaaaaa',
                                        "size": 'md',
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": genderAttributes,
                                        "wrap": true,
                                        "color": '#666666',
                                        "size": 'md',
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": 'sm',
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": '年齡:  ',
                                        "color": '#aaaaaa',
                                        "size": 'md',
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": "隱藏",
                                        "wrap": true,
                                        "color": '#666666',
                                        "size": 'md',
                                        "flex": 5
                                    }
                                ]
                            },
                        ]
                    }

                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": [
                    {
                        "type": "button",
                        "style": "link",
                        "color": "#000000",
                        "height": "sm",
                        "action": {
                            "type": "message",
                            "label": '修改會員資料',
                            "text": '[menu]修改會員資料'
                        }

                    },
                ]
            },
            "styles": {
                "header": {
                    "backgroundColor": "#DDDDDD",
                    "separatorColor": "#000000",
                    "separator": true
                },
                "hero": {
                    "backgroundColor": "#FF44AA",
                    "separatorColor": "#000000",
                    "separator": true
                },
                "body": {
                    "backgroundColor": "#FFFFFF",
                    "separatorColor": "#000000",
                    "separator": true
                },
                "footer": {
                    "backgroundColor": "#CCEEFF",
                    "separatorColor": "#000000",
                    "separator": true
                }
            }
        }
        var FlexMessage = {
            "type": "flex",
            "altText": "會員資料Flex",
            "contents": bubble
        }
        lineapi.pushText(userKey, FlexMessage)
    })
}