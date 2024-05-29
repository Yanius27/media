import Card from './components/Card';
import Popup from './components/Popup';

// Вариант реализации ошибки с попапом
// import ErrorMessage from './components/ErrorMessage';

export default class App {
  constructor() {
    this._coords;
    this.initCoords();
    this.messages = document.querySelector('.messages');
    this.input = document.querySelector('.textInput');
    this.videoPlayer = document.querySelector('.videoPlayer');

    this.actualContentType;

    this.stream;
    this.recorder;
    this.blob;

    this.messageListener();

    this.popup = new Popup().element;
    this.popupListener();

    this.recordListener();
  }

// Load coords after restart
  initCoords() {
    if (!this._coords && localStorage.getItem('coords')) {
      this._coords = JSON.parse(localStorage.getItem('coords'));
    }
  }

// Creating storage for coords
  saveCoords() {
    localStorage.setItem('coords', JSON.stringify(this._coords));
  }

// Method for getting coords from user  
  getCoords() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((data) => {
          const { latitude, longitude } = data.coords;
          this._coords = [latitude.toFixed(5), longitude.toFixed(5)];
          this.saveCoords();
          resolve(this._coords);
        }, (err) => {
          console.log(err);
          reject(err);
        }, { enableHighAccuracy: true });
      } else {
        reject(new Error('Geolocation is not supported'));
      }
    });
  }

// Method for creating new card
  async createCard(content, type, coords) {
      try {
        if (!coords) {
          this._coords = await this.getCoords();
        }  
        let card = new Card(content, type, this._coords).element; 
        ///////// Костыльный способ узнать длительность записи до начала воспроизведения  
        if (type !== 'text') {
          let duration = document.querySelector('.timing').textContent.split(':');
          duration = duration[0].replace('0', '') * 60 + +duration[1] + 0.5;
          card.setAttribute('duration', duration);
    
          card.addEventListener('click',this.messagePlayerListener);
        
          this.mediaListener(card);
        }
        this.messages.append(card);
      } catch (error) {
        console.error('Failed to get coordinates:', error);
        document.body.append(this.popup);
      }
  }  

// Cb for event handling, arising while recording audio or video
  recordListener() {
    [...document.querySelectorAll('.btn')].forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.recorder.stop();
        this.stream.getTracks().forEach(track => track.stop());   
  
        this.videoPlayer.style.display = 'none';
        document.querySelector('.player').style.display = 'none';
        document.querySelector('.icons').style.display = 'flex';

        if (e.target.classList.contains('ok')) {
          this.recorder.stop();
        }
      });
  
    });
  }

// Method creating timer and setInterval for every second update  
  timer() {
    const startTimer = new Date();

    const timerInterval = setInterval(() => {
      const currentTimer = new Date();
      const elapsedTimer = new Date(currentTimer - startTimer);

      const minutes = elapsedTimer.getMinutes();
      const seconds = elapsedTimer.getSeconds();

      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');

      const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

      document.querySelector('.timing').textContent = formattedTime;
    }, 1000);

    return function stopTimer() {
      clearInterval(timerInterval);
    };
  }

// Cb for event handling, arising on the input for creating message (text, audio, video)   
  messageListener() {
    this.input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && this.input.value !== '') {
        this.actualContentType = 'text';
        this.createCard(this.input.value, this.actualContentType, this._coords);
      }
    }); 
    
    let stopTimer;

    [...document.querySelectorAll('.icon')].forEach((el) => {
      el.addEventListener('click', async (e) => {

        this.actualContentType = e.target.className.replace(' icon', '');

        try {
          this.stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
  
          if (this.stream) {
            
            if (e.target.classList.contains('video')) {
              this.videoPlayer.style.display = 'block';
              this.videoPlayer.muted = true;
              this.videoPlayer.srcObject = this.stream
            }
  
            document.querySelector('.icons').style.display = 'none';
            document.querySelector('.player').style.display = 'flex';
            
            this.recorder = new MediaRecorder(this.stream, { mimeType: 'video/webm; codecs=vp9' });
            this.recorder.start();
  
            this.videoPlayer.addEventListener('canplay', () => {
              this.videoPlayer.play();
            });
  
            stopTimer = this.timer();
  
            const chunks = [];
    
            this.recorder.addEventListener('dataavailable', function(e) {
              chunks.push(e.data);
            });
  
            this.recorder.addEventListener('stop', async () => {
              stopTimer();
              this.blob = new Blob(chunks);
              
              this.createCard(this.blob, this.actualContentType, this._coords);
            });
          }
        } catch (error) {
          console.log('Пожалуйста, дайте разрешение для записи видео и аудио'); 
        }
      });
    });
  }

// Cb for popup elements event handler
  popupListener() {
    this.popup.querySelector('.popup_buttons').addEventListener('click', (e) => {
      if (e.target.classList.contains('popup_cancelBtn')) {
        this.popup.remove();
      }
    });

    
    this.popup.querySelector('.popup_form').addEventListener('submit', (e) => {
      e.preventDefault(); 
      this.checkInput(e.target.querySelector('.popup_input').value, this.actualContentType);
    });
  }

// Cb for event handler for Play button inside cards
  messagePlayerListener(event) {
    const card = event.target.closest('.card');
    const media = card.querySelector('.media');

    if (event.target.className === 'play-button') {
      this.actualContentType = media.className.replace('media ', '').replace(' icon', '').replace('File', '');
      event.target.classList.add(`${this.actualContentType}_pause`);
      media.play();
    } else if (event.target.className === `play-button ${this.actualContentType}_pause`) {
      this.actualContentType = media.className.replace('media ', '').replace(' icon', '').replace('File', '');
      event.target.classList.remove(`${this.actualContentType}_pause`);
      media.pause();
    }
  }

// Method for listening events on media inside cards
  mediaListener(card) {
    const media = card.querySelector('.media');
    const playBtn = card.querySelector('.play-button');
    const inputRange = card.querySelector('.seek-bar-range'); 
    const duration = card.getAttribute('duration') ? card.getAttribute('duration') : 1;

    media.addEventListener('timeupdate', () => {
      const currentTime = media.currentTime;
      const percent = (currentTime / duration) * 100;
      inputRange.value = percent;
    });
    
    media.addEventListener('ended', () => {
      this.actualContentType = media.className.replace('media ', '').replace(' icon', '').replace('File', '');
      playBtn.classList.remove(`${this.actualContentType}_pause`);
      inputRange.value = 0;
    });
    
    inputRange.addEventListener('input', (e) => {
      const newTime = +e.target.value / 100 * duration;
      media.currentTime = newTime;
    });
  }

// Checking the correctness of coordinates entered manually by the user
  checkInput(value, type) {
    try {
      if(this.input.checkValidity()) {
        this.popup.remove();
        this._coords = value.replace(/[\[\]\s]/g, '').split(','); 
        this.saveCoords();

        if (type !== 'text') {
          this.createCard(this.blob, type, this._coords);
        } else {
          this.createCard(this.input.value, type, this._coords);
        }          
      } else {
        throw new Error('Введите корректное значение координат.');
      }
    } catch (error) {
      console.log(error);
      this.input.setCustomValidity(error.message);
      this.input.reportValidity();
      setTimeout(() => {
        this.input.setCustomValidity('');
        this.input.reportValidity();
      }, 3000);
      // throw new Error(error.message);
    }
  }
}
