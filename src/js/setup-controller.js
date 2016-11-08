app.controller('setupController', ['$scope', 'coderData', function($scope, coderData) {

   $scope.caseIdKey = 'Q2 - ID #'; // TODO: Don't hard-code these.
   $scope.coderIdKey = 'Q101 - Name of Coder';

   $scope.handleLoad = function(fileContents) {
      coderData.importRawData(fileContents, $scope.caseIdKey, $scope.coderIdKey);
   }
}]);