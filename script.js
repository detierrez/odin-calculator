import { round, operate } from "./math.js";

const divMainDisplay = document.querySelector("#primary-display");
const divMinorDisplay = document.querySelector("#secondary-display");
const btnEqual = document.querySelector("button[data-type=equal]");
const btnClear = document.querySelector("button[data-type=clear]");
const btnBackspace = document.querySelector("button[data-type=backspace]");
const digitButtons = document.querySelectorAll("button[data-type=digit]");
const operatorButtons = document.querySelectorAll("button[data-type=operator]");
const allButtons = document.querySelectorAll("button");

const MAX_DIGITS = 10;

btnClear.addEventListener("click", clearDisplay);
btnBackspace.addEventListener("click", eraseDigit);
btnEqual.addEventListener("click", enterEqual);
digitButtons.forEach((btn) => {
  btn.addEventListener("click", enterDigit);
});
operatorButtons.forEach((btn) => {
  btn.addEventListener("click", enterOperator);
});
allButtons.forEach((btn) => {
  btn.addEventListener("click", updateDisplay);
});

function clearDisplay() {
  numberTop = null;
  numberBot = null;
}

function enterDigit(event) {
  let strDigit = event.target.textContent;
  if (numberBot === null) {
    numberBot = +strDigit;
    return;
  }
  let strNumber = numberBot.toString();
  if (strNumber.length < MAX_DIGITS) {
    numberBot = +(strNumber + strDigit);
  }
}

function eraseDigit() {
  if (numberBot === null) return;
  let strNumber = numberBot.toString();
  let isOneDigit = strNumber.length <= 1;
  numberBot = isOneDigit ? null : +strNumber.slice(0, -1);
}

function enterEqual() {
  if (numberTop === null) return;
  if (numberBot === null) {
    numberBot = numberTop;
    numberTop = null;
  } else {
    numberBot = operate(numberTop, numberBot, operator);
    numberTop = null;
  }
}

function enterOperator(event) {
  let pressedOperator = event.target.textContent;
  if (numberTop === null || numberBot === null) {
    operator = pressedOperator;
    if (numberBot !== null) {
      numberTop = numberBot;
      numberBot = null;
    }
    return;
  }
  numberTop = operate(numberTop, numberBot, operator);
  numberBot = null;
  operator = pressedOperator;
}

function updateDisplay() {
  console.log({ number1: numberTop, number2: numberBot, operator });
  divMinorDisplay.textContent =
    numberTop !== null ? `${numberTop} ${operator}` : "";
  divMainDisplay.textContent = numberBot !== null ? `${numberBot}` : "";
}

let numberTop = 2;
let numberBot = 0;
let operator = "+";

updateDisplay();
