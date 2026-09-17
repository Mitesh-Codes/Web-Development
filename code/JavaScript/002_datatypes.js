console.log("hello");
// console.log("chai");
/*

String
Number
Boolean
Bigint

Undefined
null

Object

Symbol

*/

// var score = 102

let score = 102;
let name = "chaicode.com";
let isLoggedin = false;

//object
let teaTypes = ["lemon tea", "orange tea", "oolong tea"];
let user = { firstname: "hitesh", lastname: "choudhary" };

let getScore = score;

console.log(getScore);



//Change value of variables

let gameName = "spiderman";

gameName = "batman";

console.log(gameName);

const username = "miteshdotcom";

//username = "mitesh";  // this will cause error as assigning value to const variable

console.log(username);


//Null and Undefined

let myVariable;
console.log(myVariable); //undefined

myVariable = null;
console.log(myVariable); //null


//String
let myString="Hola";
let myString1='Hola';
let myString2=`Hola`;

let combinedString=myString+myString1+myString2;
console.log(combinedString);

console.log(myString);
console.log(myString1);
console.log(myString2);

//but the `` allows us to use variables inside the string
let myName="Mitesh";
let myString3=`Hello ${myName}`;
console.log(myString3); //Hello Mitesh


//Symbol
let sym1=Symbol("Mitesh");
let sym2=Symbol("Mitesh");
console.log(sym1); //Symbol(Mitesh) 
console.log(sym1==sym2); //false
