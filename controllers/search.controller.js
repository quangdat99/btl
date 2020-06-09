var User = require('../models/user.model');
var Group = require('../models/group.model');
var User_Group = require("../models/user_group.model");


const filterUser = (users, field)=>{
  var reg = new RegExp(field, "gi")
  return users.filter((user)=>{
    return (user.email.search(reg) != -1 || user.displayName.search(reg) != -1);
  });
}

// tìm user không trong nhóm này để thêm vào nhóm group
// tìm partners =>> trả về những ai không phải parter

module.exports.postSearchAllUser = async (req, res)=>{
  var field = req.body.name;
  var groupId = req.body.groupId;

  if (field == ""){
    res.jsonp([]);
    return;
  }

  var parters = await User_Group.find({groupId: groupId});
  var partnerIds = parters.map((partner)=>partner.userId);
  var users = await User.find({_id: {$nin: partnerIds}});
  
  users = JSON.parse(JSON.stringify(users));

  if (field != ""){
    users = filterUser(users, field);
  }
  
  res.jsonp(users);
}

module.exports._postSearchAllUser = async function(req, res, next ) {
  var field = req.body.name;
  var groupId = req.body.groupId;

  var users = await User.find(function(err, data){
    var data =data.filter(function(user){
      return (user.displayName.toLowerCase()
                .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/đ/g, "d")
                  .replace(/Đ/g, "D")
                  

                  .indexOf(field
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/đ/g, "d")
                  .replace(/Đ/g, "D")) !== -1)
    })
    var result=[];
    if(!err && field !==''){
      if(data && data.length && data.length>0){
        data.forEach(user=>{
         result.push(user);
       });

      }
      res.json(result);
    }
  });
  // users.exec(function(err,data){

  //   var result=[];
  //   if(!err){
  //     if(data && data.length && data.length>0){
  //       data.forEach(user=>{
  //        result.push(user.displayName);
  //      });

  //     }
  //     res.jsonp(result);
  //   }

  // });
};

// tìm user trong group để chỉ định công việc
module.exports.postSearchGroupUser = async function(req, res, next) {
  var field = req.body.field;
  var groupId = req.params.groupId;

  if (field == ""){
    res.jsonp([]);
    return;
  }

  var userId = req.signedCookies.userId;
  // var userId = req.body.userId;
	if (groupId == "#null" || groupId == ""){
		var users = await User.find({_id: {$not: userId}});
	}
	else {
		var partnersGroup = await User_Group.find({groupId: groupId});
		partnerIds = partnersGroup.map((partnerGroup)=>{
			return partnerGroup.userId;
		});
		
		var users = await User.find({_id: {$in: partnerIds}});
		users = users.map((user)=>{
			return {
				_id: user._id,
				displayName: user.displayName,
				email: user.email
			}
		})
	}
	
	if (field != "#null" && field != "")
		users = filterUser(users, field);
	res.send(users)

};
