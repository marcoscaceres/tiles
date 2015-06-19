'use strict';
function async(func, self) {
  return function asyncFunction() {
    var functionArgs = Array.from(arguments);
    return new Promise(function(resolve, reject) {
      var gen;
      if (typeof func !== 'function') {
        reject(new TypeError('Expected a Function.'));
      }
      //not a generator, wrap it.
      if (func.constructor.name !== 'GeneratorFunction') {
        gen = (function*() {
          return func.apply(self, functionArgs);
        }());
      } else {
        gen = func.apply(self, functionArgs);
      }
      try {
        step(gen.next(undefined));
      } catch (err) {
        reject(err);
      }

      function step(next) {
        const value = next.value;
        const done = next.done;
        if (done) {
          return resolve(value);
        };
        if (value instanceof Promise) {
          value.then(
            result => step(gen.next(result)),
            error => step(gen.throw(error))
          );
          return;
        }
        step(gen.next(value));
      }
    });
  }
}
