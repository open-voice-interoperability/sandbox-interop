
function ejGetAgentParams( someAgentName ){ //return object for this agent
  for (let i = 0; i < asistantTable.length; i++) {
    if( asistantTable[i].agent.name === someAgentName ){
      return asistantTable[i];
    }
  }
}
    
// Use this to get colors, urls, (eventually TTS voice index, etc)
// Get Assistant Info in your Browser JS like this:
	thisAgent = ejGetAgentParams( voiceName );
        if( thisAgent ){
          vIndex = thisAgent.agent.voiceIndex;
          aColor = thisAgent.agent.lightColor;
        }
// ...


const asistantTable = [
    {
      agent: {
        name: "myHuman",
        voiceIndex: 666,
        lightColor: "#ff6666",
        markerColor: "#b30000",
        serviceName: "HumanUser",
        serviceAddress: "OriginationPoint",
        authCode: "hugi666ikjjerg",
      }
    },
    {
      agent: {
      name: "assistantBrowser",
      voiceIndex: 999,
      lightColor: "#b3b3cc",
      markerColor: "#000000",
      serviceName: "AssistantCommunications",
      serviceAddress: "localhost:15445",
      authCode: "456398nns",
    }
  },
  {
    agent: {
      name: "Eva",
      voiceIndex: 142,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "localhost:15445",
      authCode: "h229k00m8bv",
      contentType: "application/json",
    }
  },
  {
    agent: {
      name: "Jake",
      voiceIndex: 141,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "WeatherAssistant",
      serviceAddress: "localhost:15445",
      authCode: "lekg99k9e",
      contentType: "application/json",
    }
  },
  {
    agent: {
      name: "wizard",
      voiceIndex: 133,
      lightColor: "#99e6e6",
      markerColor: "#29a3a3",
      serviceName: "DaVinci_LLM",
      serviceAddress: "https://www.asteroute.com/ovontest",
      authCode: "69jjg45cf0",
      contentType: "application/x-www-form-urlencoded",
    }
  },
  {
    agent: {
      name: "ovon_auto",
      voiceIndex: 142,
      lightColor: "#99e6e6",
      markerColor: "#29a3a3",
      serviceName: "Debbie_OVONAUTO",
      serviceAddress: "https://secondAssistant.pythonanywhere.com",
      authCode: "69jjg45cf0",
      contentType: "application/json",
    }
  },
]
