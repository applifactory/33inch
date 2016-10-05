app.directive('sidebar', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'assets/app/website/sidebar/main.html',
    link: function(scope, el, attr) {
      el.bind('mousewheel', function(e, d) {
        if (
             (el[0].scrollHeight - this.scrollTop - el[0].clientHeight <= 1 && e.deltaY > 0) ||
             ( this.scrollTop <= 1 && e.deltaY < 0 )
           ) {
          e.preventDefault();
        }
      });
    }
  }
})
