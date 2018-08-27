module.exports = {}
module.exports.saveFavoriteQuestionnaire = function(user_key,favorite_list) {
    console.log(favorite_list)
    var data = {
        "type": "favorite",
        "userId": user_key,
        "providerId": providerId,
        "content": {'favorite': favorite_list[1,-1] },
    }
    var headers = {
        'Content-Type': "application/json",
    }
}
module.exports.askUserFavoriteTravel = function(user_key,ask_user_favorite_session_dict) {
    if (ask_user_favorite_session_dict.indexOf(user_key) == -1){
        ask_user_favorite_session_dict.push({user_key:["ask_session_start"]})
    }
}