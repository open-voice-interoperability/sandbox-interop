      var sbOVON_CommObject = null; // used to send http messages 
      var retOVONJSON;
      var textColor = "#ffffff";
      var voiceIndex = 0;
      var sbTimeout = 10000;
      var remoteURL = "";
      var contentType = "application/json";
      var jsonLOG;

      function sbPostToAssistant( assistantObject, OVONmsg ) { //send to their server
        if( sbOVON_CommObject == null ){
          try{
            sbOVON_CommObject = new XMLHttpRequest();
          }catch(e){
            sbOVON_CommObject = null;
            alert( 'Failed to make ejTalker communication object' );
            return false;
          }
          sbOVON_CommObject.onreadystatechange=sbOVONstateChecker;
        }

        remoteURL = assistantObject.assistant.serviceAddress;
        textColor = assistantObject.assistant.markerColor;
        voiceIndex = assistantObject.assistant.voiceIndex;
        contentType = assistantObject.assistant.contentType;
        assistantName = assistantObject.assistant.name;
       
        //setTimeout( "sendRequest( remoteURL )", sbTimeout );
        if( sbOVON_CommObject != null ){  
          jsonSENT = JSON.stringify( OVONmsg, null, "\t" );
          sbOVON_CommObject.open( 'POST', remoteURL, true );
//          sbOVON_CommObject.setRequestHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Method, Content-Type" );
//          sbOVON_CommObject.setRequestHeader('Content-Type', contentType );
//          sbOVON_CommObject.setRequestHeader("Access-Control-Allow-Method", 'POST' );
          if( assistantName == "einstein"){ // hack for openAI
            input = OVONmsg.ovon.events[0].eventType;
            if( input == "utterance"){
              input = OVONmsg.ovon.events[0].parameters.dialogEvent.features.text.tokens[0].value;
              sbOVON_CommObject.setRequestHeader('Authorization', "Bearer YourAuthCodeHere" );
              sbOVON_CommObject.setRequestHeader('Content-Type', "application/json" );
              jsonSENT = '{"model": "gpt-3.5-turbo","messages": [{"role": "user", "content": "'
              jsonSENT += input;
              jsonSENT += '."}],"temperature": 0.7}'
              sbOVON_CommObject.send( jsonSENT ); // send to server
            }
          }else{
            sbOVON_CommObject.send( JSON.stringify( OVONmsg ) ); // send to server
            var targ = document.getElementById("msgSENT");
            targ.innerHTML = jsonSENT;
          }

          jsonLOG += jsonSENT;
          localStorage.setItem( "jsonLOG", jsonLOG );
          //displayMsgLOG( jsonLOG, "#ffffff" ); // show the log so far
        }
      }

      function sbOVONstateChecker(){ // should something come in do this
        if( sbOVON_CommObject.readyState == 4 ){
          if( sbOVON_CommObject.status == 200 ){
            sbData = sbOVON_CommObject.responseText;
            if( sbData.length ){
              retOVONJSON = JSON.parse(sbData);
              jsonRECEIVED = JSON.stringify( retOVONJSON, null, "\t" );
              var targ = document.getElementById("msgRECEIVED");
              targ.innerHTML = jsonRECEIVED;

              jsonLOG += jsonRECEIVED;
              localStorage.setItem( "jsonLOG", jsonLOG );
              //displayMsgLOG( jsonLOG, "#ffffff" ); // show the log so far

              serviceEventsOVON( retOVONJSON );
            }
          }
        }
      }

      function RenderResponseOVON( oneEvent, indx, arr ){
        const type = oneEvent.eventType;
        console.log(type);
        console.log(oneEvent);
        if( type == "utterance" ){
          say = oneEvent.parameters.dialogEvent.features.text.tokens[0].value;  
          displayResponseUtterance( say, textColor)
          //OvonSpeak( say, voiceIndex );
      //}else if( type == "bye"){
      //  Do and "invite" to the previous Assistant
      //}else if( type == "invite"){
      //  Do "invite" to a new Assistant
        }
      }

      function serviceEventsOVON( OvonJson ){
        OvonJson.ovon.events.forEach(RenderResponseOVON);
      }

