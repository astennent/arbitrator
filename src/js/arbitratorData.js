app.factory('arbitratorData', ['keyRemapper', 'questionNormalization', 'questionSorter', function(keyRemapper, questionNormalization, questionSorter) {
   var cases = {};

   function generateKeyMaps() {
      var fullToShortKeyMap = {};
      var shortToFullKeyMap = {};
      var i = 0;
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

   function importRawData(fileContents, caseIdKey) {
      var parsedContents = Papa.parse(fileContents, {header: true});
      parsedContents.data.forEach(function (caseObject) {
         var caseId = caseObject[caseIdKey];
         var currentCase = cases[caseId] || {};
         for (var questionId in caseObject) {
            currentCase[questionId] = {
               value: caseObject[questionId],
               status: 1
            }
         }
         cases[caseId] = currentCase;
      });
   }

   function isFullyArbitrated(caseId) {
      var currentCase = cases[caseId];
      if (!currentCase) {
         return false;
      }
      for (var questionKey in currentCase) {
         if (currentCase[questionKey].status === 0) {
            return false;
         }
      }
      return true;
   }

   function getExportData(onlyIncludeFullyArbitrated) {
      var output = [];
      var questionIds = questionSorter.getSortedKeys(cases, true);
      output.push(questionIds);
      for (var caseId in cases) {
         var currentCase = cases[caseId];
         if (onlyIncludeFullyArbitrated && !isFullyArbitrated(caseId)) {
            continue;
         }
         var row = [];
         for (var i in questionIds) {
            var questionId = questionIds[i];
            var questionObject = currentCase[questionId];
            var value = questionObject ? questionObject.value : "";
            row.push(value);
         }
         output.push(row);
      }
      return output;
   }


   function normalizeKeys() {
      var existingMappings = questionNormalization.getCurrentMap();
      _.forEach(existingMappings, function(newName, oldName) {
         renameColumn(oldName, newName);
      });
      for (var currentCase in cases) {
         identifyLongNames(cases[currentCase]);
      }
      questionNormalization.addMappings(ellipsesToNonEllipsis);
   }

   var ellipsesToNonEllipsis = {};

   function identifyLongNames(currentCase) {
      function calculateLongVersion(abbreviatedQuestionId) {
         if (!questionId.endsWith('...')) {
            return;
         }

         if (abbreviatedQuestionId in ellipsesToNonEllipsis) {
            return;
         }

         var removedEllipses = abbreviatedQuestionId.substring(0, abbreviatedQuestionId.length - 3);
         var wasSet = false;
         for (var otherId in currentCase) {
            if (otherId.startsWith(removedEllipses) && otherId !== abbreviatedQuestionId) {
               ellipsesToNonEllipsis[abbreviatedQuestionId] = otherId;
               wasSet = true;
               break;
            }
         }
      }

      for (var questionId in currentCase) {
         calculateLongVersion(questionId);
      }
   }

   questionNormalization.addRemappingCallback(renameColumn);
   function renameColumn(oldKey, newKey) {
      for (var caseId in cases) {
         var caseObject = cases[caseId];
         remapCaseColumnNames(oldKey, newKey, caseObject, caseId);
      }
   }

   function remapCaseColumnNames(oldName, updatedName, caseObject, caseId) {
      var oldValue = caseObject[oldName];
      if (!oldValue) {
         return;
      }
      var alreadyRemappedValue = caseObject[updatedName];

      delete caseObject[oldName];

      var preferOldValue = !alreadyRemappedValue || alreadyRemappedValue.value === "";
      if (preferOldValue) {
         caseObject[updatedName] = oldValue;
         return;
      }

      var keepUpdatedValue = angular.equals(alreadyRemappedValue, oldValue) || oldValue.value === "";
      if (keepUpdatedValue) {
         return;
      }

      console.log("Unable to fix case ", caseId, " for: ", oldName);
      caseObject[updatedName].status =  0;
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
            shortMappedData[caseId] = keyRemapper.remapKeys(fullToShortKeyMap, cases[caseId]);
         }
         return {
            data: shortMappedData,
            keyMap: shortToFullKeyMap
         };
      },
      importRawData: importRawData,
      setDataFromLoading: function(arbitrationValues) {
         var unmappedCases = arbitrationValues.data;
         var shortToFullKeyMap = arbitrationValues.keyMap;
         for (var caseId in unmappedCases) {
            cases[caseId] = keyRemapper.remapKeys(shortToFullKeyMap, unmappedCases[caseId]);
         }
         normalizeKeys();
      },
      getExportData: getExportData,
      isFullyArbitrated: isFullyArbitrated
   }

}]);