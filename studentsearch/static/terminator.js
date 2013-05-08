var grouping = function(type, values){
    var items = [];

    outer:
    for(var a=0;a<values.length;a++){
        var val = values[a];

        // Make values unique
        for(var b=0;b<items.length;b++){
            if(val === items[b]){
                continue outer;
            } else if(typeof val == "string" && typeof items[b] == "string" && val.toLowerCase() == items[b].toLowerCase()){
                continue outer;
            }
        }

        // Strip empty items too
        if(typeof val == "object"){
            // Skip empty items
            if(val.items.length == 0){
                continue;
            }

            // If we have only one item, pull it up
            if(val.items.length == 1){
                values.splice(a+1, 0, val.items[0]);
                continue;
            }

            // If they're the same type, merge up
            if(val.type == type){
                for(var b=0;b<val.items.length;b++){
                    values.splice(a+b+1, 0, val.items[b]);
                }
                continue;
            }
        }

        items.push(val);
    }

    var addItem = function(item){
        this.items.push(item);
        this.clean();
    };

    var removeItem = function(item){
        var ret = [];

        for(var a=0;a<this.items.length;a++){
            if(this.items[a] === item) continue;
            ret.push(this.items[a]);
        }

        this.items = ret;
    };

    var replaceItem = function(oldItem, newItem){
        for(var a=0;a<this.items.length;a++){
            if(this.items[a] === oldItem){
                this.items[a] = newItem;
                break;
            }
        }
    };

    var clean = function(){
        for(var a=0;a<this.items.length;a++){
            if(typeof this.items[a] == "object"){
                this.items[a].clean();
            }
        }

        this.items = grouping(this.type, this.items).items;
    };

    var toString = function(){
        this.clean(); // Clean first

        var ret = [];
        for(var a=0;a<this.items.length;a++){
            if(typeof this.items[a] == "object"){
                ret.push("(" + this.items[a].toString() + ")");
            } else {
                ret.push(this.items[a]);
            }
        }

        return ret.join(" " + this.type + " ");
    };

    return {
        type: type,
        items: items,
        addItem: addItem,
        removeItem: removeItem,
        replaceItem: replaceItem,
        clean: clean,
        toString: toString
    };
};

/**
 * When given a good search string, this will return a list of groupings to use.
 */
var terminator = function(str){
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
                combined = combined.replace(/^\(/, "").replace(/\)$/, "");
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