app.factory('disk', ['Project', 'arbitratorData', function(Project, arbitratorData) {

   var savableServices = {
      arbitrator: arbitratorData,
      projectMeta: Project
   };

   function writeToDisk(saveData) { // aka "Download"
      var pretty = true;
      var stringData = pretty ?
         JSON.stringify(saveData, null, 3) :
         JSON.stringify(saveData);

      var element = document.createElement('a');
      var projectName = Project.get().name || 'Unnamed Project';
      var filename = projectName + ".arb";

      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringData));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

   }

   function save() {
      Project.clearDirtyFlag();

      var saveData = _.reduce(savableServices, function(result, service, serviceKey) {
         result[serviceKey] = service.getDataForSaving();
         return result;
      }, {});

      writeToDisk(saveData);
   }

   function load(fileContents) {
      Project.clearDirtyFlag();
      var saveData = JSON.parse(fileContents);
      _.each(saveData, function(storedValue, serviceKey) {
         var service = savableServices[serviceKey];
         if (service) {
            service.setDataFromLoading(storedValue);
         } else {
            console.warn("Skipped value for " + serviceKey);
         }
      });
   }

   return {
      load: load,
      save: save
   }
}]);
