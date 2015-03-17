// Create data store
var clacks = {};

// return clacks headers, called by popup to get them for display
function getClacks(tabId) {
    return clacks[tabId];
};

// The main listener to check each request's headers for "X-Clacks-Overhead"
chrome.webRequest.onCompleted.addListener(
    function(details) {
        var newClacks;

        // get response headers and store those tagged as "X-Clacks-Overhead"
        newClacks = details.responseHeaders.filter(function(header) {
                if (header.name === "X-Clacks-Overhead" || header.name === "Clacks-Overhead") return true;
                else return false;
        });

        // if there are any "X-Clacks-Overhead" headers.
        // Changed to display multiple messages from a single request.
        if (newClacks.length > 0) {
            var str = "";
            // Put the values of all of them together in multiple lines.
            // This means we aren't storing unneccessary data, at the cost
            // of a little extra processing at this point since we are already looping.
            // Alternatively, just extract the text values, so don't format
            // until display time.
            for (var i=0; i<newClacks.length; i++) {
                if (i > 0) str += "\n";
                str += newClacks[i].value;
            };
            // Store the resulting string under its tab's ID.
            // N.B. though it displays multiple messages from one request, separate
            // requests from one page load can still overwrite each other.
            // Note from Pete: I've change += to just = to stop it repeating itself.
            clacks[details.tabId] = str;
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
    if (change.status === "complete") {
        // if there is a clacks entry for the UPDATED tab, show icon for that tab.
        if (clacks[tabId]) {
            chrome.pageAction.show(tabId);
        }
    // if the update is loading, clean the clacks entries for the tab and hide the icon.
    // probably doesn't require the if statement.
    } else if (clacks[tabId]) {
        delete clacks[tabId];
        chrome.pageAction.hide(tabId);
    }
});
