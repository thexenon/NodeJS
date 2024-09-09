// console.log(arguments);
// console.log(require('module').wrapper);

// module.exports
const C = require('./test-module-1');
const calc1 = new C();
console.log(calc1.mul(7, 9));

// exports
const calc2 = require('./test-module-2');
const { add, sub, mul, div } = require('./test-module-2');
console.log(calc2.div(789, 7456987));
console.log(mul(789, 7456987));

// Caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
