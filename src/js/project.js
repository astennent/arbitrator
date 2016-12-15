app.factory('Project', function() {

   var project = {
      name: 'Arbitration'
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