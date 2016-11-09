app.factory('disk', ['Project', 'arbitratorData', 'sidebarDisplayCases', function(Project, arbitratorData, sidebarDisplayCases) {

   var savableServices = {
      arbitrator: arbitratorData,
      projectMeta: Project
   };

   function getFilename() {
      return Project.get().name || 'Unnamed Project';
   }

   function writeToDisk(stringData, filename) { // aka "Download"
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringData));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

   }

   function save() {
      Project.clearDirtyFlag();

      var projectData = _.reduce(savableServices, function(result, service, serviceKey) {
         result[serviceKey] = service.getDataForSaving();
         return result;
      }, {});

      var filename = getFilename() + ".arb";

      var pretty = false;
      var stringData = pretty ?
         JSON.stringify(projectData, null, 3) :
         JSON.stringify(projectData);

      writeToDisk(stringData, filename);
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
      sidebarDisplayCases.refresh();
   }

   function exportCsv() {
      var exportData = arbitratorData.getExportData();
      var stringData = Papa.unparse(exportData, {delimiter: ','})
      var filename = getFilename() + ".csv";
      writeToDisk(stringData, filename);
   }

   return {
      load: load,
      save: save,
      exportCsv: exportCsv
   }
}]);
