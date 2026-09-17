function Person(name, age){
    this.name=name;
    this.age=age;

}
function Car(make, model){
    this.make=make;
    this.model=model;
}

let person1=new Person("John", 30);
let car1=new Car("Toyota", "Camry");
// console.log(person1); 
// console.log(car1);

function Tea(type){
    this.type=type;
    this.describe=function(){
        return `This is a ${this.type} tea.`;
    }
}
let lemonTea=new Tea("Lemon");
//console.log(lemonTea.describe());


function animal(species){
    this.species=species;
}
animal.prototype.sound=function(){
    return `This ${this.species} makes a sound.`;
}
let dog=new animal("Dog");
//console.log(dog.sound());


//Error to check new keyword
function Drink(type){
    if(!new.target){
        throw new Error("You must use the 'new' keyword to create an instance of Drink.");
    }
    this.type=type;
}
let tea= /*new*/ Drink("Green"); // This will throw an error because 'new' keyword is not used
