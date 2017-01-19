app.factory('arbitratorData', ['keyRemapper', 'normalizedKeys', function(keyRemapper, normalizedKeys) {
   var cases = {};

   function generateKeyMaps() {
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

   function shaeSort(a, b) {
      function qualtricsNum(questionId) {  // Not proud of this function
         try {
            questionId = questionId.split(" ")[0];
            var undIndex = questionId.indexOf("_");
            if (undIndex == -1) {
               undIndex = questionId.length;
            }
            var questionNum = parseInt(questionId.substring(1, undIndex+1));
            questionId = questionId.substring(undIndex+1);
            var nextUndIndex = questionId.indexOf("_");
            if (nextUndIndex == -1) {
               return questionNum;
            }
            var subNum = parseInt(questionId.substring(0, undIndex+1));
            return questionNum + subNum/100;
         } catch (e) {
            return -1;
         }
      }
      return qualtricsNum(a) - qualtricsNum(b);
   }

   function getSortedQuestionIds() {
      var uniqueKeys = {};
      for (var caseId in cases) {
         var currentCase = cases[caseId];
         for (var questionId in currentCase) {
            uniqueKeys[questionId] = undefined;
         }
      }
      return Object.keys(uniqueKeys).sort(shaeSort)
   }

   function getExportData(onlyIncludeFullyArbitrated) {
      var output = [];
      var questionIds = getSortedQuestionIds();
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

   var ellipsesToNonEllipsis = {};

   function normalizeKeys() {
      for (var currentCase in cases) {
         identifyLongNames(cases[currentCase]);
      }
      normalizedKeys.set(ellipsesToNonEllipsis);

      for (var caseId in cases) {
         fixLongNamesInCase(cases[caseId], caseId);
      }
   }

   function fixLongNamesInCase(currentCase, caseId) {
      for (var questionId in currentCase) {
         var longName = ellipsesToNonEllipsis[questionId];
         if (longName) {
            var longData = currentCase[longName];
            var shortData = currentCase[questionId];

            if (!longData) {
               currentCase[longName] = shortData;
               delete currentCase[questionId];
               continue;
            }

            if (angular.equals(longData, shortData)) {
               delete currentCase[questionId];
               continue;
            }

            if (longData.value === "") {
               currentCase[longName] = currentCase[shortData];
               delete currentCase[questionId];
               continue;
            }

            if (shortData.value === "") {
               delete currentCase[questionId];
               continue;
            }

            console.log("Couldn't automatically fix case ", caseId, ". Question #" + questionId);
            delete currentCase[questionId];
            currentCase[longName].status =  0;
         }
      }
   }

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