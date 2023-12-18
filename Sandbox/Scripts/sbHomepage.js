// Core-Basic functions for the Sandbox
var conversationID;
var msgLogDiv;
var selectedAssistantIndex= localStorage.getItem( "currentAssistantIndex" );
var assistantObject = assistantTable[selectedAssistantIndex];
var bareInviteSelected = false;
var InviteWithWhisper = false;

const agent = window.navigator.userAgent.toLowerCase();
const sbBrowserType =
  agent.indexOf('edge') > -1 ? 'edge'
    : agent.indexOf('edg') > -1 ? 'chromium based edge'
    : agent.indexOf('opr') > -1 && window.opr ? 'opera'
    : agent.indexOf('chrome') > -1 && window.chrome ? 'chrome'
    : agent.indexOf('trident') > -1 ? 'ie'
    : agent.indexOf('firefox') > -1 ? 'firefox'
    : agent.indexOf('safari') > -1 ? 'safari'
    : 'other';
localStorage.setItem( "sbBrowserType", sbBrowserType );

const sbOSType = getOS();

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
  loadAssistantSelect();
}
