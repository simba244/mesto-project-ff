import './pages/index.css';
import logo from './images/logo.svg';
import { initialCards } from './scripts/cards.js';
// Логотип
document.querySelector('.header__logo').src = logo;

const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const editForm = editPopup.querySelector('form[name="editProfile"]');
const nameInput = editForm.querySelector('[name="name"]');
const aboutInput = editForm.querySelector('[name="about"]');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const addForm = addPopup.querySelector('form[name="newCard"]');
const placeInput = addForm.querySelector('[name="place"]');
const linkInput = addForm.querySelector('[name="link"]');

const cardContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

// Работа с модалками (попапами)
function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscape);
}

function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscape);
}

function handleEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) closePopup(openedPopup);
  }
}

function setPopupEventListeners(popup) {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup || evt.target.classList.contains('popup__close')) {
      closePopup(popup);
    }
  });
}

[editPopup, addPopup, imagePopup].forEach(setPopupEventListeners);

// 

// Открытие редактирования профиля
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  aboutInput.value = profileDescription.textContent;
  openPopup(editPopup);
});

// Обработка формы редактирования профиля
editForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = aboutInput.value;
  closePopup(editPopup);
});

// Открытие добавления карточки
addButton.addEventListener('click', () => {
  addForm.reset(); // очистка формы перед открытием
  openPopup(addPopup);
});

// Обработка добавления карточки
addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCard = createCard({ name: placeInput.value, link: linkInput.value });
  cardContainer.prepend(newCard);
  closePopup(addPopup);
});

// Работа с карточками 
function createCard({ name, link }) {
  const template = document.querySelector('#card-template').content;
  const cardElement = template.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  // Удаление карточки
  deleteButton.addEventListener('click', () => cardElement.remove());

  // Лайк карточки
  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('card__like-button_is-active');
  });

  // Открытие попапа с изображением
  cardImage.addEventListener('click', () => {
    const imagePopupImage = imagePopup.querySelector('.popup__image');
    const imagePopupCaption = imagePopup.querySelector('.popup__caption');
    imagePopupImage.src = link;
    imagePopupImage.alt = name;
    imagePopupCaption.textContent = name;
    openPopup(imagePopup);
  });

  return cardElement;
}

// Рендер начальных карточек 
initialCards.forEach(cardData => {
  const cardElement = createCard(cardData);
  cardContainer.append(cardElement);
});
