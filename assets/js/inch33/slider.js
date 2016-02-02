$(function(){
  $('.slides').each(function(){
    $this = $(this);
    $slides = $this.find('.slide');
    $slides.removeClass('active');
    $slides.first().addClass('active');
    $nav = $this.next();
    _nav = '';
    $slides.each(function(){
      _nav += '<li></li>';
    });
    $nav.html(_nav);
    $navs = $nav.find('li');
    var setActive = function(index) {
      $slides.removeClass('active');
      $navs.removeClass('active');
      $slides.eq(index).addClass('active');
      $navs.eq(index).addClass('active');
      timerStart();
    }
    var next = function() {
      var index = $this.find('.active').index() + 1;
      if ( index >= $slides.length )
        index = 0;
      setActive(index);
    }
    var _timeout = 0;
    var timerStart = function() {
      clearTimeout(_timeout);
      _timeout = setTimeout(next, 5000);
    }
    $navs.bind('click', function(){
      setActive($(this).index());
    })
    setActive(0);
    timerStart();
  });
})
