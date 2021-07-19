export function debounce (func, delay) {
    let timer;

    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export function moment (timestamps = null) {
    const d = timestamps ? new Date(timestamps) : new Date();
    const [year, month, day, hour, minute, second] = [
        d.getFullYear(),
        d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`,
        d.getDate() >= 10 ? d.getDate() : `0${d.getDate()}`,
        d.getHours() >= 10 ? d.getHours() : `0${d.getHours()}`,
        d.getMinutes() >= 10 ? d.getMinutes() : `0${d.getMinutes()}`,
        d.getSeconds() >= 10 ? d.getSeconds() : `0${d.getSeconds()}`,
    ];

    return {
        format (patterns = 'YYYY-MM-DD HH:mm:SS') {
            return patterns
                .replace(/YYYY/g, year)
                .replace(/MM/g, month)
                .replace(/DD/g, day)
                .replace(/HH/g, hour)
                .replace(/mm/g, minute)
                .replace(/SS/g, second);
        },
    };
}

/**
 * @description 格式化人民币 eg:10000 => 10,000.00
 * @param {*} money
 */
export function formatMoney (money, decimal = 2) {
    if (Number(money) === 0 || Number.isNaN(Number(money))) return '0.00';
    return Number(money)
        .toFixed(decimal)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function convertData (data = []) {
    const res = [];
    for (const item of data) {
        const geoCoord = geoCoordMap[item.name];
        if (geoCoord) {
            res.push({
                name: item.name,
                value: geoCoord.concat(item.value),
                // visualMap: false,
            });
        }
    }
    return res;
}


