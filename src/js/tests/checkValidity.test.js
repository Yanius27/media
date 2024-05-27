import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body><input class="textInput" /></body></html>');
global.document = dom.window.document;
global.window = dom.window;

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

import App from '../App';

const app = new App();

test('Method should save coords, if value is correct', () => {
  app.checkInput([1.23456, 7.65432]);

  expect(app._coords).toBe('[1.23456, 7.65432]');
});
