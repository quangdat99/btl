var addEventRenameTask = ()=>{
  //rename task
  $("input.title-task").focus(function(){
    var value = $(this).val();
    var taskId = $(this).attr("taskId");
    console.log(" ?? " + value);
    console.log(" ?? " + taskId);
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
        $("#checklist"+cardId).append('<div id="task'+data.task._id+'" class="window-module-title"><span style="margin-right: 15px;padding: 5px;"><i class="fas fa-tasks" aria-hidden="true">&nbsp; </i></span><div class="editable checklist-title"><input type="text" class="title-task mod-card-back-title " value="' + data.task.title +'" taskId="'+data.task._id+'" dir="auto" style="overflow: hidden; overflow-wrap: break-word; height: 32px;width: 90%;color: #5e6c84;"  > <a class="delete-task button subtle" taskTitle="'+data.task.title+'" taskId="'+data.task._id+'" href="#">X&oacute;a</a></div></div>')
        addEventRenameTask();
        addEventDeleteTask();
      }
    })
    $('input.vieccanlam').val('');
  })

  //index card
  $("a.card-name").click(function(){
    var cardId = $(this).attr('cardId');
    console.log(cardId);
    $("#checklist"+cardId).html('');
    $.ajax({
      url: "/card/index",
      method: "POST",
      dataType: "json",
      data: {cardId: cardId},
      success: function(data){
        console.log(data);
        data.card.tasks.forEach(task =>{
          $("#checklist"+cardId).append('<div id="task'+task._id+'" class="window-module-title"><span style="margin-right: 15px;padding: 5px;"><i class="fas fa-tasks" aria-hidden="true">&nbsp; </i></span><div class="editable checklist-title"><input class="title-task mod-card-back-title " dir="auto" style="overflow: hidden; overflow-wrap: break-word; height: 32px;width: 90%;color: #5e6c84;" taskId="'+task._id+'" value="'+task.title+'" ><a class="delete-task button subtle" taskId="'+task._id+'" taskTitle="'+task.title+'" href="#">X&oacute;a</a></div></div>')

        });

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
    $("#list"+listId).remove();
    console.log(listId);
    console.log(listTitle);
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


});

