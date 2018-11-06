class Model {
  constructor() {
    this.lstView = [];
  }
  registerView(view) {
    this.lstView.push(view);
  }

  unregisterView(view) {
    const index = this.lstView.indexOf(view);
    if (index > -1) {
      this.lstView.splice(index, 1);
    }
  }

  notifyUpdatedData() {
    for (let i = 0; i < this.lstView.length; i++) {
      this.lstView[i].updateView(this);
    }
  }
}