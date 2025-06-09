export function setupModal() {
const editModal = document.querySelector('.popup_type_edit');
const addModal = document.querySelector('.popup_type_new-card');
const imageModal = document.querySelector('.popup_type_image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const nameInput = editModal.querySelector('.popup__input[name="name"]');
const aboutInput = editModal.querySelector('.popup__input[name="about"]');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

function openModal(modal) {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscape);
}

function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscape);
}

// Обработчик клавиши Escape
function handleEscape(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.popup_is-opened');
    if (openedModal) closeModal(openedModal);
  }
}

// Обработчик клика по оверлею
function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

// Настройка закрытия по крестику
document.querySelectorAll('.popup__close').forEach(button => {
  const modal = button.closest('.popup');
  button.addEventListener('click', () => closeModal(modal));
});

// Настройка закрытия по клику на оверлей
[editModal, addModal, imageModal].forEach(modal => {
  modal.addEventListener('click', handleOverlayClick);
});

// Открытие попапа редактирования профиля
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  aboutInput.value = profileDescription.textContent;
  openModal(editModal);
});

// Открытие попапа добавления карточки
addButton.addEventListener('click', () => openModal(addModal));

// Функция для настройки модального окна изображения
function setupImageModal() {
  document.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('card__image')) {
      const image = evt.target;
      const imagePreview = imageModal.querySelector('.popup__image');
      const imageCaption = imageModal.querySelector('.popup__caption');
      
      imagePreview.src = image.src;
      imagePreview.alt = image.alt;
      imageCaption.textContent = image.alt;
      openModal(imageModal);
    }
  });
}

return { setupImageModal };
}