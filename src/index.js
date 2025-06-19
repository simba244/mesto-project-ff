//index.js
import './pages/index.css';
import logo from './images/logo.svg';
import { initialCards } from './scripts/cards.js';
import { createCard, deleteCard } from './scripts/card.js';
import { openModal, closeModal, handleOverlayClick } from './scripts/modal.js';

document.querySelector('.header__logo').src = logo;

const editModal = document.querySelector('.popup_type_edit');
const addModal = document.querySelector('.popup_type_new-card');

const editForm = editModal.querySelector('form[name="editProfile"]');
const nameInput = editForm.querySelector('[name="name"]');
const aboutInput = editForm.querySelector('[name="about"]');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const addForm = addModal.querySelector('form[name="newCard"]');
const placeInput = addForm.querySelector('[name="place"]');
const linkInput = addForm.querySelector('[name="link"]');

const cardContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

// Функции валидации
function enableValidation() {
  // Валидация формы редактирования профиля
  const editSubmitButton = editForm.querySelector('.popup__button');
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

  editButton.addEventListener('click', () => {
    clearValidationErrors(editForm);
  });

  nameInput.addEventListener('input', () => {
    validateInput(nameInput, {
      minLength: 2,
      maxLength: 40,
      regex: nameRegex,
      customError: 'Разрешены только буквы, дефисы и пробелы'
    });
    toggleSubmitButton(editForm, editSubmitButton);
  });

  aboutInput.addEventListener('input', () => {
    validateInput(aboutInput, {
      minLength: 2,
      maxLength: 200,
      regex: nameRegex,
      customError: 'Разрешены только буквы, дефисы и пробелы'
    });
    toggleSubmitButton(editForm, editSubmitButton);
  });

  // Валидация формы добавления карточки
  const addSubmitButton = addForm.querySelector('.popup__button');
  const placeNameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
  const urlRegex = /^https?:\/\/.+\.\w{2,}\/?.*$/i;

  addButton.addEventListener('click', () => {
    addForm.reset();
    clearValidationErrors(addForm);
    toggleSubmitButton(addForm, addSubmitButton);
    openModal(addModal);
  });

  placeInput.addEventListener('input', () => {
    validateInput(placeInput, {
      minLength: 2,
      maxLength: 30,
      regex: placeNameRegex,
      customError: 'Разрешены только буквы, дефисы и пробелы'
    });
    toggleSubmitButton(addForm, addSubmitButton);
  });

  linkInput.addEventListener('input', () => {
    validateInput(linkInput, {
      isUrl: true,
      customError: 'Введите корректный URL'
    });
    toggleSubmitButton(addForm, addSubmitButton);
  });

  // Инициализация состояния кнопок
  toggleSubmitButton(editForm, editSubmitButton);
  toggleSubmitButton(addForm, addSubmitButton);
}

function validateInput(input, { minLength, maxLength, regex, isUrl, customError }) {
  const errorElement = input.nextElementSibling;
  
  if (input.validity.valueMissing) {
    errorElement.textContent = 'Это обязательное поле';
    return false;
  }
  
  if (minLength && (input.value.length < minLength || input.value.length > maxLength)) {
    errorElement.textContent = `Должно быть от ${minLength} до ${maxLength} символов`;
    return false;
  }
  
  if (regex && !regex.test(input.value)) {
    errorElement.textContent = customError;
    return false;
  }
  
  if (isUrl && !input.validity.typeMismatch) {
    // Дополнительная проверка URL, если стандартной проверки недостаточно
    const urlRegex = /^https?:\/\/.+\.\w{2,}\/?.*$/i;
    if (!urlRegex.test(input.value)) {
      errorElement.textContent = customError || 'Введите корректный URL';
      return false;
    }
  }
  
  if (!input.validity.valid) {
    errorElement.textContent = input.validationMessage;
    return false;
  }
  
  errorElement.textContent = '';
  return true;
}

function toggleSubmitButton(form, button) {
  const inputs = Array.from(form.querySelectorAll('input'));
  const isValid = inputs.every(input => input.validity.valid);
  
  button.disabled = !isValid;
  button.classList.toggle('popup__button_disabled', !isValid);
  button.classList.toggle('popup__button_error', !isValid);
}

function clearValidationErrors(form) {
  const errors = form.querySelectorAll('.popup__error');
  errors.forEach(error => {
    error.textContent = '';
  });
  const button = form.querySelector('.popup__button');
  button.classList.remove('popup__button_error');
}

// Остальной код
function renderCards() {
  initialCards.forEach(cardData => {
    const card = createCard(cardData, deleteCard, openImagePopup);
    cardContainer.append(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  enableValidation();
});

editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  aboutInput.value = profileDescription.textContent;
  openModal(editModal);
});

editForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = aboutInput.value;
  closeModal(editModal);
});

addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const cardData = { name: placeInput.value, link: linkInput.value };
  const newCard = createCard(cardData, deleteCard, openImagePopup);
  cardContainer.prepend(newCard);
  addForm.reset();
  closeModal(addModal);
});

function setupModals() {
  document.querySelectorAll('.popup__close').forEach(button => {
    const modal = button.closest('.popup');
    button.addEventListener('click', () => closeModal(modal));
  });

  document.querySelectorAll('.popup').forEach(modal => {
    modal.addEventListener('click', handleOverlayClick);
  });
}

function openImagePopup(link, name) {
  const imagePopup = document.querySelector('.popup_type_image');
  const imagePopupImage = imagePopup.querySelector('.popup__image');
  const imagePopupCaption = imagePopup.querySelector('.popup__caption');

  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;

  openModal(imagePopup);
}

setupModals();