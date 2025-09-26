import GraphTabs from 'graph-tabs';

const tabs = new GraphTabs('header-tabs');

if (tabs) {
  tabs.tabList.querySelector(
    '.tabs__nav-item:nth-child(2) .tabs__nav-btn'
  ).tabIndex = 0;
}
