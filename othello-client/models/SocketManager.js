class SocketManager {

  constructor(host) {
    this.host = host;
    this.socket = null;
    this.lstModels = [];
  }

  init() {
    // we declare new variable because in socket.io callback, 'this' is an instance of socket, not this class.
    let self = this;
    this.socket = io.connect(this.host);
    this.socket.on('init_room', function (room) {
      self.initRoomHandler(room);
    });
    this.socket.on('joined_room', function (room) {
      self.joinedRoomHandler(room);
    });
    this.socket.on('new_move', function (data) {
      self.newMoveHandler(data);
    });
    this.socket.on('opponent_joined', function (opponentName) {
      self.opponentJoinedHandler(opponentName);
    });
  }

  emitNewMove(dataTransfer) {
    this.socket.emit('on_move', dataTransfer);
  }

  emitJoinRoomRequest(room) {
    this.socket.emit('join_room', room);
  }

  registerModel(model) {
    this.lstModels.push(model);
  }

  unRegisterModel(model) {
    const index = this.lstModels.indexOf(model);
    if (index > -1) {
      this.lstModels.splice(index, 1);
    }
  }

  // Handling after a new room was created
  initRoomHandler(room) {
    let roomModel = null;
    this.lstModels.forEach(model => {
      if (model instanceof RoomModel) {
        roomModel = model;
      }
    });

    roomModel.setRoom(room);
    console.log('My room is ' + room);
  }

  // Handling after connected to a friend's room
  joinedRoomHandler(room) {
    if (room != '-1') {
      let gameBoardModel = null;
      let roomModel = null;
      let playerModel = null;
      this.lstModels.forEach(model => {
        if (model instanceof GameBoardModel) {
          gameBoardModel = model;
        }
        if (model instanceof PlayerModel) {
          playerModel = model;
        }
        if (model instanceof RoomModel) {
          roomModel = model;
        }
      });

      roomModel.setRoom(room);
      playerModel.setChess(2);
      gameBoardModel.setLastTurnPlayer(2);
      console.log('You joined to room ' + room);
    } else {
      alert("Your friend's room doesn't exist!");
    }
  }

  // Update gameBoard after the opponent play a new move
  newMoveHandler(data) {
    let gameBoardModel = null;
    this.lstModels.forEach(model => {
      if (model instanceof GameBoardModel) {
        gameBoardModel = model;
      }
    });
    const dataTransfer = Object.assign({}, data);
    gameBoardModel.boardMatrix = dataTransfer.boardMatrix;
    gameBoardModel.lastTurnPlayer = dataTransfer.lastTurnPlayer;
    gameBoardModel.calcScore();
    gameBoardModel.isFinished();
    gameBoardModel.notifyUpdatedData();
  }

  // Handling after a friend joined the room
  opponentJoinedHandler(opponentName) {
    console.log(opponentName + ' joined.');
  }

}