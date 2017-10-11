app.factory('sidebarDisplayCases', ['coderData', 'arbitratorData', 'caseInfoService', 'sidebarRefreshService',
function(coderData, arbitratorData, caseInfoService, sidebarRefreshService) {
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
            flag: caseInfoService.getFlag(caseId),
         }
      });
   }

   function refreshCase(caseId) {
      console.log(caseId);
      refresh(); //TODO This is more than necessary.
   }

   arbitratorData.addLoadCompleteCallback(refresh);
   coderData.addLoadCompleteCallback(refresh);
   sidebarRefreshService.subscribeToRefresh(refreshCase);

   return {
      get: function() {
         return displayCases;
      }
   }

}]);