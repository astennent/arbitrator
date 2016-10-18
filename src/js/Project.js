
app.factory('Project', function() {

   var project = {
      name: 'Guardian Coding 3.0'
   };

   var dirty = false;

   return {
      name: function() {
         return project.name;
      },
      questions: function() {
         return []; // TODO: For coding
      },
      isDirty: function() {
         return dirty;
      },
      markDirty: function() {
         dirty = true;
      },
      open: function() {
         //
         chrome.fileSystem.chooseEntry({type: 'openFile', accepts:[ {extensions: ['html']}] }, function(fileEntry) {
            if (!fileEntry) {
               alert("Did not choose file");
               return;
            }
            fileEntry.file(function(file) {
               var reader = new FileReader();
               reader.onload = function(e) {
                  alert(e.target.result);
               };
               reader.readAsText(file);
            });
         });
      },
      save: function() {
         //TODO: Save
         dirty = false;
         chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: 'myfile.html'}, function(writableFileEntry) {
            writableFileEntry.createWriter(function(writer) {
               writer.onwriteend = function(e) {
                  alert("Write complete!")
               };
               writer.write(new Blob(["TESTTT"], {type: 'text/plain'}));
            }, null);
         });
      }
   }

});