app.directive('slides', function($timeout){
  return {
    restrict: 'C',
    scope: {
      ngModel: '='
    },
    link: function(scope, el, attrs){
      var _el = el[0];
      var _nav = _el.parentElement.querySelector('.nav');
      var _currentIndex = 0;

      var generateNav = function() {
        _nav.innerHTML = '';
        if ( scope.ngModel && scope.ngModel.length ) {
          angular.forEach(scope.ngModel, function(){
            _nav.innerHTML += '<li></li>'
          })
        }
        angular.element(_nav.querySelectorAll('li')).bind('click', function(e){
          var index = Array.prototype.indexOf.call(e.target.parentElement.children, e.target);
          setActiveSlide(index);
        })
      }
      var setActiveSlide = function(index) {
        _currentIndex = Math.max(index, 0);
        var slides = _el.querySelectorAll('.slide');
        var dots = _nav.querySelectorAll('li');
        angular.forEach(slides, function(slide, _index){
          if ( _currentIndex == _index )
            slide.classList.add('active');
          else
            slide.classList.remove('active');
        });
        angular.forEach(dots, function(dot, _index){
          if ( _currentIndex == _index )
            dot.classList.add('active');
          else
            dot.classList.remove('active');
        });
      }
      var unwatch = scope.$watchCollection('ngModel', function(slides){
        $timeout(function(){
          generateNav();
          setActiveSlide(Math.min(_currentIndex, slides.length-1));
        });
      });
      scope.$on('$destroy', function(){
        unwatch();
      });
      //console.log('slides', console.log('ngModel', scope.ngModel));
    }
  }
})
