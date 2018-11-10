class GameManager {
  constructor(gameBoardModel, playerModel, roomModel) {
    this.gameBoardModel = gameBoardModel;
    this.playerModel = playerModel;
    this.roomModel = roomModel;
  }

  resetGame() {
    this.gameBoardModel.resetGame();
  }

  setBoardMatrix(boardMatrix) {
    this.gameBoardModel.setBoardMatrix(boardMatrix);
  }

  setRoom(room) {
    this.roomModel.setRoom(room);
  }

  setErrorMessage(error) {
    this.roomModel.setErrorMessage(error);
  }

  setChess(chess) {
    this.playerModel.setChess(chess);
  }

  setLastTurnPlayer(lastTurnPlayer) {
    this.gameBoardModel.setLastTurnPlayer(lastTurnPlayer);
  }

  setIsReady(isReady) {
    this.gameBoardModel.setIsReady(isReady);
  }

  calcScore() {
    this.gameBoardModel.calcScore();
  }

  isFinished() {
    this.gameBoardModel.isFinished();
  }

  notifyUpdatedDataGameBoardModel() {
    this.gameBoardModel.notifyUpdatedData();
  }

  setIsOpponentReady(isOpponentReady) {
    this.gameBoardModel.setIsOpponentReady(isOpponentReady);
  }

  handleGameFinish() {
    this.gameBoardModel.handleGameFinish();
  }

}