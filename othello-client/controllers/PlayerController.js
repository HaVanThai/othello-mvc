class PlayerController extends Controller {
  constructor(model, view) {
    super(model, view);
  }

  render() {
    this.model.notifyUpdatedData();
  }

  setName(name) {
    this.model.setName(name);
  }

  getChess() {
    return this.model.getChess();
  }
}