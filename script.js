// Capture all the major buttons

const numberBtn = document.querySelectorAll(".button.numbers");
const operateBtn = document.querySelectorAll(".button.operator");
const equalBtn = document.querySelector(".button.equal");
const clearBtn = document.querySelector(".button.clear");
const deleteBtn = document.querySelector(".button.delete");
const display = document.querySelector("#display");


const valueKeyList = [1,2,3,4,5,6,7,8,9,0];
const operatorKeyList = ["+", "-", "*","/"];
let waitingForSecondOperand = false;
let anotherOperatorPressed = false;
let equalButtonPressed = false;
let dotButtonPressed = false;
let previous, current, operator;
let value;


// Calculator basic functionality

function add(a, b) {
    return (a + b).toFixed(2);
}


function subtract(a, b){
    return( a - b).toFixed(2);
}

function multiply(a, b){
    return( a * b).toFixed(2);
}   

function divide(a, b){
    return (a / b).toFixed(2);
}

// Function performs the appropriate arithmetic according to the operator

function operate(previous, current, operator){
    let displayValue;
    switch(operator){
        case "/":
            if(current == 0){
                clear();
                displayValue = "OOPS";
            }else{
                displayValue = divide(previous, current);
            }
            break;
        case "*":
            displayValue = multiply(previous, current);
            break;
        case "Del":
            break;
        case "-":
            displayValue = subtract(previous, current);
            break;
        case "+":
            displayValue = add(previous, current);
            break;
    }
    console.log("Display Value: ", displayValue, "prev:", previous, "curr: ", current, "operator: ", operator);
    display.textContent = displayValue;
    return displayValue;
}

// Function, if we know the operator was already pressed before hand then we empty the current display to make sure that we capture the second
// operand that we need to compute, but we have to make sure that once the display is emptied we set that to false to make sure we capture all the
// values for the current.

function assignValues(element){
    // this checks if the parameter is coming from either the key being clicked or number being pressed in the keyboard.
    let curr;
    if(element.textContent){
        curr = element.textContent;
    }else{
        curr = element.key;
        
    }

    console.log("curr: ", curr);
    // when the equal button is pressed to do the calculation

    if(equalButtonPressed){
        clear();
        equalButtonPressed = false;
    }

    // when an operator is pressed after the initial calculation

    if(anotherOperatorPressed){
        display.textContent = '';
        anotherOperatorPressed = false;
    }


    // assigns the value to the right operand based on if operator is present or not
    if(waitingForSecondOperand){
        if(dotButtonPressed && element.textContent == "."){
            return;
        }else{
            if(curr == ".") dotButtonPressed = true;
            display.textContent = display.textContent + curr;
            current = display.textContent;
        }
    }else{
        if(dotButtonPressed && curr == "."){
            return;
        }else{
            if(curr == ".") dotButtonPressed = true;
            display.textContent = display.textContent + curr;
            previous = display.textContent;
        }
    }
}

// Function, if we know the operator isn't empty then we know there is a pair number already, so when operator isn't empty, we first
// acknowledge that, then we compute the value of the previous operation which would be displayed and then only set the operator to the
// current operator and the previous value to the computed value otherwise we just go with initializing the operator

function assignOperator(element){
    // this checks if the parameter is coming from either the key being clicked or number being pressed in the keyboard.
    let curr;
    if(element.textContent){
        curr = element.textContent;
    }else{
        curr = element.key;
        if(curr == "Enter" || curr == "Backspace") return;
    }

    if(previous == undefined && current == undefined) return;

    // if you're trying to compute another value right after the = button is pressed

    if(equalButtonPressed){
        previous = display.textContent;
        display.textContent = '';
        value = undefined;
        current  = '';
        operator = undefined;
        equalButtonPressed = false;
    }

    // assigns the right operator based on if their is already an operator present or not.
    if(operator == undefined){
        operator = curr;
        display.textContent = '';
        waitingForSecondOperand = true;
        dotButtonPressed = false;
    }else{
        anotherOperatorPressed = true;
        value = operate(parseFloat(previous), parseFloat(current), operator);
        previous = value;
        operator = curr;
    }      
}


// Clear the display and reset all the values

function clear(){
    previous = "";
    current ="";
    operator = undefined;
    value = '';
    dotButtonPressed = false;
    anotherOperatorPressed = false;
    waitingForSecondOperand =false;
    display.textContent = '';
}

// Erase the last number

function erase(){
    let newString = display.textContent;
    display.textContent = newString.slice(0, newString.length - 1);
    if(operator){
        current = display.textContent;
    }else{
        previous = display.textContent;
    }
}


// handles all the click event happening in the calculator

numberBtn.forEach(element => element.addEventListener("click",() => assignValues(element)));
operateBtn.forEach(element => element.addEventListener("click", () => assignOperator(element)));
equalBtn.addEventListener("click", () =>{
    equalButtonPressed = true;
    operate(parseFloat(previous), parseFloat(current), operator);
});
clearBtn.addEventListener("click", clear);
deleteBtn.addEventListener("click",erase);  

// handles the right function calls based on if the pressed key was a number, operator or any other stuff

document.addEventListener("keydown", element =>{
    console.log("ELement: ", element.key, "dotButtonPressed: ", dotButtonPressed);
    let keyPresent = operatorKeyList.filter(item => item == element.key);
    if(element.key == "."){
        return assignValues(element);
    }
    if(element.key in valueKeyList) {
        return assignValues(element);
    }else if(keyPresent.length > 0){
        return assignOperator(element);
    }

    if(element.key == "Enter"){
        equalButtonPressed = true;
        operate(parseFloat(previous), parseFloat(current), operator);
    }
    if(element.key == "Backspace") erase();
});