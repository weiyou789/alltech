/**
 * 配置访问后端接口的域名端口
 */
let interfaceUrl = ''
let hbpUrl = ''
let b2bUrl = ''
let javaUrl = ''

var env = process.env.NODE_ENV === 'development' ? 'development' : (process.env.REACT_APP_ENV === 'dev' ?
    'dev' : process.env.REACT_APP_ENV === 'test' ? 'test' : process.env.REACT_APP_ENV === 'preview' ? 'preview' : 'production')
switch (env) {
    case 'development':
        interfaceUrl = 'http://localhost:130/server'
        javaUrl = 'http://192.168.20.160:40100/api'
        hbpUrl = 'https://staging-hbp.hosjoy.com'
        b2bUrl = 'https://staging-b2b-gateway.hosjoy.com'
        break
    case 'dev':
        interfaceUrl = 'http://dataserver-dfx.hosjoy.com:130'
        javaUrl = 'http://dataserver-dfx.hosjoy.com:40100'
        hbpUrl = 'https://staging-hbp.hosjoy.com'
        b2bUrl = 'https://staging-b2b-gateway.hosjoy.com'
        break
    case 'test':
        interfaceUrl = 'http://dataserver-dfx.hosjoy.com:130'
        javaUrl = 'http://dataserver-dfx.hosjoy.com:40100'
        hbpUrl = 'https://staging-hbp.hosjoy.com'
        b2bUrl = 'https://staging-b2b-gateway.hosjoy.com'
        break
    case 'preview':
        interfaceUrl = 'http://dataserver-dfx.hosjoy.com:130'
        javaUrl = 'http://dataserver-dfx.hosjoy.com:40100'
        hbpUrl = 'https://staging-hbp.hosjoy.com'
        b2bUrl = 'https://staging-b2b-gateway.hosjoy.com'
        break
    case 'production':
        interfaceUrl = 'http://dataserver-dfx.hosjoy.com/server'
        javaUrl = 'http://dataserver-dfx.hosjoy.com:40100'
        hbpUrl = 'https://staging-hbp.hosjoy.com'
        b2bUrl = 'https://staging-b2b-gateway.hosjoy.com'
        break
    default:
        break
}
export {
    interfaceUrl,
    hbpUrl,
    b2bUrl,
    javaUrl
}
