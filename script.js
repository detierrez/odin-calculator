import { round, operate } from "./math.js";

const divMainDisplay = document.querySelector("#primary-display");
const divMinorDisplay = document.querySelector("#secondary-display");
const btnEqual = document.querySelector("button[data-type=equal]");
const btnClear = document.querySelector("button[data-type=clear]");
const btnBackspace = document.querySelector("button[data-type=backspace]");
const digitButtons = document.querySelectorAll("button[data-type=digit]");
const operatorButtons = document.querySelectorAll("button[data-type=operator]");

btnEqual.addEventListener("click", calculate);
btnClear.addEventListener("click", clearScreen);
btnBackspace.addEventListener("click", eraseDigit);
digitButtons.forEach((btn) => {
  btn.addEventListener("click", enterDigit);
});
operatorButtons.forEach((btn) => {
  btn.addEventListener("click", calculate);
});

function calculate(event) {
  updateArguments(event)

  if (nextOperator === "=" && (mainContent === "" || minorContent === ""))
    return;
  if (mainContent === "" && minorContent === "") {
    return;
  }
  if (isNaN(+mainContent) || mainContent === "Infinity") {
    return;
  }
  if (mainContent === "") {
    divMinorDisplay.textContent = minorContent.slice(0, -1) + operator;
    return;
  }
  if (minorContent === "") {
    firstNumber = +mainContent;
    divMinorDisplay.textContent = `${firstNumber} ${nextOperator}`;
    divMainDisplay.textContent = "";
    return;
  }

 updateResult();
 displayResult();
}

function updateArguments(event) {
  mainContent = divMainDisplay.textContent;
  minorContent = divMinorDisplay.textContent;
  nextOperator = event.target.textContent;
  [firstNumber, operator] = minorContent.split(" ");
  firstNumber = +firstNumber;
  secondNumber = +mainContent;
}

function updateResult() {
  result = trim(operate(firstNumber, secondNumber, operator));
}

function displayResult() {
  if (nextOperator === "=") {
    divMainDisplay.textContent = result;
    divMinorDisplay.textContent = "";
  } else {
    divMainDisplay.textContent = "";
    divMinorDisplay.textContent = `${result} ${nextOperator}`;
  }
}

function trim(result) {
  let integerDigits = Math.round(result).toString().length;
  if (integerDigits > 10) {
    return Infinity;
  } else {
    let digits = Math.max(0, 9 - integerDigits);
    return round(result, digits);
  }
}

function clearScreen() {
  divMainDisplay.textContent = "";
  divMinorDisplay.textContent = "";
}

function eraseDigit() {
  const mainContent = divMainDisplay.textContent;
  if (isNaN(+mainContent) || mainContent === "Infinity") {
    divMainDisplay.textContent = "";
    return;
  }
  divMainDisplay.textContent = mainContent.slice(0, -1);
}

function enterDigit(event) {
  const digit = event.target.textContent;
  const mainContent = divMainDisplay.textContent;
  if (mainContent.length < 10) {
    divMainDisplay.textContent = mainContent + digit;
  }
}

let mainContent;
let minorContent;
let nextOperator;
let firstNumber;
let secondNumber;
let operator;
let result;

// let result = operate(10, 3, "÷");
// console.log(result)
// result = round(10/3, -6);
// console.log(result)
