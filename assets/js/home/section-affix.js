$(function(){
  $('.boxes, .style, .stock, .publish').each(function(){
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
