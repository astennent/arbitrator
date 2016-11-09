app.factory('sidebarDisplayCases', ['coderData', 'arbitratorData', function(coderData, arbitratorData) {

   var displayCases = [];

   function refresh() {
      var cases = coderData.getCases();
      displayCases = Object.keys(cases).map(function (caseId) {
         return {
            id: caseId,
            count: Object.keys(cases[caseId]).length,
            fullyArbitrated: arbitratorData.isFullyArbitrated(caseId)
         }
      });
   }

   return {
      refresh: refresh,
      get: function() {
         return displayCases;
      }
   }

}]);