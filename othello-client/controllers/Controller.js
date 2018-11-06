class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.registerView(view);
  }
}