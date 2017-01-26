app.factory('coderData', ['questionNormalization', 'keyRemapper', function(questionNormalization, keyRemapper) {
   var cases = {};
   var loadCompleteCallbacks = jQuery.Callbacks();

   function importCaseData(coderId, parsedData) {
      for (var caseId in parsedData) {
         if (!cases[caseId]) {
            cases[caseId] = {};
         }
         cases[caseId][coderId] = parsedData[caseId];
      }
   }

   function trimWhitespaceInValues(caseObject) {
      for (var key in caseObject) {
         caseObject[key] = caseObject[key].trim();
      }
   }

   function importRawData(fileContents, caseIdKey, coderIdKey) {
      var parsedContents = Papa.parse(fileContents, {header: true});
      var parsedData = {};
      var coderId = parsedContents.data[0][coderIdKey];

      var existingMappings = questionNormalization.getCurrentMap();
      parsedContents.data.forEach(function (caseObject) {
         var caseId = caseObject[caseIdKey];
         trimWhitespaceInValues(caseObject);
         var normalizedCaseObject = keyRemapper.remapKeys(existingMappings, caseObject);
         parsedData[caseId] = normalizedCaseObject;
      });
      importCaseData(coderId, parsedData);
      loadCompleteCallbacks.fire();
   }

   questionNormalization.addRemappingCallback(renameColumn);
   function renameColumn(oldName, newName) {
      _.forEach(cases, function(caseObject) {
         _.forEach(caseObject, function(coderObject) {
            coderObject[newName] = coderObject[oldName];
            delete coderObject[oldName];
         });
      })
   }

   return {
      getCase: function (caseId) {
         return cases[caseId];
      },
      getCases: function() {
         return cases;
      },
      importRawData: importRawData,
      addLoadCompleteCallback: function(callback) {
         loadCompleteCallbacks.add(callback);
      },
   }
}]);
