/**
 * Returns a new array containing objects that match the filter
 * @param objects        List of JS objects that should be filtered
 * @param attr           The attribute list of the object to check against
 * @param grouping       As built by the Terminator.
 */
// TODO: Filter needs to handle a grouping
var objectFilter = function(objects, attr, grouping) {
 // console.log("items: " + JSON.stringify(grouping.items));
 // console.log("grouping: " + JSON.stringify(grouping) + " type: " + grouping.type);
 // console.log("number of objects:" + objects.length);
  // If no filters, then return just the object
  var filteredObjects = [];
  // console.log("type is string: " + grouping);
  if (typeof grouping == 'string') {
    return _.filter(objects, function(object) {
      return _.contains(object[attr], grouping);
    });
  } else if (grouping.items.length === 0) {
    // console.log("length of items is zero");
    return objects
  }
  if (grouping.type === "AND") {
    // console.log("type is AND");
    var newObjects = objects.slice(0);
    for (var x = 0; x < grouping.items.length; x++) {
      newObjects = _.intersection(newObjects, objectFilter(objects, attr, grouping.items[x]));
    }
    return newObjects;
  } else if (grouping.type === "OR") {
    // console.log("TYPE IS OR");
    for (var y = 0; y < grouping.items.length; y++) {
      filteredObjects = _.union(filteredObjects, objectFilter(objects, attr, grouping.items[y]));
    }
    return filteredObjects;
  } else {
    console.log("SHOULD NOT GET HERE");
    return objects;
  }
};

/*
NOTES
1) It might be useful to parse booleanQuery by another helper method
2) This might be best solved by recursively diving into booleanQuery
    If that's the case, tell Chris.  He can throw together a Set class
    like what's in Java so that you don't have to worry about uniquely 
    merging two arrays.

*/
