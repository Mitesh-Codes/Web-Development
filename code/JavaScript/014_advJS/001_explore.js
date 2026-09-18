function sayHello(){
    console.log("This will print after 3 seconds: ");
    console.log("Hello, World!");
}
setTimeout(sayHello, 3000);
console.log("This will print immediately: ");
for (let i = 0; i < 5; i++) {
    
    console.log(i);
}


//EventLoop
// --> It is a mechanism that allows JavaScript to perform non-blocking operations by offloading operations to the system kernel 
// whenever possible. It handles asynchronous callbacks and ensures that the main thread is not blocked while waiting for operations 
// like I/O, timers, or network requests to complete.

// The code(function, time function(javascript doesnt have capabilities to execute time, network calls)) first enters the "call stack".
// then event loop checks if the call stack is empty or any function, if its a time function, it sends it to the "Web APIs" 
// (provided by the browser or Node.js environment) where it waits for the specified time to elapse in the queue
// and when this is happening , event loop check for function in call stack which javascipt can execute and executes it, 
// and when the time is elapsed, the callback function is moved to the "callback queue".
// and then time function execcutes later. thats why order doesnt matter in javascript during these operations, 
// it will execute the function when the time is elapsed and call stack is empty.