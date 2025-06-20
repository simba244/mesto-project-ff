import './pages/index.css';
import logo from './images/logo.svg';
import { createCard, deleteCard } from './scripts/card.js';
import { openModal, closeModal, handleOverlayClick } from './scripts/modal.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserProfile,
  addCard
} from './api.js';

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

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Загрузка пользователя и карточек
document.addEventListener('DOMContentLoaded', () => {
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      renderCards(cards.reverse()); // свежие карточки — первыми
    })
    .catch(err => console.error('Ошибка при загрузке данных:', err));

  enableValidation(validationConfig);
  setupModals();
});

function renderCards(cards) {
  cards.forEach(cardData => {
    const card = createCard(cardData, deleteCard, openImagePopup);
    cardContainer.append(card);
  });
}

// Открытие формы редактирования профиля
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  aboutInput.value = profileDescription.textContent;
  clearValidation(editForm, validationConfig);
  openModal(editModal);
});

// Сохранение профиля
editForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const name = nameInput.value;
  const about = aboutInput.value;

  updateUserProfile(name, about)
    .then(updated => {
      profileTitle.textContent = updated.name;
      profileDescription.textContent = updated.about;
      closeModal(editModal);
    })
    .catch(err => console.error('Ошибка обновления профиля:', err));
});

// Открытие формы новой карточки
addButton.addEventListener('click', () => {
  addForm.reset();
  clearValidation(addForm, validationConfig);
  openModal(addModal);
});

// Добавление карточки
addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const name = placeInput.value;
  const link = linkInput.value;

  addCard(name, link)
    .then(cardData => {
      const newCard = createCard(cardData, deleteCard, openImagePopup);
      cardContainer.prepend(newCard);
      closeModal(addModal);
    })
    .catch(err => console.error('Ошибка добавления карточки:', err));
});

// Настройка модалок
function setupModals() {
  document.querySelectorAll('.popup__close').forEach(button => {
    const modal = button.closest('.popup');
    button.addEventListener('click', () => closeModal(modal));
  });

  document.querySelectorAll('.popup').forEach(modal => {
    modal.addEventListener('click', handleOverlayClick);
  });
}

// Открытие попапа с изображением
function openImagePopup(link, name) {
  const imagePopup = document.querySelector('.popup_type_image');
  const imagePopupImage = imagePopup.querySelector('.popup__image');
  const imagePopupCaption = imagePopup.querySelector('.popup__caption');

  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;

  openModal(imagePopup);
}
