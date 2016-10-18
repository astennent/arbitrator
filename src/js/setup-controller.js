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