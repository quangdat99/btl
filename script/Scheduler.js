const Task = require("../models/task.model");

const conf = require("../res/Notification.json");

const ONE_SECOND = 1000;
const ONE_MINUTE = 60*ONE_SECOND;
const ONE_HOUR = 60*ONE_MINUTE;
const ONE_DAY = 24*ONE_HOUR;

const toHourMinute = (timeInMs)=>{
    var hours = Math.floor(timeInMs/ONE_HOUR);
    timeInMs -= hours*ONE_HOUR;
    var minutes = Math.floor(timeInMs/ONE_MINUTE);
    timeInMs -= minutes*ONE_MINUTE;

    return hours + "h:" + minutes + "m";
};

const notifyToAll = async ()=>{
    var date = new Date();

    var startOfDate = new Date(date.getTime() + conf.alertBefore*ONE_DAY);
    startOfDate.setHours(0);
    startOfDate.setMinutes(0);
    startOfDate.setSeconds(0);

    var endOfDate = new Date(date.getTime() + conf.alertBefore*ONE_DAY);
    endOfDate.setHours(23);
    endOfDate.setMinutes(59);
    endOfDate.setSeconds(59);

    // var tasks = await Task.find({deadlineTime: {$ne: -1}, status: 0})
    // tasks = tasks.filter((task)=>{
    //     return task.deadlineTime >= startOfDate && task.deadlineTime <= endOfDate;
    // });

    // var listIds = tasks.map((task)=>task.group);
    // var 
}

const Scheduler = {
    start: function(){
        var date = new Date();

        var passDay = new Date();
        passDay.setHours(conf.activeTime.hour);
        passDay.setMinutes(conf.activeTime.minute);
        passDay.setSeconds(conf.activeTime.second);
        passDay.setMilliseconds(conf.activeTime.miliSecond);

        // return;

        date.setDate(date.getDate() + (date>passDay? Number(1) : Number(0)));
        date.setHours(conf.activeTime.hour);
        date.setMinutes(conf.activeTime.minute);
        date.setSeconds(conf.activeTime.second);
        var coolDown = date - new Date();
        console.log("Start noti all after " + toHourMinute(coolDown));

        var self = this;
        setTimeout(function(){
            notifyToAll();
            this.start();
        }.bind(this), coolDown)
    },
};

module.exports.Scheduler = Scheduler;