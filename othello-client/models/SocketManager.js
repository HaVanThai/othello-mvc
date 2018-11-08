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
    this.socket.emit('init_socket');
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
    this.socket.on('opponent_ready', function (isReady) {
      self.opponentReadyHandler(isReady);
    });
    this.socket.on('opponent_ready_too', function (isReady) {
      self.opponentReadyTooHandler(isReady);
    });
  }

  emitNewMove(dataTransfer) {
    this.socket.emit('on_move', dataTransfer);
  }

  emitJoinRoomRequest(room) {
    this.socket.emit('join_room', room);
  }

  emitImReady(isReady) {
    this.socket.emit('im_ready', isReady);
  }

  emitImReadyToo(isReady) {
    this.socket.emit('im_ready_too', isReady);
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
    
    if (room == '-1') {
      roomModel.setErrorMessage("Your friend's room doesn't exist!");
    } else if (room == '-2') {
      roomModel.setErrorMessage("Your friend's room is full!");
    } else {
      roomModel.setRoom(room);
      playerModel.setChess(2);
      gameBoardModel.setLastTurnPlayer(2);
      gameBoardModel.setIsReady(true);
      console.log('You joined to room ' + room);
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
    let gameBoardModel = null;
    this.lstModels.forEach(model => {
      if (model instanceof GameBoardModel) {
        gameBoardModel = model;
      }
    });

    gameBoardModel.setIsReady(true);
    gameBoardModel.notifyUpdatedData();
    console.log(opponentName + ' joined.');
  }

  opponentReadyHandler(isReady) {
    console.log('opponent-ready-handler');
    let gameBoardModel = null;
    this.lstModels.forEach(model => {
      if (model instanceof GameBoardModel) {
        gameBoardModel = model;
      }
    });
    gameBoardModel.setIsReady(isReady);
  }

  opponentReadyTooHandler(isReady) {
    console.log('opponent-ready-Too-handler');
    let gameBoardModel = null;
    this.lstModels.forEach(model => {
      if (model instanceof GameBoardModel) {
        gameBoardModel = model;
      }
    });
    gameBoardModel.notifyUpdatedData();
  }

}