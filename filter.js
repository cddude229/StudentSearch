/**
 * Returns a new array containing objects that match the filter
 * @param objects        List of JS objects that should be filtered
 * @param attr           The attribute list of the object to check against
 * @param booleanQuery   The "good format" boolean string to search on. See tests_parser.html for "good format"
 */
var objectFilter = function(objects, attr, booleanQuery){
    objects = objects.slice(0); // CLONE THE ARRAY SO WE DON'T EDIT IT BY REFERENCE

    // TODO: Filtering here

    return objects;
};

/*
NOTES
1) It might be useful to parse booleanQuery by another helper method
2) This might be best solved by recursively diving into booleanQuery
    If that's the case, tell Chris.  He can throw together a Set class
    like what's in Java so that you don't have to worry about uniquely 
    merging two arrays.

*/