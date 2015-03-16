var clacks = {};

// return clacks headers, called by popup to get them for display
function getClacks(tabId) {
    return clacks[tabId];
}

// on request receipt, check for clacks headers and store if present
chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        var tabId = details.tabId,
            newClacks;

        // get response headers and store those tagged as clacks overhead
        newClacks = details.responseHeaders.filter(function(header) {
                if (header.name === "X-Clacks-Overhead" || header.name === "Clacks-Overhead")
                    return true;
                else return false;
        });

        // if clacks headers are present, store
        if (newClacks.length > 0) {
            clacks[tabId] = newClacks;
        }

        // console.log("length: ", clacks.length);
        // console.log(details.responseHeaders);
        // console.log(clacks[tabId]);
    },

    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

// when tab is updated, check if pageAction icon should show
chrome.tabs.onUpdated.addListener(function(tabId, change) {
    if (change.status === "complete") {
        chrome.tabs.query({active: true}, function(tabs) {
            var tab = tabs[0];

            if (clacks[tab.id]) {
                chrome.pageAction.show(tab.id);
            } else {
                chrome.pageAction.hide(tab.id);
            }
        });
    }
});
