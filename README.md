hipmenu-checklist
=================

Turn a group order into an easy to manage checklist

### What's this? ###

hipmenu-checklist is a Chrome extension that generates a checklist based on your hipMenu order page. It aims to solve the issue of keeping track of people who payed when dealing with large group orders. hipmenu-checklist is available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/hipmenu-checklist/fdbmfcgckbobgefkgcbkdcjejcnoahag).

![hipmenu-checklist screenshot](https://raw.github.com/g4b1nagy/hipmenu-checklist/master/screenshot.png)

### How does it work? ###

When clicked, the extension tries to figure out whether you're on an `order in progress` page or on the `order history` page. It then proceeds to extract every name - price pair that is finds on the page (it will limit itself to your latest order, if you're on the `order history` page) and generates a checklist based on those. Since browser action popups are not persistent, sessionStorage is used to keep track of the checkbox states.

### Feeling generous? ###

Contributions are more than welcome. Feel free to tackle any issues you may have and send me a pull request afterwards.
