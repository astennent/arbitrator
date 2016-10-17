var app = angular.module('Arbitrator', [])

app.controller('projectController', ['$scope', 'Project', function($scope, Project) {
   $scope.projectName = Project.name();
   $scope.questions = Project.questions();
}])

app.controller('topBarController', ['$scope', 'Project', 'currentPage', function($scope, Project, currentPage) {
   $scope.save = Project.save;
   $scope.open = Project.open;
   $scope.dirty = Project.isDirty;
   $scope.switchToSetup = currentPage.switchToSetup;
}]);

app.factory('Project', function() {

   var project = {
      name: 'Guardian Coding 3.0'
   }

   var dirty = false;

   return {
      name: function() {
         return project.name;
      },
      questions: function() {
         return []; // TODO: For coding
      },
      isDirty: function() {
         return dirty;
      },
      markDirty: function() {
         dirty = true;
      },
      open: function() {
         //
         chrome.fileSystem.chooseEntry({type: 'openFile', accepts:[ {extensions: ['html']}] }, function(fileEntry) {
            if (!fileEntry) {
               alert("Did not choose file");
               return;
            }
            fileEntry.file(function(file) {
               var reader = new FileReader();
               reader.onload = function(e) {
                  alert(e.target.result);
               };
               reader.readAsText(file);
            });
         });
      },
      save: function() {
         //TODO: Save
         dirty = false;
         chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: 'myfile.html'}, function(writableFileEntry) {
            writableFileEntry.createWriter(function(writer) {
               writer.onwriteend = function(e) {
                  alert("Write complete!")
               };
               writer.write(new Blob(["TESTTT"], {type: 'text/plain'}));
            }, null);
         });
      }
   }

});

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


app.controller('sidebarController', ['$scope', 'coderData', 'currentPage', 'Case', function($scope, coderData, currentPage, Case) {
   $scope.getCases = coderData.getCases;
   $scope.includeFullyArbitrated = true; // TODO: Load
   $scope.includeSingleCoded = true;

   $scope.shouldDisplay = function(caseObject) {
      return (caseObject.count > 1 || $scope.includeSingleCoded) &&
             (!caseObject.isFullyArbitrated || $scope.includeFullyArbitrated);
   }

   $scope.switchToCase = function(caseKey) {
      currentPage.switchToCase();
      Case.setCurrent(caseKey);
   }
}]);


app.controller('setupController', ['$scope', 'coderData', function($scope, coderData) {

   $scope.caseIdKey = 'Q2 - ID #'; // TODO: Don't hardcode this.

   $scope.handleLoad = function(element, rawContents) {
      var coderId = element[0].id;
      var parsedContents = Papa.parse(rawContents, {header: true});
      var data = {};
      parsedContents.data.forEach(function (caseObject) {
         var caseId = caseObject[$scope.caseIdKey];
         data[caseId] = caseObject;
      });
      coderData.setCaseData(coderId, data);
   }
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