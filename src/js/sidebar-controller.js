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

   function passesArbitrationCheckboxes(caseObject) {
      if (caseObject.count == 1) {
         return includeSingleCoded.value;
      }
      return caseObject.fullyArbitrated ?
         includeFullyArbitrated.value :
         includeDoubleCoded.value;
   }

   function passesFilterText(caseObject) {
      return $scope.filterText == "" ||
             caseObject.displayText.indexOf($scope.filterText) > -1;
   }

   function passesCoderCheckboxes(caseObject) {

   }

   $scope.shouldDisplay = function(caseObject) {
      return passesArbitrationCheckboxes(caseObject) && passesFilterText(caseObject);
   };

   $scope.switchToCase = function(caseKey) {
      currentPage.switchToCase();
      Case.setCurrent(caseKey);
   };

   $scope.isSelected = function(caseId) {
      return Case.getCurrent() === caseId;
   }
}]);

