const lineapi = require('./lineapi.js')
module.exports = {}
module.exports.askPaperMemberInfo = function (askMemberInfoSessionDict, event, callback) {
    console.log('#askPaperMemberInfo function')
    var userKey = event.source.userId
    var isFinish = false
    if(!event.message){
        messageText = "None" 
    }
    else {
        var messageText = event.message.text  
    }
    if (!(userKey in askMemberInfoSessionDict)) {
        askMemberInfoSessionDict[userKey] = ["ask_session_start"]
    }
    var tmpList = askMemberInfoSessionDict[userKey]
    console.log('Dialog Session length', askMemberInfoSessionDict[userKey].length)
    console.log('Dialog Session content', askMemberInfoSessionDict[userKey])
    if (askMemberInfoSessionDict[userKey].length == 1) {
        console.log('askMemberInfoSessionDict[userKey].length  is 1')
        var ticketsText = "請輸入您的行動電話號碼 例如:09123456789"
        tmpList.push("ask_session_start")
        askMemberInfoSessionDict[userKey] = tmpList
        var pushText = { type: 'text', text: ticketsText };
        lineapi.pushText(userKey, pushText)
    }
    else if (askMemberInfoSessionDict[userKey].length == 2) {
        var re = /\d+/
        if (re.test(messageText)) {
            tmpList.push(messageText)
            var ticketsText = "請輸入您的電子信箱 例如:mymail@gmail.com"
            var pushText = { type: 'text', text: ticketsText };
            askMemberInfoSessionDict[userKey] = tmpList
        }
        else {
            var ticketsText = "輸入的電話號碼有錯，請重新輸入"
            var pushText = { type: 'text', text: ticketsText };
        }
        lineapi.pushText(userKey, pushText)

    }
    else if (askMemberInfoSessionDict[userKey].length == 3) {
        var re = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
        if (re.test(messageText)) {
            tmpList.push(messageText)
            var gender_button = {
                type: "template",
                altText: '會員資料調查',
                template: {
                    type: "buttons",
                    title: '請問您的性別',
                    text: '請選擇您的性別',
                    actions: [
                        {
                            type: "postback",
                            label: "男性",
                            text: '男性',
                            data: "male"
                        },
                        {
                            type: "postback",
                            label: "女性",
                            text: '女性',
                            data: "female"
                        },
                    ],
                }
            }
            askMemberInfoSessionDict[userKey] = tmpList
            lineapi.pushText(userKey, gender_button)
        }
        else {
            var ticketsText = "輸入的電子信箱有誤，請重新輸入"
            var pushText = { type: 'text', text: ticketsText };
            lineapi.pushText(userKey, pushText)
        }
    }
    else if (askMemberInfoSessionDict[userKey].length == 4) {
        if (messageText.indexOf("男性") != -1 || messageText.indexOf("女性")) {
            tmpList.push(messageText)
            var ticketsText = "會員資料已輸入完畢。"
            var pushText = { type: 'text', text: ticketsText };
            askMemberInfoSessionDict[userKey] = tmpList
            var messageSlicker = {
                type: "sticker",
                packageId: '1',
                stickerId: '125'
            }
            lineapi.pushText(userKey, [pushText, messageSlicker])
            askMemberInfoSessionDict[userKey][0] = 'ask_session_close'
            isFinish = true
        }
        else {
            var ticketsText = "輸入的電子信箱有誤，請重新輸入"
            var pushText = { type: 'text', text: ticketsText };
            lineapi.pushText(userKey, pushText)
        }
    }
    else {
        console.log('askPaperMemberInfo enter other else ')
        console.log('try askMemberInfoSessionDict[userKey].length == 1 is  ',askMemberInfoSessionDict[userKey].length == 1)
    }
    callback(askMemberInfoSessionDict, isFinish)
}


module.exports.otherSession = function (event) {
    console.log('#other_session#')
    var messageSlicker =
        {
            type: "sticker",
            packageId: '2',
            stickerId: '34'
        }
    var pushText = { type: 'text', text: "請問是否有其他問題? \n 有任何問題將交由真人客服為您服務" };
    lineapi.pushText(event.source.userId, [pushText, messageSlicker], function () {
        customerButton(event.source.userId)
    })
}


module.exports.customerServiceButton = function (userKey) {
    return customerButton(userKey)
}

function customerButton(userKey) {
    confirm_template = {
        type: "template",
        altText: '確認按鈕',
        template: {
            type: "confirm",
            title: '轉接線上客服人員',
            text: '是否轉接線上客服人員，客服人員服務時間 早上 09:00 ~ 晚上 19:00',
            actions: [
                {
                    type: "postback",
                    label: "是",
                    data: "customer_service,Yes"
                },
                {
                    type: "postback",
                    label: "否",
                    data: "customer_service,No"
                }
            ],
        },
    }
    lineapi.pushText(userKey, confirm_template)
}