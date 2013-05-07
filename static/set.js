var Set = function(changeCallback){
    // changeCallback is called whenever a change occurs.  Is passed in "this" set
    // Force to be an object, not a function
    if(typeof this != "object") return new Set(changeCallback);

    changeCallback = changeCallback || function(){};

    var items = {};
    var itemsList = [];
    var count = 0;

    this.addItem = function(item){
        if(!(item in items) || items[item] === false){
            count++;
        }
        items[item] = true;
        itemsList.push(item);
        changeCallback(this);
    };

    this.hasItem = function(item){
        return item in items && items[item] === true;
    };

    this.removeItem = function(item){
        if(item in items && items[item] === true){
            count--;
        }
        items[item] = false;
        changeCallback(this);
    };

    this.removeLast = function(){
        var item = itemsList.pop();
        if(item != "undefined"){ // undefined if no items in set
            if(items[item] === false){
                this.removeLast(); // Remove another
            } else {
                this.removeItem(item);
            }
            changeCallback(this);
            return;
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
        count = 0;
        changeCallback(this);
    }
};