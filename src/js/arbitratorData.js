app.factory('arbitratorData', ['$q', 'Project', function($q, Project) {
   var cases = {};

   function emptyCase() {
      return {values: {}, statuses: {}};
   }

   return {
      getCase: function (caseKey) {
         return cases[caseKey] || emptyCase();
      },
      getDataForSaving: function() {
         return cases;
      },
      setDataFromLoading: function(loadedCases) {
         cases = loadedCases;
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