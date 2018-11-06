class GameBoardView extends View {
  constructor(gameBoardModel) {
    super(gameBoardModel);
  }

  updateView() {
    this.drawGameBoard();
    this.initPossibleMoves();
    this.drawGameScore();
  }

  drawGameBoard() {
    $('#game-board').html('');

    let boardHtml = [];
    const boardSize = this.model.boardMatrix.length;
    boardHtml.push('<table>');
    for (let i = 0; i < boardSize; i++) {
      boardHtml.push("<tr>");
      for (let j = 0; j < boardSize; j++) {
        boardHtml.push('<td class ="cell ');
        // Push class 'empty', 'white' or 'black'
        boardHtml.push(CHESS[this.model.boardMatrix[i][j]] + '" ');
        boardHtml.push('id="cell_' + i + '_' + j + '">');
        boardHtml.push('<span class="disc"></span>');
        boardHtml.push('</td>');
      }
      boardHtml.push("</tr>");
    }
    boardHtml.push("</table>");

    $('#game-board').html(boardHtml.join(''));
  }

  // Draw and Set onClick event for all possible move of a player
  initPossibleMoves() {
    let gameBoardController = null;
    this.lstController.forEach(controller => {
      if (controller instanceof GameBoardController) {
        gameBoardController = controller;
      }
    });

    const possibleMoves = gameBoardController.getPossibleMoves();
    if (possibleMoves == null) {
      // It's not you turn, do nothing
    } else if (possibleMoves.length == 0) {
      // If player can't play any move, We skip and switch to opponent turn
      gameBoardController.skipTurn();
    } else {
      const nextPlayerTurn = this.model.lastTurnPlayer == 1 ? 2 : 1;
      possibleMoves.forEach(possibleMove => {
        $('#cell_' + possibleMove.x + '_' + possibleMove.y)
          .addClass(CHESS[nextPlayerTurn] + '-possible-move ')
          .click(function () {
            gameBoardController.updateGameBoardAfterNewMove(possibleMove.x, possibleMove.y);
          });
      });
    }
  }

  drawGameScore() {
    $('#white-score').text(this.model.score[1]);
    $('#black-score').text(this.model.score[2]);
  }
}