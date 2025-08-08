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
// creating a object with 2 values(key values)
let current = {domain: null, start: null};
// an empty object
let totals = {};
// function to know which URL we are visting or using
function getDomain(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
}
// checking if any change in the URL to track the time
function switchSite(url) {
    stopTimer();
    const domain = getDomain(url);
    if (!domain) return;
    current = {domain, start: Date.now()};
}
// function to stop the timer when tabs are closed
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
// caling the functions
chrome.alarms.create("saveData", {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(() => stopTimer());
// as comments are not allowed in JSON no nee to write there
