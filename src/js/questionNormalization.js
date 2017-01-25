app.factory('questionNormalization', ['questionSorter', function(questionSorter) {
   var keyMap = {};

   var remappingCallbacks = jQuery.Callbacks();

   function addMappings(mappings) {
      angular.merge(keyMap, mappings);
      _.forEach(mappings, function(newName, oldName) {
         remappingCallbacks.fire(oldName, newName);
      });
   }

   function removeMapping(oldName) {
      var newName = keyMap[oldName];
      remappingCallbacks.fire(newName, oldName);
      delete keyMap[oldName];
   }

   function getCurrentMap() {
      return keyMap;
   }

   function getSortedMap() {
      var sortedKeys = questionSorter.getSortedKeys(keyMap, false);
      return sortedKeys.map(function(key) {
         return {
            oldName: key,
            newName: keyMap[key]
         }
      });
   }

   return {
      addMappings: addMappings,
      removeMapping: removeMapping,
      setDataFromLoading: addMappings,
      getCurrentMap: getCurrentMap,
      getSortedMap: getSortedMap,
      getDataForSaving: getCurrentMap,

      addRemappingCallback: function (callback) {
         remappingCallbacks.add(callback);
      }
   }
}]);