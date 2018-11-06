class NameInputFormView extends View {
  constructor(model) {
    super(model);
  }

  init() {
    this.setOnClickListenerForEnterNameButton();
  }

  setOnClickListenerForEnterNameButton() {
    let playerController = null;
    this.lstController.forEach(controller => {
      if (controller instanceof PlayerController) {
        playerController = controller;
      }
    });

    $('#enter-name-button').click(function() {
      const name = $('#player-name-input').val();
      if(name.trim() != '') {
        playerController.setName(name);
        $('#enter-name-screen').hide();
      }
    });
  }
}