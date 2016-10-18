module.exports = function(model, attrs) {
  var extracted = {};
  Object.keys(model).forEach(function(key){
    if ( attrs.indexOf(key) >= 0 ) {
      extracted[key] = model[key];
    }
  });
  return extracted;
};
