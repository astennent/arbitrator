app.controller('sidebarController', ['$scope', 'sidebarDisplayCases', 'currentPage', 'Case', function($scope, sidebarDisplayCases, currentPage, Case) {
   $scope.getCases = sidebarDisplayCases.get;
   var includeSingleCoded = {
      display: 'Include Single Coded',
      value: false
   };
   var includeDoubleCoded = {
      display: 'Include Double Coded',
      value: true
   };
   var includeFullyArbitrated = {
      display: 'Include Fully Arbitrated',
      value: false
   };
   $scope.filters = [
      includeSingleCoded,
      includeDoubleCoded,
      includeFullyArbitrated
   ];

   $scope.shouldDisplay = function(caseObject) {
      if (caseObject.count == 1) {
         return includeSingleCoded.value;
      }
      return caseObject.fullyArbitrated ?
         includeFullyArbitrated.value :
         includeDoubleCoded.value;
   };

   $scope.switchToCase = function(caseKey) {
      currentPage.switchToCase();
      sidebarDisplayCases.refresh();
      Case.setCurrent(caseKey);
   };

   $scope.isSelected = function(caseId) {
      return Case.getCurrent() === caseId;
   }
}]);

