app.directive('fileReader', function () {
   function readFiles(files, $scope) {
      if (files.length === 0) {
         return;
      }

      for (var i = 0; i < files.length; i++) {
         var r = new FileReader();
         r.onload = function (e) {
            var contents = e.target.result;
            $scope.$apply(function () {
               $scope.handleLoad(contents);
            });
         };
         r.readAsText(files[i]);
      }
   }

   return {
      scope: true,
      link: function ($scope, element) {
         element.on('change', function (changeEvent) {
            var files = changeEvent.target.files;
            readFiles(files, $scope);
         });
      }
   };
});