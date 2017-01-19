app.controller('setupController', ['$scope', 'coderData', 'arbitratorData', 'sidebarDisplayCases', 'Project', 'normalizedKeys',
      function($scope, coderData, arbitratorData, sidebarDisplayCases, Project, normalizedKeys) {

   $scope.project = Project.get();
         
   $scope.handleLoad = function(fileContents) {
      coderData.importRawData(fileContents, $scope.project.caseIdKey, $scope.project.coderIdKey);
      sidebarDisplayCases.refresh();
   };

   $scope.handleArbitratorLoad = function(fileContents) {
      arbitratorData.importRawData(fileContents, $scope.project.caseIdKey);
      sidebarDisplayCases.refresh();
   };
         
   $scope.normalizedKeyMap = normalizedKeys.get();
}]);