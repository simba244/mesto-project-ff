import './pages/index.css';
import logo from './images/logo.svg';
import { createCard } from './scripts/card.js';
import { openModal, closeModal, handleOverlayClick } from './scripts/modal.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserProfile,
  addCard,
  deleteCard as apiDeleteCard
} from './api.js';

document.querySelector('.header__logo').src = logo;

const editModal = document.querySelector('.popup_type_edit');
const addModal = document.querySelector('.popup_type_new-card');
const confirmModal = document.querySelector('.popup_type_confirm');

const editForm = editModal.querySelector('form[name="editProfile"]');
const nameInput = editForm.querySelector('[name="name"]');
const aboutInput = editForm.querySelector('[name="about"]');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const addForm = addModal.querySelector('form[name="newCard"]');
const placeInput = addForm.querySelector('[name="place"]');
const linkInput = addForm.querySelector('[name="link"]');

const confirmForm = confirmModal?.querySelector('form'); // может отсутствовать

const cardContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Переменные для удаления карточки
let idCardForDelete = null;
let cardElementForDelete = null;

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileImage.style.backgroundImage = `url(${userData.avatar})`;

      renderCards(cards.reverse(), userData._id);
    })
    .catch(err => console.error('Ошибка при загрузке данных:', err));

  enableValidation(validationConfig);
  setupModals();
});

function renderCards(cards, userId) {
  cards.forEach(cardData => {
    const card = createCard(
      cardData,
      userId,
      handleDeleteClick,
      openImagePopup
    );
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

addButton.addEventListener('click', () => {
  addForm.reset();
  clearValidation(addForm, validationConfig);
  openModal(addModal);
});

addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const name = placeInput.value;
  const link = linkInput.value;
  addCard(name, link)
    .then(cardData => {
      getUserInfo().then(userData => {
        const newCard = createCard(
          cardData,
          userData._id,
          handleDeleteClick,
          openImagePopup
        );
        cardContainer.prepend(newCard);
        closeModal(addModal);
      });
    })
    .catch(err => console.error('Ошибка добавления карточки:', err));
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
        cardElementForDelete.remove();
        closeModal(confirmModal);
      })
      .catch(err => console.error('Ошибка при удалении карточки:', err));
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
