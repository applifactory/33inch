$(function(){
  $('.home .newsletter form').submit(function(e){
    e.preventDefault();
    if ( $(this).find('[name=email]').val() )
      $(this).html('<p>Thank you!</p>');
  })
})
