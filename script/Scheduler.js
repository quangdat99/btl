const Task = require("../models/task.model");
const Card = require("../models/card.model");
const List = require("../models/list.model");
const Board = require("../models/board.model");
const User_Group = require("../models/user_group.model");
const User = require("../models/user.model");
const History = require("../models/history.model");

const Mailer = require("./mail").Mailer;

const conf = require("../res/Notification.json");

const ONE_SECOND = 1000;
const ONE_MINUTE = 60*ONE_SECOND;
const ONE_HOUR = 60*ONE_MINUTE;
const ONE_DAY = 24*ONE_HOUR;

const BOARD_TYPE = require("../controllers/const/Const").BOARD_TYPE;

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

    var tasks = await Task.find({deadlineTime: {$ne: -1}, status: 0})
    tasks = tasks.filter((task)=>{
        return task.deadlineTime >= startOfDate && task.deadlineTime <= endOfDate;
    });

    var cardsId = tasks.map((task)=>task.cardId);
    cardsId = cardsId.filter((cardId, index)=>(cardsId.indexOf(cardId) == index));
    var cards = await Card.find({_id: {$in: cardsId}});

    var listsId = cards.map((card)=>card.listId);
    listsId = listsId.filter((list, index)=>(listsId.indexOf(list) == index));
    var lists = await List.find({_id: {$in: listsId}});

    var boardsId = lists.map((list)=>list.boardId);
    boardsId = boardsId.filter((boardId, index)=>(boardsId.indexOf(boardId) == index));
    var boards = await Board.find({_id: {$in: boardsId}});

    for (var b in boards){
        var board = boards[b];
        
        if (board.boardType == BOARD_TYPE.PRIVATE){
            var users = await User.find({_id: board.userId});
        }
        else {
            var user_group = await User_Group.find({groupId: board.groupId});
            var usersId = user_group.map((u_g)=>u_g.userId);
            var users = await User.find({_id: {$in: usersId}})
        }

        var header = "Một công việc sắp đến deadline nằm trong bảng \"" + board.title + "\", hãy kiểm tra ngay!";
        var history = new History({
            header: header,
            content: "#noti#",
            timeCreated: new Date().getTime(),
            cardId: "",
            boardId: board._id
        });
        try {
            history.save();
        }
        catch (e) {
            console.log(e.toString());
        }
        
        global.socket.emit("NEW_HISTORY", {
            // userId: userId,
            history: history
        })

        Mailer.sendBatch(users, header)
    }



}

const Scheduler = {
    start: function(){
        var date = new Date();

        var passDay = new Date();
        passDay.setHours(conf.activeTime.hour);
        passDay.setMinutes(conf.activeTime.minute);
        passDay.setSeconds(conf.activeTime.second);
        passDay.setMilliseconds(conf.activeTime.miliSecond);

        date.setDate(date.getDate() + (date>passDay? Number(1) : Number(0)));
        date.setHours(conf.activeTime.hour);
        date.setMinutes(conf.activeTime.minute);
        date.setSeconds(conf.activeTime.second);
        var coolDown = date - new Date();
        console.log("Start noti all after " + toHourMinute(coolDown));

        setTimeout(function(){
            notifyToAll();
            this.start();
        }.bind(this), coolDown)
    },

    notify: ()=>{
        notifyToAll();
    }
};

module.exports.Scheduler = Scheduler;