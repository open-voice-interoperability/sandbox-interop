// Core-Basic functions for the Sandbox
var assistantTable; 
var conversationID;
var msgLogDiv;
var assistantObject;
var selectedAssistantIndex;

// var assistantObject = assistantTable[selectedAssistantIndex];
var bareInviteSelected = false;
var InviteWithWhisper = false;


var logsWindow = null;
var seqDiagramWindow = null;
var settingsWindow = null;
var homeWindow = null;

function openOrFocusTab(url) {
  console.log(window.top.length)
    var targetWindow = null;
    switch (url) {
        case 'logs.html':
            targetWindow = logsWindow;
            break;
        case 'sbSequenceDiag.html':
            targetWindow = seqDiagramWindow;
            break;
        case 'sbSettings.html':
            targetWindow = settingsWindow;
            break;
        case 'sbHome.html':
            targetWindow = homeWindow;
            break;
        default:
            break;
    }
    if (!targetWindow || targetWindow.closed) {
      if (url === 'sbHome.html' && homeWindow && !homeWindow.closed) {
            targetWindow = homeWindow;
        } else {
            targetWindow = window.open(url, '_blank');
        }
    } else {
        targetWindow.focus();
    }
    // Update the window variable based on the URL
    switch (url) {
        case 'logs.html':
            logsWindow = targetWindow;
            break;
        case 'sbSequenceDiag.html':
            seqDiagramWindow = targetWindow;
            break;
        case 'sbSettings.html':
            settingsWindow = targetWindow;
            break;
        case 'sbHome.html':
            homeWindow = targetWindow;
            break;
        default:
            break;
    }
}

var sbBrowserType;
const agent = window.navigator.userAgent.toLowerCase();
sbBrowserType =
  agent.indexOf('edge') > -1 ? 'edge'
    : agent.indexOf('edg') > -1 ? 'chromium based edge'
    : agent.indexOf('opr') > -1 && window.opr ? 'opera'
    : agent.indexOf('chrome') > -1 && window.chrome ? 'chrome'
    : agent.indexOf('trident') > -1 ? 'ie'
    : agent.indexOf('firefox') > -1 ? 'firefox'
    : agent.indexOf('safari') > -1 ? 'safari'
    : 'other';
localStorage.setItem( "sbBrowserType", sbBrowserType );

var sbOSType;
sbOSType = getOS();

function getOS() {
  const userAgent = window.navigator.userAgent,
      platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
      macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }
  return os;
}

function sbStart(){      
  document.getElementById("BrowserType").innerText = sbBrowserType;
  document.getElementById("OSType").innerText = sbOSType;
  localStorage.setItem( "currentConversationID", "" );
}
