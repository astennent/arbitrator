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