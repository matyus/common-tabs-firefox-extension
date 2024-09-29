/*
 *This file is loaded in the browser_action (window.html) file
 */

console.log('window.js');

const { local } = chrome.storage;
const fetchTabs = async () => await local.get('commonTabs').then(tabs => tabs);
const setTabs = async (tabs) => await local.set({ commonTabs: tabs });

function render() { window.location.reload(); }
function onGetError(error) { console.log('get Error', { error }); }
function onSetError(error) { console.log('set Error', { error }); }

function handleSubmitOpen(event) {
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

async function handleSubmitAdd(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const entries = Object.fromEntries(formData);
  const { commonTabs } = await fetchTabs();

  for (key in entries) {
    commonTabs.push({
      url: entries[key],
      checked: false
    });
  }

  const response = setTabs(commonTabs);

  render();
}

async function handleRemove(event) {
  event.preventDefault();

  const index = event.currentTarget.value;

  const { commonTabs } = await fetchTabs();

  commonTabs.splice(index,1);

  const response = await setTabs(commonTabs);

  render();
}

async function handleCheckboxToggle(event) {
  event.preventDefault();

  const { commonTabs } = await fetchTabs();

  const { index } = event.target.dataset;

  console.log({ commonTabs }, { index }, event.target.checked);

  commonTabs[Number(index)].checked = !event.target.checked;

  const response = await setTabs(commonTabs);

  render();
}

function renderCommonTabs(commonTabs) {
  const fragment = document.createDocumentFragment();

  // for(const tab of commonTabs) {
  for (var index = 0; index < commonTabs.length; index++) {
    const tab = commonTabs[index];
    console.log(tab);

    const container = document.createElement('div');
    container.className = 'row';
    container.id = `tab-${index}`;

    const checkbox = document.createElement('input');
    checkbox.addEventListener('click', handleCheckboxToggle);

    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('value', tab.url);
    checkbox.setAttribute('name', tab.url);
    checkbox.setAttribute('data-index', index);
    if (tab.checked) {
      checkbox.setAttribute('checked', tab.checked);
    }

    const label = document.createElement('label');
    label.textContent = tab.url;
    label.appendChild(checkbox)

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button gray';
    removeButton.innerText = 'remove';
    removeButton.name = `remove-${index}`;
    removeButton.value = index;
    removeButton.addEventListener('click', handleRemove);

    container.appendChild(label)
    container.appendChild(removeButton);

    fragment.append(container);
  }

  return fragment;
}

window.addEventListener('DOMContentLoaded', async (event) => {
  const { commonTabs } = await fetchTabs();

  document.querySelector('#form-open').addEventListener('submit', handleSubmitOpen)
  document.querySelector('#form-add').addEventListener('submit', handleSubmitAdd)

  const tabsFragment = renderCommonTabs(commonTabs);

  document.querySelector('#tabs').append(tabsFragment);
});

