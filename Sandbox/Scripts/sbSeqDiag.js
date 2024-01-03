
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
  
function saveSequenceDiagram( data ) {
  // ========== Write the sequence data file
  //var name = "AT_ROOT:reports/seqDiagram/SD" + cleanDateTimeString() + ".json";
  //writeFile( name, JSON.stringify( data, null, "\t" ) );
}

function sbLoadSeq(){
  //assistantTable = await fetchAssistantData();

  document.getElementById("BrowserType").innerText = sbBrowserType;
  document.getElementById("OSType").innerText = sbOSType;

  console.log(d3.version)
  var JSQ = localStorage.getItem( "seqDiagJSON" );
  const data = JSON.parse( JSQ );
  
  // set the seqDiagram directory???
  //var reportPath = "AT_ROOT:reports/seqDiagram/";

  var svg = d3.select('svg#sbSeqDiag'),
    margin = { top: 30, right: 50, bottom: 100, left: 80 },
    width = +svg.attr('width') - margin.left - margin.right,
    height = +svg.attr('height') - margin.top - margin.bottom,
    g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var froms = d3.set(data.map(function(d){ return d.from; })).values();
  var tos = d3.set(data.map(function(d){ return d.to; })).values();
  var classes = _.union(froms, tos);

  sbMoveToHead( classes, "NLU_Service");
  sbMoveToHead( classes, "assistantBrowser");
  sbMoveToHead( classes, "myHuman");

  console.log(data);
  console.log(froms);
  console.log(classes);
  console.log(classes.length);

var XPAD = 100;
var YPAD = 30;
var VERT_SPACE = parseInt(width/classes.length);
var VERT_PAD = 20;

var MESSAGE_SPACE = 30;
console.log(data.length*MESSAGE_SPACE);
svg.attr("height", (data.length+2)*MESSAGE_SPACE);

var MESSAGE_LABEL_X_OFFSET = -40;
var MESSAGE_LABEL_Y_OFFSET = 75;
var MESSAGE_ARROW_Y_OFFSET = 80;    

var CLASS_WIDTH = VERT_SPACE-10;
var CLASS_LABEL_X_OFFSET = -30;
var CLASS_LABEL_Y_OFFSET = 25;

// Draw vertical (Assistant) bars
classes.forEach(function(c, i) {
  var draw = true;
  var color = getClassColor( c );
  if( draw ){
    var line = svg.append("line")
    .style("stroke", color)
    .style("stroke-width", "110")
    .attr("x1", XPAD + i * VERT_SPACE)
    .attr("y1", YPAD)
    .attr("x2", XPAD + i * VERT_SPACE)
    .attr("y2", YPAD + VERT_PAD + data.length * (MESSAGE_SPACE+5));
  }
});

// Draw classes
classes.forEach(function(c, i) {
  if( c!="" ){
    var x = XPAD + i * VERT_SPACE;
    var g1 = svg.append("g")
      .attr("transform", "translate(" + x + "," + YPAD + ")")
      .attr("class", "class-rect")
      .append("rect")
      .attr({x: -CLASS_WIDTH/2, y:0, width: CLASS_WIDTH, height: "24px"});
  }
});

// Draw class labels
classes.forEach(function(c, i) {
  if( c!="" ){
    var x = XPAD + i * VERT_SPACE;
    var g1 = svg.append("g")
      .attr("transform", "translate(" + x + "," + YPAD + ")")
      .append("text")
      .attr("class", "class-label")
      .attr("text-anchor", "middle")
      .text(function (d) { return c; })
      .attr("dy", "16px");
  }
});

// Draw sMsg arrows
data.forEach(function(m, i) {
  var draw = true;
  var y = MESSAGE_ARROW_Y_OFFSET + (i) * MESSAGE_SPACE;
  if( m.from != m.to ){
    //var color=getArrowColor( m.from );
    var color=getArrowColor( m );
    var line = svg.append("line")
      .style("stroke", color )
      .style("stroke-width", "2")
      .attr("x1", XPAD + classes.indexOf(m.from) * VERT_SPACE)
      .attr("y1", y)
      .attr("x2", XPAD + classes.indexOf(m.to) * VERT_SPACE)
      .attr("y2", y)
      .attr("marker-end", "url(#end)")
      .attr("stroke", color )
      .append("text")
      .text(function (d) { return m.sourcetype; });
 }else{
    var line = svg.append("line")
      .attr("x1", classes.indexOf(m.from) * VERT_SPACE)
      .attr("y1", y )
      .attr("x2", classes.indexOf(m.to) * VERT_SPACE)
      .attr("y2", y)
      .append("text")
      .attr("text-anchor", "middle")
      .text(function (d) { return m.sourcetype; });
  }
  });

// Draw sMsg indices
data.forEach(function(m, i) {
  var xPos = 20;
  var yPos = MESSAGE_LABEL_Y_OFFSET + i * MESSAGE_SPACE;

  var g1 = svg.append("g")
    .attr("transform", "translate(" + xPos + "," + yPos + ")")
    .attr("class", "first")
    .attr("text-anchor", "middle")
    .append("text")
    .style("font-size", "16px")
    .text(function (d) { return i+1; });
});

// Draw sMsg labels
data.forEach(function(m, i) {
  var xPos = XPAD + MESSAGE_LABEL_X_OFFSET + (((classes.indexOf(m.to) - classes.indexOf(m.from)) * VERT_SPACE) / 2) + (classes.indexOf(m.from)  * VERT_SPACE);
  var xPos = xPos - 15;
  var yPos = MESSAGE_LABEL_Y_OFFSET + i * MESSAGE_SPACE;
  var msgBox = "classArrowMsg";
  var fontWT = 400; // note only 400/700 (normal/bold) work with d3
  if( m.from == m.to ){
    fontWT = 700;
    msgBox = "classInnerAgentMsg";
  }

  var g1 = svg.append("g")
    .attr("transform", "translate(" + xPos + "," + yPos + ")")
    .append("text")
    .attr("dx", "5px")
    .attr("dy", "-2px")
    .attr("text-anchor", "begin")
    .style("font-size", "14px")
    .attr("font-weight",fontWT )
    .attr("fill", function(d,i) {return getArrowColor( m );})
    .text(function (d) { return m.sMsg; });
});

// Arrow style
svg.append("svg:defs").selectAll("marker")
  .data(["end"])      
  .enter().append("svg:marker")
  .attr("id", String)
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 10)
  .attr("refY", 0)
  .attr("markerWidth", 10)
  .attr("markerHeight", 7)
  .attr("orient", "auto")
  .append("svg:path")
  .attr("d", "M0,-5L10,0L0,5");
}

function sbMoveToHead( arrayName, valueToMove ){
  var index = arrayName.indexOf( valueToMove );
  if( index > -1 ){
    arrayName.splice(index, 1);
    arrayName.unshift(valueToMove);
  }
}

function getClassColor( className ){
  var c = sbGetAgentParams( className );
  if( c ){
    return c.lightColor;
  }else{
    return "#b3b3cc";
  }
}

function getArrowColor( lineItem ){
  var className = lineItem.noteColor;
  if( className.length == 0){
    className = lineItem.from;
  }
  var c = sbGetAgentParams( className );
  if( c ){
    return c.markerColor;
  }else{
    return "#5c5c8a";
  }
}
