/**
 * Created by admin on 2021/6/4.
 */
const schedule = require('node-schedule');

let rule = new schedule.RecurrenceRule();
// rule.date = 1;
// rule.hour = 23;
// rule.minute = 0;
rule.second = 0;

module.exports = {
    getMonthDataTask(){
        return schedule.scheduleJob(rule, () => {
            console.log(111);
        })
    }
}