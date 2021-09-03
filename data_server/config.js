module.exports = {
    "DEV": {
        mongoUrl: 'mongodb://192.168.20.248:27017/questiondb'
        , opts: {
            server: {reconnectInterval: 3000, reconnectTries: 600, auto_reconnect: true}
            , user: 'questionAdmin'
            , pass: '12345678'
        }
    },
    "SIT": {},
    "PRE": {
        mongoUrl: 'mongodb://192.168.20.248:27017/questiondb'
        , opts: {
            server: {reconnectInterval: 3000, reconnectTries: 600, auto_reconnect: true}
            , user: 'questionAdmin'
            , pass: '12345678'
        }
    },
    "PRD": {
        mongoUrl: 'mongodb://192.168.20.248:27017/questiondb'
        , opts: {
            server: {reconnectInterval: 3000, reconnectTries: 600, auto_reconnect: true}
            , user: 'questionAdmin'
            , pass: '12345678'
        }
    },
    "DEVETS": {
        mongoUrl: 'mongodb://123.60.84.10:8635/hosjoy-hbp-ets',
        opts: {
            server: {reconnectInterval: 3000, reconnectTries: 600, auto_reconnect: true}
            , user: 'etsuser'
            , pass: 'H%oai66YDMVzFSJN'
        },
        mySqlOpts:{
            host     : '123.60.34.125',
            user     : 'devuser',
            password : 'hoslocal@1228',
            database : 'hosjoy-b2b-order',
        },
        orderDB:{
            database : 'hosjoy-b2b-order'
        },
        paymentDB:{
            database: 'hosjoy-b2b-payment'
        },
        redisUrl:'redis://:KsniDk932@192.168.20.248:6379/4'
    },
    "PRDETS": {
        mongoUrl: 'mongodb://121.36.211.243:8635/hosjoy-hbp-ets',
        opts: {
            server: {reconnectInterval: 3000, reconnectTries: 600, auto_reconnect: true}
            , user: 'etsuser'
            , pass: 'H%oai66YDMVzFSJN'
        },
        mySqlOpts:{
            host     : '124.70.214.134',
            user     : 'devuser',
            password : 'hoslocal@1228',
        },
        orderDB:{
            database : 'hosjoy-b2b-order'
        },
        paymentDB:{
            database: 'hosjoy-b2b-payment'
        },
        redisUrl:'redis://:KsniDk932@192.168.20.248:6379/4'
    },
}[process.env.NODE_ENV || "PRD"];