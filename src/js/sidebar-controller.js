app.controller('sidebarController', ['$scope', 'sidebarDisplayCases', 'currentPage', 'Case', function($scope, sidebarDisplayCases, currentPage, Case) {
   $scope.getCases = sidebarDisplayCases.get;
   var includeSingleCoded = {
      display: 'Single Coded',
      value: false
   };
   var includeDoubleCoded = {
      display: 'Double Coded',
      value: true
   };
   var includeFullyArbitrated = {
      display: 'Fully Arbitrated',
      value: false
   };
   $scope.filters = [
      includeSingleCoded,
      includeDoubleCoded,
      includeFullyArbitrated
   ];
   $scope.filterText = "";

   function canDisplayFromArbitrationCheckboxes(caseObject) {
      if (caseObject.count == 1) {
         return includeSingleCoded.value;
      }
      return caseObject.fullyArbitrated ?
         includeFullyArbitrated.value :
         includeDoubleCoded.value;
   }

   $scope.shouldDisplay = function(caseObject) {
      if (!canDisplayFromArbitrationCheckboxes(caseObject)) {
         return false;
      }
      return $scope.filterText == "" || caseObject.displayText.indexOf($scope.filterText) > -1;
   };

   $scope.switchToCase = function(caseKey) {
      currentPage.switchToCase();
      Case.setCurrent(caseKey);
   };

   $scope.isSelected = function(caseId) {
      return Case.getCurrent() === caseId;
   }
}]);

