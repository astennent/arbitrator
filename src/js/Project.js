
app.factory('Project', function() {

   var project = {
      name: 'Guardian Coding 3.0'
   };

   var dirty = false;

   return {
      name: function() {
         return project.name;
      },
      isDirty: function() {
         return dirty;
      },
      markDirty: function() {
         dirty = true;
      },
      clearDirtyFlag: function() {
         dirty = false;
      }
   }

});