import { likeCard, unlikeCard } from '../api.js';

function handleLike(likeButton, likeCountElement, cardData) {
  const liked = likeButton.classList.contains('card__like-button_is-active');
  const likeAction = liked ? unlikeCard : likeCard;

  likeAction(cardData._id)
    .then(updatedCard => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCountElement.textContent = updatedCard.likes.length;
      cardData.likes = updatedCard.likes;
    })
    .catch(err => {
      console.error('Ошибка при смене лайка:', err);
    });
}

export function createCard(cardData, userId, handleDeleteClick, openImagePopupCallback) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElement = cardElement.querySelector('.card__like-count'); 
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const titleElement = cardElement.querySelector('.card__title');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  titleElement.textContent = cardData.name;

  likeCountElement.textContent = cardData.likes.length;

  if (cardData.likes.some(user => user._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }
  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      handleDeleteClick(cardData._id, cardElement);
    });
  }

  likeButton.addEventListener('click', () => {
    handleLike(likeButton, likeCountElement, cardData);
  });

  cardImage.addEventListener('click', () => {
    openImagePopupCallback(cardData.link, cardData.name);
  });

  return cardElement;
}

export function deleteCard(cardElement) {
  cardElement.remove();
}