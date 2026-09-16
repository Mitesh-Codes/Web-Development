//Challenge1
function makeTea(TeaType){
    return "Making a cup of " + TeaType;
    console.log("I just made a cup of " + TeaType); // Unreachable code, because return statement ends the function execution
}
let greet=makeTea("Green Tea");
console.log(greet);

//Challenge2
function orderTea(teaType){
    function confirmOrder(){
        return "Order confirmed for Tea ";
    }
    return confirmOrder();
}

let orderConfirmation=orderTea("Oolong Tea");
console.log(orderConfirmation);


//Challenge3  Arrow Functions
// () => {}    valid arrow fucntion syntax
const calculateTotal =(price, quantity)=>{
    return price*quantity;
}
let total=calculateTotal(5, 10);
console.log(total);


//Challenge4
function makeTea(typeOfTea){
    return typeOfTea;
}
function processTeaOrder(teaFunction){
    return teaFunction("Earl Grey");
}
let order=processTeaOrder(makeTea);
console.log(order);


//Challenge5
function createTeaMaker(name) {
  return function (teaType) {
    return `${name} is making ${teaType}`;
  };
}

let teaMaker = createTeaMaker("Mitesh");

console.log(teaMaker("Green Tea"));
//This behavior is called a "CLOSURE", where the inner function has access to the outer function's scope even after the outer function has finished executing.
