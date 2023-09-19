
function ejGetAgentParams( someAgentName ){ //return object for this agent
  for (let i = 0; i < asistantTable.length; i++) {
    if( asistantTable[i].agent.name === someAgentName ){
      return asistantTable[i];
    }
  }
}
    
// ...
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
      name: "NLU_Service",
      voiceIndex: 999,
      lightColor: "#b3b3cc",
      markerColor: "#b30000",
      serviceName: "SemanticExtraction",
      serviceAddress: "localhost:15445",
      authCode: "7dde453008mn",
    }
  },
  {
    agent: {
      name: "HistoryService",
      voiceIndex: 999,
      lightColor: "#b3b3cc",
      markerColor: "#b30000",
      serviceName: "HistoryDataStore",
      serviceAddress: "localhost:15445",
      authCode: "7dde97885xxd",
    }
  },
  {
    agent: {
      name: "cassandra",
      voiceIndex: 140,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "localhost:15445",
      authCode: "h229k00m8bv",
      contentType: "application/x-www-form-urlencoded",
    }
  },
  {
    agent: {
      name: "bond",
      voiceIndex: 132,
      lightColor: "#99e6e6",
      markerColor: "#29a3a3",
      serviceName: "JamesBondSecretAgent",
      serviceAddress: "localhost:15445",
      authCode: "69jjg45cf0",
    }
  },
  {
    agent: {
      name: "penelope",
      voiceIndex: 136,
      lightColor: "#b3b3cc",
      markerColor: "#b30000",
      serviceName: "DaughterOfCassandra",
      serviceAddress: "localhost:15445",
      authCode: "y99r5200mkl",
    }
  },
  {
    agent: {
      name: "george",
      voiceIndex: 111,
      lightColor: "#80ff80",
      markerColor: "#339900",
      serviceName: "PharmacyBot",
      serviceAddress: "localhost:15445",
      authCode: "di449888nkp89",
    }
  },
  {
    agent: {
      name: "galileo",
      voiceIndex: 163,
      lightColor: "#ffdf80",
      markerColor: "#ffdf80",
      serviceName: "PlanetaryAssistant",
      serviceAddress: "localhost:15445",
      authCode: "666ok999dk",
    }
  },
  {
    agent: {
      name: "matahari",
      voiceIndex: 213,
      lightColor: "#b3b3cc",
      markerColor: "#b30000",
      serviceName: "ExoticAssistant",
      serviceAddress: "localhost:15445",
      authCode: "u00089734sd",
    }
  },
  {
    agent: {
      name: "juliet",
      voiceIndex: 130,
      lightColor: "#b3b3cc",
      markerColor: "#b30000",
      serviceName: "BistroMaître-d",
      serviceAddress: "localhost:15445",
      authCode: "5693ddf09jl",
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
      name: "ovon auto",
      voiceIndex: 142,
      lightColor: "#80ff80",
      markerColor: "#339900",
      serviceName: "Debbie_OVONAUTO",
      serviceAddress: "https://secondAssistant.pythonanywhere.com",
      authCode: "69jjg45cf0",
      contentType: "application/json",
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
