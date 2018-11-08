class RoomModel extends Model {
  constructor(room) {
    super();
    this.room = room;
    this.errorMessage = '';
    this.socketManager = null;
  }

  /**
   * Register SocketManager
   * @param socketManager SocketManager
   */
  registerSocketManager(socketManager) {
    this.socketManager = socketManager;
  }

  /**
   * Set room 
   * @param room String
   */
  setRoom(room) {
    this.room = room;
    this.notifyUpdatedData();
  }

  /**
   * Set errorMessage
   * @param errorMessage String
   */
  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;
    this.notifyUpdatedData();
  }

  /**
   * Request joining room
   * @param room String
   */
  createJoinRoomRequest(room) {
    this.socketManager.emitJoinRoomRequest(room);
  }

}