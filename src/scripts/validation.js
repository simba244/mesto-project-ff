// Показывает сообщение об ошибке рядом с полем
function showInputError(form, input, message, config) {
  const errorSpan = input.nextElementSibling;
  input.classList.add(config.inputErrorClass);
  errorSpan.textContent = message;
  errorSpan.classList.add(config.errorClass);
}

// Скрывает сообщение об ошибке
function hideInputError(form, input, config) {
  const errorSpan = input.nextElementSibling;
  input.classList.remove(config.inputErrorClass);
  errorSpan.classList.remove(config.errorClass);
  errorSpan.textContent = '';
}

// Проверяет, соответствует ли значение заданной регулярке (если поле текстовое)
function isTextFieldValid(input, regex) {
  const textFields = ['name', 'about', 'place'];
  return !textFields.includes(input.name) || regex.test(input.value);
}

// Проверяет валидность поля и показывает/скрывает ошибку
function validateInput(form, input, config) {
  const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
  const customError = input.dataset.errorMessage || 'Недопустимые символы';

  if (input.validity.valueMissing) {
    showInputError(form, input, 'Это обязательное поле', config);
    return false;
  }

  if (input.minLength > 0 || input.maxLength > 0) {
    const length = input.value.length;
    if (length < input.minLength || length > input.maxLength) {
      showInputError(
        form,
        input,
        `Должно быть от ${input.minLength} до ${input.maxLength} символов`,
        config
      );
      return false;
    }
  }

  if (!isTextFieldValid(input, regex)) {
    showInputError(form, input, customError, config);
    return false;
  }

  if (input.type === 'url' && input.validity.typeMismatch) {
    showInputError(form, input, 'Введите корректный URL', config);
    return false;
  }

  hideInputError(form, input, config);
  return true;
}

// Переключает активность кнопки отправки формы
function toggleSubmitButton(inputs, button, config) {
  const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

  const hasInvalid = inputs.some(input =>
    !input.validity.valid || !isTextFieldValid(input, regex)
  );

  button.disabled = hasInvalid;
  button.classList.toggle(config.inactiveButtonClass, hasInvalid);
}

// Устанавливает обработчики событий на поля формы
function setFormEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  toggleSubmitButton(inputs, submitButton, config);

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      validateInput(form, input, config);
      toggleSubmitButton(inputs, submitButton, config);
    });
  });
}

// Включает валидацию для всех форм на странице
export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach(form => {
    form.addEventListener('submit', evt => evt.preventDefault());
    setFormEventListeners(form, config);
  });
}

// Сбрасывает валидацию и деактивирует кнопку для конкретной формы
export function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach(input => hideInputError(form, input, config));
  toggleSubmitButton(inputs, submitButton, config);
}
