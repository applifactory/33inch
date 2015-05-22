$(function(){
  $('form[name=email]').each(function(){
    $(this).submit(function(e){
      e.preventDefault();
      $form = $(e.target);
      var data = {};
      $form.addClass('loading').find('input, textarea').each(function(){
        if ( $(this).attr('name') == 'email' )
          data['email'] = $(this).val();
        else
          data[$(this).parent().find('label').text()] = $(this).val();
      });
      $.post( '/api/v1/mail', data, function(){
        $form[0].reset();
        $form.delay(350).removeClass('loading');
      });
    })
  });
})
