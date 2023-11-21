// Core-Basic functions for the Sandbox
var conversationID;
var msgLogDiv;
var selectedAssistantIndex= localStorage.getItem( "currentAssistantIndex" );
var assistantObject = assistantTable[selectedAssistantIndex];
var bareInviteSelected = false;
var InviteWithWhisper = false;

function sbStart(){
    localStorage.setItem( "currentConversationID", "" );
    loadAssistantSelect();
}
