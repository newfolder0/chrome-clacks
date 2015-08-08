var tabId,
    clacks;

// Get the currently active tab in the focused window.
chrome.tabs.query(
    {active: true, lastFocusedWindow: true},
    function(tabs) {
        console.log("tabs: ", tabs);
        // get the tab ID of that current tab
        tabId = tabs[0].id;
        // get clacks headers from background script
        chrome.runtime.getBackgroundPage(
            function(bg) {
                clacks = bg.getClacks(tabId);
                // put text in popup.html
                document.getElementById("text").textContent = clacks;

                // put icon in popup.html
                // no idea why this doesn't work
                var iconURL = chrome.extension.getURL("images/backspindle_icons/Clacks19/Clacks-Blank-small.png");
                console.log(iconURL);
                document.getElementById("icon").src = iconURL;

                // animate
                var letterIndex = 0;

                var icon = setInterval(function() {
                    console.log(clacks[letterIndex]);

                    var str;

                    if (letterIndex == clacks.length) str = "Blank";
                    else if (clacks[letterIndex] == ' ') str = "SPACE";
                    else str = clacks[letterIndex].toUpperCase();

                    iconURL = "images/backspindle_icons/Clacks19/Clacks-" + str + "-small.png";
                    document.getElementById("icon").src = iconURL;

                    letterIndex++;
                    if (letterIndex > clacks.length) letterIndex = 0;
                }, 500);
            }
        );
    }
);
