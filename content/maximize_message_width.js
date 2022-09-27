const maximizeMessageWidth = () => {
  let max_width = `
      <style>
        div.v-MessageCard.app-contentCard,
        div.v-Compose.app-contentCard,
        div.v-SettingsPane,
        div.app-contentCard {
          max-width: 100% !important;
        }
      </style>
      `; 
  $('head').append($(max_width));
}

