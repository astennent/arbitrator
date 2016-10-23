app.controller('toolbarController', ['$scope', 'Project', 'currentPage', 'disk', function($scope, Project, currentPage, disk) {
   $scope.save = disk.save;
   $scope.open = disk.load;
   $scope.dirty = Project.isDirty;
   $scope.switchToSetup = currentPage.switchToSetup;
}]);
