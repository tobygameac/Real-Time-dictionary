chrome.browserAction.onClicked.addListener(
  function(activeTab) {
    chrome.tabs.create({url: 'http://dictionary.cambridge.org/dictionary/english-chinese-traditional/'});
  }
);

var word = '';
var lastUpdateTime = new Date().getTime();

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    chrome.tabs.sendMessage(tabId, {type: 'wordNow', word: word});
  }
); 

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.type == 'wordUpdate'){
      word = message.word;
      lastUpdateTime = new Date().getTime();
    }
  }
);

var autoHighlightTime = 3000;

function highlight() {
  var now = new Date().getTime();
  var timeElapsed = (now - lastUpdateTime);
  if (timeElapsed > autoHighlightTime) {
    chrome.tabs.getAllInWindow(null,
      function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id, {type: 'highlight'});                         
        }
      }
    );
  }
  setTimeout(
    function() {
      highlight();
    }
  , autoHighlightTime);
}

highlight();
