export default class Popup {
  constructor() {
    this._element;
    this.#createElement();
  }

  #createElement() {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const popupTitle = document.createElement('h5');
    popupTitle.classList.add('popup_title');
    popupTitle.textContent = 'Что-то пошло не так'; 

    const popupMessage = document.createElement('span');
    popupMessage.classList.add('popup_message');
    popupMessage.textContent = 'К сожалению нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.';

    const form = document.createElement('form');
    form.setAttribute('novalidate', '');
    form.classList.add('popup_form');

    const label = document.createElement('label');
    label.classList.add('popup_label');

    const inputSpan = document.createElement('span');
    inputSpan.classList.add('popup_inputSpan')
    inputSpan.textContent = 'Широта и долгота через запятую';

    const input = document.createElement('input');
    input.classList.add('popup_input');
    input.setAttribute('required', '');
    input.setAttribute('pattern', '^(-|−)?\\d+(\\.\\d{1,5})?,\\s?(-|−)?\\d+(\\.\\d{1,5})?$|^\\[(-|−)?\\d+(\\.\\d{1,5})?,\\s?(-|−)?\\d+(\\.\\d{1,5})?\\]$');

    label.append(inputSpan, input);

    const buttons = document.createElement('div');
    buttons.classList.add('popup_buttons');

    const okBtn = document.createElement('input');
    okBtn.type = 'submit';
    okBtn.classList.add('popup_okBtn');
    okBtn.classList.add('popup_btn');
    okBtn.textContent = 'Ok';

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('popup_cancelBtn');
    cancelBtn.classList.add('popup_btn');
    cancelBtn.textContent = 'Отмена';

    buttons.append(okBtn, cancelBtn);

    form.append(label, buttons);

    popup.append(popupTitle, popupMessage, form);

    this._element = popup;
  }

  get element() {
    return this._element;
  }
}