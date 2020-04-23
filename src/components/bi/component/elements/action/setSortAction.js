
export default class SortAction {
  constructor(callback) {
    this.type = "swap";
    this.callback=callback;
  }

  click = () => {
    this.callback();
   }
}