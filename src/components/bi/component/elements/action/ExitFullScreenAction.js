export default class ExitFullScreenAction {
  constructor(callback) {
    this.type = "fullscreen-exit";
    this.callback = callback;
  }

  click = () => {
   this.callback();
  }
}