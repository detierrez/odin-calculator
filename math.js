export function round(number, digits) {
  let multiple = Math.pow(10, digits);
  return Math.round(number * multiple) / multiple;
}

export function operate(x, y, operator) {
  switch (operator) {
    case "+":
      return add(x, y);
    case "-":
      return substract(x, y);
    case "×":
      return multiply(x, y);
    case "÷":
      return divide(x, y);
    case "%":
      return percentage(x, y);
  }
}

function add(x, y) {
  return x + y;
}

function substract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  return x / y;
}

function percentage(x, y) {
  return (x * y) / 100;
}
