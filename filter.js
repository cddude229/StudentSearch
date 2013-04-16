/**
 * Returns a new array containing objects that match the filter
 * @param objects        List of JS objects that should be filtered
 * @param attr           The attribute list of the object to check against
 * @param listOfTags     List of tags to filter on.  Need to compile your own boolean query
 */
var objectFilter = function(objects, attr, listOfTags){
    // If no filters, then return just the object
    if(listOfTags.length == 0){
        return objects.slice(0); // return clone
    }

    // TODO: Filtering here
    // Only consider the first tag for now. :)
    var theTag = listOfTags[0].toLowerCase();
    var ret = [];
    for(var a=0;a<objects.length;a++){
        var object = objects[a];
        var attrList = object[attr];
        for(var b=0;b<attrList.length;b++){
            if(attrList[b].toLowerCase() == theTag){
                ret.push(object);
                break;
            }
        }
    }

    return ret;
};

/*
NOTES
1) It might be useful to parse booleanQuery by another helper method
2) This might be best solved by recursively diving into booleanQuery
    If that's the case, tell Chris.  He can throw together a Set class
    like what's in Java so that you don't have to worry about uniquely 
    merging two arrays.

*/