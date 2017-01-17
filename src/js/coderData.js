app.factory('coderData', function() {
   var cases = {};

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
      parsedContents.data.forEach(function (caseObject) {
         var caseId = caseObject[caseIdKey];
         trimWhitespaceInValues(caseObject);
         parsedData[caseId] = caseObject;
      });
      importCaseData(coderId, parsedData);
   }

   return {
      getCase: function (caseId) {
         return cases[caseId];
      },
      getCases: function() {
         return cases;
      },
      importRawData: importRawData
   }
});
