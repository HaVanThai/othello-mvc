class GameFinishPopupView extends View {
  constructor(gameFinishPopupModel) {
    super(gameFinishPopupModel);
  }

  updateView() {
    this.displayGameFinishPopup();
  }

  init() {
    let gameBoardController = null;
    this.lstController.forEach(controller => {
      if (controller instanceof GameBoardController) {
        gameBoardController = controller;
      }
    });
    
    let self = this;
    self.hideGameFinishPopup();
    $('#game-finish-ok-button').click(function() {
      self.hideGameFinishPopup();
      gameBoardController.resetGame();
      gameBoardController.emitImReady();
    });
  }

  displayGameFinishPopup() {
    $('#game-finish-popup').show();
    $('#game-result').text(this.model.gameResult);
    $('#game-finish-message').text(this.model.gameFinishMessage);
  }

  hideGameFinishPopup() {
    $('#game-finish-popup').hide();
  }
}