class RoomView extends View {
  constructor(roomModel) {
    super(roomModel);
  }

  updateView() {
    this.drawRoomNo();
    this.displayErrorMessage();
  }

  init() {
    let roomController = null;
    this.lstController.forEach(controller => {
      if (controller instanceof RoomController) {
        roomController = controller;
      }
    });

    $('#btn-join').click(function () {
      roomController.createJoinRoomRequest($('#friend-room-number').val());
    });
  }

  drawRoomNo() {
    $('#friend-room-number').val('');
    $('#room-number').text(this.model.room);
  }

  displayErrorMessage() {
    if(this.model.errorMessage != '') {
      alert(this.model.errorMessage);
    }
  }
}