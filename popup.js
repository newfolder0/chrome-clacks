// get clacks headers from background script
var tabId,
    clacks,
    str = "";

chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
}, function(tabs) {
    tabId = tabs[0].id;

    // poor use of callbacks I think
    chrome.runtime.getBackgroundPage(function(bg) {
        clacks = bg.getClacks(tabId);

        // console.log(tabId);
        // console.log(clacks);

        // build popup text, stacking multiple headers on following lines
        for (var i = 0; i < clacks.length; i++) {
            if (i > 0) str += "\n";
            str += clacks[i].value;
        }

        // put text in popup.html
        document.getElementById("text").innerHTML = str;
    })
});
