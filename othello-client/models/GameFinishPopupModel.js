class GameFinishPopupModel extends Model {
  constructor(gameResult, gameFinishMessage) {
    super();
    this.gameResult = gameResult;
    this.gameFinishMessage = gameFinishMessage;
  }

  /**
   * Set gameResult and message
   * @param gameResult String
   * @param gameFinishMessage String
   */
  setGameFinishAttributes(gameResult, gameFinishMessage) {
    this.gameResult = gameResult;
    this.gameFinishMessage = gameFinishMessage;
    this.notifyUpdatedData();
  }

}