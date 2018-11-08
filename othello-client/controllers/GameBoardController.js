class GameBoardController extends Controller {
  constructor(model, view) {
    super(model, view);
  }

  render() {
    this.view.updateView();
  }

  drawGameBoard() {
    this.view.updateView();
  }

  resetGame() {
    this.model.resetGame();
  }

  updateGameBoardAfterNewMove(x, y) {
    this.model.updateGameBoardAfterNewMove(x, y);
  }

  skipTurn() {
    this.model.skipTurn();
  }

  getPossibleMoves(playerChess) {
    return this.model.getPossibleMoves(playerChess);
  }

  emitImReady() {
    this.model.emitImReady();
  }
}