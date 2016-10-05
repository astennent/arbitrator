var app = angular.module('Arbitrator', [])

app.controller('projectController', ['$scope', 'Project', function($scope, Project) {
   $scope.projectName = Project.name();
   $scope.questions = Project.questions();
}])

app.factory('Project', function() {

   var project = {
      name: 'Guardian Coding 3.0'
   }

   return {
      name: function() {
         return project.name;
      },
      questions: function() {
         return []; // TODO: For coding
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
         currentPage = 'Setup;'
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
      Case.setKey(caseKey);
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

   var responses = {
      1: {},
      2: {}
   }

   var cases = [];

   return {
      getCases: function() {
         return cases;
      },
      getCaseData: function(coder, caseId) {
         return responses[coder][caseId] || [];
      },
      setCaseData: function(coder, parsedData) {
         responses[coder] = parsedData;
         cases = Object.keys(parsedData);
      }
   }

});

app.factory('Case', function() {
   var currentCase = null;
   return {
      getKey: function() {
         return currentCase;
      },
      setKey: function(value) {
         currentCase = value;
      }
   };
});


app.controller('caseController', ['$scope', 'Case', 'coderData', function($scope, Case, coderData) {
   $scope.caseId = Case.getKey();

   $scope.coder1 = coderData.getCaseData(1, $scope.caseId);
   $scope.coder2 = coderData.getCaseData(2, $scope.caseId);

   var coder1Questions = Object.keys($scope.coder1);
   var coder2Questions = Object.keys($scope.coder2);


   var isCoder1Dominant = (coder1Questions.length > coder2Questions.length);
   var dominantCoder = isCoder1Dominant ? $scope.coder1 : $scope.coder2;
   $scope.questionIds = isCoder1Dominant ? coder1Questions : coder2Questions;

   $scope.arbitrator = {}; // TODO: Load
   var arbitratedSet = {};

   function getQuestionsToResolve() {
      return $scope.questionIds.filter(function(questionId) {
         var alreadyArbitrated = (questionId in arbitratedSet);
         return !alreadyArbitrated && $scope.coder1[questionId] === $scope.coder2[questionId];
      })
   }

   $scope.autoResolve = function() {
      var questions = getQuestionsToResolve();
      questions.forEach(function(questionId) {
         $scope.enableArbitration(questionId);
         $scope.arbitrator[questionId] = dominantCoder[questionId];
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

   $scope.disableArbitration = function(questionId) {
      delete arbitratedSet[questionId];
   }

   $scope.enableArbitration = function(questionId) {
      arbitratedSet[questionId] = true;
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