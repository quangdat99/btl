var addEventRenameTask = ()=>{
  //rename task
  $("input.title-task").focus(function(){
    var value = $(this).val();
    var taskId = $(this).attr("taskId");
    $(this).focusout(function(){
      var valuee = $(this).val();
      if (valuee==''){
        valuee = value;
        $(this).val(valuee);
      }
      if(valuee!==value){
        $.ajax({
          url: "/task/rename",
          method: "POST",
          dataType: "json",
          data: {title: valuee, taskId: taskId},
          success: function(data){
            console.log(data);
          }
        })
      }
      
    })
  })
}

var addEventDeleteTask =()=>{
  // delete task
  $("a.delete-task").click(function(){
    var taskId =$(this).attr("taskId");
    var taskTitle = $(this).attr("taskTitle");
    $("#task"+taskId).remove();
    console.log(taskId);
    console.log(taskTitle);
    $.ajax({
      url: "/task/delete",
      method: "POST",
      dataType:"json",
      data: {taskTitle: taskTitle, taskId: taskId},
      success: function(data){
        console.log(data);
      }
    })
  })  
}

const loadChartDistribution= ()=>{
  var taskDistribution = JSON.parse($("#taskDistribution").attr("taskDistribution"));
  var userDisplayName = JSON.parse($("#taskDistribution").attr("userDisplayName"));

  var chartData = [["User Name", "Task Count"]]
  for (var u in Object.keys(taskDistribution)){
    var key = Object.keys(taskDistribution)[u]
    var cData = [userDisplayName[key], Number(taskDistribution[key])];
    chartData.push(cData)
  }

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable(chartData);

    var options = {
      title: "Phân Chia Công Việc",
      chartArea: {
        width: 500,
        height: 150
      },
      width: 500,
      height: 260
    };

    var chart = new google.visualization.PieChart(
      document.getElementById("taskDistribution")
    );

    chart.draw(data, options);
  }
}
const loadChartComplement= ()=>{
  var taskComplement = JSON.parse($("#taskComplement").attr("taskComplement"));
  var userDisplayName = JSON.parse($("#taskComplement").attr("userDisplayName"));

  var chartData = [["User Name", "Task Complement Count"]]
  for (var u in Object.keys(taskComplement)){
    var key = Object.keys(taskComplement)[u]
    var cData = [userDisplayName[key], Number(taskComplement[key])];
    chartData.push(cData);
  }

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = google.visualization.arrayToDataTable(chartData);

    var options = {
      title: "Số Lượng Công Việc Đúng Deadline",
      chartArea: {
        width: 500,
        height: 150
      },
      width: 500,
      height: 260
    };

    var chart = new google.visualization.BarChart(
      document.getElementById("taskComplement")
    );

    chart.draw(data, options);
  }
}
const loadChartOverDeadline= ()=>{
  var taskOverDeadline = JSON.parse($("#taskOverDeadline").attr("taskOverDeadline"));
  var userDisplayName = JSON.parse($("#taskOverDeadline").attr("userDisplayName"));

  var chartData = [["User Name", "Task Over Deadline"]]
  for (var u in Object.keys(taskOverDeadline)){
    var key = Object.keys(taskOverDeadline)[u]
    var cData = [userDisplayName[key], Number(taskOverDeadline[key])];
    chartData.push(cData);
  }

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = google.visualization.arrayToDataTable(chartData);

    var options = {
      title: "Số Lượng Công Việc Trễ Deadline",
      chartArea: {
        width: 500,
        height: 150
      },
      legend: {
        position: 'top'
      },
      width: 500,
      height: 260
    };

    var chart = new google.visualization.BarChart(
      document.getElementById("taskOverDeadline")
    );

    chart.draw(data, options);
  }
}

$(document).ready(function(){
  // change backgroud
  $(".bg-change").click(function(){
    var boardId = $(this).attr("boardId");
    var imgUrl = $(this).css("background-image");
    var bg = $(this).attr("bg");
    $(".board").css("background-image", imgUrl);
    $.ajax({
      url: "/board/changeBackground",
      method: "POST",
      dataType: "json",
      data: {boardId: boardId, imgUrl: bg},
      success: function(data){
        console.log(data);
      }
    })
  })

  // create list
  $("a#them1").click(function(){
    $(".submit").fadeIn(300);
    $("a#them1").fadeOut(0);
  });
  $("a#them2").click(function(){
    $(".submit").fadeOut(0);
    $("a#them1").fadeIn(0);
  });

  //ceate card
  $(".list-add ").click(function(){
    var id= $(this).attr("id").slice(3);
    $(" #card"+id).fadeIn(0);
    $(" #add"+id).fadeOut(0);  
  });
  $(".thoatnhe").click(function(){
    var id= $(this).attr("id").slice(5);
    
    $(" #card"+id).fadeOut(0);
    $(" #add"+id).fadeIn(0);
  });


  var poolTask = {};
  var poolCheck ={};
  var his_cardId;
  
  //create comment
  $("input.comment-his").on("keydown", function search(e){
    if (e.keyCode == 13){
      var content = $(this).val();
      var cardId = $(this).attr("cardId");
      his_cardId=cardId;


      $.ajax({
        url: "/comment/create",
        method: "POST",
        dataType: "json",
        data: {content: content, cardId: cardId},
        success: function(data){
          console.log(data);
        }
      })

      $(this).val('');
    }
  })

  //index card
  var poolDeadline = {};
  
  $("a.card-name").click(function(){
    var cardId = $(this).attr('cardId');
    var boardId = $(this).attr('boardId');
    his_cardId = cardId;

    $("#checklist"+cardId).html('');
    $("#hd"+cardId).html('');
    $("#select"+cardId).html('<option value="Chọn công việc" disabled selected>Chọn công việc</option>');

    $.ajax({
      url: "/card/index",
      method: "POST",
      dataType: "json",
      data: {cardId: cardId},
      success: function(data){
        console.log(data);
        data.card.tasks.forEach(task =>{
          var status;
          if (task.status==1) {status="checked"} else {status ="unchecked"};
          if (task.deadlineTime >0) {
            task.deadlineTime= new Date(task.deadlineTime);
            task.deadlineTime=JSON.stringify(task.deadlineTime);
            task.deadlineTime = task.deadlineTime.substr(1, task.deadlineTime.length - 6);
          }
             else {task.deadlineTime='';
           };
          if (task.user){
            $("#checklist"+cardId).append('<div id="task'+task._id+'" class="window-module-title" style="display:block; overflow: hidden;"><div style="display:flex;"><span style="margin-right: 15px;padding: 5px;"><input type="checkbox" '+status+' class="checkbox-task" taskId="'+task._id+'"  id="checkbox'+task._id+'" style="zoom:2"></span><div class="editable checklist-title"><input class="title-task mod-card-back-title " dir="auto" style="overflow: hidden; overflow-wrap: break-word; height: 32px;width: 90%;color: #5e6c84; " taskId="'+task._id+'" value="'+task.title+'" ><a class="delete-task button subtle" taskId="'+task._id+'" taskTitle="'+task.title+'" href="#">X&oacute;a</a></div></div><div style="display: flex;margin-top: 10px;"><a class="button subtle appoint-member" taskId="'+task._id+'" id="chidinh'+task._id+'" href="#" style="float: left; margin-left: 53px;display: none; ">Chỉ định </a><input id="search'+task._id+'" taskId="'+task._id+'" type="text" class=" form-control search-member-group" style="width:200px; display:none; margin-left:53px;"><div  style="float: left;margin-left: 100px;color: #29a3a3; font-weight: 600;" id="result'+task._id+'">'+task.user.displayName+'<span  style="font-size: 14px;font-weight: 400;">&nbsp;đã được chỉ định thực hiện</span> </div></div><div id="dl-display'+task._id+'" style="margin-left: 160px;">'+task.deadlineTime+'</div><ul class="list-group result-search-group" id="result-'+task._id+'" taskId="'+task._id+'"></ul> </div>')
          } else {
            $("#checklist"+cardId).append('<div id="task'+task._id+'" class="window-module-title" style="display:block; overflow: hidden;"><div style="display:flex;"><span style="margin-right: 15px;padding: 5px;"><input type="checkbox" '+status+' class="checkbox-task" taskId="'+task._id+'"  id="checkbox'+task._id+'" style="zoom:2"></span><div class="editable checklist-title"><input class="title-task mod-card-back-title " dir="auto" style="overflow: hidden; overflow-wrap: break-word; height: 32px;width: 90%;color: #5e6c84; " taskId="'+task._id+'" value="'+task.title+'" ><a class="delete-task button subtle" taskId="'+task._id+'" taskTitle="'+task.title+'" href="#">X&oacute;a</a></div></div><div style="display: flex;margin-top: 10px;"><a class="button subtle appoint-member" taskId="'+task._id+'" id="chidinh'+task._id+'" href="#" style="float: left; margin-left: 53px; color: #777 ">Chỉ định thành viên thực hiện </a><input id="search'+task._id+'" taskId="'+task._id+'" type="text" class=" form-control search-member-group" style="width:200px; display:none; margin-left:53px;"><div id="result'+task._id+'" style="float: left;margin-left: 100px;color: #29a3a3;font-weight: 600;"  id="result'+task._id+'"></div></div><div id="dl-display'+task._id+'" style="margin-left: 160px;">'+task.deadlineTime+'</div><ul class="list-group result-search-group" id="result-'+task._id+'" taskId="'+task._id+'"></ul> </div>')
          };
          // if (task.status==1){
          //   $('input#checkbox'+taskId).prop("checked", true);
          // } else {
          //   $('input#checkbox'+taskId).prop("checked", false);
          // }
          

          $("#select"+cardId).append('<option class="option-task"  value='+task._id+'> '+task.title+'</option>')

        });
        addEventRenameTask();
        addEventDeleteTask();
        // deadline
        $("#select"+cardId).on('click',function(){
          var taskId = $(this).val();
          console.log(taskId);
          var deadlineTime = Date.parse($("#dl-input"+cardId).val());
          console.log(deadlineTime);
          // deadlineTime = Date.parse(deadlineTime);
          // console.log(deadlineTime);
          
          var keyD = taskId.toString().trim() + "_" + deadlineTime.toString().trim();
          // if (poolDeadline[keyD] === true){
          //   return;
          // }
          // else {
          //   poolDeadline[keyD] = true;
          // }
          
          $.ajax({
            url: "/task/setDeadlineTime",
            method: "POST",
            dataType: "json",
            data: {taskId: taskId, deadlineTime: deadlineTime},
            success: function(data){
              console.log(data);
              var task = data.task;
              var dead= new Date(task.deadlineTime);
              var de=JSON.stringify(dead);
              var d = de.substr(1, de.length - 6);
              $("#dl-display"+taskId).text('');
              $("#dl-display"+taskId).text(d);

            }
          });
          // $(this).val('Chọn công việc');


        })

        // update checkbox task
        $("input.checkbox-task").click(function(){
          var taskId =$(this).attr("taskId");
          console.log(taskId);
          var value = $(this).prop("checked");
          console.log(value);
          if (value===true){
            var tonumber = $('span#comple'+cardId).text();
            tonumber = Number(tonumber)+1;
            $('span#comple'+cardId).text(tonumber);
          } else{
            var tonumber = $('span#comple'+cardId).text();
            tonumber = Number(tonumber)-1;
            $('span#comple'+cardId).text(tonumber);
          }

          if ($('span#comple'+cardId).text() === $('span#tasksCount'+cardId).text() && $('span#tasksCount'+cardId).text() !== '0'){
            $("#cpl"+cardId).css({"background-color":"#61bd4f","color":"#fff","padding":"5px"});
          } else {
            $("#cpl"+cardId).css({"background-color":"","color":"","padding":""});
          }

          $.ajax({
            url: "/task/toggleStatus",
            method: "POST",
            dataType: "json",
            data: {taskId: taskId},
            success: function(data){
              console.log(data);
            }
          })
        });

        //appoint member
        $("a.appoint-member").click(function(){
          var taskId = $(this).attr("taskId");
          $(this).fadeOut(0);
          $("#search"+taskId).fadeIn(0).focus();
        });
        $("input.search-member-group").focusout(function(){
          var taskId = $(this).attr("taskId");
            $(this).fadeOut(0);
            $("a#chidinh"+taskId).fadeIn(0);
        });
        $("input.search-member-group").on("keydown",function(e){
          var taskId = $(this).attr("taskId");
          if(e.keyCode ==13){
            $(this).fadeOut(0);
            $("a#chidinh"+taskId).fadeIn(0);
          }
        });
        //search member group
        $("input.search-member-group").keyup(function(search){
          var value = $(this).val();
          var taskId =$(this).attr("taskId");
          $('#result-'+taskId).html('');
          var groupId=($('#groupId').attr('groupId'));
          $.ajax({
            url: "/search/groupUser",
            method: "POST",
            dataType: "json",
            data: {field: value, groupId: groupId},
            success: function(data){
              console.log(data);
              data.forEach(user =>{
                $('#result-'+taskId).append("<li userId="+ user._id+" taskId="+taskId+" class='list-group-item' style=' display:flex; '><img src='/image/group.png' style='height:40px;width:40px;' class='img-thumbnail'><div style='margin-left: 15px;'><div style='font-weight: 600;'>"+ user.displayName+ "</div><div style='font-size: 14px;color:#777;'>"+user.email+"</div></div></li>")
              });

            }
          })

          $('#result-'+taskId).on("click", "li", function(event){             
            var taskId = $(this).attr("taskId");   
            $('#result-'+taskId).html('');
            $('input.search-member-group').val('');
            var userId=($(this).attr('userId'));
            var groupId=($('#groupId').attr('groupId'));
            
            if (poolTask[taskId] === true){
              return;
            }
            else {
              poolTask[taskId] = true;
            };
            
            $.ajax({
              url: "/task/appoint",
              method: "POST",
              dataType: "json",
              data: {appointedUserId: userId, taskId: taskId},
              success: function(data){
                console.log(data);
                $('#result'+taskId).html('');
                $('#result'+taskId).append(data.displayName+'<span  style="font-size: 14px;font-weight: 400;">&nbsp;đã được chỉ định thực hiện</span>');
                $("#chidinh"+taskId).remove();
              }
            })
            event.stopPropagation();
          });
        });

        //deadline Task



        for(var i=data.card.histories.length-1; i>=0; i--){
          var date = new Date(data.card.histories[i].timeCreated);
          var day = date.getDate();
          var month = date.getMonth()+1;
          var year = date.getFullYear();
          var hour = date.getHours();
          var minute = date.getMinutes();
          var second = date.getSeconds();

          $("#hd"+cardId).append('<div class="js-menu-action-list"><div class="phenom"><div class="phenom-creator"><div class="member"><span class="member-initials"><i class="far fa-user" aria-hidden="true"> </i></span></div></div><div class="phenom-desc"><span class="inline-member">'+data.card.histories[i].header+'</span><div style="color:#777;">  &nbsp; '+data.card.histories[i].content +'</div></div><div class="phenom-meta">'+day+'-'+month+'-'+year+' '+hour+':'+minute+':'+second+'</div></div></div>')
        }




      }
    })

  })


  //create Task
  $('button.themcongviec').click(function(){
    var cardId = $(this).attr('cardId');
    var title = $('input#themviec'+cardId).val();
    $('span#tasksCount'+cardId).text(Number($('span#tasksCount'+cardId).text())+1);
    console.log(cardId);

    $.ajax({
      url: "/task/create",
      method: "POST",
      dataType: "json",
      data: { title: title, cardId: cardId},
      success: function(data){
        var task=data.task;
        var status;
        if (task.status==1) {status="checked"} else {status ="unchecked"};
        if (task.deadlineTime >0) {
            task.deadlineTime= new Date(task.deadlineTime);
            task.deadlineTime=JSON.stringify(task.deadlineTime);
            task.deadlineTime = task.deadlineTime.substr(1, task.deadlineTime.length - 6);
          }
             else {task.deadlineTime='';
           };
        $("#checklist"+cardId).append('<div id="task'+task._id+'" class="window-module-title" style="display:block; overflow: hidden;"><div style="display:flex;"><span style="margin-right: 15px;padding: 5px;"><input type="checkbox" '+status+' taskId="'+task._id+'" class="checkbox-task" id="checkbox'+task._id+'" style="zoom:2"></span><div class="editable checklist-title"><input class="title-task mod-card-back-title " dir="auto" style="overflow: hidden; overflow-wrap: break-word; height: 32px;width: 90%;color: #5e6c84; " taskId="'+task._id+'" value="'+task.title+'" ><a class="delete-task button subtle" taskId="'+task._id+'" taskTitle="'+task.title+'" href="#">X&oacute;a</a></div></div><div style="display: flex;margin-top: 10px;"><a class="button subtle appoint-member" taskId="'+task._id+'" id="chidinh'+task._id+'" href="#" style="float: left; margin-left: 53px; color: #777 ">Chỉ định thành viên thực hiện </a><input id="search'+task._id+'" taskId="'+task._id+'" type="text" class=" form-control search-member-group" style="width:200px; display:none; margin-left:53px;"><div id="result'+task._id+'" style="float: left;margin-left: 100px;color: #29a3a3; font-weight: 600;"  id="result'+task._id+'"></div></div><div id="dl-display'+task._id+'" style="margin-left: 160px;">'+task.deadlineTime+'</div><ul class="list-group result-search-group" id="result-'+task._id+'" taskId="'+task._id+'"></ul> </div>')
        
        addEventRenameTask();
        addEventDeleteTask();
        $("#select"+cardId).append('<option class="option-task"  value='+task._id+'> '+task.title+'</option>');

        // deadline
        $("#select"+cardId).on('click',function(){
          var taskId = $(this).val();
          console.log(taskId);
          var deadlineTime = $("#dl-input"+cardId).val();
          deadlineTime = Date.parse(deadlineTime);
          console.log(deadlineTime);
          $.ajax({
            url: "/task/setDeadlineTime",
            method: "POST",
            dataType: "json",
            data: {taskId: taskId, deadlineTime: deadlineTime},
            success: function(data){
              console.log(data);
              var task = data.task;
              var dead= new Date(task.deadlineTime);
              var de=JSON.stringify(dead);
              var d = de.substr(1, de.length - 6);
              $("#dl-display"+taskId).text('');
              $("#dl-display"+taskId).text(d);

            }
          });
          $(this).val('Chọn công việc');

        })

        // update checkbox task
        $("input.checkbox-task").click(function(){
          var taskId =$(this).attr("taskId");
          console.log(taskId);
          var value = $(this).prop("checked");
          console.log(value);
          if (value===true){
            var tonumber = $('span#comple'+cardId).text();
            tonumber = Number(tonumber)+1;
            $('span#comple'+cardId).text(tonumber);
          } else {
            var tonumber = $('span#comple'+cardId).text();
            tonumber = Number(tonumber)-1;
            $('span#comple'+cardId).text(tonumber);
          }
          if ($('span#comple'+cardId).text() === $('span#tasksCount'+cardId).text() && $('span#tasksCount'+cardId).text() !== '0'){
            $("#cpl"+cardId).css({"background-color":"#61bd4f","color":"#fff","padding":"5px"});
          } else {
            $("#cpl"+cardId).css({"background-color":"","color":"","padding":""});
          }

          $.ajax({
            url: "/task/toggleStatus",
            method: "POST",
            dataType: "json",
            data: {taskId: taskId},
            success: function(data){
              console.log(data);
            }
          })
        });

            //appoint member
        $("a.appoint-member").click(function(){
          var taskId = $(this).attr("taskId");
          $(this).fadeOut(0);
          $("#search"+taskId).fadeIn(0).focus();
        });
        $("input.search-member-group").focusout(function(){
          var taskId = $(this).attr("taskId");
            $(this).fadeOut(0);
            $("a#chidinh"+taskId).fadeIn(0);
            // $('#result-'+taskId).fadeOut(0);
        });
        $("input.search-member-group").on("keydown",function(e){
          var taskId = $(this).attr("taskId");
          if(e.keyCode ==13){
            $(this).fadeOut(0);
            $("a#chidinh"+taskId).fadeIn(0);
            // $('#result-'+taskId).fadeOut(0);
          }
        });



        //search member group
        $("input.search-member-group").keyup(function(search){
          var value = $(this).val();
          var taskId =$(this).attr("taskId");
          $('#result-'+taskId).html('');
          var groupId=($('#groupId').attr('groupId'));
          $.ajax({
            url: "/search/groupUser",
            method: "POST",
            dataType: "json",
            data: {field: value, groupId: groupId},
            success: function(data){
              console.log(data);
              data.forEach(user =>{
                $('#result-'+taskId).append("<li userId="+ user._id+" taskId="+taskId+" class='list-group-item' style=' display:flex; '><img src='/image/group.png' style='height:40px;width:40px;' class='img-thumbnail'><div style='margin-left: 15px;'><div style='font-weight: 600;'>"+ user.displayName+ "</div><div style='font-size: 14px;color:#777;'>"+user.email+"</div></div></li>")
              });

            }
          })

          $('#result-'+taskId).on("click", "li", function(event){             
            var taskId = $(this).attr("taskId");   
            $('#result-'+taskId).html('');
            $('input.search-member-group').val('');
            var userId=($(this).attr('userId'));
            var groupId=($('#groupId').attr('groupId'));

            if (poolTask[taskId] === true){
              return;
            }
            else {
              poolTask[taskId] = true;
            };

            
            $.ajax({
              url: "/task/appoint",
              method: "POST",
              dataType: "json",
              data: {appointedUserId: userId, taskId: taskId},
              success: function(data){
                console.log(data);
                $('#result'+taskId).html('');
                $('#result'+taskId).append(data.displayName+'<span  style="font-size: 14px;font-weight: 400;">&nbsp;đã được chỉ định thực hiện</span>');
                $("#chidinh"+taskId).remove();
              }
            })
            event.stopPropagation();
          });
        });    






      }
    });




    $('input.vieccanlam').val('');
  })


  //rename card
  $("input.title-card").focus(function(){
    var value = $(this).val();
    var cardId = $(this).attr("cardId");
    console.log(value);
    console.log(cardId);
    $(this).focusout(function(){
      var valuee = $(this).val();
      if (valuee==''){
        valuee = value;
        $(this).val(valuee);
      }
      $("span#card-name"+cardId).text(valuee);
      if(valuee!==value){
        $.ajax({
          url: "/card/rename",
          method: "POST",
          dataType: "json",
          data: {title: valuee, cardId: cardId},
          success: function(data){
            console.log(data);
          }
        })
      }
      
    })
  });

  

  //rename list
  $("input.title-list").focus(function(){
    var value = $(this).val();
    var listId = $(this).attr("listId");
    console.log(value);
    console.log(listId);
    $(this).focusout(function(){
      var valuee = $(this).val();
      if (valuee=='') {
        valuee = value;
        $(this).val(valuee);

      }
      if(valuee!==value){
        $.ajax({
          url: "/list/rename",
          method: 'POST',
          dataType: "json",
          data: { title: valuee, listId: listId},
          success: function(data){
            console.log(data);
          }
        })
      }
      
    })
  });

  //delete list
  $("button.dropdown-item").click(function(){
    var listId =$(this).attr("listId");
    var listTitle = $(this).attr("listTitle");
        his_boardId= $(this).attr("boardId");
    $("#list"+listId).remove();
    console.log(listId);
    console.log(listTitle);
    const socket = io.connect('http://localhost:3001');
    socket.on('NEW_HISTORY', (data) => {
      console.log(data);
      if(data.history.boardId== his_boardId){
        $("#hd"+his_boardId).prepend('<div class="js-menu-action-list"><div class="phenom"><div class="phenom-creator"><div class="member"><span class="member-initials"><i class="far fa-user" aria-hidden="true"> </i></span></div></div><div class="phenom-desc"><span class="inline-member">'+data.history.header+'</span></div><div class="phenom-meta">H&ocirc;m qua l&uacute;c 13:36</div></div></div>')
      }
    });

    $.ajax({
      url: "/list/delete",
      method: "POST",
      dataType:"json",
      data: {listTitle: listTitle, listId: listId},
      success: function(data){
        console.log(data);
      }
    })
  });




  //update description
  $("p.u-bottom").click(function(){
    $("p.u-bottom").fadeOut(0);
    $(".description-edit").fadeIn(0);
    $('textarea.update-des').focus();
  });
  $("a#xxx").click(function(){
    $(".description-edit").fadeOut(0);
    $("p.u-bottom").fadeIn(0);
  });

  $("button.update-description").click(function(){
    var cardId = $(this).attr("cardId");
    var description = $('textarea.update-des').val();
    $(".description-edit").fadeOut(0);
    $("p.u-bottom").fadeIn(0);
    if (description==''){
      $('a.description-fake-text-area').text("Thêm mô tả chi tiết hơn...")
    } else {
      $('a.description-fake-text-area').text(description);
    }
    $.ajax({
      url: "/card/updateDescription",
      method: "POST",
      dataType: "json",
      data: {description: description, cardId: cardId},
      success: function(data){
        console.log(data);
      }
    })
  })

  //update viec can lam
  $("#themm").click(function(){
    $("#themm").fadeOut(0);
    $(".description-editt").fadeIn(0);
  });
  $("#xxy").click(function(){
    $(".description-editt").fadeOut(0);
    $("#themm").fadeIn(0);
  });

  //history board card
  const socket = io.connect('http://localhost:3001');
  socket.on('NEW_HISTORY', (data) => {
    console.log(data);

    var date = new Date(data.history.timeCreated);
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if(data.history.cardId== his_cardId){
      $("#hd"+his_cardId).prepend('<div class="js-menu-action-list"><div class="phenom"><div class="phenom-creator"><div class="member"><span class="member-initials"><i class="far fa-user" aria-hidden="true"> </i></span></div></div><div class="phenom-desc"><span class="inline-member">'+data.history.header+'</span><div style="color:#777;">  &nbsp; '+data.history.content +'</div></div><div class="phenom-meta">'+day+'-'+month+'-'+year+' '+hour+':'+minute+':'+second+'</div></div></div>')
    }
    var his_boardId = $(".board-header").attr("boardId");
    if(data.history.boardId== his_boardId){
      $("#hd"+his_boardId).prepend('<div class="js-menu-action-list"><div class="phenom"><div class="phenom-creator"><div class="member"><span class="member-initials"><i class="far fa-user" aria-hidden="true"> </i></span></div></div><div class="phenom-desc"><span class="inline-member">'+data.history.header+'</span><div style="color:#777;">  &nbsp; '+data.history.content +'</div></div><div class="phenom-meta">'+day+'-'+month+'-'+year+' '+hour+':'+minute+':'+second+'</div></div></div>')
    }
  });

  loadChartDistribution();
  loadChartComplement();
  loadChartOverDeadline();
});




// // socket io
// const socket = io.connect('http://localhost:3001');
// socket.on('NEW_HISTORY', (data) => {
//     console.log(data);
//     /// api append vào lịch sử của board, card 
//     // thêm cái header với kiểu thêm, sửa, xóa
//     // thêm cả content với bình luận trong card 
//     // kiểu check boardId == data.history.boardId => tạo 1 history element
//     // xong append vào thẻ chứa history của board , còn đang bật card -> xem đúng cardId thì append 1 element vào lịch sử của card 
// });



 



