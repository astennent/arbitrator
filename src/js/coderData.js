app.factory('coderData', function() {
   var cases = {};
   var displayCases = [];

   function updateDisplayCases() {
      displayCases = Object.keys(cases).map(function(caseId) {
         return {
            id: caseId,
            count: Object.keys(cases[caseId]).length
         }
      });
   }

   function importCaseData(coderId, parsedData) {
      for (var caseId in parsedData) {
         if (!cases[caseId]) {
            cases[caseId] = {};
         }
         cases[caseId][coderId] = parsedData[caseId];
      }
      updateDisplayCases();
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
      getCases: function () {
         return displayCases;
      },
      getCase: function (caseId) {
         return cases[caseId];
      },
      importRawData: importRawData
   }
});
