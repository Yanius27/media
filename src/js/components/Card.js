import MediaControls from './MediaControls';
import moment from 'moment';

export default class Card {
  constructor(content, type, coords) {
    this._content = content;
    this.contentContainer;
    this._type = type;
    this._coords = coords;
    this._element;
    this._currentDate;

    this.#setDate();
    this.#createCard();
  }

  #setDate() {
    const date = moment().locale('ru');
    this._currentDate = date.format('DD.MM.YY HH:mm');
  }


  #createCard() {
    const card = document.createElement('div');
    card.classList.add('card');

    const flex = document.createElement('div');
    flex.classList.add('flex');

    switch (this._type) {
      case 'text':
        this.#createTextCard();
        break;
      case 'video':
        this.#createVideoCard();
        break;
      case 'audio':
        this.#createAudioCard();
        break;
    }

    const date = document.createElement('span');
    date.classList.add('date');
    date.textContent = this._currentDate;

    flex.append(this.contentContainer, date);

    const coords = document.createElement('span');
    coords.classList.add('coords');
    const [latitude, longitude ] = this._coords;
    coords.textContent = `[${ latitude }, ${ longitude }] ${ String.fromCodePoint(128065) }`;

    card.append(flex, coords);

    this._element = card;
  }

  #createTextCard() {
    this.contentContainer = document.createElement('div');
    this.contentContainer.classList.add('content');

    this.contentContainer.textContent = this._content;
  }

  #createVideoCard() {
    this.contentContainer = document.createElement('div');
    this.contentContainer.classList.add('content');

    const video = document.createElement('video');

    video.classList.add('media');
    video.classList.add('videoFile');
    const customControls = new MediaControls(video, 'video').element;
    video.setAttribute('poster', 'https://img.freepik.com/free-photo/white-background_23-2147730801.jpg');
    video.src = URL.createObjectURL(this._content);
    this.contentContainer.append(video, customControls);
  }

  #createAudioCard() {
    this.contentContainer = document.createElement('div');
    this.contentContainer.classList.add('content');

    const audio = document.createElement('audio');

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.#blobToArrayBuffer(this._content).then(buffer => {
      audioContext.decodeAudioData(buffer, (_buffer) => {
        const duration = _buffer.duration;
        console.log('duration -->' + duration);
      })
    })

    audio.classList.add('media');
    audio.classList.add('audioFile');
    const customControls = new MediaControls(audio, 'audio').element;
    audio.src = URL.createObjectURL(this._content);
    this.contentContainer.append(audio, customControls);
  }

  #blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      }

      reader.onerror = (event) => {
        reject('Error reading Blob as ArrayBuffer');
      }

      reader.readAsArrayBuffer(blob);
    })
  }

  get element() {
    return this._element;
  }
}