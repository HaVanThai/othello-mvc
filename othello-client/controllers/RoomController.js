class RoomController extends Controller {
  constructor(model, view) {
    super(model, view);
  }

  render() {
    this.model.notifyUpdatedData();
  }

  setRoom(room) {
    this.model.setRoom(room);
  }

  createJoinRoomRequest(room) {
    this.model.createJoinRoomRequest(room);
  }
}