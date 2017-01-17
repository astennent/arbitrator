app.factory('Project', function() {

   var project = {
      name: 'Arbitration',
      caseIdKey: 'Q2 - ID #', // TODO: Don't hard-code these.
      coderIdKey: 'Q101 - Name of Coder - Selected Choice'
   };

   var dirty = false;

   return {
      get: function() {
         return project;
      },
      isDirty: function() {
         return dirty;
      },
      markDirty: function() {
         dirty = true;
      },
      clearDirtyFlag: function() {
         dirty = false;
      },
      getDataForSaving: function() {
         return project;
      },
      setDataFromLoading: function(loadedData) {
         angular.merge(project, loadedData);
      }
   }

});