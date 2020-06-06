$(document).ready(function(){
  $("#them1").click(function(){
    $(".submit").fadeIn(300);
    $("#them1").fadeOut(0);
  });
  $("#them2").click(function(){
    $(".submit").fadeOut(0);
    $("#them1").fadeIn(0);
  });


  $(".list-add ").click(function(){
    var id= $(this).attr("id").slice(3);
    console.log(id);
    $(" #card"+id).fadeIn(0);
    $(" #add"+id).fadeOut(0);
    
  });

  $(".thoatnhe").click(function(){
    var id= $(this).attr("id").slice(5);
    console.log(id);
    $(" #card"+id).fadeOut(0);
    $(" #add"+id).fadeIn(0);
  });
  
  $(".u-bottom").click(function(){
    $(".u-bottom").fadeOut(0);
    $(".description-edit").fadeIn(0);
  });
  $("#xxx").click(function(){
    $(".description-edit").fadeOut(0);
    $(".u-bottom").fadeIn(0);
  });

  $("#themm").click(function(){
    $("#themm").fadeOut(0);
    $(".description-editt").fadeIn(0);
  });
  $("#xxy").click(function(){
    $(".description-editt").fadeOut(0);
    $("#themm").fadeIn(0);
  });


});

