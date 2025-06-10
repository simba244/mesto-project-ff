export function openModal(modal) {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscape);
}

export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscape);
}

function handleEscape(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.popup_is-opened');
    if (openedModal) closeModal(openedModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

export function setupModals() {
  document.querySelectorAll('.popup__close').forEach(button => {
    const modal = button.closest('.popup');
    button.addEventListener('click', () => closeModal(modal));
  });

  document.querySelectorAll('.popup').forEach(modal => {
    modal.addEventListener('click', handleOverlayClick);
  });
}

export function openImagePopup(link, name) {
  const imagePopup = document.querySelector('.popup_type_image');
  const imagePopupImage = imagePopup.querySelector('.popup__image');
  const imagePopupCaption = imagePopup.querySelector('.popup__caption');

  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;

  openModal(imagePopup);
}
