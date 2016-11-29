$(function(){
  $('a[href^="#"]').click(function(e){
    var $target = $(e.currentTarget.href.replace(/.+#/gi, '#'));
    if ( $target.length ) {
      e.preventDefault();
      $('html,body').stop().animate({scrollTop: Math.min($target.offset().top, $('body')[0].scrollHeight - $(window).height())}, 350);
    }
  });
});
