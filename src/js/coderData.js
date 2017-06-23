app.factory('coderData', ['questionNormalization', 'keyRemapper', 'questionSorter',
 function(questionNormalization, keyRemapper, questionSorter) {
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

   function getReliability() {
      var questionIds = questionSorter.getSortedKeys(cases, 2)
      var headerRow = ['Case Id'].concat(questionIds);
      headerRow.push('Case Average');
      var output = [headerRow];

      var questionMatchCounts = {};
      _.forEach(questionIds, function(questionId) {
         questionMatchCounts[questionId] = 0;
      });

      var doubleCountedCount = 0;
      _.forEach(cases, function(caseObject, caseId) {
         var coderKeys = Object.keys(caseObject);
         var coder1 = caseObject[coderKeys[0]];

         var row = [caseId];
         if (coderKeys.length === 2) {
            doubleCountedCount += 1;
            var coder2 = caseObject[coderKeys[1]];
            var caseMatchCount = 0;
            _.forEach(questionIds, function(questionId) {
               var matchValue = coder1[questionId] === coder2[questionId] ? 1 : 0;
               caseMatchCount += matchValue;
               questionMatchCounts[questionId] += matchValue;
               row.push(matchValue);
            });
            row.push(caseMatchCount / questionIds.length);
         }

         output.push(row);
      })

      var totalRow = ['Question Average'];
      _.forEach(questionIds, function(questionId) {
         var questionMatchCount = questionMatchCounts[questionId]
         totalRow.push(questionMatchCount / doubleCountedCount);
      })
      output.push(totalRow);

      return output;
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
      getReliability: getReliability,
   }
}]);
