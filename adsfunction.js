const lineapi = require('./lineapi.js')
module.exports = {}
module.exports.getAdsInfoCarousel = function (userKey) {
    var urlPhoto = 'https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/kurobe-dam-2538514_1920.jpg'
    var addressUrl = "https://travel.liontravel.com/detail?NormGroupID=08a2caee-3aa1-4d19-8290-10b06b639369&GroupID=18JPN12BRB-T&_ga=2.11776183.2039194849.1532414860-420242525.1528167229&_gac=1.150918596.1530605816.Cj0KCQjwvezZBRDkARIsADKQyPmypYDGYB3Y_SrQhDSpDP2ED3RhJ4sWii4We7cN93IDbxLdHIXXynEaAhw3EALw_wcB"
    var addressUrl02 = "http://app.tahsintour.com.tw/page/Itinerary/ItineraryTH.aspx?ItnNo=180507JTT5BRN"
    var urlPhoto02 = "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/mickey-mause-832112_1920.jpg"
    var addressUrl03 = "http://www.ggogo.com/ggogoWeb/goProd.do?step=goStep1&mgrupCd=EFFD10"
    var urlPhoto03 = "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/prague-1168302_1920.jpg"
    var carouselContent01 =
        {
            "thumbnailImageUrl": urlPhoto,
            "title": "立山黑部5天4夜",
            "text": "立山黑部奇景．兼六園．合掌村．飛驒高山小京都散策．近江海鮮市場．溫泉五日",
            "defaultAction": {
                "type": "uri",
                "label": "立即訂購",
                "uri": addressUrl
            },
            "actions": [
                {
                    "type": "message",
                    "label": "$28,500元起",
                    "text": "立山黑部5天4夜 $28,500起"
                },
                {
                    "type": "uri",
                    "label": "立即訂購",
                    "uri": addressUrl
                },
                {
                    "type": "postback",
                    "label": "詢問詳細行程",
                    "text": "詢問詳細行程",
                    "data": "ads,ask,tokyto"
                }
            ]
        }
    var carouselContent02 = {
        "thumbnailImageUrl": urlPhoto02,
        "title": "東京迪士尼5天4夜",
        "text": "東京迪士尼樂園‧輕井澤‧川越小江戶‧萌木森林童話村‧JR高原列車‧音樂之森‧溫泉美食五日",
        "defaultAction": {
            "type": "uri",
            "label": "立即訂購",
            "uri": addressUrl02
        },
        "actions": [
            {
                "type": "message",
                "label": "$22,900元起",
                "text": "東京迪士尼5天4夜 $22,900起"
            },
            {
                "type": "uri",
                "label": "立即訂購",
                "uri": addressUrl02
            },
            {
                "type": "postback",
                "label": "詢問詳細行程",
                "text": "詢問詳細行程",
                "data": "ads,ask,tokyto"
            }
        ]
    }
    var carouselContent03 = {
        "thumbnailImageUrl": urlPhoto03,
        "title": "捷奧旅遊十天",
        "text": "神奇奧捷-仙境布拉格深度全覽阿爾卑斯童話世遺遊船饗宴十天",
        "defaultAction": {
            "type": "uri",
            "label": "立即訂購",
            "uri": addressUrl02
        },
        "actions": [
            {
                "type": "message",
                "label": "$41,999元起",
                "text": "捷奧旅遊十天 $41,999元起"
            },
            {
                "type": "uri",
                "label": "立即訂購",
                "uri": addressUrl03
            },
            {
                "type": "postback",
                "label": "詢問詳細行程",
                "text": "詢問詳細行程",
                "data": "ads,ask,easternEurope"
            }
        ]
    }
    var carouselTemplateMessage = {
        "type": "template",
        "altText": "專屬廣告優惠",
        "template": {
            "type": "carousel",
            "columns": [
                carouselContent01,
                carouselContent02,
                carouselContent03
            ],
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
        }
    }
    lineapi.pushText(userKey, carouselTemplateMessage)
}
module.exports.getFlexTemplate = function (userKey) {
    var bubble = {
        "type": "bubble",
        "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "大興旅行社",
                    "size": "lg",
                    "weight": "bold"
                }
            ]
        },
        "hero": {
            "type": "image",
            "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/kurobe-dam-2538514_1920.jpg",
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
                "type": "uri",
                "label": "大興旅行社",
                "uri": "http://app.tahsintour.com.tw/page/Itinerary/ItineraryTH.aspx?ItnNo=180425JKK5BR-A"
            }
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "北陸立山黑部．世界遺產合掌村．上高地仙境．溫泉飛驒牛五日",
                    "weight": "bold",
                    "size": "xl"
                },
                {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": 'sm',
                    "contents": [
                        {
                            "type": "text",
                            "text": '售價:  ',
                            "color": '#aaaaaa',
                            "size": 'md',
                            "flex": 0
                        },
                        {
                            "type": "36,900元起",
                            "wrap": "True",
                            "color": '#666666',
                            "size": 'md',
                            "flex": 5
                        }
                    ]
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
                                    "text": '天 數:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "5天4夜",
                                    "wrap": "True",
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
                                    "text": '國家:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "日本",
                                    "wrap": "True",
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
                                    "text": '地區:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "北陸.小松.立山.名古屋",
                                    "wrap": "True",
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
                                    "text": '出發地:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "桃園機場",
                                    "wrap": "True",
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
                                    "text": '航空公司:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "長榮航空",
                                    "wrap": "True",
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
                                    "text": '最少成行人數:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "16人",
                                    "wrap": "True",
                                    "color": '#666666',
                                    "size": 'md',
                                    "flex": 5
                                }
                            ]
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
                    "type": "button",
                    "style": "link",
                    "color": "#000000",
                    "height": "sm",
                    "action": {
                        "type": "uri",
                        "label": '出發日及報名',
                        "uri": 'http://b2c.tahsintour.com.tw/page/tahsin/grolist.aspx?homepage=180425JKK5BR-A'
                    }

                },
                {
                    "type": "separator",
                    "color": "#000000"
                },
                {
                    "type": "button",
                    "style": "link",
                    "color": "#000000",
                    "height": "sm",
                    "action": {
                        "type": "uri",
                        "label": '查看更多相關行程',
                        "uri": 'http://b2c.tahsintour.com.tw/page/tahsin/grolist.aspx?area=%E6%9D%B1%E5%8C%97%E4%BA%9E&city=%E5%8C%97%E9%99%B8'
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
                    "text": "雄獅旅行社",
                    "size": "lg",
                    "weight": "bold"
                }
            ]
        },
        "hero": {
            "type": "image",
            "url": "https://raw.githubusercontent.com/housekeepbao/flight_bot/dev/images/prague-1168302_1920.jpg",
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
                "type": "uri",
                "label": "雄獅旅行社",
                "uri": "https://travel.liontravel.com/detail?NormGroupID=58ea86f3-576a-460d-9fd2-cc111437d14d&GroupID=18EA816CI-T"
            }
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "奧地利單國~百水設計、金色大廳、設計旅店、中央咖啡館、鹽礦冰洞10天",
                    "weight": "bold",
                    "size": "xl"
                },
                {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": 'sm',
                    "contents": [
                        {
                            "type": "text",
                            "text": '售價:  ',
                            "color": '#aaaaaa',
                            "size": 'md',
                            "flex": 0
                        },
                        {
                            "type": "135,900元起",
                            "wrap": "True",
                            "color": '#666666',
                            "size": 'md',
                            "flex": 5
                        }
                    ]
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
                                    "text": '天 數:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "10天",
                                    "wrap": "True",
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
                                    "text": '國家:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "奧地利",
                                    "wrap": "True",
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
                                    "text": '地區:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "維也納 Vienna",
                                    "wrap": "True",
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
                                    "text": '出發地:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "桃園機場",
                                    "wrap": "True",
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
                                    "text": '航空公司:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "中華航空",
                                    "wrap": "True",
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
                                    "text": '最少成行人數:  ',
                                    "color": '#aaaaaa',
                                    "size": 'md',
                                    "flex": 0
                                },
                                {
                                    "type": "16人",
                                    "wrap": "True",
                                    "color": '#666666',
                                    "size": 'md',
                                    "flex": 5
                                }
                            ]
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
                    "type": "button",
                    "style": "link",
                    "color": "#000000",
                    "height": "sm",
                    "action": {
                        "type": "uri",
                        "label": '出發日及報名',
                        "uri": 'https://travel.liontravel.com/order/choose?NormGroupID=58ea86f3-576a-460d-9fd2-cc111437d14d&GroupID=18EA816CI-T&Status=1'
                    }

                },
                {
                    "type": "separator",
                    "color": "#000000"
                },
                {
                    "type": "button",
                    "style": "link",
                    "color": "#000000",
                    "height": "sm",
                    "action": {
                        "type": "uri",
                        "label": '查看更多相關行程',
                        "uri": 'https://travel.liontravel.com/detail?NormGroupID=58ea86f3-576a-460d-9fd2-cc111437d14d&GroupID=18EA816CI-T'
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
        "altText": "旅遊資訊Flex",
        "contents": carousel_Flex
    }
    lineapi.pushText(userKey, Flex_Message)
}
