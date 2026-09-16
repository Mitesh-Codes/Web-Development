// //While loop
// let sum=0;
// let i=1;
// while(i<=5){
//     sum+=i;
//     i++;
// }
// //console.log(sum);


// //Challenge1
// let countdown=[];
// let j=5;
// while(j>0){
//     countdown.push(j);
//     j--;
// }
// //console.log(countdown);


// //Challenge2
// // let teaCollection=[];
// // let tea;

// // do{
// //     //tea=prompt("What is your favorite tea? (Type 'exit' to quit)"); //prompt is a browser function, not available in Node.js
// //     if(tea !=="exit"){
// //         teaCollection.push(tea);

// //     }
// // }while(tea!=="exit");
// // console.log(teaCollection);


// //Challenge3
// let total=0;
// let k=1;
// do{
//     total+=k;
//     k++;
// }while(k<=5);``
// //console.log(total);


// //Challenge4
// array1=[2,4,6];
// array2=[];
// for(let l=0;l<array1.length;l++){
//     array2.push(array1[l]*2);
// }
// console.log(array2);


// //Challenge5
// let cities=["Delhi","Mumbai","Kolkata"];
// let cityList=[];
// for (let m = 0; m < cities.length; m++) {
//     cityList.push/*unshift*/(cities[m]);
// }
// console.log(cityList);




//DAY2


//Challenge1
let teaCollection = ["Black Tea", "Green Tea", "Chai", "Oolong tea"];
let selectedTeas = [];
for (let i = 0; i < teaCollection.length; i++) {
    if (teaCollection[i] === "Chai") {
        break;
    }
    selectedTeas.push(teaCollection[i]);
}
console.log(selectedTeas);


//Challenge2
let teaCollection2 = ["Black Tea", "Green Tea", "Chai", "Oolong tea"];
let selectedTeas2 = [];
for (let i = 0; i < teaCollection2.length; i++) {
  if (teaCollection2[i] === "Chai") {
    continue;
  }
  selectedTeas2.push(teaCollection2[i]);
}
console.log(selectedTeas2);


//Challenge3  (for-of loops)
let numbers=[1,2,3,4,5];
let smallNumbers=[];
for (const num of numbers) {
    if (num==4) {
        break;
    }
    smallNumbers.push(num);
}
console.log(smallNumbers);


//Challenge4 (for-in loops)
let citiespopulation = {
    "New York": 8419600,
    "Delhi": 34232494,
    "Los Angeles": 3980400,
    "Chicago": 2720500
};
let cityNewPopulation={};
for (const city in citiespopulation) {
    if (city=="Los Angeles") {
        break;
    }
    cityNewPopulation[city]=citiespopulation[city];
    
}
console.log(cityNewPopulation);



//Challenge5 (for-each loop)
let teaCollection3 = ["Black Tea", "Green Tea", "Chai", "Oolong tea"];
let selectedTeas3 = [];

teaCollection3.forEach(function(tea) {
    if(tea==="Chai"){
        return;
    }
    selectedTeas3.push(tea);
});
console.log(selectedTeas3);
