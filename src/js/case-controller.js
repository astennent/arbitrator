app.controller('caseController', ['$scope', 'Case', 'coderData', 'arbitratorData', 'Project', 'caseInfoService', 'sidebarRefreshService',
   function($scope, Case, coderData, arbitratorData, Project, caseInfoService, sidebarRefreshService) {

   Case.subscribe(onSetCase);

   let Status = {
      NotArbitrated: 0,
      Arbitrated: 1
   };

   $scope.hideArbitrated = {
      value: false
   };

   $scope.hideBlanks = {
      value: false
   };

   onSetCase(Case.getCurrent());

   function onSetCase(caseId) {
      let caseData = coderData.getCase(caseId);

      const project = Project.get();

      const allCaseInfos = project.caseInfo;
      $scope.caseInfo = allCaseInfos[caseId] || {
         notes: "",
         flag: 0,
      };
      allCaseInfos[caseId] = $scope.caseInfo;

      $scope.caseId = caseId;
      const coderKeys = Object.keys(caseData);

      $scope.coder1Name = coderKeys[0];
      $scope.coder1 = caseData[$scope.coder1Name];

      if (coderKeys.length > 1) {
         $scope.coder2Name = coderKeys[1];
         $scope.coder2 = caseData[$scope.coder2Name];
      } else {
         $scope.coder2Name = "None";
         $scope.coder2 = {};
      }

      $scope.expandedRows = {};
      $scope.questionIds = Object.keys($scope.coder1);

      $scope.caseTitle = caseInfoService.getFullTitle(caseId);


      loadArbitratedData(caseId);
      guessArbitratedData();
   }

   function loadArbitratedData(caseId) {
      let storedArbitration  = arbitratorData.getCase(caseId);
      angular.forEach($scope.questionIds, function(questionId) {
         if (angular.isUndefined(storedArbitration[questionId])) {
            storedArbitration[questionId] =  {value: "", status:Status.NotArbitrated};
         }
      });
      $scope.arbitrator = storedArbitration;
   }

   function guessArbitratedData() {
      // TODO: Fill in arbitrator.
   }

   function getQuestionsToResolve() {
      return $scope.questionIds.filter(function(questionId) {
         let alreadyArbitrated = $scope.arbitrator[questionId] && $scope.arbitrator[questionId].status;
         return !alreadyArbitrated && $scope.coder1[questionId] === $scope.coder2[questionId];
      })
   }

   $scope.autoResolve = function() {
      let questions = getQuestionsToResolve();
      questions.forEach(function(questionId) {
         $scope.arbitrator[questionId].value = $scope.coder1[questionId];
         $scope.arbitrator[questionId].status = Status.Arbitrated;
      });
      Project.markDirty();
      sidebarRefreshService.triggerRefresh($scope.caseId);
   };

   $scope.canAutoResolve = function() {
      return getQuestionsToResolve().length > 0;
   };

   $scope.progress = function() {
      let arbitratedCount = 0;
      angular.forEach($scope.questionIds, function(questionId) {
         if ($scope.isArbitrated(questionId)) {
            arbitratedCount++;
         }
      });
      return Math.floor(100 * arbitratedCount / $scope.questionIds.length);
   };

   $scope.isEquivalent = function(questionId) {
      let value1 = $scope.coder1[questionId];
      let value2 = $scope.coder2[questionId];
      return value1 === value2;
   };

   $scope.isArbitrated = function(questionId) {
      return $scope.arbitrator[questionId].status === Status.Arbitrated;
   };

   $scope.isBlank = function(questionId) {
      return $scope.coder1[questionId] === "" && $scope.coder2[questionId] === "";
   }

   function setArbitrated(questionId, value) {
      $scope.arbitrator[questionId].status = value;
      Project.markDirty();
      sidebarRefreshService.triggerRefresh($scope.caseId);
   }

   $scope.disableArbitration = function(questionId) {
      setArbitrated(questionId, Status.NotArbitrated)
   };

   $scope.enableArbitration = function(questionId) {
      setArbitrated(questionId, Status.Arbitrated);
   };

   $scope.onArbitrationChange = function(questionId) {
      $scope.disableArbitration(questionId);
      Project.markDirty();
      sidebarRefreshService.triggerRefresh($scope.caseId);
   };

   $scope.toggleArbitration = function(questionId) {
      if ($scope.isArbitrated(questionId)) {
         $scope.disableArbitration(questionId);
      } else {
         $scope.enableArbitration(questionId);
      }
   };

   $scope.acceptCoder = function(questionId, coder) {
      $scope.arbitrator[questionId].value = coder[questionId];
      setArbitrated(questionId, Status.Arbitrated);
   }

   $scope.cycleFlag = function() {
      const numFlags = 4;
      $scope.caseInfo.flag = ($scope.caseInfo.flag + 1) % numFlags;
      Project.markDirty();
      sidebarRefreshService.triggerRefresh($scope.caseId);
   }
}]);

