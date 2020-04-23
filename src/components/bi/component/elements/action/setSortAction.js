
export default class DeleteAction {
  constructor(callback) {
    this.type = "swap";
    this.callback=callback;
  }

  click = () => {
    this.callback();
   }
}