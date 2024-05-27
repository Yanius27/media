export default class MediaControls {
  constructor(media, type) {
    this._media = media;
    this._type = type;
    this._element;
    this.#createElement();
  }

  #createElement() {
    const controls = document.createElement('div');
    controls.classList.add('custom-controls');
    controls.classList.add('custom-controls' + `_${this._type}`);

    const play = document.createElement('div');
    play.classList.add('play-button'); 

    const seekBar = document.createElement('div');
    seekBar.classList.add('seek-bar');

    const input = document.createElement('input');
    input.classList.add('seek-bar-range');
    input.setAttribute('type', 'range');
    input.setAttribute('min', 0);
    input.setAttribute('value', this._media.currentTime);
    input.setAttribute('step', 1);

    seekBar.append(input);

    controls.append(play, seekBar);

    this._element = controls;
  }

  get element() {
    return this._element;
  }
}