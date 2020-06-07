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
    // $(document).mouseup(function(evt){
    //   var target = evt.currentTarget;
    //   var inside = $(" #card"+id);
    //   if (target !== inside){
    //     console.log("hello");
    //     $(" #card"+id).fadeOut(0);
    //     $(" #add"+id).fadeIn(0);
    //   }
      
    // });  
  });
  $(".thoatnhe").click(function(){
    var id= $(this).attr("id").slice(5);
    
    $(" #card"+id).fadeOut(0);
    $(" #add"+id).fadeIn(0);
  });
  // $("input.themthe").click(function(){
  //   var id= $(this).attr("id");
  //   var value = $("textarea#"+id).val();
  //   console.log(id);
  //   console.log(value);
  //   $(" #card"+id).fadeOut(0);
  //   $(" #add"+id).fadeIn(0);
  //   $.ajax({
  //     url: "/card/create",
  //     method: "POST",
  //     dataType: "json",
  //     data: { title: value, listId: id},
  //     success: function(data){
  //       console.log(data);
  //       $("")
  //     }
  //   })
  // });

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
  })


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

