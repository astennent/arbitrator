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
      $scope.expandedRows = {};

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
   };

   $scope.isArbitrated = function(questionId) {
      return arbitratedSet[questionId];
   };

   function storeArbitration(questionId) {
      arbitratorData.storeArbitration($scope.caseId, questionId, $scope.arbitrator[questionId], arbitratedSet[questionId]);
   }

   function setArbitrated(questionId, value) {
      arbitratedSet[questionId] = value;
      storeArbitration(questionId);
   }

   $scope.disableArbitration = function(questionId) {
      setArbitrated(questionId, false)
   };

   $scope.enableArbitration = function(questionId) {
      setArbitrated(questionId, true);
   };

   $scope.onArbitrationChange = function(questionId) {
      $scope.disableArbitration(questionId);
      storeArbitration(questionId);
   };

   $scope.toggleArbitration = function(questionId) {
      if ($scope.isArbitrated(questionId)) {
         $scope.disableArbitration(questionId);
      } else {
         $scope.enableArbitration(questionId);
      }
   };

   $scope.acceptCoder = function(questionId, coder) {
      $scope.arbitrator[questionId] = coder[questionId];
      setArbitrated(questionId, true);
   }
}]);

