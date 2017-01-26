app.controller('setupController', ['$scope', 'coderData', 'arbitratorData', 'sidebarDisplayCases', 'Project', 'questionNormalization',
      function($scope, coderData, arbitratorData, sidebarDisplayCases, Project, questionNormalization) {

   $scope.project = Project.get();

   $scope.handleLoad = function(fileContents) {
      coderData.importRawData(fileContents, $scope.project.caseIdKey, $scope.project.coderIdKey);
   };

   $scope.handleArbitratorLoad = function(fileContents) {
      arbitratorData.importRawData(fileContents, $scope.project.caseIdKey);
   };


   function clearAdding() {
      $scope.adding = false;
      $scope.addedOld = "";
      $scope.addedNew = "";
      editedRowKey = null;
   }
   clearAdding();

   $scope.startAdding = function() {
      $scope.adding = true;
   };

   $scope.finishAdding = function() {
      $scope.adding = false;
      var oldName = $scope.addedOld;
      if (questionNormalization.getCurrentMap()[oldName]) {
         questionNormalization.removeMapping(oldName);
      }
      var mapping = {};
      mapping[oldName] = $scope.addedNew;
      questionNormalization.addMappings(mapping);
      clearAdding();
      refresh();
   };

   $scope.cancelAdding = function() {
      $scope.adding = false;
      clearAdding();
   };

   $scope.edit = function(oldText, newText) {
      $scope.addedOld = oldText;
      $scope.addedNew = newText;
      $scope.adding = true;
      editedRowKey = oldText;
   };

   $scope.removeMapping = function(oldText) {
      questionNormalization.removeMapping(oldText);
      refresh();
   };

   var editedRowKey = null;
   $scope.isEditing = function(oldText) {
      return oldText === editedRowKey;
   };

   function refresh() {
      $scope.normalizedKeyMap = questionNormalization.getSortedMap();
   }
   arbitratorData.addLoadCompleteCallback(refresh);
}]);