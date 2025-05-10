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

function enterOperator(event) {
  let pressedOperator = event.target.textContent;
  if (numberTop !== null && numberBot !== null) {
    numberTop = operate(numberTop, numberBot, operator);
    numberBot = null;
    operator = pressedOperator;
    return;
  } else {
    operator = pressedOperator;
    if (numberBot !== null) {
      numberTop = numberBot;
      numberBot = null;
    }
  }
}

function enterOperator_(event) {
  let pressedOperator = event.target.textContent;
  let state = ((numberBot !== null) << 1) + (numberTop !== null);
  switch (state) {
    case 0: // there's no number
    case 1: // there's only numberTop
      operator = pressedOperator;
      break;
    case 2: // there's only numberBot
      numberTop = numberBot;
      numberBot = null;
      operator = pressedOperator;
      break;
    case 3: // there's both numbers
      numberTop = operate(numberTop, numberBot, operator);
      numberBot = null;
      operator = pressedOperator;
      break;
  }
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

function enterEqual_() {
  let state = ((numberBot !== null) << 1) + (numberTop !== null);
  switch (state) {
    case 0: // there's no number
    case 2: // there's only numberBot
      break;
    case 1: // there's only numberTop
      numberBot = numberTop;
      numberTop = null;
      break;
    case 3: // there's both numbers
      numberBot = operate(numberTop, numberBot, operator);
      numberTop = null;
      break;
  }
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

function updateDisplay() {
  console.log({ number1: numberTop, number2: numberBot, operator });
  divMinorDisplay.textContent =
    numberTop !== null ? `${numberTop} ${operator}` : "";
  divMainDisplay.textContent = numberBot !== null ? `${numberBot}` : "";
}

let numberTop = 2;
let numberBot = 123;
let operator = "+";

updateDisplay();