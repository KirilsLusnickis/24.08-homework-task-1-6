//1. Write a function that takes two numbers 
// (a and b) as Sum a and Return the result

function myFunction(a, b) {
        return a + b;
}
console.log(myFunction(1, 2));


// 2. Write a function that takes a string as an argument. 
// Extract the last 3 characters from the string. Return the result

function myFunction2(str) {    
    return str.slice(-3);
}
const str = "id123";
console.log(myFunction2(str));

// 3. Write a function that takes a number (a) as argument
//  Split a into its individual digits and return them in an array
function numberSplitToArray(a) {

    let digits = a.toString().split("");
    return digits.map(Number);
}

console.log(numberSplitToArray(777));


// 4. Write a function that takes an array (a) and a number (n) as
//  arguments It should return the last n elements of a

function returnArray (a, n) {
    return a.slice(-n);
    
}
const array = [1, 2, 3, 45]
console.log(returnArray(array,2));

// 5. Write a function that takes two arrays as arguments 
// Merge both arrays and remove duplicate values 
// Sort the merge result in ascending order Return the resulting array

function myFunction3(arr1, arr2) {
    const merged = [...arr1, ...arr2];
    const sorted = merged.sort((a, b) => a -b);
    const result = sorted.filter((item, index) => sorted.indexOf(item) === index);
    return result;
}

console.log(myFunction3([1, 2, 3], [3, 5, 6]));



//6. Write a function that takes an object (a) and a string (b) as argument
//Return true if the object has a property with key 'b'
//Return false otherwise

function myFunction4(obj, str) {

        if (obj.hasOwnProperty(str)) {
            return true
        } else {
            return false
        }
}

console.log(myFunction4({ name: "Bob", age: 35 }, "name")); //true
console.log(myFunction4({ name: "Bob", age: 52 }, "address")); //false
