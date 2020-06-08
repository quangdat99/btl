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
      $.ajax({
        url: "/task/rename",
        method: "POST",
        dataType: "json",
        data: {title: valuee, taskId: taskId},
        success: function(data){
          console.log(data);
        }
      })
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


$(document).ready(function(){
  
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

  //create Task
  $('button.themcongviec').click(function(){
    var cardId = $(this).attr('cardId');
    var title = $('input#themviec'+cardId).val();
    console.log(title);
    console.log(cardId);
    $.ajax({
      url: "/task/create",
      method: "POST",
      dataType: "json",
      data: { title: title, cardId: cardId},
      success: function(data){
        console.log(data);
        $("#checklist"+cardId).append('<div id="task'+data.task._id+'" class="window-module-title"><span style="margin-right: 15px;padding: 5px;"><i class="fas fa-check-square" aria-hidden="true">&nbsp; </i></span><div class="editable checklist-title"><input type="text" class="title-task mod-card-back-title " value="' + data.task.title +'" taskId="'+data.task._id+'" dir="auto" style="overflow: hidden; overflow-wrap: break-word; height: 32px;width: 90%;color: #5e6c84;"  > <a class="delete-task button subtle" taskTitle="'+data.task.title+'" taskId="'+data.task._id+'" href="#">X&oacute;a</a></div></div>')
        addEventRenameTask();
        addEventDeleteTask();
      }
    })
    $('input.vieccanlam').val('');
  })
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

  $("a.card-name").click(function(){
    var cardId = $(this).attr('cardId');
    var boardId = $(this).attr('boardId');
    his_cardId = cardId;

    $("#checklist"+cardId).html('');
    $("#hd"+cardId).html('');
    $.ajax({
      url: "/card/index",
      method: "POST",
      dataType: "json",
      data: {cardId: cardId},
      success: function(data){
        console.log(data);
        data.card.tasks.forEach(task =>{
          $("#checklist"+cardId).append('<div id="task'+task._id+'" class="window-module-title"><span style="margin-right: 15px;padding: 5px;"><i class="fas fa-check-square" aria-hidden="true">&nbsp; </i></span><div class="editable checklist-title"><input class="title-task mod-card-back-title " dir="auto" style="overflow: hidden; overflow-wrap: break-word; height: 32px;width: 90%;color: #5e6c84;" taskId="'+task._id+'" value="'+task.title+'" ><a class="delete-task button subtle" taskId="'+task._id+'" taskTitle="'+task.title+'" href="#">X&oacute;a</a></div></div>')
        });

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
        // data.card.histories.forEach(history=>{
        //   $("#hd"+cardId).append('<div class="js-menu-action-list"><div class="phenom"><div class="phenom-creator"><div class="member"><span class="member-initials"><i class="far fa-user" aria-hidden="true"> </i></span></div></div><div class="phenom-desc"><span class="inline-member">'+history.header+'</span></div><div class="phenom-meta">H&ocirc;m qua l&uacute;c 13:36</div></div></div>')

        // });

        addEventRenameTask();
        addEventDeleteTask();
      }
    })

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
      $("a#card-name"+cardId).text(valuee);
      console.log(valuee);
      $.ajax({
        url: "/card/rename",
        method: "POST",
        dataType: "json",
        data: {title: valuee, cardId: cardId},
        success: function(data){
          console.log(data);
        }
      })
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
      console.log(valuee);
      $.ajax({
        url: "/list/rename",
        method: 'POST',
        dataType: "json",
        data: { title: valuee, listId: listId},
        success: function(data){
          console.log(data);
        }
      })
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



 



