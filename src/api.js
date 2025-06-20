// Конфигурация API
const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-41',
  headers: {
    authorization: 'f71800eb-ee29-470d-bc11-cc4dc7adfb93',
    'Content-Type': 'application/json'
  }
};

// Обработчик ответа сервера
function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// Получить информацию о пользователе
export function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(handleResponse);
}

// Обновить профиль пользователя
export function updateUserProfile(name, about) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then(handleResponse);
}

// Обновить аватар пользователя
export function updateAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(handleResponse);
}

// Получить стартовые карточки
export function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(handleResponse);
}

// Добавить новую карточку
export function addCard(name, link) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  }).then(handleResponse);
}

// Удалить карточку
export function deleteCard(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(handleResponse);
}

// Поставить лайк карточке
export function likeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  }).then(handleResponse);
}

// Удалить лайк с карточки
export function unlikeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(handleResponse);
}
