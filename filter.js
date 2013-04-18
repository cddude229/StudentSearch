/**
 * Returns a new array containing objects that match the filter
 * @param objects        List of JS objects that should be filtered
 * @param attr           The attribute list of the object to check against
 * @param grouping       As built by the Terminator.
 */
var objectFilter = function(objects, attr, grouping) {
 // console.log("items: " + JSON.stringify(grouping.items));
 // console.log("grouping: " + JSON.stringify(grouping) + " type: " + grouping.type);
 // console.log("number of objects:" + objects.length);
  // If no filters, then return just the object
  var filteredObjects = [];
  // console.log("type is string: " + grouping);
  if (typeof grouping == 'string') {
    return _.filter(objects, function(object) {
      var attrSet = _.map(object[attr], function(s){
        return s.toLowerCase();
      });
      return _.contains(attrSet, grouping.toLowerCase());
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