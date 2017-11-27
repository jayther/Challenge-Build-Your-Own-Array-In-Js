function MyArray(initialCapacity) {
    if (initialCapacity === undefined) {
        initialCapacity = 3;
    }

    this.elements = new PlainArray(initialCapacity);
    this.size = 0;
    this._growthFactor = 3;
}

MyArray.prototype._growElementsTo = function (size) {
    // only grow if requested size is bigger than the capacity
    if (size <= this.elements.length) { return; }

    var i, oldElements = this.elements;
    // grow by growth factor so it doesn't instantiating new arrays for every
    // single push
    var capacity = (Math.floor(size / this._growthFactor) + 1) * this._growthFactor;

    this.elements = new PlainArray(capacity);
    // copy elements from old to new array
    for (i = 0; i < oldElements.length; i += 1) {
        this.elements.set(i, oldElements.get(i));
    }
};

MyArray.prototype.length = function () {
    return this.size;
};

MyArray.prototype.push = function (value) {
    this.set(this.size, value);
};

MyArray.prototype.get = function (index) {
    if (index < 0 || index >= this.size) {
        return undefined;
    }
    return this.elements.get(index);
};

MyArray.prototype.set = function (index, value) {
    this._growElementsTo(index + 1);
    this.elements.set(index, value);
    if (index >= this.size) {
        this.size = index + 1;
    }
};

MyArray.of = function () {
    var i, arr = new MyArray(arguments.length);
    for (i = 0; i < arguments.length; i += 1) {
        arr.push(arguments[i]);
    }
    return arr;
};

MyArray.prototype.pop = function () {
    if (this.size === 0) {
        return undefined;
    }
    var element = this.get(this.size - 1);
    this.size -= 1;
    // clear last item's old position
    this.elements.set(this.size, undefined);
    return element;
};

MyArray.prototype.concat = function (other) {
    var arr = new MyArray(this.size + other.size);
    var i;
    for (i = 0; i < this.size; i += 1) {
        arr.push(this.get(i));
    }
    for (i = 0; i < other.length(); i += 1) {
        arr.push(other.get(i));
    }
    return arr;
};

MyArray.prototype.indexOf = function (element) {
    var i;
    for (i = 0; i < this.size; i += 1) {
        if (this.get(i) === element) {
            return i;
        }
    }
    return -1;
};

MyArray.prototype.lastIndexOf = function (element) {
    var i;
    for (i = this.size - 1; i >= 0; i -= 1) {
        if (this.get(i) === element) {
            return i;
        }
    }
    return -1;
};

MyArray.prototype.includes = function (element) {
    return this.indexOf(element) > -1;
};

MyArray.prototype.find = function (fn) {
    var i, element;
    for (i = 0; i < this.size; i += 1) {
        element = this.get(i);
        if (fn(element)) {
            return element;
        }
    }
    return undefined;
};

MyArray.prototype.findIndex = function (fn) {
    var i;
    for (i = 0; i < this.size; i += 1) {
        if (fn(this.get(i))) {
            return i;
        }
    }
    return -1;
};

MyArray.prototype.equals = function (other) {
    if (this.size !== other.length()) { return false; }

    var i;
    for (i = 0; i < this.size; i += 1) {
        if (this.get(i) !== other.get(i)) {
            return false;
        }
    }

    return true;
};

MyArray.prototype.forEach = function (fn) {
    var i;
    for (i = 0; i < this.size; i += 1) {
        fn(this.get(i), i, this);
    }
};

MyArray.prototype.join = function (separator) {
    if (typeof separator === 'undefined') {
        separator = ',';
    }
    var s = '', i;
    for (i = 0; i < this.size; i += 1) {
        var element = this.get(i);
        if (i < this.size - 1) {
            s += element + separator;
        } else {
            s += element;
        }
    }
    return s;
};

MyArray.prototype.toString = function () {
    return this.join(',');
};

MyArray.prototype.map = function (fn) {
    var i, arr = new MyArray(this.size);
    for (i = 0; i < this.size; i += 1) {
        arr.push(
            fn(this.get(i), i, this)
        );
    }
    return arr;
};

MyArray.prototype.filter = function (fn) {
    var i, arr = new MyArray(), element;
    for (i = 0; i < this.size; i += 1) {
        element = this.get(i);
        if (fn(element, i, this)) {
            arr.push(element);
        }
    }
    return arr;
};

MyArray.prototype.some = function (fn) {
    var i;
    for (i = 0; i < this.size; i += 1) {
        if (fn(this.get(i), i, this)) {
            return true;
        }
    }
    return false;
};

MyArray.prototype.every = function (fn) {
    var i;
    for (i = 0; i < this.size; i += 1) {
        if (!fn(this.get(i), i, this)) {
            return false;
        }
    }
    return true;
};

MyArray.prototype.fill = function (value, start, end) {
    if (typeof start === 'undefined') {
        start = 0;
    }
    if (typeof end === 'undefined') {
        end = this.size;
    }
    var i;
    for (i = start; i < end; i += 1) {
        this.set(i, value);
    }
};

MyArray.prototype.reverse = function () {
    // only need to iterate through half the array since it's swapping the
    // two elements the same distance from both sides of the pivot
    var i, pivot = Math.ceil(this.size / 2), temp;
    for (i = 0; i < pivot; i += 1) {
        // swap 
        temp = this.get(i);
        this.set(
            i,
            this.get(this.size - 1 - i)
        );
        this.set(
            this.size - 1 - i,
            temp
        );
    }
    return this;
};

MyArray.prototype.shift = function () {
    if (this.size === 0) { return undefined; }

    var element = this.get(0), i;

    // shift items to the left
    for (i = 1; i < this.size; i += 1) {
        this.set(
            i - 1,
            this.get(i)
        );
    }

    // clear last item from old index
    this.elements.set(this.size - 1, undefined);

    this.size -= 1;

    return element;
};

MyArray.prototype.unshift = function (element) {
    var i;
    
    // shift items to the right
    for (i = this.size - 1; i >= 0; i -= 1) {
        this.set(
            i + 1,
            this.get(i)
        );
    }

    // set element to first
    this.set(0, element);

    return this.size;
};

MyArray.prototype.slice = function (start, end) {
    // default values
    if (typeof start === 'undefined') {
        start = 0;
    }
    if (typeof end === 'undefined') {
        end = this.size;
    }

    var i, arr = new MyArray(end - start);
    for (i = start; i < end; i += 1) {
        arr.push(this.get(i));
    }

    return arr;
};

MyArray.prototype.splice = function (start, deleteCount) {
    // default value and
    // make sure start + deleteCount doesn't go over the size
    if (typeof deleteCount === 'undefined' || start + deleteCount > this.size) {
        deleteCount = this.size - start;
    }

    var i,
        removedItems = new MyArray(deleteCount),
        sizeOfAddingItems = 0;
    
    // store removed items to return
    for (i = start; i < start + deleteCount; i += 1) {
        removedItems.push(this.get(i));
    }

    // are there items to add?
    if (arguments.length > 2) {
        sizeOfAddingItems = arguments.length - 2;
    }

    var deltaSize = sizeOfAddingItems - deleteCount;

    if (deltaSize < 0) {
        // items to add is smaller than delete count (and thus smaller array)
        // shift tail elements left
        var oldSize = this.size;
        for (i = start + deleteCount; i < oldSize; i += 1) {
            this.set(
                i + deltaSize,
                this.get(i)
            );
        }
        // clear uncopied remaining tail elements
        for (i = oldSize + deltaSize; i < oldSize; i += 1) {
            this.elements.set(i, undefined);
        }

        // need to update size since it's smaller
        this.size += deltaSize;
    } else if (deltaSize > 0) {
        // items to add is bigger than delete count (and thus bigger array)
        // shift tail elements right to make room
        for (i = this.size - 1; i >= start + deleteCount; i -= 1) {
            this.set(
                i + deltaSize,
                this.get(i)
            );
        }
    }

    // put items to add from arguments
    if (sizeOfAddingItems > 0) {
        for (i = 0; i < sizeOfAddingItems; i += 1) {
            this.set(start + i, arguments[i + 2]);
        }
    }

    return removedItems;
};