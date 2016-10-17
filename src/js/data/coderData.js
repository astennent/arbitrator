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

   return {
      getCases: function () {
         return displayCases;
      },
      getCase: function (caseId) {
         return cases[caseId];
      },
      setCaseData: function(coderId, parsedData) {
         for (var caseId in parsedData) {
            if (!cases[caseId]) {
               cases[caseId] = {};
            }
            cases[caseId][coderId] = parsedData[caseId];
         }
         updateDisplayCases();
      }
   }
});
