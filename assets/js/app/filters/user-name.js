app.filter('userName', function(){
  return function(user) {
    var userName = ( user.name || user.email.replace(/@.*/, '') );
    return userName.charAt(0).toUpperCase() + userName.slice(1);
  };
});
