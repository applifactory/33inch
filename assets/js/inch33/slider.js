$(function(){
  $('.slides').each(function(){
    var $this = $(this),
        $slides = $this.find('.slide'),
        $nav = $this.next();
    $slides.removeClass('active');
    $slides.first().addClass('active');
    _nav = '';
    $slides.each(function(){
      _nav += '<li></li>';
    });
    $nav.html(_nav);
    var $navs = $nav.find('li');
    var setActive = function(index) {
      $slides.removeClass('active');
      $navs.removeClass('active');
      $slides.eq(index).addClass('active');
      $navs.eq(index).addClass('active');
      timerStart();
    };
    var next = function() {
      var index = $this.find('.active').index() + 1;
      if ( index >= $slides.length )
        index = 0;
      setActive(index);
    };
    var _timeout = 0;
    var timerStart = function() {
      clearTimeout(_timeout);
      _timeout = setTimeout(next, 5000);
    };
    $navs.bind('click', function(){
      setActive($(this).index());
    });
    setActive(0);
    timerStart();
  });
});
