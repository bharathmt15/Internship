const productiveSites = [
    "github.com",
    "stackoverflow.com",
    "w3schools.com",
    "leetcode.com",
];
const unproductiveSites = [
    "facebook.com",
    "instagram.com",
    "tiktok.com",
    "twitter.com",
];

let current = {domain: null, start: null};
let totals = {};

function getDomain(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
}

function switchSite(url) {
    stopTimer();
    const domain = getDomain(url);
    if (!domain) return;
    current = {domain, start: Date.now()};
}

function stopTimer() {
    if (!current.start) return;
    const timeSpent = Date.now() - current.start;
    totals[current.domain] = (totals[current.domain] || 0) + timeSpent;
    current = {domain: null, start: null};
    chrome.storage.local.set({totals});
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    switchSite(tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && changeInfo.status === "complete") {
        switchSite(tab.url);
    }
});

chrome.alarms.create("saveData", {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(() => stopTimer());
