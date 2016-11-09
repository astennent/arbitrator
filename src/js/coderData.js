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

   function importRawData(fileContents, caseIdKey, coderIdKey) {
      var parsedContents = Papa.parse(fileContents, {header: true});
      var parsedData = {};
      var coderId = parsedContents.data[0][coderIdKey];
      parsedContents.data.forEach(function (caseObject) {
         var caseId = caseObject[caseIdKey];
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
