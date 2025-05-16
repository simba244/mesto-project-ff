// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

function createCard(cardValue, deleteValue) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  cardImage.src = cardValue.link;
  cardElement.querySelector('.card__title').textContent = cardValue.name;

  cardElement.querySelector('.card__delete-button').addEventListener('click', (evt) => {
    deleteValue(cardElement);
  });
  
  return cardElement;
}

// для удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// для отображения карточек
function renderCards() {
  const placesList = document.querySelector('.places__list');
  
  initialCards.forEach(cardData => {
    const card = createCard(cardData, deleteCard);
    placesList.append(card);
  });
}

document.addEventListener('DOMContentLoaded', renderCards);

