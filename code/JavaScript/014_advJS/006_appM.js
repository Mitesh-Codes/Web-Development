//Module import and export

//default import
import multiply from './005_ES6_MathOperationM.js';
//named import
import { add, subtract } from './005_ES6_MathOperationM.js';

console.log(add(5, 3)); // Output: 8
console.log(subtract(5, 3)); // Output: 2
console.log(multiply(5, 3)); // Output: 15