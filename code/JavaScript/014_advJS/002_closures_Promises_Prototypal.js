//Closures
//--> Closures are functions that have access to variables from another function’s scope. This is often used to create private 
//    variables or to maintain state between function calls.

function outer(){
    let counter=0;
    return function inner(){
        counter++;
        return counter;
    }
}
let increment=outer();
console.log(increment()); //1
console.log(increment()); //2
console.log(increment()); //3



//Promises and Promise Chaining
//--> Promises are a way to handle asynchronous operations in JavaScript. They represent a value that may be available now, 
//    or in the future, or never. It has three states: pending, fulfilled, and rejected.
//    Promise chaining allows you to perform a series of asynchronous operations in a more readable and manageable way.
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let success = true;         
            if(success){
                resolve("Data fetched successfully");
            } else {
                reject(new Error("Failed to fetch data"));
            }
        }, 2000);
    });
}
let promise = fetchData();
promise
    .then((data) => {
        console.log(data);
        return data.toUpperCase();
    })
    .then((data) =>{
        console.log(data);
        return data.toLowerCase();
    })
    .catch(error => {
        console.error(error);
    });



//Prototypal Inheritance
//--> In JavaScript, objects can inherit properties and methods from other objects. This is known as prototypal inheritance. 
//    Every object has a prototype, which is another object that it inherits properties and methods from.
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.greet=function(){
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
}
let person1 = new Person("Alice", 30);
person1.greet(); //Hello, my name is Alice and I am 30 years old.