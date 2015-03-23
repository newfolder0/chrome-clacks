var DEBUG = true;

// Create data store
var clacks = {};

// log stuff, do with this function to make it easily modifiable
function log() {
    var args = [];
    for (var i = 0; i < arguments.length; ++i) args[i] = arguments[i];
    if (DEBUG) console.log(args.join(''));
}

// return clacks headers, called by popup to get them for display
function getClacks(tabId) {
    return clacks[tabId];
};

// The main listener to check each request's headers for clacks
chrome.webRequest.onCompleted.addListener(
    function(details) {
        var tabId = details.tabId,
            // match case-insensitive, with or without 'X-' prefix
            pattern = /^(X-)?(Clacks-Overhead)$/i;

        // ignore background requests (where tabId === -1)
        if (tabId >= 0) {

            log("webRequest.onCompleted - triggered tab ", tabId);

            // get response headers and store those tagged as "Clacks-Overhead"
            // or "X-Clacks-Overhead"
            var newClacks = details.responseHeaders.filter(function(header) {
                    return pattern.test(header.name);
                }).map(function(header) {
                    return header.value;
                }).join("\n");

            log("newClacks = ",newClacks);

            // if there are any Clacks-Overhead headers.
            if (newClacks) {
                // Store the resulting string under its tab's ID.
                // N.B. though it displays multiple messages from one request, separate
                // requests from one page load can still overwrite each other.
                // Note from Pete: I've change += to just = to stop it repeating itself.
                // - related to premature deletion? - don't think so...
                log("webRequest.onCompleted - store");
                clacks[tabId] = newClacks;
                chrome.pageAction.show[tabId];
            }
        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

// clear clacks on navigation to a new page
chrome.webNavigation.onCommitted.addListener(
    function(details) {
        var tabId = details.tabId;

        if (tabId >= 0 &&
            details.transitionType !== "auto_subframe" &&
            details.transitionType !== "reload") {
                
                log("webNavigation.onCommitted - type = ", details.transitionType ," - delete");
                delete clacks[tabId];
                chrome.pageAction.hide(tabId);
        }
    }
);

// listen to messages from content scripts
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (tabId >= 0) {
            var tabId = sender.tab.id;

            if (request.clacks) {
                if (clacks[tabId]) clacks[tabId] += "\n" + request.clacks;
                else clacks[tabId] = request.clacks;
            }

            // if there is a clacks entry for the loaded tab, show icon for that tab.
            log("runtime.onMessage - show");
            if (clacks[tabId]) chrome.pageAction.show(tabId);
            // if (DEBUG) console.log("shown: ", shown[tabId]);
        }
    }
);

// Keeps the data store clean by deleting entries for tabs when they are closed.
chrome.tabs.onRemoved.addListener(
    function (tabId) {
        if (clacks[tabId]) {
            log("tabs.onRemoved - delete");
            delete clacks[tabId];
        }
    }
);

// Possible code for filtering duplicate strings
// function uniqueStrings(list) {
//     var set = {}, i;
//     for (i in list) {
//         set[list[i]] = true;
//     }
//     return Object.keys(set);
// }
