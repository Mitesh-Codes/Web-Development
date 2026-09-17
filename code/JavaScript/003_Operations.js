//1.Addition
let score=70;
let bonus=30;
let total_score=score+bonus;
let Total=70+30;
console.log(total_score,Total);

//2.Substraction
let score1=70;
let bonus1=30;
let total_score1=score1-bonus1;
console.log(total_score1);

//3. Multiplication
let score2=70;
let bonus2=30;
let total_score2=score2*bonus2;
console.log(total_score2);

//4. Division
let score3=70;
let bonus3=30;
let total_score3=score3/bonus3;
console.log(total_score3);

//5. Modulus
let score4=70;
let bonus4=30;
let total_score4=score4%bonus4;
console.log(total_score4);

//6. Exponentiation
let score5=7;
let bonus5=3;
let total_score5=score5**bonus5;
console.log(total_score5);

//7. Increment
let score6=70;
score6++;
console.log(score6);

//8. Decrement
score6--;
console.log(score6);



//Comparison Operators
let a = 5;
let b = 10;
console.log(a == b); // false
console.log(a != b); // true
console.log(a < b); // true
console.log(a > b); // false
console.log(a <= b); // true
console.log(a >= b); // false

//Logical Operators
let x = true;
let y = false;
console.log(x && y); // false
console.log(x || y); // true
console.log(!x); // false
console.log(!y); // true
console.log(x && !y); // true
console.log(!x || y); // false
console.log((x && y) || (!x && !y)); // false
console.log((x || y) && (!x || !y)); // true
console.log((x && !y) || (!x && y)); // true
console.log((x || !y) && (!x || y)); // true


//Assignment Operators
let c = 5;
c += 3;
console.log(c); // 8
c -= 2;
console.log(c); // 6
c *= 4;
console.log(c); // 24
c /= 3;
console.log(c); // 8
c %= 5;
console.log(c); // 3


//Ternary Operator
let age = 18;
let canVote = (age >= 18) ? "Yes" : "No";
console.log(canVote); // Yes

//Typeof Operator
let num = 42;
let str = "Hello";
let bool = true;
console.log(typeof num); // number
console.log(typeof str); // string
console.log(typeof bool); // boolean


//Bitwise Operators
let p = 5;
let q = 3;
console.log(p & q); // 1  how?--> 5 in binary is 101, 3 in binary is 011. The bitwise AND operation gives 001, which is 1 in decimal.
console.log(p | q); // 7  how?--> 5 in binary is 101, 3 in binary is 011. The bitwise OR operation gives 111, which is 7 in decimal.
console.log(p ^ q); // 6  how?--> 5 in binary is 101, 3 in binary is 011. The bitwise XOR operation gives 110, which is 6 in decimal.
console.log(~p); // -6    how?--> The bitwise NOT operation inverts all the bits of 5 (101), resulting in 010, which is -6 in decimal.
console.log(p << 1); // 10      how?--> 5 in binary is 101. Shifting it left by 1 position gives 1010, which is 10 in decimal.
console.log(p >> 1); // 2       how?--> 5 in binary is 101. Shifting it right by 1 position gives 010, which is 2 in decimal.
console.log(p >>> 1); // 2      how?--> 5 in binary is 101. Unsigned right shift by 1 position gives 010, which is 2 in decimal.

//Difference between >> and >>>
// The >> operator is the signed right shift operator, which preserves the sign of the number. It shifts the bits to the right and fills in the leftmost bits with the sign bit (0 for positive numbers, 1 for negative numbers).
// The >>> operator is the unsigned right shift operator, which does not preserve the sign of the number. It shifts the bits to the right and fills in the leftmost bits with 0, regardless of the sign of the number.

//Difference between == and ===
let num1 = 5;
let str1 = "5";
console.log(num1 == str1); // true because == performs type coercion and converts str1 to a number before comparison
console.log(num1 === str1); // false because === checks for both value and type, and they are of different types (number vs string)

//Operators Precedence
let result = 5 + 3 * 2;
console.log(result); // 11

// The order of operations is: *, /, %, +, -
// So the expression is evaluated as: 5 + (3 * 2) = 5 + 6 = 11

// just use parentheses to control the order of operations

//More complex example
let complexResult = (5 + 3) * 2 - 4 / 2;
console.log(complexResult); // 14


//new keyword
// The new keyword is used to create an instance of an object that has a constructor function. 
// It creates a new object, sets the prototype of that object to the constructor's prototype, 
// and calls the constructor function with the specified arguments.

//in easy language, the new keyword is used to create a new object based on a constructor function.
let person = new Object();
person.name = "John";
person.age = 30;
console.log(person); // { name: 'John', age: 30 }
console.log(person.name.valueOf()); // 'John'

console.log(typeof person); // 'object'