var Set = function(changeCallback){
    // changeCallback is called whenever a change occurs.  Is passed in "this" set
    // Force to be an object, not a function
    if(typeof this != "object") return new Set(changeCallback);

    changeCallback = changeCallback || function(){};

    var items = {};

    this.addItem = function(item){
        items[item] = true;
        changeCallback(this);
    };

    this.hasItem = function(item){
        return item in items && items[item] === true;
    };

    this.removeItem = function(item){
        items[item] = false;
        changeCallback(this);
    };

    this.getAllItems = function(){
        var ret = [];

        for(var a in items){
            if(items[a] === true){
                ret.push(a);
            }
        }

        return ret;
    };

    this.countItems = function(){
        return this.getAllItems().length;
    };

    this.hasItems = function(){
        return this.countItems() > 0;
    };
};