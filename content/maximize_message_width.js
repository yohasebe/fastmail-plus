const maximizeMessageWidth = () => {
  let max_width = `
      <style>
        .v-SettingsPane,
        :has(> .v-Contact),
        :has(> .v-EditContact)
        {
          margin: 0 auto !important;
          margin-top: 20px !important;
          margin-bottom: 20px !important;
        }

        .v-MessageCard
        {
          max-width: 100% !important;
        }

        div.v-MessageCard:has(> .v-Compose),
        :has(> .v-EditNote)
        {
          width: 100%;
          margin-top: 20px !important;
          margin-bottom: 20px !important;
        }

      </style>
      `;
  $('head').append($(max_width));
}