app.factory('caseInfoService', ['Project', 'coderData', function(Project, coderData) {

   function getFullTitle(caseId) {
      const caseData = coderData.getCase(caseId);
      const coderKeys = Object.keys(caseData);
      const firstCoderData = caseData[coderKeys[0]]
      const titleFromHeaders = Project.get().invariateHeaders.map((questionId) => {
         return firstCoderData[questionId]
      }).join(' ');
      return `Case ${caseId} | ${titleFromHeaders}`
   }

   return {
      getFullTitle: getFullTitle
   }
}]);