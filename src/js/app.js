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

app.factory('coderData', function() {
   var cases = {};
   var displayCases = [];

   function updateDisplayCases() {
      displayCases = Object.keys(cases).map(function(caseId) {
         return {
            id: caseId,
            count: Object.keys(cases[caseId]).length
         }
      });
   }

   return {
      getCases: function () {
         return displayCases;
      },
      getCase: function (caseId) {
         return cases[caseId];
      },
      setCaseData: function(coderId, parsedData) {
         for (var caseId in parsedData) {
            if (!cases[caseId]) {
               cases[caseId] = {};
            } 
            cases[caseId][coderId] = parsedData[caseId];
         }
         updateDisplayCases();
      }
   }
});


app.factory('arbitratorData', ['$q', 'Project', function($q, Project) {
   var cases = {};

   var loadPromise = load();

   function load() {
      return $q.when();
   }

   function save() {

   }

   function emptyCase() {
      return {values: {}, statuses: {}};
   }

   return {
      getCase: function (caseKey) {
         return cases[caseKey] || emptyCase();
      },
      storeArbitration: function(caseKey, questionId, value, status) {
         var currentCase = cases[caseKey] || emptyCase();
         currentCase.values[questionId] = value;
         currentCase.statuses[questionId] = status;
         cases[caseKey] = currentCase;
         Project.markDirty();
      }

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


app.controller('caseController', ['$scope', 'Case', 'coderData', 'arbitratorData', function($scope, Case, coderData, arbitratorData) {

   Case.subscribe(onSetCase);

   var arbitratedSet = {};
   onSetCase(Case.getCurrent());

   function onSetCase(caseId) {
      var caseData = coderData.getCase(caseId);

      $scope.caseId = caseId;
      var coderKeys = Object.keys(caseData);
      $scope.coder1 = caseData[coderKeys[0]];
      $scope.coder2 = coderKeys.length > 1 ? caseData[coderKeys[1]] : {};

      $scope.questionIds = Object.keys($scope.coder1);

      loadArbitratedData(caseId);
      guessArbitratedData();
   }

   function loadArbitratedData(caseId) {
      var storedArbitration = arbitratorData.getCase(caseId);
      $scope.arbitrator = storedArbitration.values;
      arbitratedSet = storedArbitration.statuses;
   }

   function guessArbitratedData() {
      // TODO: Fill in arbitrator.
   }

   function getQuestionsToResolve() {
      return $scope.questionIds.filter(function(questionId) {
         var alreadyArbitrated = (questionId in arbitratedSet);
         return !alreadyArbitrated && $scope.coder1[questionId] === $scope.coder2[questionId];
      })
   }

   $scope.autoResolve = function() {
      var questions = getQuestionsToResolve();
      questions.forEach(function(questionId) {
         $scope.arbitrator[questionId] = $scope.coder1[questionId];
         $scope.enableArbitration(questionId);
      })
   }

   $scope.canAutoResolve = function() {
      return getQuestionsToResolve().length > 0;
   }

   $scope.progress = function() {
      return Math.floor(100 * Object.keys(arbitratedSet).length / $scope.questionIds.length);
   }

   $scope.isEquivalent = function(questionId) {
      var value1 = $scope.coder1[questionId];
      var value2 = $scope.coder2[questionId];
      return value1 === value2;
   }

   $scope.isArbitrated = function(questionId) {
      return arbitratedSet[questionId];
   }

   function storeArbitration(questionId) {
      arbitratorData.storeArbitration($scope.caseId, questionId, $scope.arbitrator[questionId], arbitratedSet[questionId]);
   }

   function setArbitrated(questionId, value) {
      arbitratedSet[questionId] = value;
      storeArbitration(questionId);
   }

   $scope.disableArbitration = function(questionId) {
      setArbitrated(questionId, false)
   }

   $scope.enableArbitration = function(questionId) {
      setArbitrated(questionId, true);
   }

   $scope.onArbitrationChange = function(questionId) {
      $scope.disableArbitration(questionId);
      storeArbitration(questionId);
   }

   $scope.toggleArbitration = function(questionId) {
      if ($scope.isArbitrated(questionId)) {
         $scope.disableArbitration(questionId);
      } else {
         $scope.enableArbitration(questionId);
      }
   }

   $scope.acceptCoder = function(questionId, coder) {
      $scope.arbitrator[questionId] = coder[questionId];
      setArbitrated(questionId, true);
   }
}]);


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