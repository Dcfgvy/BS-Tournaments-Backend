export default class Redis {
  constructor() {
    console.log('Mocked Redis instance created');
  }
  on() {
    // Mock the `on` method
  }
  quit() {
    // Mock the `quit` method
  }
  set() {
    return Promise.resolve('OK');
  }
  get() {
    return Promise.resolve(null);
  }
}
