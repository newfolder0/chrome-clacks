# Chrome-Clacks
[![GitHub](https://img.shields.io/badge/GitHub-newfolder0/chrome--clacks-blue?logo=github)](https://github.com/newfolder0/chrome-clacks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/newfolder0/chrome-clacks/blob/master/LICENCE)
[![Chrome Web Store](https://img.shields.io/badge/chrome_web_store-Clacks_Overhead_--_GNU_Terry_Pratchett-e0c68c?logo=chromewebstore&logoColor=ffffff)](https://chrome.google.com/webstore/detail/clacks-overhead-gnu-terry/lnndfmobdoobjfcalkmfojmanbeoegab)

A Chrome Extension that keeps Terry Pratchett's name alive in your browser.

To quote the twitter account of the great man himself:
> "AT LAST, SIR TERRY, WE MUST WALK TOGETHER."
>
> Terry took Death's arm and followed him through the doors and on to the black
desert under the endless night.

Learn more about [GNU Terry Pratchett](http://www.gnuterrypratchett.com/)


# Getting Started

If you are only interested in using the extension, you can install it via the [Chrome Web Store](https://chrome.google.com/webstore/detail/clacks-overhead-gnu-terry/lnndfmobdoobjfcalkmfojmanbeoegab)

### 1. Download the extension by cloning the repository

```bash
git clone https://github.com/newfolder0/chrome-clacks.git
```
### 2. Load the extension in Chrome

1. Prepare the extension files:
  * Ensure that the extension code (including manifest.json and other necessary files) is in a single folder.
2. Open Chrome’s Extension Management Page:
  * Open Google Chrome.
  * In the address bar, type `chrome://extensions/` and press Enter. This will open the Chrome Extensions page.
3. Enable Developer Mode:
  * In the top-right corner of the Extensions page, toggle the Developer mode switch on. This will enable options to load unpacked extensions.
4. Load the Unpacked Extension:
  * Click the “Load unpacked” button.
  * In the file browser that opens, navigate to the folder where your extension files are located. Select the folder and click Open.
  * Chrome will now load the extension, and it should appear in the list of extensions.
5. Make your changes and Reload:
* As you continue developing, you can make changes to your extension’s files.
* After saving changes, return to the Extensions page and click the Reload button (a circular arrow) under your extension to apply the updates.

### 3. Run Tests

To run the tests, follow these steps:

1. Install the required dependencies:

```bash
npm install
```

2. Run the test suite using jest

```bash
npm test
```

### 4. Make a pull request

See [this github guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) for how to make pull requests.

# Contributors:
* Peter Bell (original author)
* Charlie Wheeler-Robinson (bug hunting, refactoring, improving in early versions)
* Jimmy Nyström (code)
* Melanie Wilberforce (icons)
* Rob Grundy (who made the Firefox extension) for sending me the clacks icons used in the animation
* Backspindle Games for producing the clacks icons in the animation
* Sap1ens, jwakely, and Amy Atha-Nicholls (generously offering new icons)
* yousuf811 on Github (squashing bugs)
* Jarek Glowacki for some CSS help
* [@hmk](https://github.com/hmk) for manifestv3 and testing

-See GitHub issues and pull requests for others

A big thank you to all of the lovely people who sent new icons (listed above)!

# Contact
The Chrome Developer Dashboard sucks and doesn't notify me of feedback - I try
to keep an eye on it but if I don't reply, email me (devpete0@gmail.com). I take
no responsibility for any impact on browser performance as a result of this
extension, though I believe it should be negligible. I use this extension myself
and am completely open to suggestions or improvements.


# Note: Permissions
There are people complaining about the permissions required. That's fair
enough, I would be too. The latest versions need 'webNavigation' permissions for reading the HTML meta tags (a feature which a lot of people were asking for). That is what requires access to web page content. The original permissions required by older versions were for webRequest, which is necessary for the basic HTTP header interception. 

As far as I know, there isn't a better way of doing
it. If you have a better way, feel free to contribute.

If you are still concerned I suggest downloading it directly from Github
(link above) so you know exactly what you are getting, you just won't get
automatic updates. I wish there was a way to transparently publish directly fromthe public version on Github but as far as I know, the only way is to upload zip files myself. There is no way I can guarantee I haven't changed anything in
between.
