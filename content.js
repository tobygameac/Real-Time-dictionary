var word;
var searchword = document.getElementById('searchword');
var search = document.getElementsByClassName('cdo-search-button')[0];
var needToUpdate = false;
var updateWaitForTime = 200;
var updateTime;

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.type == 'wordNow') {
      word = message.word;
      searchword.value = word;
    }
    if (message.type == 'highlight') {
      if (!needToUpdate) {
        searchword.setSelectionRange(0, searchword.value.length);
      }
    }
  }
);

function onKeyDown() {
  if (word == searchword.value) {
    return;
  }
  needToUpdate = true;
  updateTime = new Date().getTime() + updateWaitForTime;
}

searchword.onkeydown = onKeyDown;

function updateHandler() {
  if (needToUpdate && new Date().getTime() > updateTime) {
    word = searchword.value;
    chrome.runtime.sendMessage({type: 'wordUpdate', word: word});
    search.click();
  }
  setTimeout(
    function() {
      updateHandler();
    }
  , updateWaitForTime);
}

updateHandler();
