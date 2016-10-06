var app = angular.module('Arbitrator', [])

app.controller('projectController', ['$scope', 'Project', function($scope, Project) {
   $scope.projectName = Project.name();
   $scope.questions = Project.questions();
}])

app.controller('topBarController', ['$scope', 'Project', 'currentPage', function($scope, Project, currentPage) {
   $scope.save = Project.save;
   $scope.dirty = Project.isDirty;
   $scope.switchToSetup = currentPage.switchToSetup;
}]);

app.factory('Project', function() {

   var project = {
      name: 'Guardian Coding 3.0'
   }

   var dirty = true;

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
      save: function() {
         //TODO: Save
         dirty = false;
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
   $scope.switchToCase = function(caseKey) {
      currentPage.switchToCase();
      Case.setCurrent(caseKey);
   }
}]);


app.controller('setupController', ['$scope', 'coderData', function($scope, coderData) {

   $scope.caseIdKey = 'Q2 - ID #'; // TODO: Don't hardcode this.

   $scope.handleLoad = function(element, rawContents) {
      var coderNum = element[0].id === 'coder1Source' ? 1 : 2;
      var parsedContents = Papa.parse(rawContents, {header: true});
      var data = {};
      parsedContents.data.forEach(function (caseObject) {
         var caseId = caseObject[$scope.caseIdKey];
         data[caseId] = caseObject;
      });
      coderData.setCaseData(coderNum, data);
   }
}]);

app.factory('coderData', function() {
   var cases = {}

   return {
      getCases: function () {
         return Object.keys(cases);
      },
      getCase: function (caseKey) {
         return cases[caseKey];
      },
      setCaseData: function(coder, parsedData) {
         for (var caseKey in parsedData) {
            if (!cases[caseKey]) {
               cases[caseKey] = {};
            } 
            cases[caseKey][coder] = parsedData[caseKey];
         }
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
         console.log(cases);
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

   var dominantCoder;
   var arbitratedSet = {};
   onSetCase(Case.getCurrent());

   function onSetCase(caseId) {
      var caseData = coderData.getCase(caseId);

      $scope.caseId = caseId;
      $scope.coder1 = caseData[1] || {};
      $scope.coder2 = caseData[2] || {};

      var coder1Questions = Object.keys($scope.coder1);
      var coder2Questions = Object.keys($scope.coder2);

      // TODO: Merge, not choose.
      var isCoder1Dominant = (coder1Questions.length > coder2Questions.length);
      dominantCoder = isCoder1Dominant ? $scope.coder1 : $scope.coder2;
      $scope.questionIds = isCoder1Dominant ? coder1Questions : coder2Questions;

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
         $scope.arbitrator[questionId] = dominantCoder[questionId];
         $scope.enableArbitration(questionId);
      })
   }

   $scope.canAutoResolve = function() {
      return getQuestionsToResolve().length > 0;
   }

   $scope.progress = function() {
      return Math.floor(100 * Object.keys(arbitratedSet).length / Object.keys(dominantCoder).length);
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

   $scope.questions = dominantCoder
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