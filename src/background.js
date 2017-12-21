// import { attachHeadersListener } from 'chrome-sidebar'

console.log('Chrome Github Trending Sidebar Extension Registered')

chrome.browserAction.onClicked.addListener(tab => {
  console.log('Browser Action Triggered')
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.id, {
    file: 'Frame.js'
	})
})

// attachHeadersListener({
//   webRequest: chrome.webRequest,
//   overrideFrameOptions: true
// })
