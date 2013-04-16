var Set = function(changeCallback){
    // changeCallback is called whenever a change occurs.  Is passed in "this" set
    // Force to be an object, not a function
    if(typeof this != "object") return new Set(changeCallback);

    changeCallback = changeCallback || function(){};

    var items = {};
    var itemsList = [];
    var count = 0;

    this.addItem = function(item){
        items[item] = true;
        itemsList.push(item);
        count++;
        changeCallback(this);
    };

    this.hasItem = function(item){
        return item in items && items[item] === true;
    };

    this.removeItem = function(item){
        items[item] = false;
        count--;
        changeCallback(this);
    };

    this.removeLast = function(){
        var item = itemsList.pop();
        if(item){ // undefined if no items in set
            if(items[item] === false){
                this.removeLast(); // Remove another
            } else {
                this.removeItem(item);
            }
        }
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
        return count;
    };

    this.hasItems = function(){
        return this.countItems() > 0;
    };

    this.clear = function(){
        items = {};
        itemsList = [];
        changeCallback(this);
    }
};