class MainApp {

  constructor(){}

  start() {
    // Host address
    const host = 'http://localhost:8080';

    // Init socket
    let socketManager = new SocketManager(host);

    // Init models
    let playerModel = new PlayerModel('Player', 1, 0, 0);
    let roomModel = new RoomModel('');
    let gameFinishPopupModel = new GameFinishPopupModel('', '');
    let gameBoardModel = new GameBoardModel(JSON.parse(JSON.stringify(BOARD_MATRIX_INIT)), 2, {1: 2, 2: 2});
    let gameManager = new GameManager(gameBoardModel, playerModel, roomModel);

    // Init views
    let gameBoardView = new GameBoardView(gameBoardModel);
    let playerView = new PlayerView(playerModel);
    let nameInputFormView = new NameInputFormView(null);
    let roomView = new RoomView(roomModel);
    let gameFinishPopupView = new GameFinishPopupView(gameFinishPopupModel);

    // Init controllers
    let gameBoardController = new GameBoardController(gameBoardModel, gameBoardView);
    let playerController = new PlayerController(playerModel, playerView);
    let roomController = new RoomController(roomModel, roomView);
    let gameFinishPopupController = new GameFinishPopupController(gameFinishPopupModel, gameFinishPopupView);

    // Register dependency between models
    gameBoardModel.setPlayerModel(playerModel);
    gameBoardModel.setGameFinishPopupModel(gameFinishPopupModel);

    // Register socket and models
    socketManager.setGameManager(gameManager);
    gameBoardModel.registerSocketManager(socketManager);
    roomModel.registerSocketManager(socketManager);

    // Register controllers to views
    gameBoardView.registerController(gameBoardController);
    gameBoardView.registerController(playerController);
    playerView.registerController(playerController);
    nameInputFormView.registerController(playerController);
    roomView.registerController(roomController);
    gameFinishPopupView.registerController(gameFinishPopupController);
    gameFinishPopupView.registerController(gameBoardController);
    

    // Start
    socketManager.init();

    gameBoardController.render();
    playerController.render();
    roomController.render();
    nameInputFormView.init();
    roomView.init();
    gameFinishPopupView.init();
  }

}