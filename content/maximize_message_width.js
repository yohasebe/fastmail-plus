const maximizeMessageWidth = () => {
  let max_width = `
      <style>
        .v-SettingsPane,
        .app-contentCard:has(.v-Contact),
        .app-contentCard:has(.v-EditContact)
        {
          margin: 0 auto !important;
          margin-top: 20px !important;
          margin-bottom: 20px !important;
        }

        .v-MessageCard.app-contentCard
        {
          max-width: 100% !important;
        }

        .app-contentCard:has(.v-Compose),
        .app-contentCard:has(.v-EditNote)
        {
          width: 100%;
          margin-top: 20px !important;
          margin-bottom: 20px !important;
        }

      </style>
      `;
  $('head').append($(max_width));
}