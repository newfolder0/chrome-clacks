var clacks = {};

// return clacks headers, called by popup to get them for display
function getClacks() {
    return clacks;
}

// make pageAction visible in URL bar
function showButton(tabId) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.pageAction.show(tabId);
    });
}

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {

        // get response headers and store those tagged as clacks overhead
        clacks = details.responseHeaders.filter(function(header) {
                if (header.name === "X-Clacks-Overhead") return true;
                else return false;
        });

        // show the pageAction icon if clacks headers are present
        if (clacks.length >= 0) showButton(details.tabId);

        console.log("length: ", clacks.length);
        console.log(details.responseHeaders);
        console.log(clacks);
    },

    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

// show popup when icon is clicked
chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.pageAction.setPopup({"tabId":tab.id, "popup":"popup.html"});
})
