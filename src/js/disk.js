app.factory('disk', ['Project', 'arbitratorData', 'questionNormalization',
function(Project, arbitratorData, questionNormalization) {

   var savableServices = {
      arbitrator: arbitratorData,
      projectMeta: Project,
      questionNormalization: questionNormalization
   };

   function getFilename() {
      var name = Project.get().name || 'Arbitration';
      var d = new Date();
      var dateString =  d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " +
         d.getHours() + "_" + d.getMinutes();
      return name + "_" + dateString
   }

   function writeToDisk(stringData, filename) { // aka "Download"
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(new Blob([stringData], {type: 'text'}));
      a.download = filename;

      // Append anchor to body.
      document.body.appendChild(a)
      a.click();

      // Remove anchor from body
      document.body.removeChild(a)
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

   function loadProject(fileContents) {
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

   function exportCsv(onlyExportFullyArbitrated) {
      var exportData = arbitratorData.getExportData(onlyExportFullyArbitrated);
      var stringData = Papa.unparse(exportData, {delimiter: ','})
      var filename = getFilename() + ".csv";
      writeToDisk(stringData, filename);
   }

   return {
      load: loadProject,
      save: save,
      exportCsv: exportCsv,
   }
}]);
