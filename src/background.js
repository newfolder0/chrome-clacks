// Create data store
var clacks = {},
    shown = {}; // this object is to enable crappy, hacky fix. I'll try and find
                // a better solution but without it, it currently doesn't work
                // with www.gnuterrypratchett.com for example. It does make it
                // persist for a short time in some cases where it shouldn't
                // though.

// return clacks headers, called by popup to get them for display
function getClacks(tabId) {
    return clacks[tabId];
};

// The main listener to check each request's headers for clacks
chrome.webRequest.onCompleted.addListener(
    function(details) {
        var newClacks,
            // match case-insensitive, with or without 'X-' prefix
            match = /^(X-)?(Clacks-Overhead)$/i;

        // ignore background requests (where tabId === -1)
        if (details.tabId >= 0) {

            // get response headers and store those tagged as "Clacks-Overhead"
            // or "X-Clacks-Overhead"
            newClacks = details.responseHeaders.filter(function(header) {
                    if (match.test(header.name)) return true;
                    else return false;
            });

            // if there are any Clacks-Overhead headers.
            if (newClacks.length > 0) {
                var str = "";

                for (var i=0; i<newClacks.length; i++) {
                    if (i > 0) str += "\n";
                    str += newClacks[i].value;
                };

                // store the resulting string under its tab's ID.
                // nb though it displays multiple messages from one request, seperate
                // requests from one page load can still overwrite each other.
                // Note from Pete: I've change += to just = to stop it repeating itself.
                // - related to premature deletion? - don't think so...
                clacks[details.tabId] = str;
                chrome.pageAction.show(details.tabId);
                shown[details.tabId] = false;
                console.log("store");
            }
        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

// Keeps the data store clean by deleting entries for tabs when they are closed.
chrome.tabs.onRemoved.addListener(function (tabId) {
    if (clacks[tabId]) delete clacks[tabId];
});

// when tab is updated, check if pageAction icon should show
chrome.tabs.onUpdated.addListener(function(tabId, change) {
    // if the update is complete, decide if we show the icon.
    console.log("status: ",change.status);
    if (change.status === "complete") {
        // if there is a clacks entry for the UPDATED tab, show icon for that tab.
        if (clacks[tabId]) {
            chrome.pageAction.show(tabId);
            shown[tabId] = true;
        }
    // if the update is loading, clean the clacks entries for the tab and hide the icon.
    // probably doesn't require the if statement.
    } else if (clacks[tabId] && shown[tabId] === true) {
        delete clacks[tabId];
        delete shown[tabId];
        chrome.pageAction.hide(tabId);
    }
    console.log("shown: ",shown[tabId]);
});
