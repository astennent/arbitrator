app.controller('sidebarController', ['$scope', 'coderData', 'currentPage', 'Case', function($scope, coderData, currentPage, Case) {
   $scope.getCases = coderData.getCases;
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
      return caseObject.isFullyArbitrated ?
         includeFullyArbitrated.value :
         includeDoubleCoded.value;
   }

   $scope.switchToCase = function(caseKey) {
      currentPage.switchToCase();
      Case.setCurrent(caseKey);
   }
}]);

