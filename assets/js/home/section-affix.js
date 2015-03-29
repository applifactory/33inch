$(function(){
  $('.boxes, .style, .stock').each(function(){
    var $item = $(this);
    $item.affix({
      offset: {
        top: function () {
          return $item.offset().top;
        }
      }
    })
  })
})
