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
  btn.addEventListener("click", getDigitCb("mouse"));
});
operatorButtons.forEach((btn) => {
  btn.addEventListener("click", getOperatorCb("mouse"));
});
allButtons.forEach((btn) => {
  btn.addEventListener("click", updateDisplay);
});

const clearKeys = ["c", "C"];
const digitKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const operatorKeys = ["/", "*", "-", "+", "%"];

document.addEventListener("keydown", (event) => {
  const keyName = event.key;
  if (keyName === ".") enterDot();
  if (keyName === "Enter") enterEqual();
  if (keyName === "-") toggleLeadingMinus();
  if (keyName === "Backspace") deleteRightSymbol();
  if (clearKeys.includes(keyName)) clearDisplay();
  if (digitKeys.includes(keyName)) getDigitCb("keyboard")(event);
  if (operatorKeys.includes(keyName)) getOperatorCb("keyboard")(event);

  updateDisplay();
});

updateDisplay();

function getDigitCb(eventSource) {
  let digit;
  if (eventSource === "mouse") {
    return function (event) {
      digit = event.target.textContent;
      enterDigit(digit);
    };
  } else if (eventSource === "keyboard") {
    return function (event) {
      digit = event.key;
      enterDigit(digit);
    };
  }
}

function getOperatorCb(eventSource) {
  if (eventSource === "mouse") {
    return function (event) {
      let operator = event.target.getAttribute("data-operator");
      enterOperator(operator);
    };
  } else if (eventSource === "keyboard") {
    return function (event) {
      let operator = event.key;
      enterOperator(operator);
    };
  }
}
