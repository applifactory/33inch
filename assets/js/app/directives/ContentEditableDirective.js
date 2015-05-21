app.directive("contenteditable", function($timeout, $window) {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      function sanitize() {
        var savedSelection = rangy.saveSelection();
        var repeat = true;
        while (repeat) {
          repeat = false;
          angular.forEach(element[0].querySelectorAll('*'), function(item){
            if ( ['div', 'span', 'br', 'i', 'b', 'strong'].indexOf(item.tagName.toLowerCase()) < 0 ) {
              item.insertAdjacentHTML('afterend', '<div>' + item.innerHTML + '</div>');
              item.remove();
              repeat = true;
            }
            item.removeAttribute('style');
          });
        }
        rangy.restoreSelection(savedSelection);
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind('blur keyup change', function(e) {
        if ( e.type != 'blur' )
          sanitize();
        scope.$apply(read);
      });

      element.bind('keydown', function(e) {
        if( ( e.keyCode || e.witch ) == 13 ) {
            e.preventDefault();
            if( navigator.userAgent.indexOf("msie") > 0 ) {
              insertHtml('<br />');
            }
            else {
              var selection = window.getSelection(),
              range = selection.getRangeAt(0),
              br = document.createElement('br');
              range.deleteContents();
              range.insertNode(br);
              range.setStartAfter(br);
              range.setEndAfter(br);
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
            }
        }
      });

      element.bind('paste', function(e){
        e.preventDefault();
        var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
        $window.document.execCommand('insertText', false, text);
      });

    }
  };
});
