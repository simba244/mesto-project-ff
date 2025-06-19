// Function to display an error message for an input
function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = inputElement.nextElementSibling; // Assuming error span is the immediate sibling
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

// Function to hide an error message for an input
function hideInputError(formElement, inputElement, config) {
  const errorElement = inputElement.nextElementSibling; // Assuming error span is the immediate sibling
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
}

// Updated function to check the validity of a single input element
function checkInputValidity(formElement, inputElement, config) {
  const errorElement = inputElement.nextElementSibling;
  const customRegexErrorMessage = inputElement.dataset.errorMessage || 'Недопустимые символы';
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
  const isUrl = inputElement.type === 'url';

  // Проверка на пустое значение
  if (inputElement.validity.valueMissing) {
    showInputError(formElement, inputElement, 'Это обязательное поле', config);
    return false;
  }

  // Проверка длины (если задана)
  const minLength = inputElement.minLength;
  const maxLength = inputElement.maxLength;

  if ((minLength > 0 || maxLength > 0) &&
    (inputElement.value.length < minLength || inputElement.value.length > maxLength)) {
    showInputError(
      formElement,
      inputElement,
      `Должно быть от ${minLength} до ${maxLength} символов`,
      config
    );
    return false;
  }

  // Проверка регулярного выражения
  if ((inputElement.name === 'name' || inputElement.name === 'about' || inputElement.name === 'place') &&
      !nameRegex.test(inputElement.value)) {
    showInputError(formElement, inputElement, customRegexErrorMessage, config);
    return false;
  }

  // Проверка URL, если указано
  if (isUrl && inputElement.validity.typeMismatch) {
    showInputError(formElement, inputElement, 'Введите корректный URL', config);
    return false;
  }

  // Если поле валидно
  hideInputError(formElement, inputElement, config);
  return true;
}

// Function to toggle the state of the submit button
function toggleButtonState(inputList, buttonElement, config) {
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

  const hasInvalidInput = inputList.some((inputElement) =>
    !inputElement.validity.valid ||
    ((inputElement.name === 'name' || inputElement.name === 'about' || inputElement.name === 'place') &&
      !nameRegex.test(inputElement.value))
  );

  if (hasInvalidInput) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

// Sets up event listeners for a single form
function setEventListeners(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  // Initial state of the button
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

// Enables validation for all forms on the page
export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault(); // Prevent default submission
    });
    setEventListeners(formElement, config);
  });
}

// Clears validation errors and disables the button for a specific form
export function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
}
