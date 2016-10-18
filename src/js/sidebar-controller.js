app.controller('sidebarController', ['$scope', 'coderData', 'currentPage', 'Case', function($scope, coderData, currentPage, Case) {
   $scope.getCases = coderData.getCases;
   $scope.includeFullyArbitrated = true; // TODO: Load
   $scope.includeSingleCoded = true;

   $scope.shouldDisplay = function(caseObject) {
      return (caseObject.count > 1 || $scope.includeSingleCoded) &&
         (!caseObject.isFullyArbitrated || $scope.includeFullyArbitrated);
   }

   $scope.switchToCase = function(caseKey) {
      currentPage.switchToCase();
      Case.setCurrent(caseKey);
   }
}]);

