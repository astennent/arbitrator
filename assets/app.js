angular.module('Arbitrator', [])

angular.module('Arbitrator').controller('projectController', ['$scope', 'Project', function($scope, Project) {
   $scope.projectName = Project.name();
   $scope.questions = Project.questions();
}])

angular.module('Arbitrator').factory('Project', function() {

   var project = {
      name: 'Guardian Coding 3.0'
   }

   var questions = {
      1: 'Does the site contain any images or videos?',
      2: 'Does the site include an image or video of victim (person killed by police)...',
      3: 'Site 1 URL of images or videos of victim. Separate urls with commas. If una...',
      4: 'Does the site include an image or video of officer responsible for the deat...',
   };

   return {
      name: function() {
         return project.name;
      },
      questions: function() {
         return questions;
      }
   }

})

angular.module('Arbitrator').controller('sidebarController', ['$q', function($q) {
   console.log($q);
}])

angular.module('Arbitrator').factory('CoderData', function() {

   var responses = {
      1: {
         3: {
            1: 'Yes',
            2: 'No',
            3: 'google.com',
            4: 'No'
         }
      },
      2: {
         3: {
            1: 'Yes',
            2: 'Yes',
            3: 'google.com',
            4: 'No'
         }      
      }
   }

   return {
      getCaseData: function(coder, caseNumber) {
         return responses[coder][caseNumber];
      }
   }

});

angular.module('Arbitrator').factory('Case', function() {

   var currentCase = {
      number: 3,
      description: 'Long Beach police shoot, kill man who was seated at arcade with knife',
   };

   return {
      number: function() {
         return currentCase.number;
      },
      description: function() {
         return currentCase.description;
      },
   };
});


angular.module('Arbitrator').controller('caseController', ['$scope', 'Case', 'CoderData', function($scope, Case, CoderData) {
   $scope.caseNumber = Case.number();
   $scope.description = Case.description();

   $scope.coder1 = CoderData.getCaseData(1, $scope.caseNumber);
   $scope.coder2 = CoderData.getCaseData(2, $scope.caseNumber);

   $scope.arbitrator = {1: 'test'};

   var arbitratedSet = {};

   function getQuestionsToResolve() {
      return Object.keys($scope.coder1).filter(function(key) {
         var alreadyArbitrated = (key in arbitratedSet);
         return !alreadyArbitrated && $scope.coder1[key] === $scope.coder2[key];
      })
   }

   $scope.autoResolve = function() {
      var questions = getQuestionsToResolve();
      questions.forEach(function(num) {
         $scope.enableArbitration(num);
         $scope.arbitrator[num] = $scope.coder1[num];
      })
   }

   $scope.canAutoResolve = function() {
      return getQuestionsToResolve().length > 0;
   }

   $scope.progress = function() {
      return 100 * Object.keys(arbitratedSet).length / Object.keys($scope.coder1).length;
   }

   $scope.isEquivalent = function(num) {
      var value1 = $scope.coder1[num];
      var value2 = $scope.coder2[num];
      return value1 === value2;
   }

   $scope.isArbitrated = function(num) {
      return arbitratedSet[num];
   }

   $scope.disableArbitration = function(num) {
      delete arbitratedSet[num];
   }

   $scope.enableArbitration = function(num) {
      arbitratedSet[num] = true;
   }

   $scope.toggleArbitration = function(num) {
      if ($scope.isArbitrated(num)) {
         $scope.disableArbitration(num);
      } else {
         $scope.enableArbitration(num);
      }
   }

   $scope.acceptCoder = function(num, coder) {
      $scope.arbitrator[num] = coder[num];
   }
}])



angular.module('Arbitrator').directive('ngEnter', function () {
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