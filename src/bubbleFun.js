/* File Name: bubbleFun.js
 * Afto to arxeio filoksenei sinartiseis sxetikes me to bubble vis.
 *
 */
var rootOffcetX = 6750;
var rootOffcetY = 0;

var g_vis = null;
var grid = null;
var g_yearLabels = null;
var labsLabels = null;
var typeLabels = null;
var bubbles = null;
var labs = null;

var svg = null;
var slider = document.getElementById('slider');
slider.setAttribute('disabled', true);			//Apenergopoiisi tou slider gia na min mporei na xrisimopoiithei mexri h optikopoiisi na einai etimh.
var bubbleClicked = null;
var dColor = null;
var list1_of_disabled_bubbles = []; //lista me tis alages gia na kseroume ti tha ginei diafano apo to filtro 1
var list2_of_disabled_bubbles = []; //lista me tis alages gia na kseroume ti tha ginei diafano apo to filtro 2
var select = document.getElementById('input-select');
var select2 = document.getElementById('input-select2');

// @v4 strength to apply to the position forces
var forceStrength = 0.05; //force sto to positioning twn kendrwn twn fisalidwn
var forceStrengthRadius = 0.1; // dinami apothisis ths aktinas
var fixedDistRadius = 1.8; // aktina apothisis (1.8)
var dClickForceStrengthRadius = 0.1; // otan kaneis duble Click
////////////////////////////////////////////////////////////////

// Constants for sizing
//var width = window.innerWidth;
//var height = window.innerHeight;

var width = 8000;  //3000
var height = 700; //540

// Locations to move bubbles towards, depending
// on which view mode is selected.
var center = { x: 2 * width / year_size + 100 , y: height / 8 + 200};

var start_year=1989 ;
var end_year= 2019;
var year_size= (end_year - start_year) + 1 ;

var offset  = 10;
var yearCenters = {} ;
var counter = 0;
for(i=start_year; i<=end_year; i++){
	counter++;
	yearCenters[i] =( { x: counter * width / year_size + offset} );
}

var offset2 = 10;
var yearsTitleX = {};
var counter = 0;
for(i=start_year; i<=end_year; i++){
	counter++;
	yearsTitleX[i] =( ( (counter * width / year_size) + offset2) );
}

var lala = {};
for(i=0; i<=100; i++){
	lala[i] = i ;
}

width = (yearsTitleX[end_year]) + 250;


offset  = 0;
offset2 = 0;

var typeCenters = {
	"article":      	{  y: 2 * height / 8 + offset },
	"inproceedings":   	{  y: 3 * height / 8 + offset },
	"techreport":      	{  y: 4 * height / 8 + offset },
	"book": 			{  y: 5 * height / 8 + offset },
	"incollection": 	{  y: 6 * height / 8 + offset },
	"misc": 			{  y: 7 * height / 8 + offset }
};

// Y locations of the type titles.
var typeTitleY = {
	"article":          ( 2 * height / 8 + offset2 ),
	"inproceedings":   	( 3 * height / 8 + offset2 ),
	"techreport":      	( 4 * height / 8 + offset2 ),
	"book": 		    ( 5 * height / 8 + offset2 ),
	"incollection":   	( 6 * height / 8 + offset2 ),
	"misc": 			( 7 * height / 8 + offset2 )
};


var pubTypes = ["Επιστημονικό άρθρο","Ευρεσιτεχνία","Αναφορά","Βιβλίο","Διάσκεψη","Διάφορα"]
 

offset  = -10;
offset2 = -10;
numberOfLabsPos = 11; // Panda kata 2 megalitero apo to Labs


var labTitleY = {
	"Laboratory of Algebraic and Geometric Algorithms":     ( 2 * height / numberOfLabsPos + offset2 ),
	"Computer Graphics group":      						( 3 * height / numberOfLabsPos + offset2 ),
	"Pervasive Computing Research Group":      				( 4 * height / numberOfLabsPos + offset2 ),
	"Management of Data Information and Knowledge Group":   ( 5 * height / numberOfLabsPos + offset2 ),
	"Signal and Image Processing Group":      		    	( 6 * height / numberOfLabsPos + offset2 ),
	"Advanced Networking Research group": 					( 7 * height / numberOfLabsPos + offset2 ),
	"Software Centric and Autonomic Networking":            ( 8 * height / numberOfLabsPos + offset2 ),
	"Green, Adaptive and Intelligent Networking Group":     ( 9 * height / numberOfLabsPos + offset2 ),
	"Teaching and Language Technology Group":               ( 10 * height / numberOfLabsPos + offset2 )
};

var labsCenters = {
	"Laboratory of Algebraic and Geometric Algorithms":     {  y: 2 * height / numberOfLabsPos + offset },
	"Computer Graphics group":   							{  y: 3 * height / numberOfLabsPos + offset },
	"Pervasive Computing Research Group":       			{  y: 4 * height / numberOfLabsPos + offset },
	"Management of Data Information and Knowledge Group":   {  y: 5 * height / numberOfLabsPos + offset },
	"Signal and Image Processing Group": 		            {  y: 6 * height / numberOfLabsPos + offset },
	"Advanced Networking Research group":  					{  y: 7 * height / numberOfLabsPos + offset },
	"Software Centric and Autonomic Networking":            {  y: 8 * height / numberOfLabsPos + offset },
	"Green, Adaptive and Intelligent Networking Group":  	{  y: 9 * height / numberOfLabsPos + offset },
	"Teaching and Language Technology Group":               {  y: 10 * height / numberOfLabsPos + offset }
};


var researchLabs = ["Laboratory of Algebraic and Geometric Algorithms",
					"Computer Graphics group",
					"Pervasive Computing Research Group",
					"Management of Data Information and Knowledge Group",
					"Signal and Image Processing Group",
					"Advanced Networking Research group",
					//"Software Centric and Autonomic Networking",
					"Green, Adaptive and Intelligent Networking Group",
					"Teaching and Language Technology Group"
					];


/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    console.log(error);
  }

  //console.log(data);

  myBubbleChart('#vis', data);
}

/*
 * - Manipulation Functions -
 */
var initialRadius = 4; //#r
function filterNodes(rawData){
	console.log(rawData);	
	var myNodes = rawData.map(function (d) {

		var tempLab = urlToLabs(d.labLink);
		var tempLabLink = d.labLink.split(",");;

		if(tempLab == null){
			var labsList = d.labLink.split(",");
			tempLab = urlToLabs(labsList[0]);  //pernei to proto ergastirio pou yparxei stin lista twn data sto pedio labLink.
			tempLabLink = labsList[0];
			console.log(tempLabLink)
		}

		if(d.year>=start_year && d.year<=end_year)
			return {
				id: d.id,
				radius: initialRadius, //  initialRadius = 4
				authors: d["Συγγραφείς"],
				name: d.title,
				type: d.type,
				year: d.year,
				lab: tempLab,
				labLink: tempLabLink[0],
				link: d.link,
				x: Math.random() * 900,
				y: Math.random() * 800
			};
		else
			return 0;
	});

	// sort them to prevent occlusion of smaller nodes.
	//myNodes.sort(function (a, b) { return b.value - a.value; });
	return myNodes;

}


/*
 * - Manipulation Functions -
 */

function filterTextNodes(data){

	var myNodes = data.map(function (d) {
		return {
			id: d.id,
			lab: d.lab,
			x: 0,
			y: 0    //#f
		};
	});

	// sort them to prevent occlusion of smaller nodes.
	//myNodes.sort(function (a, b) { return b.value - a.value; });
	return myNodes;

}



/*
* This data manipulation function takes the raw data from
* the CSV file and converts it into an array of node objects.
* Each node will store data and visualization values to visualize
* a bubble.
*
* rawData is expected to be an array of data objects, read in from
* one of d3's loading functions like d3.csv.
*
* This function returns the new node array, with a node in that
* array for each element in the rawData input.
*/
function createNodes(rawData) { 

	// Use map() to convert raw data into node data.
	// Checkout http://learnjsdata.com/ for more on
	// working with data.
	var tempLab = "";
	var myNodes = rawData.map(function (d) {

		tempLab = urlToLabs(d.labLink);

		if(tempLab == null){
			var labsList = d.labLink.split(",");
			tempLab = urlToLabs(labsList[0]);  //pernei to proto ergastirio pou yparxei stin lista twn data sto pedio labLink.
		}

		if(d.year>=2010 && d.year<=2020)
			return {
				id: d.id,
				radius: initialRadius, //  initialRadius = 4
				value: d.author,
				name: d.title,
				type: d.type,
				year: d.year,
				lab: tempLab,

				x: Math.random() * 900,
				y: Math.random() * 800
			};
		else
			return 0;
	});

	// sort them to prevent occlusion of smaller nodes.
	//myNodes.sort(function (a, b) { return b.value - a.value; });
	return myNodes;
}


// Charge function that is called for each node.
// As part of the ManyBody force.
// This is what creates the repulsion between nodes.
//
// Charge is proportional to the diameter of the
// circle (which is stored in the radius attribute
// of the circle's associated data.
//
// This is done to allow for accurate collision
// detection with nodes of different sizes.
//
// Charge is negative because we want nodes to repel.
// @v4 Before the charge was a stand-alone attribute
//  of the force layout. Now we can use it as a separate force!
function charge(d) {
	return -Math.pow(d.radius, fixedDistRadius) * forceStrengthRadius; //* 0.3;
	//return -d.radius;
}

function openCharge(d) {
	return -Math.pow(d.radius, fixedDistRadius) * dClickForceStrengthRadius;
}


function dataToHtml(rows){
	var html = '<table id="myTable" class="table">';
	html += '<thead class="thead-dark" >';
	html += '<tr>';
	for( var j in rows[0] ) {
	  if(j=="lab") continue; // $$$$  -> na valw na diavazonde ta lab apo to arxeio sta elinika!
	  html += '<th scope="col">' + j + '</th>';
	}
	html += '</tr>';
	html += '</thead>';
	html += '<tbody id="myTableBody">';
	for( var i = 0; i < rows.length; i++) {
	  html += '<tr>';
	  var k=0;
	  for( var j in rows[i] ) {
	    if(j=="lab") continue; // $$$$  -> na valw na diavazonde ta lab apo to arxeio sta elinika!
	    html += '<td class=\"'+ j + 'tag' +'\">' + rows[i][j] + '</td>';
	    k++;
	  }
	  html += '</tr>';
	}
	 html += '</tbody>';
	html += '</table>';
	return html;
}

function urlToLabs(url){
	if( url.includes("erga.di.uoa.gr") ){
		return "Laboratory of Algebraic and Geometric Algorithms";
	}
	else if( url.includes("graphics.di.uoa.gr") ){
		return "Computer Graphics group";
	}
	else if( url.includes("p-comp.di.uoa.gr") ){
		return "Pervasive Computing Research Group";
	}
	else if( url.includes("madgik.di.uoa.gr") ){
		return "Management of Data Information and Knowledge Group";
	}
	else if( url.includes("cgi.di.uoa.gr") ){
		return "Signal and Image Processing Group";
	}
	else if( url.includes("anr.di.uoa.gr") ){
		return "Advanced Networking Research group";
	}
	else if( url.includes("scan.di.uoa.gr") ){
		return "Software Centric and Autonomic Networking";
	}
	else if( url.includes("gain.di.uoa.gr") ){
		return "Green, Adaptive and Intelligent Networking Group";
	}
	else if( url.includes("hermes.di.uoa.gr") ){
		return "Teaching and Language Technology Group";
	}
	else{
		console.log("Mi anagnorisimo ergastirio: ",url);
		return null;
	}
}

function simulationInit(){

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  // add forces to it.
  var simulation = d3.forceSimulation() //!!!
    .velocityDecay(0.22)
    .force('x', d3.forceX().strength(0).x(0))
    .force('y', d3.forceY().strength(0).y(0))
    .force('charge', d3.forceManyBody().strength(0))//.distanceMax(200))//.distanceMin(10))//.distanceMax(100).distanceMin(50))
    .force('collide', d3.forceCollide().strength(0.3).radius(initialRadius+1).iterations(4))  //#r
    .on('tick', ticked);
    //.alphaMin(0.5)       // apo to alpha(1) prospathei na ftasei sto alphaTarget(0.2) kai stamataei sto alphaMin(0.5) to Simulation
	//.alphaTarget(0.2);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();
  
  return simulation;
}


function simulationInitText(){

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  // add forces to it.
  var simulation = d3.forceSimulation() //!!!
    .velocityDecay(0.22)
    .force('x', d3.forceX().strength(0).x(0))
    .force('y', d3.forceY().strength(0).y(0))
    .force('charge', d3.forceManyBody().strength(0))//.distanceMax(200))//.distanceMin(10))//.distanceMax(100).distanceMin(50))
    .force('collide', d3.forceCollide().strength(0.3).radius(initialRadius+1).iterations(4))  //#r
    .on('tick', tickedText);
    //.alphaMin(0.5)       // apo to alpha(1) prospathei na ftasei sto alphaTarget(0.2) kai stamataei sto alphaMin(0.5) to Simulation
	//.alphaTarget(0.2);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();
  
  return simulation;
}



/*
 * Zoom Functions
 */

function zoomedAll(){
	var t = d3.event.transform;

	//t.x = 1;
	//t.y = 1;
	//t.k = 1;

	g_vis.attr('transform', t);
	g_yearLabels.attr('transform', t);
	grid.attr('transform', t);
	labsLabels.attr('transform', t);
	typeLabels.attr('transform', t);
}


var typeSideRectFlag = 0;
var labSideRectFlag = 0;
function zoomedTypes(){

	if(typeSideRectFlag==0){
		d3.select('#typeSideRect')
		    .transition()
		    .duration(500)
		    .style("opacity","0");
		d3.select('#typeSideRect')
		    .transition()
		    .delay(1000)
		    .style("display","none");	
		d3.select('#labSideRect')
		    .transition()
		    .style("display","none");	
		labSideRectFlag=1;  

		typeSideRectFlag=1;
	}

	var t = d3.event.transform;
	t = zoomPosFixed(t);

	if (t.k==1){

		typesLabelsAnimation(-t.x+5);
		labsLabelsAnimation(-t.x+5);
	}
	else if(t.k>1){
	
		typesLabelsAnimation(-(t.x/t.k));
		labsLabelsAnimation(-(t.x/t.k));
	}
	else if(t.k<1){
		
		typesLabelsAnimation(-(t.x/t.k));
		labsLabelsAnimation(-(t.x/t.k));
	}

	g_vis.attr('transform', t);
	g_yearLabels.attr('transform', t);
	grid.attr('transform', t);
	labsLabels.attr('transform', t);
	typeLabels.attr('transform', t);
}

function zoomedLabs(){

	if(labSideRectFlag==0){
		d3.select('#labSideRect')
		    .transition()
		    .duration(500)
		    .style("opacity","0");
		d3.select('#labSideRect')
		    .transition()
		    .delay(1000)
		    .style("display","none");
		d3.select('#typeSideRect')
		    .transition()
		    .style("display","none");
		typeSideRectFlag=1;

		labSideRectFlag=1;
	}

	var t = d3.event.transform;
	t = zoomPosFixed(t);

	if (t.k==1){
		labsLabelsAnimation(-t.x+5);
		typesLabelsAnimation(-t.x+5);
	}
	else if(t.k>1){
		labsLabelsAnimation(-(t.x/t.k));
		typesLabelsAnimation(-(t.x/t.k));
	}
	else if(t.k<1){
		labsLabelsAnimation(-(t.x/t.k));
		typesLabelsAnimation(-(t.x/t.k));
	}

	g_vis.attr('transform', t);
	g_yearLabels.attr('transform', t);
	grid.attr('transform', t);
	labsLabels.attr('transform', t);
	typeLabels.attr('transform', t);
}

//http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
// https://bl.ocks.org/mbostock/5e81cc677d186b6845cb00676758a339
//Periorismos tou zoom... $$$$

//console.log(t.invertX(width),t.invertY(height));
//console.log("cursor: ",cursorX,cursorY);
//console.log(t.invertX(width)+t.x, t.invertY(height)+t.y);

//t.invertX(width)+t.x == 8000
//t.invertY(height)+t.y == 700
function zoomPosFixed(t){

	if (t.k>1.5){

	}
	else{
		if (t.y<1) t.y = 1;
		else if (t.y>1) t.y = 1;
	}
	if (t.k < 0.5) t.k = 0.5;

	//if (t.k > 3) t.k = 3;
	

	//if (t.x > 7) t.x = 7;
	//else if (t.x/t.k < -6810) t.x = -6810*t.k;

	//if (t.y > -30) t.y = -30;
	//else if (t.y < 0.5) t.y = 0.5;

	//console.log("t.x/t.k:"+t.x/(t.k*t.k));

	//console.log("t.x:"+t.x+"\nt.y:"+t.y+"\nt.k:"+t.k);

	return t;
}


