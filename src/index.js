// Привет,Владислав, спасибо за ревью =)
// Обновил порядок карточек, валидацию, анимацию, убрал лишние части кода по твоим замечаниям.

import './pages/index.css';
import logo from './images/logo.svg';
import { openModal, closeModal, handleOverlayClick } from './scripts/modal.js';
import { createCard, deleteCard } from './scripts/card.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserProfile,
  addCard,
  deleteCard as apiDeleteCard,
  updateAvatar
} from './api.js';


const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

document.querySelector('.header__logo').src = logo;

const editModal = document.querySelector('.popup_type_edit');
const addModal = document.querySelector('.popup_type_new-card');
const confirmModal = document.querySelector('.popup_type_confirm');
const avatarModal = document.querySelector('.popup_type_avatar-image');

const editForm = editModal.querySelector('form[name="editProfile"]');
const nameInput = editForm.querySelector('[name="name"]');
const aboutInput = editForm.querySelector('[name="about"]');

const addForm = addModal.querySelector('form[name="newCard"]');
const placeInput = addForm.querySelector('[name="place"]');
const linkInput = addForm.querySelector('[name="link"]');

const confirmForm = confirmModal?.querySelector('form');
const avatarForm = avatarModal.querySelector('form[name="editProfileImage"]');
const avatarInput = avatarForm.querySelector('input[name="link"]');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const cardContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

const imagePopup = document.querySelector('.popup_type_image');
const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

let idCardForDelete = null;
let cardElementForDelete = null;
let currentUserId = null;


Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
    renderCards(cards, currentUserId);
  })
  .catch(err => console.error('Ошибка при загрузке данных:', err));
  enableValidation(validationConfig);
  setupModals();


function renderCards(cards, userId) {
  cards.forEach(cardData => {
    const card = createCard(cardData, userId, handleDeleteClick, openImagePopup);
    cardContainer.append(card);
  });
}

editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  aboutInput.value = profileDescription.textContent;
  clearValidation(editForm, validationConfig);
  openModal(editModal);
});

editForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = 'Сохранение...';

  const name = nameInput.value;
  const about = aboutInput.value;

  updateUserProfile(name, about)
    .then(updated => {
      profileTitle.textContent = updated.name;
      profileDescription.textContent = updated.about;
      closeModal(editModal);
    })
    .catch(err => console.error('Ошибка обновления профиля:', err))
    .finally(() => {
      submitButton.textContent = 'Сохранить';
    });
});

addButton.addEventListener('click', () => {
  addForm.reset();
  clearValidation(addForm, validationConfig);
  openModal(addModal);
});

addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = 'Создание...';

  const name = placeInput.value;
  const link = linkInput.value;

  addCard(name, link)
    .then(cardData => {
      getUserInfo().then(userData => {
        const newCard = createCard(cardData, currentUserId, handleDeleteClick, openImagePopup);
        cardContainer.prepend(newCard);
        closeModal(addModal);
      });
    })
    .catch(err => console.error('Ошибка добавления карточки:', err))
    .finally(() => {
      submitButton.textContent = 'Создать';
    });
});

profileImage.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarModal);
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = 'Сохранение...';

  const link = avatarInput.value;

  updateAvatar(link)
    .then(userData => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(err => console.error('Ошибка обновления аватара:', err))
    .finally(() => {
      submitButton.textContent = 'Сохранить';
    });
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

function handleDeleteClick(cardId, cardElement) {
  idCardForDelete = cardId;
  cardElementForDelete = cardElement;
  openModal(confirmModal);
}

if (confirmForm) {
  confirmForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!idCardForDelete || !cardElementForDelete) return;

    apiDeleteCard(idCardForDelete)
      .then(() => {
        deleteCard(cardElementForDelete);
        closeModal(confirmModal);
      })
      .catch(err => console.error('Ошибка при удалении карточки:', err));
  });
}

function openImagePopup(link, name) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}
