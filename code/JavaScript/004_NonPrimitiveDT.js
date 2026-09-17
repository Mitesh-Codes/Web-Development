const /*let*/ username={
    firstname: "Mitesh",
    LoggedIn: true,
    "roll no":56,
};

username.LoggedIn=false; //assigning value to the property of an object is allowed even if the object is declared as const
username.lastname="Dotcom"; //adding new property to the object is allowed even if the object is declared as const

console.log(username);
console.log(typeof username);
console.log(username.LoggedIn);
console.log(username.lastname);
console.log(username["roll no"]); //accessing property with space in the name using bracket notation

let today = new Date();
console.log(today.getDate());


//ARRAYS
let myArray=[1,2,3,4,5,"a",true];
console.log(myArray);


//Implicit Type Conversion
let num1=5;
let num2="10";
let result=num1+num2;
console.log(result); // "510" (string concatenation)

let num3=5;
let num4="10";
let result2=num3-num4;
console.log(result2); // -5 (number subtraction)

//why ?? -> In JavaScript, when you use the + operator with a number and a string, 
// it performs string concatenation. When you use the - operator with a number and a string, 
// it attempts to convert the string to a number and then performs subtraction.

//for multiplication
let num5=5;
let num6="10";
let result3=num5*num6;
console.log(result3); // 50 (number multiplication)
//for division
let num7=5;
let num8="10";
let result4=num7/num8;
console.log(result4); // 0.5 (number division)



let isValid=true;
console.log(isValid+1); // 2 (true is converted to 1)

//NaN (Not a Number)
let invalidNumber="2abc";
console.log(Number(invalidNumber));
console.log(typeof (invalidNumber)); // NaN is of type number