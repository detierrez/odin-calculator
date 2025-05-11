import {
  deleteRightSymbol,
  invertNumberBotSign,
  toggleLeadingMinus,
  clearDisplay,
  enterEqual,
  enterDot,
  enterOperator,
  enterDigit,
  updateDisplay,
} from "./calculator-cbs.js";

const btnBackspace = document.querySelector("button[data-backspace]");
const btnInvert = document.querySelector("button[data-invert]");
const btnClear = document.querySelector("button[data-clear]");
const btnEqual = document.querySelector("button[data-equal]");
const btnMinus = document.querySelector("button[data-minus]");
const btnDot = document.querySelector("button[data-dot]");
const operatorButtons = document.querySelectorAll("button[data-operator]");
const digitButtons = document.querySelectorAll("button[data-digit]");
const allButtons = document.querySelectorAll("button");

btnBackspace.addEventListener("click", deleteRightSymbol);
btnInvert.addEventListener("click", invertNumberBotSign);
btnMinus.addEventListener("click", toggleLeadingMinus);
btnClear.addEventListener("click", clearDisplay);
btnEqual.addEventListener("click", enterEqual);
btnDot.addEventListener("click", enterDot);
digitButtons.forEach((btn) => {
  btn.addEventListener("click", enterDigit);
});
operatorButtons.forEach((btn) => {
  btn.addEventListener("click", enterOperator);
});
allButtons.forEach((btn) => {
  btn.addEventListener("click", updateDisplay);
});

updateDisplay();
