let num1=10;
let num2=100;

if(num1>num2){
    console.log("num1 is greater than num2");
}
else{
    console.log("num1 is not greater than num2");
}


let username="mitesh";
let anotherusername="mitesh";

if(username==anotherusername){
    console.log("Both usernames are the same");
}

//Check if variable is number or not
let myVar=10;
if(typeof myVar==="number"){
    console.log("myVar is a number");
}

//if myVar is array then 
let myVar2=[1,2,3,4,5];
if(typeof myVar2==="array" /*but its an object*/ ){ //arrays are of type object in JavaScript, so this condition will not work as expected. To check if a variable is an array, you can use Array.isArray(myVar2).
    console.log("myVar2 is an array");
} else{
    console.log("myVar2 is not an array");
}
//check array
let items=[1,2,3,4,5];
if(Array.isArray(items)){
    console.log("items is an array");
} else{
    console.log("items is not an array");
}

//check boolean value
let isLoggedIn=true;
if(isLoggedIn){
    console.log("User is logged in");
} else{
    console.log("User is not logged in");
}