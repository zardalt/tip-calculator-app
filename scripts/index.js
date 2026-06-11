import { isCloser, debounce, round } from "./utility.js";

const h1 = document.querySelector('h1'),
      main = document.querySelector('main'),
      form = document.querySelector('form'),
      numericInputs = document.querySelectorAll('input[inputmode=numeric]'),
      customPercentage = numericInputs.item(1),
      radioInputs = document.querySelectorAll('input[type=radio]'),
      noOfPpl = document.getElementById('noOfPeople'),
      inputs = document.querySelectorAll('input'),
      resetBtn = form.querySelector('button[type=reset]'),
      errorSpans = form.querySelectorAll('span.error'),
      tipAmount = form.querySelector('.js-tip-amount'),
      totalBill = form.querySelector('.js-total');

let checkedInput = null;  
  
function handleResize() {
  if (window.innerWidth < 1000) {
    document.body.classList.remove('center');
    return;
  }

  const total = parseFloat(window.getComputedStyle(h1).getPropertyValue('height')) + parseFloat(window.getComputedStyle(main).getPropertyValue('height'));

  if (window.innerHeight - total >= 145) {
    document.body.classList.add('center');
  }  else document.body.classList.remove('center');
}

// Form Submission //

function handleFormSubmit(e) {
  const formData = Object.fromEntries(new FormData(this.target));

  if (Object.values(formData).some(val => val.length > 0)) resetBtn.disabled = false;
  else resetBtn.disabled = true;

  const tipPercentage = formData.customPercentage || formData.tipPercentage

  if (formData.billAmount && tipPercentage && formData.noOfPeople) {
    errorSpans.forEach(span => {
      if (span.textContent) {
        span.textContent = ''
        span.parentElement?.nextElementSibling?.setCustomValidity('');
      }
    });
    
    calculateTip(formData);
  }
}

function calculateTip({billAmount, tipPercentage, customPercentage, noOfPeople}) {
  const _tipAmount = (billAmount * ((tipPercentage | customPercentage)/100)) / Number(noOfPeople),
        total = Number(billAmount) + _tipAmount;

  tipAmount.textContent = round(_tipAmount)
  totalBill.textContent = round(total);
}

const debounceFormSubmission = debounce(1000, handleFormSubmit, e => e.preventDefault());

// Validate input //

const BLACKLIST = new Set(['.']);

function handleNumericInput(e) {
  if (BLACKLIST.has(e.target.value)) e.target.value = '';
}

function handleNumericKeydown(e) {
  const {allowDecimal, rangeStart, rangeEnd} = e.target.dataset;

  // allow only numbers and period if decimals are allowed

  if ((allowDecimal ? /[^0-9.]/.test(e.key) : /[^0-9]/.test(e.key)) && e.key.length===1) {
    e.preventDefault();
    return;
  }

  // allow only one period

  if (e.key === '.') {
    if (e.target.value.includes('.')) {
      e.preventDefault();
      return;
    }
  }

  // Ensure input is in between range

  if (/[0-9]/.test(e.key)) {
    const numericInput = Number(e.target.value+e.key);

    if (Math.max(Math.min(rangeEnd, numericInput), rangeStart) !== numericInput) {
      e.preventDefault();
      errorSpans.forEach(span => {
        if (span.parentElement.getAttribute('for') === e.target.id) {
          span.textContent = `Can't exceed range of ${rangeStart} to ${rangeEnd}`;
          e.target.setCustomValidity('.');
        }
      })
      return;
    }
  }

  form.requestSubmit();
}

function handleCustomPercentage(e) {
  if (e.target.value && checkedInput) {
    checkedInput.checked = false;
  }
}

function handleRadioInputs(e) {
  customPercentage.value = '';
  checkedInput = e.target;
  form.requestSubmit();
}

function handleReset() {
  tipAmount.textContent = '0.00';
  totalBill.textContent = '0.00';
  errorSpans.forEach(span => span.textContent = '');
}

window.addEventListener('resize', handleResize);
form.addEventListener('submit', debounceFormSubmission);
numericInputs.forEach(input => {
  input.addEventListener('input', handleNumericInput)
  input.addEventListener('keydown', handleNumericKeydown)
});
customPercentage.addEventListener('input', handleCustomPercentage);
radioInputs.forEach(input => input.addEventListener('input', handleRadioInputs));
resetBtn.addEventListener('click', handleReset);
handleResize();