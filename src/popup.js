var tabId,
    clacks;

// Get the currently active tab in the focused window.
chrome.tabs.query(
    { active: true, lastFocusedWindow: true },
    function (tabs) {
        console.log("tabs: ", tabs);

        if (!tabs || !tabs.length) {
            return;
        }

        // get the tab ID of that current tab
        tabId = tabs[0].id;
        // get clacks headers from background script
        chrome.runtime.sendMessage({ action: "getClacks", tabId: tabId }, function(response) {
    
            // If there's a response with clacks data, update the popup
            if (response && response.clacks) {
                clacks = response.clacks;
                document.getElementById("text").textContent = clacks;
    
                // Animate icon
                var letterIndex = 0;
                var interval = 500;
                // var iconSize = 19; // icon size, 19 or 38 pixels
    
                // Put the initial icon in popup.html
                var iconURL = chrome.runtime.getURL("images/backspindle_icons/Clacks19/Clacks-Blank-small.png");
                document.getElementById("icon").src = iconURL;
    
                // Animator loop to display the clacks letters
                var icon = setInterval(function() {
                    var str;
    
                    // Get the icon name based on the clacks content
                    if (letterIndex == clacks.length) str = "Blank";
                    else if (clacks[letterIndex] == " ") str = "SPACE";
                    else str = clacks[letterIndex].toUpperCase();
    
                    // Construct the icon URL and update the src
                    iconURL = chrome.runtime.getURL("images/backspindle_icons/Clacks19/Clacks-" + str + "-small.png");
                    document.getElementById("icon").src = iconURL;
    
                    // Iterate to the next letter
                    letterIndex++;
                    if (letterIndex > clacks.length) letterIndex = 0;
                }, interval);
            } else {
                document.getElementById("text").textContent = "No clacks data available.";
            }
        });
    }
);
