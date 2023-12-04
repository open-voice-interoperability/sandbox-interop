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


function sbStart(){
    localStorage.setItem( "currentConversationID", "" );
    loadAssistantSelect();
}
