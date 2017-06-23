app.factory('questionSorter', function() {

   function qualtricsSort(a, b) {
      function qualtricsNum(questionId) {  // Not proud of this function
         try {
            questionId = questionId.split(" ")[0];
            var undIndex = questionId.indexOf("_");
            if (undIndex == -1) {
               undIndex = questionId.length;
            }
            var questionNum = parseInt(questionId.substring(1, undIndex+1));
            questionId = questionId.substring(undIndex+1);
            var nextUndIndex = questionId.indexOf("_");
            if (nextUndIndex == -1) {
               return questionNum;
            }
            var subNum = parseInt(questionId.substring(0, undIndex+1));
            return questionNum + subNum/100;
         } catch (e) {
            return -1;
         }
      }
      return qualtricsNum(a) - qualtricsNum(b);
   }

   function getSortedKeys(objectWithKeys, depth) {
      var uniqueKeys = {};
      for (var baseKey in objectWithKeys) {
         if (depth > 0) {
            var nestedObject = objectWithKeys[baseKey];
            for (var nestedKey in nestedObject) {
               if (depth > 1) {
                  var nestedNestedObject = nestedObject[nestedKey];
                  for (var doubleNestedKey in nestedNestedObject) {
                     uniqueKeys[doubleNestedKey] = undefined;
                  }
               } else {
                  uniqueKeys[nestedKey] = undefined;
               }
            }
         } else {
            uniqueKeys[baseKey] = undefined;
         }
      }
      return Object.keys(uniqueKeys).sort(qualtricsSort)
   }

   return {
      getSortedKeys: getSortedKeys,
   }
})