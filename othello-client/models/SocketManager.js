class SocketManager {

  constructor(host) {
    this.host = host;
    this.socket = null;
  }

  setGameManager(gameManager) {
    this.gameManager = gameManager;
  }

  init() {
    // we declare new variable because in socket.io callback, 'this' is an instance of socket, not this class.
    let self = this;
    this.socket = io.connect(this.host);
    this.socket.emit('init_socket');
    this.socket.on('opponent_disconnect', function () {
      self.opponentDisconnectHandler();
    });
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
    this.socket.on('opponent_ready', function () {
      self.opponentReadyHandler();
    });
    this.socket.on('force_finish', function () {
      self.forceFinishHandler();
    });
  }

  emitNewMove(dataTransfer) {
    this.socket.emit('on_move', dataTransfer);
  }

  emitJoinRoomRequest(room) {
    this.socket.emit('join_room', room);
  }

  emitImReady() {
    this.socket.emit('im_ready');
  }

  // Handling after a new room was created
  initRoomHandler(room) {
    this.gameManager.setRoom(room);
    console.log('My room is ' + room);
  }

  // 
  opponentDisconnectHandler() {
    this.gameManager.resetGame();
  }

  // Handling after connected to a friend's room
  joinedRoomHandler(room) {
    if (room == '-1') {
      this.gameManager.setErrorMessage("Your friend's room doesn't exist!");
    } else if (room == '-2') {
      this.gameManager.setErrorMessage("Your friend's room is full!");
    } else {
      this.gameManager.setRoom(room);
      this.gameManager.setChess(2);
      this.gameManager.handleGameReady();
      console.log('You joined to room ' + room);
    }
  }

  // Update gameBoard after the opponent play a new move
  newMoveHandler(data) {
    const dataTransfer = Object.assign({}, data);
    this.gameManager.newMoveHandler(dataTransfer);
  }

  // Handling after a friend joined the room
  opponentJoinedHandler(opponentName) {
    this.gameManager.handleGameReadyAndNotify();
    console.log(opponentName + ' joined.');
  }

  opponentReadyHandler(isReady) {
    console.log('opponent-ready-handler');
    this.gameManager.setIsReady(true);
    this.gameManager.setIsOpponentReady(true);
    this.gameManager.notifyUpdatedDataGameBoardModel();
  }

  forceFinishHandler() {
    // this.gameManager.handleGameFinish();
  }

}