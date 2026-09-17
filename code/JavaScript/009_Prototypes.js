let computer={cpu:12};
let lenovo={screen:"HD",
    __proto__:computer
};
let tomHardware={};

console.log(lenovo.__proto__); // Object.prototype

//or

Object.setPrototypeOf(tomHardware, lenovo);
console.log(tomHardware.screen)

//or

console.log(Object.getPrototypeOf(tomHardware));


//What is Prototype?
//Prototype is an object that is associated with every functions and objects by default in JavaScript. 
//It allows you to add new properties and methods to existing objects constructors. 