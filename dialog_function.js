module.exports = {}

module.exports.ask_paper_memberInfo = function (ask_member_Info_session_dict,event) {
    var user_key = event.source.user_id
    if (ask_member_Info_session_dict.indexOf(user_key) === -1) {
        ask_member_Info_session_dict.push({user_key:["ask_session_start"]})
    }
    if (ask_member_Info_session_dict[user_key].lenght === 1){
        var tmp_list = ask_member_Info_session_dict[user_key]
        var tickets_text = "請輸入您的行動電話號碼 例如:09123456789"
        tmp_list.push("ask_session_start")
        ask_member_Info_session_dict.push({user_key:tmp_list})
        return user_key,tickets_text
    }
}