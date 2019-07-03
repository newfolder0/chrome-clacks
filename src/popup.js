var tabId,
    clacks;

// Get the currently active tab in the focused window.
chrome.tabs.query(
    {active: true, lastFocusedWindow: true},
    function(tabs) {
        console.log("tabs: ", tabs);

        if (!tabs || !tabs.length) {
            return;
        }

        // get the tab ID of that current tab
        tabId = tabs[0].id;
        // get clacks headers from background script
        chrome.runtime.getBackgroundPage(
            function(bg) {
                clacks = bg.getClacks(tabId);
                // put text in popup.html
                document.getElementById("text").textContent = clacks;

                // animate icon
                var letterIndex = 0;
                var interval = 500;
                // var iconSize = 19; // icon size, 19 or 38 pixels

                // put icon in popup.html
                var iconURL = chrome.extension.getURL("images/backspindle_icons/Clacks19/Clacks-Blank-small.png");
                console.log(iconURL);
                document.getElementById("icon").src = iconURL;

                // animator loop
                var icon = setInterval(function() {
                    var str;

                    // get icon name
                    if (letterIndex == clacks.length) str = "Blank";
                    else if (clacks[letterIndex] == ' ') str = "SPACE";
                    else str = clacks[letterIndex].toUpperCase();

                    // make full string and set src in html
                    iconURL = chrome.extension.getURL("images/backspindle_icons/Clacks19/Clacks-" + str + "-small.png");
                    document.getElementById("icon").src = iconURL;

                    // iterate
                    letterIndex++;
                    if (letterIndex > clacks.length) letterIndex = 0;
                }, interval);
            }
        );
    }
);
