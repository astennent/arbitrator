app.factory('sidebarDisplayCases', ['coderData', 'arbitratorData', 'disk', function(coderData, arbitratorData, disk) {
   var displayCases = [];

   function refresh() {
      var cases = coderData.getCases();
      displayCases = Object.keys(cases).map(function (caseId) {
         return {
            id: caseId,
            count: Object.keys(cases[caseId]).length,
            fullyArbitrated: arbitratorData.isFullyArbitrated(caseId),
            displayText: 'Case ' + caseId
         }
      });
   }

   disk.addLoadCompleteCallback(refresh);

   return {
      get: function() {
         return displayCases;
      }
   }

}]);