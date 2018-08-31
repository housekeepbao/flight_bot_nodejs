const lineapi = require('./lineapi.js')
const config = require('./lineconfig.js').lineAccoessTokenConfig
// create LINE SDK client
const line = require('@line/bot-sdk');
const client = new line.Client(config);
var fs = require("fs");
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
                    "label":'專屬優惠',
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
                    "label":'使用教學',
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
                    "label":'會員資料',
                    "text": "[menu]會員資料測試",
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
                    "label":'轉接客服',
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
                    "label":'share_friend',
                    "uri":"line://msg/text/?"+shareStringEncode
                }
            }
        ]
    }
    client.createRichMenu(richMenuToCreate).then(function(response){
        var contentType = 'image/jpeg'
        var imgPath = "images/rich_background.png"
        client.setRichMenuImage(response.richMenuId,fs.createReadStream(imgPath),contentType).then(() => {
            client.linkRichMenuToUser(userKey,response.richMenuId)
        })
    })
}