
var seqDiagJSON = new Object();
seqDiagJSON = [];

function stuffToPutInTheStart(){ // just a note of start stuff
    loadVoiceSelect();
    ejSetCookie( "reListen", "false" );
    localStorage.setItem( "uttCount", 0 );
    localStorage.setItem( "sequenceLog", "" );
  
    localStorage.setItem( "thisExchPacket", "" );
    localStorage.setItem( "exchangePacket", "" );
    localStorage.setItem( "thisExchPacketJSON", "" );
    localStorage.setItem( "exchangePacketJSON", "log" );
  
    localStorage.setItem('sessionServerMsgLog', '');
    seqDiagJSON = [];
}

function buildSeqDiagJSON( from, to, shortM, longM, changeColor ){
    const line = new Object();
    line.from = from;
    line.to = to;
    line.sMsg = shortM;
    line.lMsg = longM;
    line.noteColor = changeColor;
  
    seqDiagJSON.push( line );
  }
  
function ejClearSeqDiag(){
    seqDiagJSON = [];
    localStorage.setItem( "seqDiagJSON", "" );
  }
  