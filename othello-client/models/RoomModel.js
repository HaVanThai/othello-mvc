class RoomModel extends Model {
  constructor(room) {
    super();
    this.room = room;
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
   * Request joining room
   * @param room String
   */
  createJoinRoomRequest(room) {
    this.socketManager.emitJoinRoomRequest(room);
  }

}