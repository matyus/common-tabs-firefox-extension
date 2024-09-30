const { local } = chrome.storage;

const defaultTab = {
  url: 'https://example.com (add new tab to replace)',
  checked: true
};

const fetchTabs = async () => await local.get('commonTabs').then(tabs => tabs);
const setTabs = async (tabs) => await local.set({ commonTabs: tabs });

function render() { window.location.reload(); }

function handleSubmitOpen(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const entries = Object.fromEntries(formData);

  for (url in entries) {
    chrome.tabs.create({
      active: false,
      pinned: true,
      url: url
    });
  }
}

async function handleSubmitAdd(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const entries = Object.fromEntries(formData);
  const { commonTabs } = await fetchTabs();
  const tabs = Array.isArray(commonTabs) ? commonTabs : [];

  for (key in entries) {
    tabs.push({
      url: entries[key],
      checked: false
    });
  }

  setTabs(tabs);

  render();
}

async function handleRemove(event) {
  event.preventDefault();

  const index = event.currentTarget.value;

  const { commonTabs } = await fetchTabs();

  if (!Array.isArray(commonTabs)) return null;

  commonTabs.splice(index, 1);

  await setTabs(commonTabs);

  render();
}

async function handleCheckboxToggle(event) {
  event.preventDefault();

  const { commonTabs } = await fetchTabs();

  if (!Array.isArray(commonTabs)) return null;

  const { index } = event.target.dataset;

  commonTabs[Number(index)].checked = !event.target.checked;

  await setTabs(commonTabs);

  render();
}

function renderCommonTabs(commonTabs) {
  const fragment = document.createDocumentFragment();

  for (var index = 0; index < commonTabs.length; index++) {
    const tab = commonTabs[index];

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
    removeButton.className = 'button-remove';
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
  const tabs = Array.isArray(commonTabs) ? commonTabs : [defaultTab];

  document.querySelector('#form-open').addEventListener('submit', handleSubmitOpen)
  document.querySelector('#form-add').addEventListener('submit', handleSubmitAdd)
  const tabsFragment = renderCommonTabs(tabs);

  document.querySelector('#tabs-list').append(tabsFragment);
});

