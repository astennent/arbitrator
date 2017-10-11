app.factory('sidebarDisplayCases', ['coderData', 'arbitratorData', 'caseInfoService', function(coderData, arbitratorData, caseInfoService) {
   var displayCases = [];

   function refresh() {
      var cases = coderData.getCases();
      displayCases = Object.keys(cases).map(function (caseId) {
         return {
            id: caseId,
            count: Object.keys(cases[caseId]).length,
            fullyArbitrated: arbitratorData.isFullyArbitrated(caseId),
            partiallyArbitrated: arbitratorData.isPartiallyArbitrated(caseId),
            displayText: caseInfoService.getFullTitle(caseId),
         }
      });
   }

   arbitratorData.addLoadCompleteCallback(refresh);
   arbitratorData.addFullyArbitratedStateChangeCallback(refresh)
   coderData.addLoadCompleteCallback(refresh);

   return {
      get: function() {
         return displayCases;
      }
   }

}]);