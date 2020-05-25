const socketMapper = function(){
    this.mapper = {}
    this.appendSocket = (uId, socket)=>{
        this.mapper[uId] = socket;
    }
    this.getSockets = (uId)=>{
        return this.mapper[uId];
    }
}

module.exports = socketMapper;