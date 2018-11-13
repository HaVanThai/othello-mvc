class PlayerModel extends Model {
  constructor(name, chess, won, lost){
    super();
    this.name = name;
    this.chess = chess;
    this.won = won;
    this.lost = lost;
  }

  /**
   * Set name
   * @param name String
   */
  setName(name) {
    this.name = name;
    this.notifyUpdatedData();
  }

  /**
   * @returns number
   */
  getChess() {
    return this.chess;
  }

  /**
   * Set chess
   * @param chess number
   */
  setChess(chess) {
    this.chess = chess;
    // this.notifyUpdatedData();
  }

  /**
   * Increment won
   */
  incrementWon() {
    this.won++;
    this.notifyUpdatedData();
  }

  /**
   * Increment lost
   */
  incrementLost() {
    this.lost++;
    this.notifyUpdatedData();
  }
}