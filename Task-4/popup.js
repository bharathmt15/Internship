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

chrome.storage.local.get("totals", ({totals}) => {
    const container = document.getElementById("list");
    if (!totals) return (container.textContent = "No data yet.");

    container.innerHTML = Object.entries(totals)
        .map(([site, ms]) => {
            const minutes = Math.round(ms / 60000);
            let cls = "neutral";
            if (productiveSites.includes(site)) cls = "productive";
            else if (unproductiveSites.includes(site)) cls = "unproductive";
            return `<div class="${cls}"><span>${site}</span><span>${minutes} min</span></div>`;
        })
        .join("");
});
