//This context in JavaScript refers to the object that is currently executing the code. The value of 'this' can change depending 
// on how a function is called.
// this value can be lost when a function is passed as a callback or assigned to a variable. To maintain the correct context, 
// you can use the bind() method, arrow functions, or the call() and apply() methods.
//bind() --> The bind() method creates a new function that, when called, has its 'this' keyword set to the provided value.
//call() --> The call() method calls a function with a given 'this' value and arguments provided individually.
//apply() --> The apply() method calls a function with a given 'this' value and arguments provided as an array.

const person={
    name:"John",
    greet(){
        console.log(`Hello, my name is ${this.name}`);
    },
};

//person.greet(); //Hello, my name is John

const greetFunction=person.greet;
//greetFunction(); //Hello, my name is undefined

//Binding the context of 'this' using bind()
const boundGreetFunction2=person.greet.bind(person);
//boundGreetFunction2(); //Hello, my name is John





//AsyncAwait and Promises
//--> Async/Await is a syntactic sugar built on top of Promises. It allows you to write asynchronous code that looks synchronous, 
//    making it easier to read and understand. The 'async' keyword is used to declare an asynchronous function, and the 'await' 
//    keyword is used to pause the execution of the function until the Promise is resolved or rejected.

/*
function fetchUserData(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve({name:"Mitesh", URL:"https://www.mitesh.com"})
        },3000);
    });
}
async function getUserData(){
    try{
        console.log('Fetching user data...');
        const userData=await fetchUserData();
        console.log("User data: ",userData);
    }
    catch(error){
        console.log("Error fetching data ");
    }
}

getUserData();
*/


//Example 2 of async/await
function fetchPostData(){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve("Post Data Fetched")
        }, 2000);
    })
}

function fetchCommentData() {
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve("Comment Data Fetched");
        }, 3000);
    });
}

async function getBlogData() {
    try{
        console.log("Fetching Blog Data...");

        // const blogData=await fetchPostData();
        // const commentData =await fetchCommentData();

        const [blogData,commentData]=await Promise.all([
            fetchPostData(),
            fetchCommentData()
        ]);

        console.log(blogData);
        console.log(commentData);
        console.log("fetch completed");
    } catch(error){
        console.error("Error fetching Blog Data",error);
    }
}
getBlogData();