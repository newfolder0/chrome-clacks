// get clacks headers from background script
var clacks =  chrome.extension.getBackgroundPage().getClacks(),
    str = "";

// build popup text, stacking multiple headers on following lines
for (var i = 0; i < clacks.length; i++) {
    if (i > 0) str += "\n";
    str += clacks[i].value;
}

// put text in popup.html
document.getElementById("text").innerHTML = str;
