var grouping = function(type, values){
    return {
        type: type,
        items: values
    };
};

/**
 * When given a good search string, this will return a list of groupings to use.
 */
var terminator = function(str){
    // strip parenthesis
    if(str[0] == "(" && str[str.length-1] == ")"){
        str = str.replace(/^\(/, "").replace(/\)$/, "");
    }

    // State
    var currentItems = [];
    var unparsedTerms = []; // Used for groupings only
    var groupDepth = 0;
    var currentTerm = "";
    var lastType = "AND"; // Default to AND.  Only case where this is used if it's only one item

    for(var a=0;a<str.length;a++){
        var ch = str[a];
        if(ch == "("){
            groupDepth++;
            currentTerm += ch;
        } else if(ch == ")"){
            groupDepth--;
            currentTerm += ch;

            // Ok, recursively pass down
            if(groupDepth == 0){
                unparsedTerms.push(currentTerm);
                var combined = unparsedTerms.join(" ");
                currentItems.push(terminator(combined));
                unparsedTerms = []; // Reset unparsed terms
                currentTerm = ""; // Clear term
                a++; // Skip the next space
            }
        } else if(ch == " "){
            if(groupDepth == 0){
                // Ok, not in parenthesis and hit a gap.
                // See if it was an AND or OR, and record it
                if(currentTerm == "AND" || currentTerm == "OR"){
                    lastType = currentTerm;
                } else {
                    currentItems.push(currentTerm);
                }
            } else {
                unparsedTerms.push(currentTerm);
            }

            // ok, finally add last term
            currentTerm = "";
        } else {
            currentTerm += ch;
        }
    }

    // Add last item, if there
    if(currentTerm.length > 0){
        currentItems.push(currentTerm);
    }

    // return our result
    return grouping(lastType, currentItems);
};