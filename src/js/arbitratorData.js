app.factory('arbitratorData', function() {
   var cases = {};

   function remapKeys(keyMap, object) {
      return _.reduce(object, function (result, value, key) {
         key = keyMap[key];
         result[key] = value;
         return result;
      }, {});
   }

   function generateKeyMaps() {
      var i = 0;
      var fullToShortKeyMap = {};
      var shortToFullKeyMap = {};
      for (var caseKey in cases) {
         for (var questionKey in cases[caseKey]) {
            if (!(questionKey in fullToShortKeyMap)) {
               var shortenedKey = (++i).toString(36);
               fullToShortKeyMap[questionKey] = shortenedKey;
               shortToFullKeyMap[shortenedKey] = questionKey;
            }
         }
      }
      return {
         fullToShortKeyMap: fullToShortKeyMap,
         shortToFullKeyMap: shortToFullKeyMap
      };
   }

   return {
      getCase: function (caseKey) {
         if (!(caseKey in cases)) {
            cases[caseKey] = {};
         }
         return cases[caseKey];
      },
      getDataForSaving: function() {
         var keyMaps = generateKeyMaps();
         var fullToShortKeyMap = keyMaps.fullToShortKeyMap;
         var shortToFullKeyMap = keyMaps.shortToFullKeyMap;
         var shortMappedData = {};
         for (var caseId in cases) {
            shortMappedData[caseId] = remapKeys(fullToShortKeyMap, cases[caseId]);
         }
         return {
            data: shortMappedData,
            keyMap: shortToFullKeyMap
         };
      },
      setDataFromLoading: function(arbitrationValues) {
         cases = arbitrationValues.data;
         var shortToFullKeyMap = arbitrationValues.keyMap;
         for (var caseId in cases) {
            cases[caseId] = remapKeys(shortToFullKeyMap, cases[caseId]);
         }
      },
      getExportData: function() {
         var output = [];
         for (var caseId in cases) {
            var currentCase = cases[caseId];
            var row = {};
            for (var questionId in currentCase) {
               row[questionId] = currentCase[questionId].value;
            }
            output.push(row);
         }
         return output;
      }
   }

});