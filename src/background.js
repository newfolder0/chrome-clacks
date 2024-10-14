var DEBUG = false;

// Create data store
var clacks = {};

// return clacks headers, called by popup to get them for display
function getClacks(tabId) {
    if (DEBUG) console.log("getClacks: ", clacks[tabId]);
    return clacks[tabId];
};

function extinguishClacksIcon(tabId) {
    if (DEBUG) console.log("extinguishClacksIcon: ", tabId);
    // Set a disabled icon and optionally change the title
    chrome.action.setIcon({
        "tabId": tabId,
        "path": {
            "19": chrome.runtime.getURL("images/melanie_icon19_disabled.png"),
            "38": chrome.runtime.getURL("images/melanie_icon38_disabled.png")
        }
    });
    chrome.action.setTitle({ tabId: tabId, title: "Clacks icon is disabled" });
}

function illuminateClacksIcon(tabId) {
    if (DEBUG) console.log("illuminateClacksIcon: ", tabId);
    chrome.action.setIcon({
        "tabId": tabId,
        "path": {
            "19": chrome.runtime.getURL("images/melanie_icon19.png"),
            "38": chrome.runtime.getURL("images/melanie_icon38.png")
        }
    });
    chrome.action.setTitle({ tabId: tabId, title: "Clacks icon is active" });
}


// The main listener to check each request's headers for clacks
chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        if (DEBUG) console.log("Event fired for tabId:", details.tabId);
        var newClacks,
            // match case-insensitive, with or without 'X-' prefix
            pattern = /^(X-)?(Clacks-Overhead)$/i;

        // ignore background requests (where tabId === -1)
        if (details.tabId >= 0) {

            // get response headers and store those tagged as "Clacks-Overhead"
            // or "X-Clacks-Overhead"
            newClacks = details.responseHeaders.filter(function(header) {
                    if (DEBUG) console.log("header.name: ", header.name);
                    if (DEBUG) console.log("header.value: ", header.value);
                    return pattern.test(header.name);
                }).map(function(header) {
                    return header.value;
                }).join("\n");

            // if there are any Clacks-Overhead headers.
            if (newClacks) {
                if (DEBUG) console.log("newClacks: ", newClacks);
                // Store the resulting string under its tab's ID.
                // N.B. though it displays multiple messages from one request, separate
                // requests from one page load can still overwrite each other.
                // Note from Pete: I've change += to just = to stop it repeating itself.
                // - related to premature deletion? - don't think so...
                clacks[details.tabId] = newClacks;
                illuminateClacksIcon(details.tabId);
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
        if (DEBUG) console.log("onCommitted: ", details);
        if (details.transitionType !== "auto_subframe") {
            delete clacks[details.tabId];
            extinguishClacksIcon(details.tabId);
        }
    }
);

// listen to messages from content scripts
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (DEBUG) console.log("onMessage: ", request, sender);
        if (request.action === "setClacks") {
            var tabId = sender.tab.id;
        } else {
            var tabId = request.tabId; 
        }

        if (request.clacks) {
            if (clacks[tabId]) clacks[tabId] += "\n" + request.clacks;
            else clacks[tabId] = request.clacks;
        }

        // if there is a clacks entry for the loaded tab, show icon for that tab.
        if (clacks[tabId]) illuminateClacksIcon(tabId);
        sendResponse({ clacks: clacks[tabId] });
        // if (DEBUG) console.log("shown: ", shown[tabId]);
});

// Keeps the data store clean by deleting entries for tabs when they are closed.
chrome.tabs.onRemoved.addListener(function (tabId) {
    if (DEBUG) console.log("onRemoved: ", tabId);
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
