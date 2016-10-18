app.filter('websiteUrl', function(){
  return function(website, short) {
    return ( short ? '' : 'http://' ) + ( website.domain ? website.domain : website.permalink + '.' + window.location.host );
  };
});
