class View {

  constructor(model) {
    this.lstController = [];
    this.model = model;
  }

  registerController(controller) {
    this.lstController.push(controller);
  }

  unregisterController(controller) {
    const index = this.lstController.indexOf(controller);
    if (index > -1) {
      this.lstController.splice(index, 1);
    }
  }

}