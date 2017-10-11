app.factory('sidebarRefreshService', function() {
   const callbacks = jQuery.Callbacks();
   return {
      subscribeToRefresh: function(callback) {
         callbacks.add(callback);
      },
      triggerRefresh: function(caseId) {
         callbacks.fire(caseId);
      }
   }
});