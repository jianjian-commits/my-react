export default class FullScreenAction {
  constructor(callback) {
    this.type = "fullscreen";
    this.callback = callback;
  }

  click = () => {
   this.callback();
  }
}