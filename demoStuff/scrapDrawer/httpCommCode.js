      var ejComObjectOVON = null; // used to send http messages 
      var retOVONJSON;

      function ejTestOtherSrv( srvToken ) { //send to REMOTES
        var remoteURL = "";
        var ovonMsgToSend = "";
        var contentType = "application/x-www-form-urlencoded";
        var prefix = "";
        if( ejComObjectOVON == null ){
          try{
            ejComObjectOVON = new XMLHttpRequest();
          }catch(e){
            ejComObjectOVON = null;
            alert( 'Failed to make ejTalker communication object' );
            return false;
          }
          ejComObjectOVON.onreadystatechange=OVONstateChecker;
        }

        if( srvToken == 'DD' ){
          remoteURL = "https://secondAssistant.pythonanywhere.com";
          ovonMsgToSend = JSON.stringify(OVON_Engage_Debbie);
          contentType = "application/json";
        }else if( srvToken == 'ALAN'){
          remoteURL = "https://www.asteroute.com/ovontest";
          ovonMsgToSend = JSON.stringify(OVON_Engage_Allan);
          //remoteURL = "https://www.asteroute.com/debbieagent.html";
        }else if( srvToken == 'CASSANDRA'){
          ovonMsgToSend = "in=" + JSON.stringify(OVON_Engage_Anyone);
          remoteURL = "http://localhost:15445/clientEvent";
          //remoteURL = "http://ejtalk.com";
        }
      
        ///*
        if( ejComObjectOVON != null ){ // it is good so use it
          ejComObjectOVON.open( 'POST', remoteURL, true );
          ejComObjectOVON.send( null );
        }else{ // not so much
          alert( "Ajax object is NULL" );
        }
        setTimeout( "sendRequest( remoteURL )", ejTimeOutMS );
        //*/

        if( ejComObjectOVON != null ){  
          //msg = prefix + JSON.stringify(OVON_Engage_Anyone);
          ejComObjectOVON.open( 'POST', remoteURL, true );

          ejComObjectOVON.setRequestHeader("Content-type", contentType);
          ejComObjectOVON.send( ovonMsgToSend ); // send this to the ejTalker internal server
        }
      }

      function OVONstateChecker(){ // should something come in do this
        if( ejComObjectOVON.readyState == 4 ){
          if( ejComObjectOVON.status == 200 ){
            ejData = ejComObjectOVON.responseText;
            if( ejData.length ){
              retOVONJSON = JSON.parse(ejData);
              findUttOVON( retOVONJSON );
            }
          }
        }
      }

      function SpeakResponseOVON( oneEvent, indx, arr ){
        const type = oneEvent["event-type"];
        console.log(type);
        console.log(oneEvent);
        if( type == "utterance" ){
          say = oneEvent["parameters"]["dialog-event"].features.text.tokens[0].value;
          voice = oneEvent["parameters"]["dialog-event"]["speaker-id"];
          OvonSpeak( say, voice );
        //}else if( type == "assistant-return"){
        //  ejSetCookie( "ejAgentName", "cassandra" ); // Hack:W920
        //  ejLogonBasic( "agentHandOff", "ejAgentResume.step.xml", "localhost:15455" );
        }
      }

      function findUttOVON( OvonJson ){
        OvonJson.ovon.events.forEach(SpeakResponseOVON);
      }

