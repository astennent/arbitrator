app.controller('setupController', ['$scope', 'coderData', 'arbitratorData', 'sidebarDisplayCases', 'Project', 'questionNormalization',
      function($scope, coderData, arbitratorData, sidebarDisplayCases, Project, questionNormalization) {

   $scope.project = Project.get();
         
   $scope.handleLoad = function(fileContents) {
      coderData.importRawData(fileContents, $scope.project.caseIdKey, $scope.project.coderIdKey);
      sidebarDisplayCases.refresh();
   };

   $scope.handleArbitratorLoad = function(fileContents) {
      arbitratorData.importRawData(fileContents, $scope.project.caseIdKey);
      sidebarDisplayCases.refresh();
   };
         
   $scope.normalizedKeyMap = questionNormalization.get();
}]);