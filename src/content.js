// Find meta tags with clacks overhead
// ********** it would be so much better to match this with a regex or similar
// <meta http-equiv="X-Clacks-Overhead" content="GNU Terry Pratchett" />
var clacks = document.querySelectorAll("meta[http-equiv='X-Clacks-Overhead']"
                                    || "meta[http-equiv='x-clacks-overhead']"
                                    || "meta[http-equiv='Clacks-Overhead']"
                                    || "meta[http-equiv='clacks-overhead']"),
    str = "";

// get text content from clack meta tags, first item outside loop to avoid newline
if (clacks[0]) str += clacks[0].getAttribute('content');
for (i=1; i<clacks.length; i++) str += "\n"+clacks[i].getAttribute('content');

// send clacks to background, even if empty, to trigger pageAction check
chrome.runtime.sendMessage({clacks: str});
