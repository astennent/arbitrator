app.factory('disk', ['Project', 'arbitratorData', '$q', function(Project, arbitratorData, $q) {

   function writeToDisk(saveData) {
      chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: 'suggestedName.arb'}, function(writableFileEntry) {
         writableFileEntry.createWriter(function(writer) {
            writer.onwriteend = function(e) {
               console.log("File saved complete!")
            };

            var pretty = true;
            var stringData = pretty ?
               JSON.stringify(saveData, null, 3) :
               JSON.stringify(saveData);

            writer.write(new Blob([stringData]), {type: 'text/json'});
         }, null);
      });
   }

   function readFromDisk() {
      var deferred = $q.defer();
      chrome.fileSystem.chooseEntry({type: 'openFile', accepts:[ {extensions: ['arb']}] }, function(fileEntry) {
         if (!fileEntry) {
            console.log("Did not choose file");
            return;
         }
         fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onload = function(event) {
               var loadedData = JSON.parse(event.target.result);
               deferred.resolve(loadedData);
            };
            reader.readAsText(file);
         });
      });
      return deferred.promise;
   }

   function save() {
      Project.clearDirtyFlag();
      writeToDisk({
         arbitrator: arbitratorData.getDataForSaving()
      });
   }

   function load() {
      Project.clearDirtyFlag();
      readFromDisk().then(function(saveData) {
         arbitratorData.setDataFromLoading(saveData.arbitrator);
      });
   }

   return {
      load: load,
      save: save
   }
}]);
