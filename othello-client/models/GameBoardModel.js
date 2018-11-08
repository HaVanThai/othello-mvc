class GameBoardModel extends Model {
  constructor(boardMatrix, lastTurnPlayer, score) {
    super();
    this.boardMatrix = boardMatrix;
    this.lastTurnPlayer = lastTurnPlayer;
    this.score = score;
    this.socketManager = null;
    this.checkFinish = false;
    this.isReady = false;
  }

  /**
   * Set PlayerModel
   * @param playerModel PlayerModel
   */
  setPlayerModel(playerModel) {
    this.playerModel = playerModel;
  }

  /**
   * Set GameFinishPopupModel
   * @param gameFinishPopupModel GameFinishPopupModel
   */
  setGameFinishPopupModel(gameFinishPopupModel) {
    this.gameFinishPopupModel = gameFinishPopupModel;
  }

  /**
   * set lastTurnPlayer in {1, 2}
   * @param lastTurnPlayer number
   */
  setLastTurnPlayer(lastTurnPlayer) {
    this.lastTurnPlayer = lastTurnPlayer;
    this.notifyUpdatedData();
  }

  /**
   * Set isReady
   * @param isReady boolean
   */
  setIsReady(isReady) {
    this.isReady = isReady;
  }

  /**
   * Skip turn
   */
  skipTurn() {
    this.lastTurnPlayer = this.lastTurnPlayer == 1 ? 2 : 1;

    // Notify to update Game Board View
    this.notifyUpdatedData();

    this.socketManager.emitNewMove(new DataTransfer(this.boardMatrix, this.lastTurnPlayer));
  }

  /**
   * Calculate score and set to score object
   */
  calcScore() {
    this.score = {
      1: 0,
      2: 0
    };
    const boardSize = this.boardMatrix.length;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (this.boardMatrix[j][i] != 0) {
          this.score[this.boardMatrix[j][i]]++;
        }
      }
    }
  }

  /**
   * Register SocketManager
   * @param socketManager SocketManager
   */
  registerSocketManager(socketManager) {
    this.socketManager = socketManager;
  }

  /**
   * Check if game is finish by calculate total of chess in board
   */
  isFinished() {
    const isFinished = (this.score[1] + this.score[2]) == this.boardMatrix.length * this.boardMatrix.length;
    const opponentChess = this.playerModel.getChess() == 1 ? 2 : 1;
    if (isFinished && !this.checkFinish) {
      this.checkFinish = true;
      if (this.score[this.playerModel.getChess()] > this.score[opponentChess]) {
        this.gameFinishPopupModel.setGameFinishAttributes('You won!', 'Congrattulations!');
        this.playerModel.incrementWon();
      } else if (this.score[1] == this.score[2]) {
        this.gameFinishPopupModel.setGameFinishAttributes('Wow, draw!', 'You can do better!');
      } else {
        this.gameFinishPopupModel.setGameFinishAttributes('You lost!', 'You can do better!');
        this.playerModel.incrementLost();
      }
    }
  }

  /**
   * Reset Game
   */
  resetGame() {
    this.boardMatrix = JSON.parse(JSON.stringify(BOARD_MATRIX_INIT));
    this.lastTurnPlayer = 2;
    this.score = {1: 2, 2: 2};
    this.checkFinish = false;
    this.isReady = false;
    this.notifyUpdatedData();
  }

  
  /**
   * Emit to opponent that I'm ready to play a new game
   */
  emitImReady() {
    if (this.isReady) {
      console.log('emit-im-ready-too');
      this.socketManager.emitImReadyToo(this.isReady);
      this.notifyUpdatedData();
    } else {
      console.log('emit-im-ready');
      this.socketManager.emitImReady(this.isReady);
    }
  }

  /**
   * Update matrix for each new move
   * @param x number
   * @param y number
   */
  updateGameBoardAfterNewMove(x, y) {
    this.lastTurnPlayer = this.lastTurnPlayer == 1 ? 2 : 1;
    this.boardMatrix[x][y] = this.lastTurnPlayer;
    // Top
    this.updateGameBoardAfterNewMoveByDirection(x, y, 0, -1);
    // Top-Right
    this.updateGameBoardAfterNewMoveByDirection(x, y, 1, -1);
    // Right
    this.updateGameBoardAfterNewMoveByDirection(x, y, 1, 0);
    // Bottom-Right
    this.updateGameBoardAfterNewMoveByDirection(x, y, 1, 1);
    // Bottom
    this.updateGameBoardAfterNewMoveByDirection(x, y, 0, 1);
    // Bottom-Left
    this.updateGameBoardAfterNewMoveByDirection(x, y, -1, 1);
    // Left
    this.updateGameBoardAfterNewMoveByDirection(x, y, -1, 0);
    // Top-Left
    this.updateGameBoardAfterNewMoveByDirection(x, y, -1, -1);

    // Update score
    this.calcScore();

    // Check if game is finish
    this.isFinished();

    // Notify to update Game Board View
    this.notifyUpdatedData();

    this.socketManager.emitNewMove(new DataTransfer(this.boardMatrix, this.lastTurnPlayer));
  }

  /**
   * Update matrix for each direction of a move
   * @param x number
   * @param y number
   * @param xGap number
   * @param yGap number
   */
  updateGameBoardAfterNewMoveByDirection(x, y, xGap, yGap) {
    const boardSize = this.boardMatrix.length;
    let xTemp = x + xGap;
    let yTemp = y + yGap;
    if (xTemp >= 0 && xTemp < boardSize &&
      yTemp >= 0 && yTemp < boardSize &&
      this.boardMatrix[xTemp][yTemp] != 0 &&
      this.boardMatrix[xTemp][yTemp] != this.boardMatrix[x][y]) {

      while (xTemp + xGap >= 0 && xTemp + xGap < boardSize &&
        yTemp + yGap >= 0 && yTemp + yGap < boardSize) {
        xTemp = xTemp + xGap;
        yTemp = yTemp + yGap;
        if (this.boardMatrix[xTemp][yTemp] == this.boardMatrix[x + xGap][y + yGap]) {
          continue;
        } else if (this.boardMatrix[xTemp][yTemp] == 0) {
          break;
        } else {
          while (xTemp != x || yTemp != y) {
            this.boardMatrix[xTemp][yTemp] = this.boardMatrix[x][y];
            xTemp = xTemp - xGap;
            yTemp = yTemp - yGap;
          }
          break;
        }
      }
    }
  }

  /**
   * Get all possible moves of a player on board
   * @returns Move[]
   */
  getPossibleMoves() {
    let possibleMoves = null;
    if (this.isReady && this.lastTurnPlayer != this.playerModel.getChess()) {
      possibleMoves = [];
      let possibleMove = null;
      const boardSize = this.boardMatrix.length;
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (this.boardMatrix[i][j] == this.playerModel.getChess()) {
            // Top
            possibleMove = this.getPossibleMove(i, j, 0, -1);
            if (possibleMove != null) possibleMoves.push(possibleMove);
            // Top-Right
            possibleMove = this.getPossibleMove(i, j, 1, -1);
            if (possibleMove != null) possibleMoves.push(possibleMove);
            // Right
            possibleMove = this.getPossibleMove(i, j, 1, 0);
            if (possibleMove != null) possibleMoves.push(possibleMove);
            // Bottom-Right
            possibleMove = this.getPossibleMove(i, j, 1, 1);
            if (possibleMove != null) possibleMoves.push(possibleMove);
            // Bottom
            possibleMove = this.getPossibleMove(i, j, 0, 1);
            if (possibleMove != null) possibleMoves.push(possibleMove);
            // Bottom-Left
            possibleMove = this.getPossibleMove(i, j, -1, 1);
            if (possibleMove != null) possibleMoves.push(possibleMove);
            // Left
            possibleMove = this.getPossibleMove(i, j, -1, 0);
            if (possibleMove != null) possibleMoves.push(possibleMove);
            // Top-Left
            possibleMove = this.getPossibleMove(i, j, -1, -1);
            if (possibleMove != null) possibleMoves.push(possibleMove);
          }
        }
      }
      // Remove duplicates
      possibleMoves = possibleMoves.filter((move, index, self) =>
        index === self.findIndex((e) => (e.x === move.x && e.y === move.y))
      );
    }
    return possibleMoves;
  }

  /**
   * Get a possible move on a direction
   * @param x number
   * @param y number
   * @param xGap number
   * @param yGap number
   * @returns Move
   */
  getPossibleMove(x, y, xGap, yGap) {
    let possibleMove = null;
    const boardSize = this.boardMatrix.length;
    let xTemp = x + xGap;
    let yTemp = y + yGap;
    if (xTemp >= 0 && xTemp < boardSize &&
      yTemp >= 0 && yTemp < boardSize &&
      this.boardMatrix[xTemp][yTemp] != 0 &&
      this.boardMatrix[xTemp][yTemp] != this.boardMatrix[x][y]) {
      while (xTemp + xGap >= 0 && xTemp + xGap < boardSize &&
        yTemp + yGap >= 0 && yTemp + yGap < boardSize) {
        xTemp = xTemp + xGap;
        yTemp = yTemp + yGap;

        if (this.boardMatrix[xTemp][yTemp] == this.boardMatrix[x + xGap][y + yGap]) {
          continue;
        } else if (this.boardMatrix[xTemp][yTemp] == 0) {
          possibleMove = new Move(xTemp, yTemp);
          break;
        } else {
          break;
        }
      }
    }
    return possibleMove;
  }
}