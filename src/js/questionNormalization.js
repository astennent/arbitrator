app.factory('keyRemapper', function() {

   function remapKeys(keyMap, object) {
      return _.reduce(object, function (result, value, currentKey) {
         var updatedKey = keyMap[currentKey] || currentKey;
         result[updatedKey] = value;
         return result;
      }, {});
   }

   return {
      remapKeys: remapKeys
   }
});