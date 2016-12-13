app.controller('setupController', ['$scope', 'coderData', 'sidebarDisplayCases', function($scope, coderData, sidebarDisplayCases) {

   $scope.caseIdKey = 'Q2 - ID #'; // TODO: Don't hard-code these.
   $scope.coderIdKey = 'Q101 - Name of Coder';

   $scope.handleLoad = function(fileContents) {
      coderData.importRawData(fileContents, $scope.caseIdKey, $scope.coderIdKey);
      sidebarDisplayCases.refresh();
   }

   $scope.handleArbitratorLoad = function(fileContents) {
      console.log("here");
      arbitratorData.importRawData(fileContents, $scope.caseIdKey, $scope.coderIdKey);
      sidebarDisplayCases.refresh();
   }
}]);