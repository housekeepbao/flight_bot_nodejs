const lineapi = require('./lineapi.js')
module.exports = {}
module.exports.ask_paper_memberInfo = function (ask_member_Info_session_dict, event, callback) {
    var user_key = event.source.user_id
    var isFinish = false
    if (user_key in ask_member_Info_session_dict) {
        ask_member_Info_session_dict[user_key] = ["ask_session_start"]
    }
    console.log('Dialog Session length', ask_member_Info_session_dict[user_key].lenght)
    console.log('Dialog Session content', ask_member_Info_session_dict[user_key])
    if (ask_member_Info_session_dict[user_key].lenght === 1) {
        var tmp_list = ask_member_Info_session_dict[user_key]
        var tickets_text = "請輸入您的行動電話號碼 例如:09123456789"
        tmp_list.push("ask_session_start")
        ask_member_Info_session_dict[user_key] = tmp_list
        var push_text = { type: 'text', text: tickets_text };
        lineapi.pushText(user_key, push_text)
    }
    else if (ask_member_Info_session_dict[user_key].lenght === 2) {
        var tmp_list = ask_member_Info_session_dict[user_key]
        var message = event.message.text
        var re = /\d+/
        if (re.test(message)) {
            tmp_list.push(message)
            var tickets_text = "請輸入您的電子信箱 例如:mymail@gmail.com"
            var push_text = { type: 'text', text: tickets_text };
            ask_member_Info_session_dict[user_key] = list(tmp_list)
        }
        else {
            var tickets_text = "輸入的電話號碼有錯，請重新輸入"
            var push_text = { type: 'text', text: tickets_text };
        }
        lineapi.pushText(user_key, push_text)

    }
    else if (ask_member_Info_session_dict[user_key].lenght === 3) {
        var tmp_list = ask_member_Info_session_dict[user_key]
        var message = event.message.text
        var re = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
        if (re.test(message)) {
            tmp_list.push(message)
            var gender_button = {
                "type": "template",
                "altText": '會員資料調查',
                "template": {
                    "type": "button",
                    "title": '請問您的性別',
                    "text": '請選擇您的性別',
                    "actions": [
                        {
                            "type": "postback",
                            "label": "男性",
                            "text": '男性',
                            "data": "male"
                        },
                        {
                            "type": "postback",
                            "label": "女性",
                            "text": '女性',
                            "data": "female"
                        }
                    ]
                }
            }
            ask_member_Info_session_dict[user_key] = tmp_list
            lineapi.pushText(user_key, gender_button)
        }
        else {
            var tickets_text = "輸入的電子信箱有誤，請重新輸入"
            var push_text = { type: 'text', text: tickets_text };
            lineapi.pushText(user_key, push_text)
        }
        lineapi.pushText(user_key, push_text)
    }
    else if (ask_member_Info_session_dict[user_key].lenght === 4) {
        var tmp_list = ask_member_Info_session_dict[user_key]
        var message = event.message.text
        if (message.indexOf("男性") != -1 || message.indexOf("女性")) {
            tmp_list.push(message)
            var tickets_text = "會員資料已輸入完畢。"
            var push_text = { type: 'text', text: tickets_text };
            ask_member_Info_session_dict[user_key] = tmp_list
            var message_slicker = {
                type: "sticker",
                packageId: '1',
                stickerId: '125'
            }
            lineapi.pushText(user_key, [push_text, message_slicker])
            ask_member_Info_session_dict[user_key][0] = 'ask_session_close'
            isFinish = true
        }
        else {
            var tickets_text = "輸入的電子信箱有誤，請重新輸入"
            var push_text = { type: 'text', text: tickets_text };
            lineapi.pushText(user_key, push_text)
        }
        lineapi.pushText(user_key, push_text)
    }
    callback(ask_member_Info_session_dict, isFinish)
}


module.exports.other_session = function (event) {
    console.log('#other_session#')
    message_slicker =
        {
            type: "sticker",
            packageId: '2',
            stickerId: '34'
        }
    var push_text = { type: 'text', text: "請問是否有其他問題? \n 有任何問題將交由真人客服為您服務" };
    lineapi.replyText(event, [push_text, message_slicker])
    customer_button(event.source.user_id)
}


module.exports.customer_service_button = function(user_key){
    return customer_button(user_key)
}

function customer_button (user_key) {
    confirm_template = {
        "type": "template",
        "altText": '確認按鈕',
        "template": {
            "type": "confirm",
            "title": '轉接線上客服人員',
            "text": '是否轉接線上客服人員，客服人員服務時間 早上 09:00 ~ 晚上 19:00',
            "actions": [
                {
                    "type": "postback",
                    "label": "是",
                    "data": "customer_service,Yes"
                },
                {
                    "type": "postback",
                    "label": "否",
                    "data": "customer_service,No"
                }
            ]
        }
    }
    lineapi.pushText(user_key, confirm_template)
}