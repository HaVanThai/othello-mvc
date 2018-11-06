class PlayerView extends View {
  constructor(playerModel) {
    super(playerModel);
  }

  updateView() {
    this.drawPlayerInfo();
  }

  drawPlayerInfo() {
    $('#player-name').html(this.model.name);
    $('#total-won').text(this.model.won);
    $('#total-lost').text(this.model.lost);
  }
}