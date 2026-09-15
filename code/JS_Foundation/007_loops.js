//While loop
let sum=0;
let i=1;
while(i<=5){
    sum+=i;
    i++;
}
//console.log(sum);


//Challenge1
let countdown=[];
let j=5;
while(j>0){
    countdown.push(j);
    j--;
}
//console.log(countdown);


//Challenge2
// let teaCollection=[];
// let tea;

// do{
//     //tea=prompt("What is your favorite tea? (Type 'exit' to quit)"); //prompt is a browser function, not available in Node.js
//     if(tea !=="exit"){
//         teaCollection.push(tea);

//     }
// }while(tea!=="exit");
// console.log(teaCollection);


//Challenge3
let total=0;
let k=1;
do{
    total+=k;
    k++;
}while(k<=5);``
//console.log(total);


//Challenge4
array1=[2,4,6];
array2=[];
for(let l=0;l<array1.length;l++){
    array2.push(array1[l]*2);
}
console.log(array2);


//Challenge5
let cities=["Delhi","Mumbai","Kolkata"];
let cityList=[];
for (let m = 0; m < cities.length; m++) {
    cityList.push/*unshift*/(cities[m]);
}
console.log(cityList);
