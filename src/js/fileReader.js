function executeContents($scope, callback, file) {
   var r = new FileReader();
   r.onload = function (e) {
      var contents = e.target.result;
      $scope.$apply(function () {
         callback(contents);
      });
   };
   r.readAsText(file);
   return r;
}

app.directive('fileReader', function () {
   function readFiles(files, $scope) {
      for (var i = 0; i < files.length; i++) {
         var file = files[i];
         var callback = $scope.handleLoad;
         executeContents($scope, callback, file);
      }
   }

   function readArbitratorFile(files, $scope) {
      var callback = $scope.handleArbitratorLoad;
      executeContents($scope, callback, files[0]);
   }

   return {
      scope: true,
      link: function ($scope, element) {
         element.on('change', function (changeEvent) {
            var files = changeEvent.target.files;
            if (element[0].id === 'arbitratorFile') {
               readArbitratorFile(files, $scope)     ;
            } else {
               readFiles(files, $scope);
            }
            element[0].value = null;
         });
      }
   };
});