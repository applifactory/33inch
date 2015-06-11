$(function(){
  $('.scroll-down').click(function(e){
    var $target = $('.newsletter');
    $('html,body').stop().animate({scrollTop: Math.min($target.offset().top, $('body')[0].scrollHeight - $(window).height())}, 350);
  })
})
