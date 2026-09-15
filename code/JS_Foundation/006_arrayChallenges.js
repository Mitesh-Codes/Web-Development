//Challenge 1
let teaFlavors=["green tea","black tea","oolong tea"];
// let teaFlavors= new Array("green tea","black tea","oolong tea");
let firstTea=teaFlavors[0];
//console.log(firstTea);
//console.log(typeof firstTea);


//Challenge 2
let cities=["New York","Los Angeles","Chicago","Houston","Phoenix"];
let favoriteCity=cities[2];
//console.log(favoriteCity);

//Challenge 3
let citiesVisited= new Array("Mumbai","Sydney");
citiesVisited[2]="Berlin";
citiesVisited[citiesVisited.length]="Tokyo";
citiesVisited.push("London");
//console.log(citiesVisited);

//Challenge 4
let countries=["India","Australia","Germany"];
let hitlercountry=countries.pop();
// console.log(hitlercountry);
// console.log(countries);

//Challenge 5
let countries2=["India","Australia","Germany"];
let softcopyCountries=countries2.copyWithin(1,0,2); // it will copy the values of index 0 and 1 to index 1 and 2 respectively
let HARDcopyCountries=countries2.slice(); // it will create a hard copy of the array and will not change the original array when we change the values of the hard copy
let hardcopycountires2=[...countries2]; // it will create a hard copy of the array and will not change the original array when we change the values of the hard copy
let softcopyCountries2=countries2;
countries2[0]="USA"; // it will change the value of softcopyCountries as well because it is a reference to the same array in memory
// console.log(softcopyCountries2);

// console.log(hardcopycountires2);
// console.log(softcopyCountries);
// console.log(countries2);
// console.log(HARDcopyCountries);


//Challenge 6
let europeanCountries=["Germany","France","Italy"];
let asianCountries=["China","Japan","India"];
let allCountries = [...europeanCountries, ...asianCountries]; //Hard copy of the array
let allCountries2 = europeanCountries.concat(asianCountries); //Hard copy of the array
let allCountries3 =[europeanCountries, asianCountries]; //Soft copy of the array
europeanCountries.pop();

console.log(allCountries);
console.log(allCountries2);
console.log(allCountries3);


//Challenge 7
let fruits=["apple","banana","orange"];
let menuLength=fruits.length;



//Challenge 8
let bucketList=["milk","eggs","bread"];
let isAvailable=bucketList.includes("eggs");
console.log(isAvailable);


//shift : removes the first element of the array and returns the removed element
//unshift : adds an element to the beginning of the array and returns the new length of the array
