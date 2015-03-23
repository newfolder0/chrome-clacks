// Find meta tags with clacks overhead
// ********** it would be so much better to match this with a regex or similar
// <meta http-equiv="X-Clacks-Overhead" content="GNU Terry Pratchett" />
var clacks = document.querySelectorAll("meta"),
    str = "",
    // match case-insensitive, with or without 'X-' prefix
    pattern = /^(X-)?(Clacks-Overhead)$/i;

// function nodeListToArray(nodeList) {
//     return [].slice.call(nodeList, 0);
// }

str = [].slice.call(clacks, 0)
    .filter(function(meta) {
        return pattern.test(meta.getAttribute("http-equiv"));
    })
    .map(function(node) {
		return node.getAttribute("content");
	})
    .join("\n");

// send clacks to background, even if empty, to trigger pageAction check
chrome.runtime.sendMessage({clacks: str});
