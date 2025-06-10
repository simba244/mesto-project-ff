// Павел, привет, спасибо за ревью, надеюсь получилось исправить в лучшую сторону 🫡: 
// 1) Убрал лишние комменты 
// 2) Сделал три колбека в создании карточки 
// 3) Убрал дублирование кода
// 4) Поправил размещение по модулям

import './pages/index.css';
import logo from './images/logo.svg';
import { initialCards } from './scripts/cards.js';
import { createCard, deleteCard } from './scripts/card.js';
import { openModal, closeModal, setupModals, openImagePopup } from './scripts/modal.js';

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

setupModals();



