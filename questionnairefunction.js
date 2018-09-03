const lineapi = require('./lineapi.js')
module.exports = {}
module.exports.saveFavoriteQuestionnaire = function (user_key, favorite_list) {
    console.log(favorite_list)
    var data = {
        "type": "favorite",
        "userId": user_key,
        "providerId": providerId,
        "content": { 'favorite': favorite_list[1, -1] },
    }
    var headers = {
        'Content-Type': "application/json",
    }
}
module.exports.askUserFavoriteTravel = function (userKey, askUserFavoriteSessionDict) {
    if (!(userKey in askUserFavoriteSessionDict)) {
        askUserFavoriteSessionDict[userKey] = ["ask_session_start"]
    }
    if (askUserFavoriteSessionDict[userKey].length >= 1) {
        var tickets_text = "我們關心您的喜好，以下是詢問您喜歡的旅遊類型，未來也會推播相關的旅遊情報給您喔"
        var push_tickets_info = { type: 'text', text: tickets_text };
        var message_slicker = {
            type: "sticker",
            packageId: '1',
            stickerId: '407'
        }
        lineapi.pushText(userKey, [push_tickets_info, message_slicker])
        var bubble = {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "旅遊喜好問卷",
                        "size": "xl",
                        "weight": "bold"
                    }
                ]
            },
            "hero": {
                "type": "image",
                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/tom-barrett-318954-unsplash.jpg",
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover",
                "action": {
                    "type": "uri",
                    "label": "View details",
                    "uri": "http://www.flightgoai.com/"
                }
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "選擇喜愛的旅遊類型",
                        "weight": "bold",
                        "size": "xl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/beach-1630540_1920.jpg",
                                "aspectRatio": "20:13",
                                "size": "xxl",
                                "aspectMode": "cover"
                            },
                            {
                                "type": "button",
                                "style": "link",
                                "color": "#0000FF",
                                "height": "sm",
                                "action": {
                                    "type": "postback",
                                    "label": "喜愛島嶼度假",
                                    "data": "travel,Islands"
                                }

                            },
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/japanese-cherry-trees-3063992_1920.jpg",
                                "aspectRatio": "20:13",
                                "size": "xxl",
                                "aspectMode": "cover"
                            },
                            {
                                "type": "button",
                                "style": "link",
                                "color": "#0000FF",
                                "height": "sm",
                                "action": {
                                    "type": "postback",
                                    "label": "喜愛日韓旅遊",
                                    "data": "travel,JP_Korea"
                                }

                            },
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/264dc9dadd946494e236391231976bdc_m.jpg",
                                "aspectRatio": "20:13",
                                "size": "xxl",
                                "aspectMode": "cover"
                            },
                            {
                                "type": "button",
                                "style": "link",
                                "color": "#0000FF",
                                "height": "sm",
                                "action": {
                                    "type": "postback",
                                    "label": "喜愛郵輪旅遊",
                                    "data": "travel,Cruiseship"
                                }

                            },
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/dahshur-2292509_1920.jpg",
                                "aspectRatio": "20:13",
                                "size": "xxl",
                                "aspectMode": "cover"
                            },
                            {
                                "type": "button",
                                "style": "link",
                                "color": "#0000FF",
                                "height": "sm",
                                "action": {
                                    "type": "postback",
                                    "label": "喜愛中東非旅遊",
                                    "data": "travel,Central_Eastern_Africa"
                                }

                            },
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/bangkok-1020850_1920.jpg",
                                "aspectRatio": "20:13",
                                "size": "xxl",
                                "aspectMode": "cover"
                            },
                            {
                                "type": "button",
                                "style": "link",
                                "color": "#0000FF",
                                "height": "sm",
                                "action": {
                                    "type": "postback",
                                    "label": "喜愛東南亞旅遊",
                                    "data": "travel,southeast_asia"
                                }

                            }
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
                        "type": "separator",
                        "color": "#000000"
                    },
                    {
                        "type": "button",
                        "style": "link",
                        "color": "#000000",
                        "height": "md",
                        "action": {
                            "type": "postback",
                            "label": "已完成",
                            "data": "travel Done"
                        }

                    }
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

        var bubble01 = {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "旅遊喜好問卷",
                        "size": "xl",
                        "weight": 'bold'
                    }
                ]
            },
            "hero": {
                "type": "image",
                "url": 'https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/tom-barrett-318954-unsplash.jpg',
                "size": "full",
                "aspectRatio": '20:13',
                "aspectMode": 'cover',
                "action": {
                    "type": "uri",
                    "label": "View details",
                    "uri": 'http://www.flightgoai.com/'
                }
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": '選擇喜愛的旅遊類型',
                        "weight": 'bold',
                        "size": 'xl'
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/taj-mahal-1209004_1920.jpg",
                                "aspectRatio": '20:13',
                                "size": 'xxl',
                                "aspectMode": 'cover'
                            },
                            {
                                "type": "button",
                                "style": 'link',
                                "color": '#0000FF',
                                "height": 'sm',
                                "action": {
                                    "type": "postback",
                                    "label": '喜愛南北亞旅遊',
                                    "data": "travel,south_asia"
                                }

                            },
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/0a16fa82381c4bb981d07841408329f1_s.jpg",
                                "aspectRatio": '20:13',
                                "size": 'xxl',
                                "aspectMode": 'cover'
                            },
                            {
                                "type": "button",
                                "style": 'link',
                                "color": '#0000FF',
                                "height": 'sm',
                                "action": {
                                    "type": "postback",
                                    "label": '喜愛中國旅遊',
                                    "data": "travel,china"
                                }

                            },
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/milan-cathedral-2704544_1280.jpg",
                                "aspectRatio": '20:13',
                                "size": 'xxl',
                                "aspectMode": 'cover'
                            },
                            {
                                "type": "button",
                                "style": 'link',
                                "color": '#0000FF',
                                "height": 'sm',
                                "action": {
                                    "type": "postback",
                                    "label": '喜愛歐洲線旅遊',
                                    "data": "travel,Europe"
                                }

                            },
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev//images/buildings-2297210_1920.jpg",
                                "aspectRatio": '20:13',
                                "size": 'xxl',
                                "aspectMode": 'cover'
                            },
                            {
                                "type": "button",
                                "style": 'link',
                                "color": '#0000FF',
                                "height": 'sm',
                                "action": {
                                    "type": "postback",
                                    "label": '喜愛美國加拿大旅遊',
                                    "data": "travel,America_Canada"
                                }

                            },
                            {
                                "type": "separator",
                                "color": "#000000"
                            },
                            {
                                "type": "image",
                                "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev//images/new-zealand-2089838_1920.jpg",
                                "aspectRatio": '20:13',
                                "size": 'xxl',
                                "aspectMode": 'cover'
                            },
                            {
                                "type": "button",
                                "style": 'link',
                                "color": '#0000FF',
                                "height": 'sm',
                                "action": {
                                    "type": "postback",
                                    "label": '喜愛紐西蘭、澳洲旅遊',
                                    "data": "travel,Oceania"
                                }

                            }
                        ]
                    }

                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "spacing": 'sm',
                "contents": [
                    {
                        "type": "separator",
                        "color": "#000000"
                    },
                    {
                        "type": "button",
                        "style": 'link',
                        "color": '#000000',
                        "height": 'md',
                        "action": {
                            "type": "postback",
                            "label": '已完成',
                            "data": "travel Done"
                        }

                    }
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

        var carousel_Flex = {
            "type": "carousel",
            "contents": [
                bubble,
                bubble01
            ]
        }
        var Flex_Message = {
            "type": "flex",
            "altText": "旅遊問卷 Flex",
            "contents": {
                carousel_Flex
            }
        }
        lineapi.pushText(userKey, Flex_Message)
    }
    return askUserFavoriteSessionDict
}