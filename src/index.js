// Павел,привет.Cпасибо.Исправляюсь...
// В modal.js код на 1-22 оставил. Экспортнул handleOverlayClick. Код на 24-45 пернес сюда в index.js
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

function renderCards() {
  initialCards.forEach(cardData => {
    const card = createCard(cardData, deleteCard, openImagePopup);
    cardContainer.append(card);
  });
}

document.addEventListener('DOMContentLoaded', renderCards);

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

addButton.addEventListener('click', () => {
  addForm.reset();
  openModal(addModal);
});

addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const cardData = { name: placeInput.value, link: linkInput.value };
  const newCard = createCard(cardData, deleteCard, openImagePopup);
  cardContainer.prepend(newCard);
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
