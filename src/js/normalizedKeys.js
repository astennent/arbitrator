app.factory('questionNormalization', ['keyRemapper', function(keyRemapper) {
   var keyMap = {};

   function mergeKeysIntoMap(value) {
      angular.merge(keyMap, value);
   }

   function getCurrentMap() {
      return keyMap;
   }

   return {
      set: mergeKeysIntoMap,
      setDataFromLoading: mergeKeysIntoMap,
      get: getCurrentMap,
      getDataForSaving: getCurrentMap,
      
      normalizeCaseQuestions: function(object) {
         return keyRemapper.remapKeys(keyMap, object)
      }
   }
}]);