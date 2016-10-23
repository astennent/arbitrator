var app = angular.module('Arbitrator', [])

app.controller('projectController', ['$scope', 'Project', function($scope, Project) {
   $scope.projectName = Project.name();
}]);


app.factory('currentPage', function() {
   var currentPage = 'Setup';
   return {
      isOnSetup: function () {
         return currentPage === 'Setup';
      },
      isOnCase: function () {
         return currentPage === 'Case';
      },
      switchToCase: function() {
         currentPage = 'Case';
      },
      switchToSetup: function() {
         currentPage = 'Setup';
      }
   }
})
app.controller('pageController', ['$scope', 'currentPage', function($scope, currentPage) {
   $scope.isOnCase = currentPage.isOnCase;
   $scope.isOnSetup = currentPage.isOnSetup;
}]);


app.factory('Case', function() {
   var currentCase = null;
   var callbacks = [];

   return {
      getCurrent: function() {
         return currentCase;
      },
      subscribe: function(callback) {
         callbacks.push(callback);
      },
      setCurrent: function(value) {
         currentCase = value;
         callbacks.forEach(function(callback) {
            callback(currentCase);
         })
      }
   };
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

app.directive('fileReader', function() {
  return {
    scope: true,
    link: function($scope, element) {
      element.on('change', function(changeEvent) {
        var files = changeEvent.target.files;
        if (files.length) {
          var r = new FileReader();
          r.onload = function(e) {
              var contents = e.target.result;
              $scope.$apply(function () {
                  $scope.handleLoad(element, contents);
              });
          };
          r.readAsText(files[0]);
        }
      });
    }
  };
});