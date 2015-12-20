(function() {
  'use strict';

  window._ = {};

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return val;
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, return just the last element.
  _.last = function(array, n) {
    return n === undefined ? array[array.length - 1] : array.slice(Math.max(0, array.length-n));
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the iterator function over each item in the input collection.

_.each = function(collection, iterator) {
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    } else {
      for (var key in collection) {
        iterator(collection[key], key, collection);
      }
    }
  };


  // Returns the index at which value can be found in the array, or -1 if value is not present in the array.
  _.indexOf = function(array, target){
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var filtered = [];
    _.each(collection, function(item) {
      if (test(item)) {
        filtered.push(item);
      }
    });
    return filtered;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    return _.filter(collection, function(item) {
      return !test(item);
    });
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
    var uniqStor = {};
    var uniqArr = [];
    // Build up a storage object to store each item in array
    // This will overwrite duplicate values for us :)
    _.each(array, function(item) {
      uniqStor[item] = item;
    });

    // iterate through out storage object (which only had unique values)
    // and push them to out results array
    _.each(uniqStor, function(prop) {
      uniqArr.push(prop);
    });
    return uniqArr;
  };


  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    // works a lot like each(), but in addition to running
    // the operation on all the members, it also maintains
    // an array of results.
    var mapped = [];
    _.each(collection, function(value, key, collection) {
      mapped.push(iterator(value));
    });
    return mapped;
  };

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(collection, key) {
    return _.map(collection, function(item){
      return item[key];
    });
  };

  /*
   Reduces an array or object to a single value by repetitively calling iterator(accumulator, item) for each item. accumulator should be  the return value of the previous iterator call.

   You can pass in a starting value for the accumulator as the third argument to reduce. If no starting value is passed, the first element is used as the accumulator, and is never passed to the iterator. In other words, in the case where a starting value is not passed, the iterator is not invoked until the second element, with the first element as its second argument.

   Example:
     var numbers = [1,2,3];
     var sum = _.reduce(numbers, function(total, number){
       return total + number;
     }, 0); // should be 6

     var identity = _.reduce([5], function(total, number){
       return total + number * number;
     }); // should be 5, regardless of the iterator function passed in
            No accumulator is given so the first element is used.
*/
  _.reduce = function(collection, iterator, accumulator) {
    var startingValueMissing = accumulator === undefined;

    _.each(collection, function(item) {
      if(startingValueMissing) {
        accumulator = item;
        startingValueMissing = false;
      } else {
        accumulator = iterator(accumulator, item);
      }
    });

    return accumulator;

  };


  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // Use reduce to reduce to found or not found :)
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    // Set the iterator as identity if none passed in
    iterator = iterator || _.identity;

    // using reduce again to check if every item reduces to true
    // double bang coerces truthy values to true
    return !!_.reduce(collection, function(result, item) {
      return iterator(item) && result;
    }, true);

  };


  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
/*
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.
    iterator = iterator || _.identity;

    return !!_.reduce(collection, function(result, item) {
      return iterator(item) || result;
    }, false)
  };
*/
  _.some = function(collection, iterator) {
    // Set the iterator to be identity if none passed in
    iterator = iterator || _.identity;

    /* We can re-use every but do a double negative.
      There's 3 possible outcomes:
        - all pass truth test === true
        - none pass truth test === false
        - some pass truth test === true
      If we look at these outcomes and see what the _.every function would return:
        - all pass truth test === true
        - none pass truth test === false
        - some pass truth test === false
      So there's only one situation where _.every and _.some function will be the opposity result: some but not all pass truth test

      Using this clever trick, we know that if we do the oposite of the
      truth test using every, we'd get false, true, false, respectively,
      for the above 3 scenarious. So then we just need to negate them
      again to get true, false, true (which is exactly what we want for _.some!!)
    */
    return !_.every(collection, function(item) {
      return !iterator(item);
    });
  };

  /**
   * OBJECTS
   * =======
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {
    _.each(arguments, function(argObject) {
      _.each(argObject, function(value, prop) {
        obj[prop] = value;
      });
    });
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    _.each(arguments, function(argObject) {
      _.each(argObject, function(value, prop) {
        if(!(prop in obj)) {
        obj[prop] = value;
      }
      });
    });
    return obj;
  };

  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time.
  // Subsequent calls should return the previously returned value.
  _.once = function(func) {
    // so that they'll remain available to the newly-generated function every time it's called.
    var alreadyCalled = false;
    var result;

    // We'll return a new function that delegates to the old one,
    // but only if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may
  // assume that the function only takes primitives as arguments.
  // memoize could be renamed to oncePerUniqueArgumentList; memoize does
  // the same thing as once, but based on many sets of unique arguments.
  //
  // _.memoize should return a function that, when called, will check
  // if it has already computed the result for the given argument
  // and return that value  instead if possible.
  _.memoize = function(func) {
    var computed = {};

    return function() {
      var arg = JSON.stringify(arguments);
      if(!(arg in computed)) {
        computed[arg] = func.apply(this, arguments);
      }
      return computed[arg];
    };
  };

  // Delays a function for the given number of milliseconds, and then
  // calls it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var args = Array.prototype.slice.call(arguments, 2);
    setTimeout( function() {
      func.apply(null, args); // NOTE TO SELF: When passing information from one function to another, use apply. Apply can take "null" or "this" as first argument in this use case
    }, wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  // TIP: This function's test suite will ask that you not modify the original input array.

  _.shuffle = function(array) {
    var copyOfArray = Array.prototype.slice.call(array);
    var newArr = [];

    _.each(array, function(item) {
      var rand = Math.floor(Math.random() * copyOfArray.length);
      newArr.push(copyOfArray[rand]);
      copyOfArray.splice(rand, 1);
    });

    return newArr;
  };

  /**
   * EXTRA CREDIT
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue, but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
    // we can use map since we want to call on each value on the list
    // and return all the results
    // For each iteration, we check if the method is a function or key
    // if it's a key, we set the method to be the value at that key
    // if it's a function, our method is the function itself
    // then we apply the method to our current item
     return _.map(collection, function(item) {
      var method;
      if(typeof functionOrKey === 'string') {
        method = item[functionOrKey];
      } else {
        method = functionOrKey;
      }
      return method.apply(item, args);
      });
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the
  // name of that string. For example, _.sortBy(people, 'name') should
  // sort an array of people by their name.

  _.sortBy = function(collection, iterator) {
    if(typeof iterator === 'function') {
      return collection.sort( function(a, b) {
        return iterator(a) - iterator(b);
      });
     } else if (typeof iterator === 'string') {
        return collection.sort( function(a, b) {
          if (a[iterator] < b[iterator]) {
            return -1;
          }
          if (a[iterator] > b[iterator]) {
            return 1;
          }
          return 0;
        });
       } else {
        return null;
      }
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
    var newArr = [];

    function findLongest() {
      var longest = 0;
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i].length > longest) {
          longest = arguments[i].length;
       }
      }
      return longest;
    }

    var longestArr = findLongest(arguments);

    for (var i = 0; i < longestArr; i++) {
      var subArr = [];
      for (var j = 0; j < arguments.length; j++) {
        subArr.push(arguments[j][i]);
      }
      newArr.push(subArr);
    }

    return newArr;
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.

  _.flatten = function(nestedArray, result) {
    var newArr = [];
    _.each(nestedArray, function(item) {
      if (Array.isArray(item)) {
        newArr = newArr.concat(_.flatten(item));
      } else {
        newArr.push(item);
      }
    });
    return newArr;
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.

  _.intersection = function() {
    // Take one of the arrays (lets call this the test array) and use that as base case.
    // Test to see if every one of the other arrays contains every element in the test array.
    var newArr = [];
    var argumentsArr = arguments;
    _.each(argumentsArr[0], function(item) {
        var allContain = _.every(argumentsArr, function(arg) {
          return _.contains(arg, item);
        });
        if (allContain) {
          newArr.push(item);
        }
    });

    return newArr;
  };


  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    // loop through each item in the passed in array and compare it against
    // each item in every other array. If none match, then add the item to the result
    var newArr = [];
    var argumentsArr = arguments;
    _.each(array, function(item) {
      var noneOtherContain = true;
      for (var i = 1; i < argumentsArr.length; i++) {
        for (var j = 0; j < argumentsArr[i].length; j++) {
          if (argumentsArr[i][j] === item) {
            noneOtherContain = false;
          }
        }
      }
      if (noneOtherContain) {
          newArr.push(item);
        }
    });
    return newArr;
  };

  // Returns a function, that, when invoked, will only be triggered at // most once during a given window of time.
  _.throttle = function(func, wait) {
    // a time should set off each time a function is invoked
    // when a function is called, the timer should be checked
    // if we are clear, run the function, and reset timer.
    // if not, do nothing
    var timeCleared = true;
    var args, result;
    return function() {
      args = Array.prototype.slice.call(arguments);
      if (timeCleared) {
        timeCleared = false;
        result = func.apply(this, args);

        function clearTime() {
          timeCleared = true;
        }
        _.delay(clearTime, wait);
       }
      return result;
    };
  };

}());
