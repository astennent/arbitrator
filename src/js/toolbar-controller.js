app.controller('toolbarController', ['$scope', 'Project', 'currentPage', function($scope, Project, currentPage) {
   $scope.save = Project.save;
   $scope.open = Project.open;
   $scope.dirty = Project.isDirty;
   $scope.switchToSetup = currentPage.switchToSetup;
}]);
