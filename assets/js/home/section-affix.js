$(function(){
  $('section.boxes').affix({
    offset: {
      top: function () {
        return $('section.boxes').offset().top;
      }
    }
  })
})
