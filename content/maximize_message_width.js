const maximizeMessageWidth = () => {
  let max_width = `
      <style>
        div.v-SettingsPane {
          margin: auto !important;
        }

        div.v-MessageCard.app-contentCard {
          max-width: 100% !important;
        }

        div.v-Compose.app-contentCard {
          width: 100%;
          margin-top: 20px !important;
          margin-bottom: 20px !important;
        }

      </style>
      `; 
  $('head').append($(max_width));
}

