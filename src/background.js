var DEBUG = false;

// Create data store
var clacks = {};

// return clacks headers, called by popup to get them for display
function getClacks(tabId) {
    return clacks[tabId];
};

// The main listener to check each request's headers for clacks
chrome.webRequest.onCompleted.addListener(
    function(details) {
        var newClacks,
            // match case-insensitive, with or without 'X-' prefix
            pattern = /^(X-)?(Clacks-Overhead)$/i;

        // ignore background requests (where tabId === -1)
        if (details.tabId >= 0) {

            // get response headers and store those tagged as "Clacks-Overhead"
            // or "X-Clacks-Overhead"
            newClacks = details.responseHeaders.filter(function(header) {
                    return pattern.test(header.name);
                }).map(function(header) {
                    return header.value;
                }).join("\n");

            // if there are any Clacks-Overhead headers.
            if (newClacks) {
                // Store the resulting string under its tab's ID.
                // N.B. though it displays multiple messages from one request, separate
                // requests from one page load can still overwrite each other.
                // Note from Pete: I've change += to just = to stop it repeating itself.
                // - related to premature deletion? - don't think so...
                clacks[details.tabId] = newClacks;
                chrome.pageAction.show[details.tabId];
                if (DEBUG) console.log("store");
            }
        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

// clear clacks on navigation to a new page
chrome.webNavigation.onCommitted.addListener(
    function(details) {
        if (details.transitionType !== "auto_subframe") {
            delete clacks[details.tabId];
            chrome.pageAction.hide(details.tabId);
        }
    }
);

// listen to messages from content scripts
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var tabId = sender.tab.id;

        if (request.clacks) {
            if (clacks[tabId]) clacks[tabId] += "\n" + request.clacks;
            else clacks[tabId] = request.clacks;
        }

        // if there is a clacks entry for the loaded tab, show icon for that tab.
        if (clacks[tabId]) chrome.pageAction.show(tabId);
        // if (DEBUG) console.log("shown: ", shown[tabId]);
});

// Keeps the data store clean by deleting entries for tabs when they are closed.
chrome.tabs.onRemoved.addListener(function (tabId) {
    if (clacks[tabId]) {
        delete clacks[tabId];
    }
});

// Possible code for filtering duplicate strings
// function uniqueStrings(list) {
//     var set = {}, i;
//     for (i in list) {
//         set[list[i]] = true;
//     }
//     return Object.keys(set);
// }
