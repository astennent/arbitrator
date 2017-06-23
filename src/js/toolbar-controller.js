app.controller('toolbarController', ['$scope', 'Project', 'currentPage', 'disk',
   function($scope, Project, currentPage, disk) {
      $scope.save = disk.save;
      $scope.open = disk.load;
      $scope.exportReliability = disk.exportReliability;
      $scope.switchToSetup = currentPage.switchToSetup;
      $scope.onlyIncludeFullyArbitrated = {
         value: false
      };
      $scope.export = function() {
         disk.exportCsv($scope.onlyIncludeFullyArbitrated.value);
      };

      $scope.handleLoad = disk.load;
}]);
