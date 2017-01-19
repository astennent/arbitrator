app.factory('normalizedKeys', ['keyRemapper', function(keyRemapper) {
   var keyMap = {};
   return {
      set: function(value) {
         angular.merge(keyMap, value);
      },
      apply: function(object) {
         return keyRemapper.remapKeys(keyMap, object)
      },
      get: function() {
         return keyMap;
      }
   }
}]);