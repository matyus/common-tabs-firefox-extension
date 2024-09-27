/*
 *This file is loaded in the browser_action (window.html) file
 */

console.log('window.js');

const { local } = chrome.storage;

window.addEventListener('DOMContentLoaded', (event) => {
  const tabsFieldset = document.getElementById('tabs-fieldset');
  const form = document.getElementById('form');

  function onGetError(error) { console.log('get Error', { error }); }
  function onSetError(error) { console.log('set Error', { error }); }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const entries = Object.fromEntries(formData);

    for (url in entries) {
      chrome.tabs.create({
        active: false,
        discarded: true,
        url: url
      });
    }
  }

  form.addEventListener('submit', handleSubmit)

  function onGetSuccess({ commonTabs }) {
    const fragment = document.createDocumentFragment();
    for(const tab of commonTabs) {
      const checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('value', tab.url);
      checkbox.setAttribute('name', tab.url);
      checkbox.setAttribute('checked', tab.checked);

      const label = document.createElement('label');
      label.textContent = tab.url;
      label.appendChild(checkbox)

      fragment.append(label);
    }

    tabsFieldset.append(fragment);
  }

  local.get('commonTabs').then(onGetSuccess, onGetError);
});

