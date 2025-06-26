// validation.js
export { enableValidation, clearValidation };
const hasInvalidInput = (inputList) => {
  return inputList.some(inputElement => !inputElement.validity.valid);
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add('popup__button_disabled');
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove('popup__button_disabled');
  }
};

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = inputElement.nextElementSibling;
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__error_visible');
  inputElement.classList.add('popup__input_type_error');
};

const isValid = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    const customMessage = inputElement.dataset.errorMessage;
    const errorMessage = customMessage ? customMessage : inputElement.validationMessage;
    showInputError(formElement, inputElement, errorMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};
const hideInputError = (formElement, inputElement) => {
  const errorElement = inputElement.nextElementSibling;
  errorElement.textContent = '';
  errorElement.classList.remove('popup__error_visible');
  inputElement.classList.remove('popup__input_type_error');
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

function enableValidation() {
  const formList = Array.from(document.querySelectorAll('.popup__form'));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement);
  });
}

function clearValidation(formElement) {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  inputList.forEach(inputElement => {
    hideInputError(formElement, inputElement);
  });
  const buttonElement = formElement.querySelector('.popup__button');
  toggleButtonState(inputList, buttonElement);
}


