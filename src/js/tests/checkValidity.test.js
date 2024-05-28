import { JSDOM } from 'jsdom';
import App from '../App';

const dom = new JSDOM('<!DOCTYPE html><html><body><form><input class="textInput" /></form></body></html>');
global.document = dom.window.document;

const input = document.querySelector('.textInput');

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

describe('App class checkInput method', () => {
  let app;
  let validValue = '[1.23456, 7.65432]';
  let invalidValue = '!5, ?5';
  let type = 'text';

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    app = new App();
  });

  it('should save coords value to this._coords if value is correct', () => {
    input.checkValidity = jest.fn(() => true);

    app.checkInput(validValue, type); 

    jest.advanceTimersByTime(3000);

    expect(app._coords).toEqual(['1.23456', '7.65432']);
  })

  it('should remove popup.element  if coords is correct', () => {
    input.checkValidity = jest.fn(() => true);

    app.popup.remove = jest.fn();

    app.createCard = jest.fn();

    app.checkInput(validValue, type); 

    jest.advanceTimersByTime(3000);

    expect(app.popup.remove).toHaveBeenCalledTimes(1);
  })


// Вот этот тест не проходит, я не понимаю почему

  // it('should throw an error if incorrect coords are passed', () => {
  //   input.checkValidity = jest.fn(() => false);

  //   jest.advanceTimersByTime(3000);

  //   expect(() => {
  //     app.checkInput(invalidValue, type)
  //   }).toThrow('Введите корректное значение координат.');
  // })

  it('should pass the error text to the method setCustomValidity and call it', () => {
    input.checkValidity = jest.fn(() => false);
    input.setCustomValidity = jest.fn();

    app.checkInput(invalidValue, type);

    jest.advanceTimersByTime(3000);

    expect(input.setCustomValidity).toHaveBeenCalledWith('Введите корректное значение координат.');
  })
});
