function handleLike(likeButton, cardData) {
  likeButton.classList.toggle('card__like-button_is-active');
}

export function createCard(cardValue, deleteValueCallback, openImagePopupCallback) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardValue.link;
  cardImage.alt = cardValue.name;
  cardElement.querySelector('.card__title').textContent = cardValue.name;

  cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
    deleteValueCallback(cardElement);
  });

  likeButton.addEventListener('click', () => {
    handleLike(likeButton, cardValue);
  });

  cardImage.addEventListener('click', () => {
    openImagePopupCallback(cardValue.link, cardValue.name);
  });

  return cardElement;
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

