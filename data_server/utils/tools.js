
export function myBrowser (b) {
    var agent = b.toLowerCase()

    let regStrIe = /msie [\d.]+;/gi
    let regStrFf = /firefox\/[\d.]+/gi
    let regStrChrome = /chrome\/[\d.]+/gi
    let regStrSaf = /safari\/[\d.]+/gi

    // IE
    if (agent.indexOf('msie') > 0) {
        return agent.match(regStrIe)
    }

    // firefox
    if (agent.indexOf('firefox') > 0) {
        return agent.match(regStrFf)
    }

    // Chrome
    if (agent.indexOf('chrome') > 0) {
        return agent.match(regStrChrome)
    }

    // Safari
    if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
        return agent.match(regStrSaf)
    }
}
// 获取操作系统信息 
export function getOsInfo (b) {
    var userAgent = b.toLowerCase();
    var name = 'Unknown';
    var name = 'Unknown';
    if (userAgent.indexOf('win') > -1) {
        if (userAgent.indexOf('windows nt 5.0') > -1) {
            name = 'Windows 2000';
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
            name = 'Windows XP';
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
            name = 'Windows Vista';
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
            name = 'Windows 7';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
            name = 'Windows 8';
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
            name = 'Windows 8.1';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
            name = 'Windows 10';
        } else {
            name = 'Unknown';
        }
    } else if (userAgent.indexOf('iphone') > -1) {
        name = 'Iphone';
    } else if (userAgent.indexOf('mac') > -1) {
        name = 'Mac';
    } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
        name = 'Unix';
    } else if (userAgent.indexOf('linux') > -1) {
        if (userAgent.indexOf('android') > -1) {
            name = 'Android';
        } else {
            name = 'Linux';
        }
    } else {
        name = 'Unknown';
    }
    return name
}