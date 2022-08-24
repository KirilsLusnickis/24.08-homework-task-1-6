// Write a function that takes two numbers 
// (a and b) as Sum a and Return the result

function myFunction(a, b) {
        return a + b;
}
console.log(myFunction(1, 2));

// Write a function that takes an array (a) and a number (n) as
//  arguments It should return the last n elements of a

var array = [1, 2, 3, 45]

function returnArray (a, n) {
    const lastItem = array[array.length - 1]
    console.log(lastItem);
    return lastItem;
    
}
returnArray(array,2);
