import MediaControls from './MediaControls';

export default class Card {
  constructor(content, type, coords) {
    this._content = content;
    this._type = type;
    this._coords = coords;
    this._element;
    this._currentDate;

    this.#setDate();
    this.#createCard();
  }

  #setDate() {
    const date = new Date();
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    this._currentDate = `${day}.${month}.${year} ${hour}:${minute}`; 
  }


  #createCard() {
    const card = document.createElement('div');
    card.classList.add('card');

    const flex = document.createElement('div');
    flex.classList.add('flex');

    const content = document.createElement('div');
    content.classList.add('content');

    if (this._type === 'text') {
      content.textContent = this._content;
    } else if (this._type === 'video') {
      const video = document.createElement('video');
      video.classList.add('media');
      video.classList.add('videoFile');
      const customControls = new MediaControls(video, 'video').element;
      video.setAttribute('poster', 'https://img.freepik.com/free-photo/white-background_23-2147730801.jpg');
      video.src = URL.createObjectURL(this._content);
      content.append(video, customControls);
    } else {
      const audio = document.createElement('audio');
      audio.classList.add('media');
      audio.classList.add('audioFile');
      const customControls = new MediaControls(audio, 'audio').element;
      audio.src = URL.createObjectURL(this._content);
      content.append(audio, customControls);
    }

    const date = document.createElement('span');
    date.classList.add('date');
    date.textContent = this._currentDate;

    flex.append(content, date);

    const coords = document.createElement('span');
    coords.classList.add('coords');
    const [latitude, longitude ] = this._coords;
    coords.textContent = `[${ latitude }, ${ longitude }] ${ String.fromCodePoint(128065) }`;

    card.append(flex, coords);

    this._element = card;
  }

  get element() {
    return this._element;
  }
}