export default class ErrorMessage {
  constructor(message) {
    this._element;
    this._message = message;
    this.#createElement();
  }

  #createElement() {
    const error = document.createElement('div');
    error.classList.add('error');
    error.textContent = this._message;

    this._element = error;
  }

  get element() {
    return this._element;
  }
}
