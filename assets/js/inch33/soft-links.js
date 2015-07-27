$(function(){
  var scrollOffset = 0;
  $('[class^=menu] li a').click(function(e){
    if ( this.href.indexOf('#') > 0 ) {
      if ( this.href.replace(/#.*/, '') == document.location.href.replace(/#.*/, '') ) {
        e.preventDefault();
        var $target = $( this.href.replace(/.+#/, '#') );
        if ( $target.length )
          $('html,body').animate({scrollTop: Math.min($target.offset().top - scrollOffset, $('body')[0].scrollHeight - $(window).height())});
      }
    }
  });
  if ( document.location.hash && document.location.hash.length > 1 ) {
    var $target = $( document.location.hash );
    $('html,body').scrollTop(0).animate({scrollTop: Math.min($target.offset().top - scrollOffset, $('body')[0].scrollHeight - $(window).height())});
  }
})
