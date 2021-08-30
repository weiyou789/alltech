/**
 * 配置访问后端接口的域名端口
 */
let interfaceUrl = ''

var env = process.env.NODE_ENV === 'development' ? 'development' : (process.env.REACT_APP_ENV === 'dev' ?
    'dev' : process.env.REACT_APP_ENV === 'test' ? 'test' : process.env.REACT_APP_ENV === 'preview' ? 'preview' : 'production')
switch (env) {
    case 'development':
        interfaceUrl = 'http://192.168.20.248:130'
        break
    case 'dev':
        interfaceUrl = 'http://192.168.20.248:130'
        break
    case 'test':
        interfaceUrl = 'http://192.168.20.248:130'
        break
    case 'preview':
        interfaceUrl = 'http://192.168.20.248:130'
        break
    case 'production':
        interfaceUrl = 'http://192.168.20.248:130'
        break
    default:
        break
}
export {
    interfaceUrl
}
