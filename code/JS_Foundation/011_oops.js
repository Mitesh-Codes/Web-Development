class vehicle{
    constructor(make, model){
        this.make=make;
        this.model=model;
    }

    start(){
        return `${this.make} ${this.model} is starting`;
    }
}

//Inheritance
class Car extends vehicle{
    drive(){
        return `${this.make} ${this.model} is driving`;
    }
}
let car1=new Car("Toyota", "Corolla");
// console.log(car1.start());
// console.log(car1.drive());


//Encapsulation
class BankAccount{
    #balance=0; //private property
    deposit(amount){
        this.#balance+=amount;
        return this.#balance;
    }

    getBalance(){
        return `$ ${this.#balance}`;
    }
}


let account1=new BankAccount();
//console.log(account1.balance); ///Cannot access private property
//console.log(account1.getBalance());



//Abstraction
class CoffeeMachine{
    start(){
        //Call Database
        //Check water level
        //Check coffee beans
        return "Coffee machine is starting";
    }
    brewCoffee(){
        //start brewing process
        return "Brewing of coffee is in progress";
    }

    pressStartButton(){
        return this.start() + " and " + this.brewCoffee();
    }
}

let myMachine=new CoffeeMachine();
// console.log(myMachine.start());
// console.log(myMachine.brewCoffee());

// console.log(myMachine.pressStartButton());



//Polymorphism
class Animal{
    makeSound(){
        return "Animal makes a sound";
    }

}

class Dog extends Animal{
    makeSound(){
        return "Dog barks";
    }
}

class Jaguar extends Animal{
    makeSound(){
        return "Jaguar roars";
    }
}

let myDog=new Dog();
let myJaguar=new Jaguar();
// console.log(myDog.makeSound());
// console.log(myJaguar.makeSound());



//Static Method
class Calculator{
    static add(a,b){
        return a+b;
    }
}

// let miniCalculator=new Calculator();
//console.log(miniCalculator.add(5,10));  // this we cannot call static method because static methods are called on the class itself, not on instances of the class.
//console.log(Calculator.add(5,10));  // this is the correct way to call a static method



//Getter and Setter

class Employee{
    #salary
    constructor(name, salary){
        if(salary<0){
            throw new Error("Salary cannot be negative");

        }
        this.name=name;
        this.#salary=salary;
    }

    // Getter for salary
    get salary(){
        return `$ ${this.#salary}`;
    }

    // Setter for salary
    set salary(value){
        if(value<0){
            throw new Error("Salary cannot be negative");
        }
        else{
            this.#salary=value;
        }
    }
}
let emp1=new Employee("John",-50000);
console.log(emp1.salary);
emp1.salary=60000;
