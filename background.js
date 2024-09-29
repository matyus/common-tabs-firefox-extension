console.log('background.js');

const { local } = chrome.storage;

window.addEventListener('DOMContentLoaded', (event) => {
  function onGetError(error) {
    console.log('get Error', { error });
  }
  function onSetError(error) { console.log('set Error', { error }); }

  function onSetSuccess(success) {
    console.log('set Success', { success });
  }

  function initialTabs() {
    const tabs = [
      {
        url: 'https://mail.google.com/mail/u/0/',
        checked: true
      },
      {
        url: 'https://calendar.google.com/calendar/u/0/r',
        checked: true
      },
      {
        url: 'https://app.slack.com/client/E02S83XM6G2/C03H50Y9S?selected_team_id=E02S83XM6G2',
        checked: false
      }
    ];

    local.set({ commonTabs: tabs }).then(onSetSuccess);
  }

  function onGetSuccess({ commonTabs }) {
    console.log('get Success', { commonTabs });

    if (commonTabs === undefined || !commonTabs.length || commonTabs.length === 0) {
      console.log('no tabs exist');
      initialTabs();
    } else {
      console.log('tabs exist, doing nothing');
    }
  }

  local.get('commonTabs').then(onGetSuccess, onGetError);
});
