const expressionEl = document.getElementById("expression");
const currentEl    = document.getElementById("current");

let currentInput   = "";
let justCalculated = false;

function appendToDisplay(value) {
  if (justCalculated && isOperator(value)) {
    justCalculated = false;
    currentInput += value;
    updateDisplay();
    return;
  }

  if (justCalculated) {
    currentInput   = "";
    justCalculated = false;
  }

  if (value === ".") {
    const parts    = currentInput.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes(".")) return;
  }

  if (isOperator(value) && currentInput.length > 0) {
    const lastChar = currentInput[currentInput.length - 1];
    if (isOperator(lastChar)) {
      currentInput = currentInput.slice(0, -1);
    }
  }

  currentInput += value;
  updateDisplay();
}

function clearDisplay() {
  currentInput           = "";
  justCalculated         = false;
  expressionEl.innerHTML = "&nbsp;";
  currentEl.textContent  = "0";
}

function backspace() {
  if (justCalculated) {
    clearDisplay();
    return;
  }
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculatePercent() {
  if (currentInput === "") return;
  const num = parseFloat(currentInput);
  if (isNaN(num)) return;
  currentInput = String(num / 100);
  updateDisplay();
}

function calculate() {
  if (currentInput === "") return;

  try {
    const result = eval(currentInput);

    if (result === undefined || !isFinite(result)) {
      currentEl.textContent    = "Error";
      expressionEl.textContent = currentInput + " =";
      currentInput             = "";
      return;
    }

    const niceResult         = formatResult(result);
    expressionEl.textContent = currentInput + " =";
    currentInput             = String(niceResult);
    currentEl.textContent    = niceResult;
    justCalculated           = true;

  } catch (e) {
    currentEl.textContent    = "Error";
    expressionEl.textContent = currentInput;
    currentInput             = "";
  }
}

function formatResult(num) {
  return parseFloat(num.toFixed(10));
}

function isOperator(char) {
  return /[+\-*/]/.test(char);
}

function updateDisplay() {
  currentEl.textContent = currentInput === "" ? "0" : currentInput;
}

document.addEventListener("keydown", function(e) {
  if      (/[0-9]/.test(e.key))               appendToDisplay(e.key);
  else if (e.key === ".")                      appendToDisplay(".");
  else if (e.key === "+")                      appendToDisplay("+");
  else if (e.key === "-")                      appendToDisplay("-");
  else if (e.key === "*")                      appendToDisplay("*");
  else if (e.key === "/") { e.preventDefault(); appendToDisplay("/"); }
  else if (e.key === "Enter" || e.key === "=") calculate();
  else if (e.key === "Backspace")              backspace();
  else if (e.key === "Escape")                 clearDisplay();
  else if (e.key === "%")                      calculatePercent();
});


