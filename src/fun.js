//new js file with funs



var nodes = [];
var cursorX;
var cursorY;

var yearBars;
var typeBars;
var labBars;
var typeTopPanding = 30;


var width = 8000;  //3000
var height = 700; //540


//--- Arxikopoiisi timwn gia parakolouthisi tou dikti tou pontikiou ---//
window.onload = init;
function init() {
  if (window.Event) {
  document.captureEvents(Event.MOUSEMOVE);
  }
  document.onmousemove = getCursorXY;
}
function getCursorXY(e) {
  cursorX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
  cursorY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
  //console.log("cursor: ",cursorX,cursorY);
}


//--- Mia proti prospatheia gia isagogh filtrwn ---//
function applyFilters(){
  svg.selectAll(".bubble")
        .attr('style', 'visibility: visible'); 
  for(i=0; i<list1_of_disabled_bubbles.length; i++){
        svg.selectAll( list1_of_disabled_bubbles[i] )
           .attr('style', 'visibility: hidden');
           //.attr('style', 'opacity: 0.07');     
  }
  for(i=0; i<list2_of_disabled_bubbles.length; i++){
        svg.selectAll( list2_of_disabled_bubbles[i] )
           .attr('style', 'visibility: hidden');
           //.attr('style', 'opacity: 0.07');      
  }
}


//--- Search bar ---//

/* 
 * Dimiourgia filtrarismatos tou Table pou einai sto telos tis optikopoiisis. 
 */
var names = [];
var searchValue = " ";
function AuthorFunctionFilter(author_name){
  //input = document.getElementById("myInput2");
  input = document.getElementById("myInput");
  
  input.value = author_name;
  //console.log("Athor name is: ",author_name);

  list1_of_disabled_bubbles = [];
  searchValue = author_name.toLowerCase(); //Metatropi ths timis anazitisis se mikra gramata.

  $("#myTableBody tr").filter(function() { //filtrarisma timwn pinaka simfona me mia sinartisi
    $(this).toggle( ($(this).text().toLowerCase().indexOf(searchValue) > -1) && yearTableFilter($(this).text(),names) )  //gia kathe grami tou pinaka <tr> kanoume:
                                           // toggle true(An h timi teriazei me to searchValue, indexOf epistrepsei thetiko arithmo) 
                                          //h' toggle false(An h timi den teriazei me to searchValue, indexOf epistrepsei arnitiko arithmo).
    var temp_id = parseInt($(this).text());
    if( ($(this).text().toLowerCase().indexOf(searchValue) > -1 ) == false){
      if(svg!=null){
        list1_of_disabled_bubbles.push( "#id"+temp_id ); //apothikefse to id tou pediou pou egine aorato.
      }
    }   
  });

  applyFilters();

}



/* When the user clicks on the button,
 * toggle between hiding and showing the dropdown content 
 */
function dropBtnShow() {
  document.getElementById("myDropdown").classList.toggle("show");
}


function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput2");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}


function yearTableFilter(txt,names){
  //console.log(select.value);
  //console.log(select2.value);
  var temp_id = parseInt(txt);
  //console.log(temp_id);

  //console.log(names[temp_id-1])   //$$paradoxi- ta IDs sto data set arxizoun me id=1 !!!

  if( (names[temp_id-1] < select.value)  || (names[temp_id-1] > select2.value) )
      return false;
  else
      return true;
}


function yearSliderFilterInit(){

  //--- Filtro Anazitisis No3(years) ---//

  // Append the option elements
  for (var i = 1989; i <= 2019; i++) {
      var option = document.createElement("option");
      option.text = i;
      option.value = i;
      select.appendChild(option);
  }
  // Append the option elements
  for (var i = 1989; i <= 2019; i++) {
      var option2 = document.createElement("option");
      option2.text = i;
      option2.value = i;
      select2.appendChild(option2);
  }
  var html5Slider = document.getElementById('filterContainer2');
  noUiSlider.create(html5Slider, {
      start: [1989, 2019],
      connect: true,
      range: {
          'min': 1989,
          'max': 2019
      }
  });
  //var inputNumber = document.getElementById('input-number');
  html5Slider.noUiSlider.on('update', function (values, handle) {
      var value = values[handle];
      if (handle) {
          select2.value = Math.round(value);
      } else {
          select.value = Math.round(value);
      }

      if(svg!=null){
        list2_of_disabled_bubbles = [];
        var yearList = [];

        for(i=1989;i<=2019;i++){
          if( (i<select.value) || (i>select2.value) ){
            list2_of_disabled_bubbles.push( ".y"+ i.toString() );
          }
        }

        //vres tis imerominies twn dimosiefsewn toy pinaka me tin sira(kata id) apo tin class "yeartag".
        var elements = document.getElementsByClassName("yeartag");
        names = [];
        for(var i=0; i<elements.length; i++) {
            names.push(elements[i].innerText);
        }
        //console.log(names)

        $("#myTableBody tr").filter(
        function() { //filtrarisma timwn pinaka simfona me mia sinartisi
          $(this).toggle( ($(this).text().toLowerCase().indexOf(searchValue) > -1) && yearTableFilter($(this).text(),names) )  //gia kathe grami tou pinaka <tr> kanoume:
                                               // toggle true(An h timi teriazei me to value, indexOf epistrepsei thetiko arithmo) 
                                              //h' toggle false(An h timi den teriazei me to value, indexOf epistrepsei arnitiko arithmo).
        });

        applyFilters();
      }
      
  });

  select.addEventListener('change', function () {
      html5Slider.noUiSlider.set([this.value, null]);
  });
  select2.addEventListener('change', function () {
      html5Slider.noUiSlider.set([null, this.value]);
  });

}


function searchFiltersInit(){
  //--- Filtro Anazitisis No1(search) ---//
  $(document).ready(function(){

    /***********************- Key Words Search Filter -***********************/
    $("#myInput").on("keyup", function() {
      list1_of_disabled_bubbles = [];
      searchValue = $(this).val().toLowerCase(); //Metatropi ths timis anazitisis se mikra gramata.

      $("#myTableBody tr").filter(function() { //filtrarisma timwn pinaka simfona me mia sinartisi
        $(this).toggle( ($(this).text().toLowerCase().indexOf(searchValue) > -1) && yearTableFilter($(this).text(),names) )  //gia kathe grami tou pinaka <tr> kanoume:
                                               // toggle true(An h timi teriazei me to searchValue, indexOf epistrepsei thetiko arithmo) 
                                              //h' toggle false(An h timi den teriazei me to searchValue, indexOf epistrepsei arnitiko arithmo).
        var temp_id = parseInt($(this).text());
        if( ($(this).text().toLowerCase().indexOf(searchValue) > -1 ) == false){
          if(svg!=null){
            list1_of_disabled_bubbles.push( "#id"+temp_id ); //apothikefse to id tou pediou pou egine aorato.
          }
        }   
      });

      applyFilters();
    });
    /************************************************************************/

    /***********************- Author Filter -***********************/
/*
    $("#myInput2").on("keyup", function() {
      list1_of_disabled_bubbles = [];
      searchValue = $(this).val().toLowerCase(); //Metatropi ths timis anazitisis se mikra gramata.

      $("#myTableBody tr").filter(function() { //filtrarisma timwn pinaka simfona me mia sinartisi
        $(this).toggle( ($(this).text().toLowerCase().indexOf(searchValue) > -1) && yearTableFilter($(this).text(),names) )  //gia kathe grami tou pinaka <tr> kanoume:
                                               // toggle true(An h timi teriazei me to searchValue, indexOf epistrepsei thetiko arithmo) 
                                              //h' toggle false(An h timi den teriazei me to searchValue, indexOf epistrepsei arnitiko arithmo).
        var temp_id = parseInt($(this).text());
        if( ($(this).text().toLowerCase().indexOf(searchValue) > -1 ) == false){
          if(svg!=null){
            list1_of_disabled_bubbles.push( "#id"+temp_id ); //apothikefse to id tou pediou pou egine aorato.
          }
        }   
      });

      applyFilters();
    });
*/
    /**************************************************************/

  });

}

function visInit(){
  $(document).ready(function() {
    
    document.getElementById('myInput').value = "";  // gia na katharizei to Search se periptosi refrech

    setTimeout(function(){ 
      slider.removeAttribute('disabled');
      //console.log("ektelite"); //$$$$
      //alert("Hello"); 
    }, 1500);
  });

}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set active "this" button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');
      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}


/*
 * Vale ta data tis epilegmenis fisalidas sth karta(Card) sto plai tis optikopoiisis.
 */
function dataToCard(d) {  //#data

  var linkStr = d.link;
  if( linkStr == "Link unavailable." ){
    linkStr = "";
  }
  else{
    linkStr = '<br><br><span class="name">Διαθέσιμο στην Διεύθυνση: </span><span class="value">' +
              '<a href="'+ d.link +'" target="_blank"> PDF </a>'+
              '</span>';
  }



  var tempDiv1 = document.createElement("div");
      tempDiv1.innerHTML = d.year;
  $("#cardtitle").empty();
  document.getElementById("cardtitle").appendChild(tempDiv1);


  var tempDiv2 = document.createElement("div");
      tempDiv2.innerHTML = d.name;
  $("#cardsubtitle").empty();
  document.getElementById("cardsubtitle").appendChild(tempDiv2);


	var content =   '<br><span class="name">Συγγραφέας/είς: </span><span class="value">' +
              //addCommas(d.value) +
              d.authors +
              '</span><br><br>' +
              '<span class="name">Είδος Δημοσιεύσεις: </span><span class="value">' +
              d.type +
              '</span><br><br>' +
              '<span class="name">Ερευνητικό Εργαστήριο: </span><span class="value">' +
              d.lab +
			        '</span>'+
              '<a href="'+ d.labLink +'" target="_blank"> ('+ d.labLink +')</a>'
               + linkStr
              ;

	
	var div2 = document.createElement("div");
			div2.innerHTML = content;
			//div.setAttribute('class', 'inercard');

	//document.getElementById("card-text").empty();
	$("#cardtext").empty();
	document.getElementById("cardtext").appendChild(div2);
}


// Nice looking colors - no reason to buck the trend
// @v4 scales now have a flattened naming scheme
var fillColor = d3.scaleOrdinal()
//.domain(["article", "inproceedings", "techreport", "book", "incollection", "phdthesis", "misc"])
.domain(["Επιστημονικό άρθρο","Ευρεσιτεχνία","Αναφορά","Βιβλίο","Διάσκεψη","Διάφορα"])
.range(['#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FFFF', '#0000FF', '#FF00FF']);

/*
 * An ginei click panw se kapoia fisalida
 */
function click(d){
	dataToCard(d);
	d3.select(bubbleClicked)
	  .attr('stroke', dColor);
	bubbleClicked = this;
	dColor = d3.rgb(fillColor(d.type)).darker();
}


/*
 * tooltip for mouseover functionality
 */
var tooltip = floatingTooltip('gates_tooltip', 240); //Oi sinartisi orizete sto arxeio "tooltip.js"


/*
* Function called on mouseover to display the
* details of a bubble in the tooltip.
*/
var mark1 = null;
var mark2 = null;
var mark3 = null;
var mark4 = null;
var mark5 = null;
var mark6 = null;
function showDetail(d) { //#data

	// change outline to indicate hover state.
	d3.select(this).attr('stroke', 'black');

	var content =
                '<p class="title">' +
                d.year +
                '</p>' +
                '<span class="name">Τίτλος Δημοσίευσης: </span><span class="value">' +
	              d.name +
	              '</span><br/>' +
	              //'<span class="name">Amount: </span><span class="value">' +
	              '<span class="name">Συγγραφέας/είς: </span><span class="value">' +
	              //addCommas(d.value) +
	              d.authors +
	              '</span><br/>'
	              ;

	tooltip.showTooltip(content, d3.event);


  try{
    //console.log(d.year)
    mark1 = document.getElementsByClassName('rectBarsYear '+ d.year);
    mark1[0].style.fill = "blue";
    //console.log(y)

    mark2 = document.getElementsByClassName('year '+ d.year);
    mark2[0].style.fill = "black";
    //console.log(y)

    //console.log(d.lab)
    mark3 = document.getElementsByClassName('labGrid '+ d.lab);
    mark3[0].style.fill = "blue";
    //console.log(l)

    mark4 = document.getElementsByClassName('labs '+ d.lab);
    mark4[0].style.fill = "black";
    //console.log(l)

    mark5 = document.getElementsByClassName('typeGrid '+ d.type);
    mark5[0].style.fill = "blue";
    //console.log(l)   

    mark6 = document.getElementsByClassName('type '+ d.type);
    mark6[0].style.fill = "black";
    //console.log(l)   
  }catch{
    //console.log("Egine catch!!!!");
  }
  
}
//#fill
/*
* Hides tooltip
*/
function hideDetail(d) {
	// reset outline
	if (bubbleClicked != this){
		d3.select(this)
		  .attr('stroke', d3.rgb(fillColor(d.type)).darker());
	}
	tooltip.hideTooltip();


  try{
    mark1[0].style.fill = "lightgray";
    mark2[0].style.fill = "black";
    mark3[0].style.fill = "#808080";
    mark4[0].style.fill = "black";
    mark5[0].style.fill = "#808080";
    mark6[0].style.fill = "black";
  }catch{
    //console.log("Egine catch!!!!");
  }
}


/*
 * Callback function that is called after every tick of the
 * force simulation.
 * Here we do the acutal repositioning of the SVG circles
 * based on the current x and y values of their bound node data.
 * These x and y values are modified by the force simulation.
 */
function ticked() {
  bubbles
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; });
}


function tickedText() {
  labs
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; });
}


/*
 * Provides a x value for each node to be used with the split by year
 * x force.
 */
function nodeYearPos(d) {
  var yearsData = d3.keys(yearsTitleX);

  yearBars = d3
    .scaleBand()
    .domain(yearsData)
    .range([0, width])

  return (yearBars(d.year) + yearBars.bandwidth()/2) - rootOffcetX; //#p1
}

function nodeTypePos(d) {

  typeBars = d3
    .scaleBand()
    .domain(pubTypes) // pubTypes: Lista me ola ta types otizere sto bubbleFun.js
    .range([0, height-typeTopPanding])

  return (typeBars(d.type) + typeTopPanding + typeBars.bandwidth()/2) - rootOffcetY; //#p1
}

function nodeLabPos(d) {

  typeBars = d3
    .scaleBand()
    .domain(researchLabs) // pubTypes: Lista me ola ta types otizere sto bubbleFun.js
    .range([0, height-typeTopPanding])

  return (typeBars(d.lab) + typeTopPanding + typeBars.bandwidth()/2) - rootOffcetY; //#p1
}

function centerX(d) {
  return (1600/3);  //vis max-width/2
}

function centerY(d) {
  return (height/2);  //vis height/2
}

/*
* Sets visualization in "single group mode".
* The year labels are hidden and the force layout
* tick function is set to move all nodes to the
* center of the visualization.
*/
function groupBubbles() {
  //document.getElementById("but1").style.visibility = "visible"; 
	hideYearTitles();
	hideTypeTitles();
	hideLabsTitles();

	// @v4 Reset the 'x' force to draw the bubbles to the center.
	simulation.force('x', d3.forceX().strength(forceStrength).x( centerX ))
	          .force('y', d3.forceY().strength(forceStrength).y( centerY ))
            //.force('charge', d3.forceManyBody().strength(charge));
            .force('charge', d3.forceManyBody().strength(charge))//.distanceMax(200)//.distanceMin(10))
            .force('collide', d3.forceCollide().strength(0).radius(0).iterations(0))
   
            
	// @v4 We can reset the alpha value and restart the simulation
	simulation.alpha(1).restart();
}


/*
* Sets visualization in "split by year mode".
* The year labels are shown and the force layout
* tick function is set to move nodes to the
* yearCenter of their data's year.
*/
function splitBubbles() {
	hideLabsTitles();
	showYearTitles();
	showTypeTitles();

	// @v4 Reset the 'x' force to draw the bubbles to their year centers
	simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPos))
	          .force('y', d3.forceY().strength(forceStrength).y(nodeTypePos))
            .force('charge', d3.forceManyBody().strength(0))//.distanceMax(200))//.distanceMin(10))//.distanceMax(100).distanceMin(50))
            .force('collide', d3.forceCollide().strength(0.3).radius(4).iterations(4))

	// @v4 We can reset the alpha value and restart the simulation
	simulation.alpha(1).restart();
}

/*
*  ...
*/
function splitBubblesToLabs() {
	hideTypeTitles();
	showYearTitles();
  showLabTitles();

	// @v4 Reset the 'x' force to draw the bubbles to their year centers
	simulation.force('x', d3.forceX().strength(forceStrength).x( nodeYearPos )) 
	          .force('y', d3.forceY().strength(forceStrength).y( nodeLabPos ))
            .force('charge', d3.forceManyBody().strength(0))//.distanceMax(200))//.distanceMin(10))//.distanceMax(100).distanceMin(50))
            .force('collide', d3.forceCollide().strength(0.3).radius(4).iterations(4))

	// @v4 We can reset the alpha value and restart the simulation
	simulation.alpha(1).restart();
}


/*
* Hides Year title displays.
*/
function hideYearTitles() {
	g_yearLabels.selectAll('.year').remove();
  g_yearLabels.selectAll('.rectBarsYear').remove();
}
function hideTypeTitles() {
  document.getElementById("typeLabels").style.display = "none"; //Den xriazete na ta kanoume remove ta kanoume apla hide.
  grid.selectAll('.typeGrid').style("display","none");
    
}
function hideLabsTitles() {
  document.getElementById("labsLabels").style.display = "none"; //Den xriazete na ta kanoume remove ta kanoume apla hide.
  grid.selectAll('.labGrid').style("display","none");
}


/*  
 *  Boithitikes sinartiseis gia thn sinartisi showYearTitles()
 */
function onhoverRectAndYearFill(classname) {
  var x = document.getElementsByClassName('year ' + classname);
  for(i=0;i<x.length;i++)
    x[i].style.fill = "black";
}
function onhoveroutRectAndYearFill(classname) {
  var x = document.getElementsByClassName('year ' + classname);
  for(i=0;i<x.length;i++)
    x[i].style.fill = "#808080";
}

/*  
 *  Dimiourgia tou year axis mazi me ta rect poy xromatizonde otan kaneis hover se mia fisalida.
 */
function showYearTitles() {
	// Another way to do this would be to create
	// the year texts once and then just hide them.
	var yearsData = d3.keys(yearsTitleX);

  yearBars = d3
    .scaleBand()
    .domain(yearsData) //years
    .range([0, width])

    //scale(yearsData[0]);
    //yearBars.bandwidth()

	var years = g_yearLabels.selectAll('.year')
	  .data(yearsData);

  years.enter().append('rect')
    .attr('class', function (d) {   return('rectBarsYear ' + d); })
    //.attr('x', function (d) {  return yearsTitleX[d]; })
    .attr('x', function (d) {   return yearBars(d) - rootOffcetX; })
    .attr('y', 0)
    .attr('width', yearBars.bandwidth())
    .attr('height',height)
    .attr('fill-opacity', '10%')
    //.attr('onmouseover', function (d) {   return('onhoverRectAndYearFill('+d+')'); } )
    //.attr('onmouseout', function (d) {   return('onhoveroutRectAndYearFill('+d+')'); } );

  years.enter().append('text')
    .attr('class', function (d) {   return('year ' + d); } )
    //.attr('x', function (d) { return yearsTitleX[d]; })
    .attr('x', function (d) { return ( yearBars(d) + yearBars.bandwidth()/2 ) - rootOffcetX;  })
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .text(function (d) { return d; });
}


/*  
 *  Dimiourgia tou type axis mazi me ta rect poy xromatizonde otan kaneis hover se mia fisalida.
 */
var typeTitlesCreated = false;
function showTypeTitles() {

  if(typeTitlesCreated==false){

    //Dimuoiurgia rect koutiou gia na mpoune mesa ta type titles.
    var typerect = typeLabels.append('rect')
      .attr('fill','lightgrey')
      .attr('stroke-width','1')
      .attr('height',height)
      .attr('width','160')
      .attr('y','0')
      .attr('x','0')
      .attr('stroke','#000000')
      .attr('id','typeSideRect')
      .attr('class','typeSideRect');


    if(labSideRectFlag == 1 ){
      typerect.transition()
        .style("display","none");
    }


    //var typesData = d3.keys(typeTitleY);
    var typesData = pubTypes;

    typeBars = d3
      .scaleBand()
      .domain(typesData) 
      .range([0, height-typeTopPanding])

    var typeGrid = grid.selectAll('.grid')
      .data(typesData);

    typeGrid.enter().append('rect')
      .attr('class', function (d) {   return('typeGrid ' + d); })
      .attr('x', -rootOffcetX )
      .attr('y', function (d) {   return (typeBars(d)+typeTopPanding); })
      .attr('width', width)
      .attr('height', typeBars.bandwidth()-1 ) //#p2
      //.attr('onmouseover', function (d) {   return('onhoverRectAndYearFill('+d+')'); } )
      //.attr('onmouseout', function (d) {   return('onhoveroutRectAndYearFill('+d+')'); } );
      .attr('fill-opacity', '10%')
      .attr('fill', '#808080');

    var types = typeLabels.selectAll('.type')
      .data(typesData);


    // Dimourgei ena path element gia na valei panv to keimeno pou theloume na kouniete.
    var counter = 0 ;
    var typesPaths = types.enter().append("path")
        .attr("id", function(d){return "wavyT"+(counter++);}) //Unique id of the path
        .attr("d",function(d){return "M0,"+(typeBars(d)+typeTopPanding+typeBars.bandwidth()/2)+" l160,0" } )//SVG path
        .style("fill", "none")
        .style("stroke", "#AAAAAA")
        .style("opacity", "0%");

    counter = 0 ;
    var typesText = types.enter().append('text')

      .append("textPath") //append a textPath to the text element
        .attr("xlink:href", function(d){return "#wavyT"+(counter++);}) //place the ID of the path here
        .style("text-anchor","middle") //place the text halfway on the arc
        .attr("startOffset", "50%") 

        .attr('class', function (d) {   return('type ' + d); })
        .attr('x', 10)
        .attr('y', function(d){ return(typeBars(d)+typeTopPanding+typeBars.bandwidth()/2); } )
        .text(function (d) { return d; });

    document.getElementById("typeLabels").style.display = "block";
    typeTitlesCreated = true; //otan dimiourgithoun kando true gia na min ksana dimiourgounde tin epomeni fora.
  }
  else{
    document.getElementById("typeLabels").style.display = "block";
    grid.selectAll('.typeGrid').style("display","block");
  }
}


/*  
 *  Dimiourgia tou Lab axis mazi me ta rect poy xromatizonde otan kaneis hover se mia fisalida.
 */
var labsTitlesCreated = false;
function showLabTitles() {

  if(labsTitlesCreated == false){

    labBars = d3
      .scaleBand()
      .domain(researchLabs) // pubTypes: Lista me ola ta types otizere sto bubbleFun.js
      .range([0, height-typeTopPanding])

    //Dimuoiurgia rect koutiou gia na mpoune mesa ta labs titles.
    var labsrect = labsLabels.append('rect')
    .attr('fill','lightgrey')
    .attr('stroke-width','1')
    .attr('height','900')
    .attr('width','300')
    .attr('y','0')
    .attr('x','0')
    .attr('stroke','#000000')
    .attr('id','labSideRect')
    .attr('class','labSideRect');

    var labGrid = grid.selectAll('.grid')
      .data(researchLabs);

    labGrid.enter().append('rect')
      .attr('class', function (d) {   return('labGrid ' + d); })
      .attr('x', -rootOffcetX )
      .attr('y', function (d) {   return (labBars(d)+typeTopPanding); })
      .attr('width', width)
      .attr('height', labBars.bandwidth()-1 ) //#p2
      //.attr('onmouseover', function (d) {   return('onhoverRectAndYearFill('+d+')'); } )
      //.attr('onmouseout', function (d) {   return('onhoveroutRectAndYearFill('+d+')'); } );
      .attr('fill-opacity', '20%')
      .attr('fill', '#808080');

    /* //#textSimulation ($$$$)
      tempList = [];
      for(i=0; i<researchLabs.length; i++){
        tempList.push( {'id': i , 'lab': researchLabs[i]} )
      }
      console.log("prepei na ftixtei edw!!!: ",tempList)
    */
    //var labTextsNodes = filterTextNodes(researchLabs); //#f

    // Bind nodes data to what will become DOM elements to represent them.
    labs = labsLabels.selectAll('.labs')
      .data(researchLabs);
      //.data(labTextsNodes, function (d) { return d.id; });
    

    // Dimourgei ena path element gia na valei panv to keimeno pou theloume na kouniete.
    var counter = 0 ;
    var labsPaths = labs.enter().append("path")
        .attr("id", function(d){return "wavy"+(counter++);}) //Unique id of the path
        .attr("d",function(d){return "M0,"+(labBars(d)+typeTopPanding+labBars.bandwidth()/2)+" l300,0" } )//SVG path
        .style("fill", "none")
        .style("stroke", "#AAAAAA")
        .style("opacity", "0%");

    counter = 0 ;
    var labsText = labs.enter().append('text')

      .append("textPath") //append a textPath to the text element
        .attr("xlink:href", function(d){return "#wavy"+(counter++);}) //place the ID of the path here
        .style("text-anchor","middle") //place the text halfway on the arc
        .attr("startOffset", "50%")

        .attr('class', function (d) {   return('labs ' + d); })
        .attr('x', 10)
        .attr('y', function(d){ return(labBars(d)+typeTopPanding+labBars.bandwidth()/2); } )
        .text(function (d) { return d; })
        ;


    //labs = labs.merge(labsText);


    //textSimulation.nodes(labTextsNodes); //#f

    document.getElementById("labsLabels").style.display = "block";
    labsTitlesCreated = true; //otan dimiourgithoun kando true gia na min ksana dimiourgounde tin epomeni fora.
  }
  else{
    document.getElementById("labsLabels").style.display = "block";
    grid.selectAll('.labGrid').style("display","block");

    d3.select('#labSideRect')
      .transition()
      .duration(2000)
      .attr("width", "300")
  }

}  

/*
 *    Eksafanizei me animasion tin pagia mpara aristera pou einai arxika ta labs.
 */
function labsLabelsAnimation(xOffset = 0, yOffset = labBars.bandwidth()/2 - 10 ,durationOffset = 1000 ,  delayOffset = 0){

  labBars = d3
    .scaleBand()
    .domain(researchLabs) // pubTypes: Lista me ola ta types otizere sto bubbleFun.js
    .range([0, height-typeTopPanding])

  var startingPositionX = xOffset;
  var startingPositionoffsetY = yOffset
  for(i=0;i<researchLabs.length;i++){
    var labYPosition = labBars(researchLabs[i]) + typeTopPanding + labBars.bandwidth() / 2 + startingPositionoffsetY;
    svg.selectAll("#wavy"+i)
        .transition().duration(durationOffset).delay(delayOffset)
        .attr("d", "M"+startingPositionX+","+labYPosition+" l300,0");
  }

}

/*
 *    Eksafanizei me animasion tin pagia mpara aristera pou einai arxika ta types.
 */
function typesLabelsAnimation(xOffset = 0, yOffset = typeBars.bandwidth()/2 - 10 ,durationOffset = 1000 ,  delayOffset = 0){

   typeBars = d3
    .scaleBand()
    .domain(pubTypes) // pubTypes: Lista me ola ta types otizere sto bubbleFun.js
    .range([0, height-typeTopPanding])

  var startingPositionX = xOffset;
  var startingPositionoffsetY = yOffset
  for(i=0;i<pubTypes.length;i++){
    var typeYPosition = typeBars(pubTypes[i]) + typeTopPanding + typeBars.bandwidth() / 2 + startingPositionoffsetY;
    svg.selectAll("#wavyT"+i)
        .transition().duration(durationOffset).delay(delayOffset)
        .attr("d", "M"+startingPositionX+","+typeYPosition+" l300,0");
  }

}
 


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function slideBarFilterInit(){

  var myPrefix = 'Μέγεθος φυσαλίδων(διάμετρος): ';

  //--- Filtro Anazitisis No2(radius) ---// 
  var sliderObj = noUiSlider.create(slider, {
      start: 4,
      step: 1,
      connect: true,
      tooltips: true,
      range: {
          'min': 1,
          'max': 6
      },
      format: wNumb({
          decimals: 0, // default is 2
          //thousand: '.', // thousand delimiter
          prefix: myPrefix, // gets appended after the number
      })
  });

  sliderObj.on('update', function( values, handle ) {
    if(svg!=null){
      var myradius = sliderObj.get().substring(myPrefix.length, myPrefix.length+2);
      svg.selectAll(".bubble")
            .attr('r', myradius);

      /*
      var forceStrength = 0.05; //force sto to positioning twn kendrwn twn fisalidwn
      var forceStrengthRadius = 0.1; // dinami apothisis ths aktinas
      var fixedDistRadius = 1.8; // aktina apothisis (1.8)
      var dClickForceStrengthRadius = 0.2; // otan kaneis duble Click ( $$$$ ) ???
      */
      /*
      if(myradius==1){
        fixedDistRadius = 1.0; // aktina apothisis
        forceStrength = 0.05; // to position
        forceStrengthRadius = 0.1; // dinami apothisis ths aktinas
      }
      else if(myradius==2){
        fixedDistRadius = 1.2; // aktina apothisis
        forceStrength = 0.05; // to position
        forceStrengthRadius = 0.1; // dinami apothisis ths aktinas
      }
      else if(myradius==3){
        fixedDistRadius = 1.5; // aktina apothisis
        forceStrength = 0.05; // to position
        forceStrengthRadius = 0.1; // dinami apothisis ths aktinas
      }
      else if(myradius==4){
        fixedDistRadius = 1.8; // aktina apothisis
        forceStrength = 0.05; // to position
        forceStrengthRadius = 0.1; // dinami apothisis ths aktinas
      }
      else if(myradius==5){
        fixedDistRadius = 2.0; // aktina apothisis
        forceStrength = 0.05; // to position
        forceStrengthRadius = 0.1; // dinami apothisis ths aktinas
      }
      else if(myradius==6){
        fixedDistRadius = 1.8; // aktina apothisis
        forceStrength = 0.06; // to position
        forceStrengthRadius = 0.2; // dinami apothisis ths aktinas
        //svg.selectAll(".year")
            //.attr('style', "font-size:19px");
      }
      else{
        console.log("Minima aposfalmatosis: Bale kai alla if gia tis ekstra epiloges pou evales");
      }
      */
      console.log(parseInt(myradius)+1)
      simulation.force('collide', d3.forceCollide().strength(0.3).radius(parseInt(myradius)+1).iterations(4))
      simulation.alpha(1).restart();

    }
         
  });

}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////


/*
* Areonei tis fisalides oste na fenonde kalitera
*
*/
function bubbleMouseLeave(){
  simulation.force('charge', d3.forceManyBody().strength(charge));
  simulation.alpha(1).restart();
}

function bubbleMouseOver(){
  simulation.force('charge', d3.forceManyBody().strength(openCharge));
  simulation.alpha(1).restart();
}

/*
* Shows Type title displays.
*/
var loop_flag2 = false;
function showTypesTitles_old() {
  var typesData = d3.keys(typeTitleY);

  if(loop_flag2 == true){
    document.getElementById("typeLabels").style.display = "block";
  }
  else if(loop_flag2 == false){
    loop_flag2 = true;
    for(i=0;i<=typesData.length-1;i++){
      var div = document.createElement("div");
      div.style.width = "140px";
      div.style.height = "77px";
      div.style.background = "lightgray";
      div.style.color = "#808080";
      div.innerHTML = typesData[i];
      div.setAttribute('class', 'type');

      document.getElementById("typeLabels").appendChild(div);
    }
    document.getElementById("typeLabels").style.display = "block";
  }

  /*   //palios tropos oi titloi twn types mesa sto svg eksafanozondan me scroll 
  var types = g_yearLabels.selectAll('.type')
    .data(typesData);

  types.enter().append('text')
    .attr('class', 'type')
    .attr('x', 80)
    .attr('y', function (d) { return typeTitleY[d]; })
    .attr('text-anchor', 'middle')
    .text(function (d) { return d; });*/
}


/*
* Shows Labs title displays.
*/
var loop_flag = false;
function showLabsTitles_old() {
  
  var labsData = d3.keys(labTitleY);

  if(loop_flag == true){
    document.getElementById("labsLabels").style.display = "block";
  }
  else if(loop_flag == false){
    loop_flag = true;
    for(i=0;i<=labsData.length-1;i++){
      var div = document.createElement("div");
      div.style.width = "210px";
      div.style.height = "66px";
      div.style.background = "lightgray";
      div.style.color = "#808080";
      div.innerHTML = labsData[i];
      div.setAttribute('class', 'labs');

      document.getElementById("labsLabels").appendChild(div);
    }
    document.getElementById("labsLabels").style.display = "block";
  }
} 


function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}

function draged(d) {
  //console.log("draged");
}

function dragend(d) {
  d3.select(this).classed("fixed", d.fixed = false);
}


function nodeYearPos_old(d) {

  var yearsData = d3.keys(yearsTitleX);

  yearBars = d3
    .scaleBand()
    .domain(yearsData) //years
    .range([0, width])


  //console.log("Edw hello: ", d.year);


  return yearBars(d.year) + yearBars.bandwidth()/2; 
/* ---palia ekdosi--- 
  try {
    yearFloor = parseInt(d.year);
    //console.log(d.year,"------>",yearFloor)
    x = yearCenters[yearFloor].x;
    //console.log(d.year,yearCenters[d.year]);
  }
  catch(error) {
    //console.log("error: ",d.year,yearCenters[d.year]);
    //console.error(error);
    x = width-100;
  }
  return x;*/
}


function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}


openFlag = false;
function bubbleDblclick(){
  if (openFlag == true){
    openFlag = false;
    simulation.force('charge', d3.forceManyBody().strength(charge));
    simulation.alpha(1).restart();
  }else if(openFlag == false){
    openFlag = true;
    simulation.force('charge', d3.forceManyBody().strength(openCharge));
    simulation.alpha(1).restart();
  }
}



function nodeTypePos_old(d) {
  try {
    if(d.type == "Επιστημονικό άρθρο")
      y = typeCenters["article"].y;
    else if(d.type == "Ευρεσιτεχνία")
      y = typeCenters["inproceedings"].y;
    else if(d.type == "Αναφορά")
      y = typeCenters["techreport"].y;
    else if(d.type == "Βιβλίο")
      y = typeCenters["book"].y;
    else if(d.type == "Διάσκεψη")
      y = typeCenters["incollection"].y;
    else if(d.type == "Διάφορα")
      y = typeCenters["misc"].y;
    else
      console.log("Aprosdioristos type: ", d.type)
  }
  catch(error) {
    //console.error(error);
    y = 0;
  }
  return y;
}


function nodeLabPos_old(d) {
  try {
    y = labsCenters[d.lab].y;
  }
  catch(error) {
    //console.error(error);
    y = 0;
  }
  return y;
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////


  //labsLabels.style( 'fill', 'red' ).style('stroke','green').style('stroke-width','5');
  //--or-- d3.selectAll("circle").style("fill", "green");


  /*
    var labDiv = document.createElement("div");
    labDiv.style.width = "100px";
    labDiv.style.height = "66px";
    labDiv.style.background = "red";
    labDiv.style.color = "green";
    labDiv.setAttribute('class', 'labsL');
    labDiv.setAttribute('id', 'labDiv');
  */
  //document.getElementById("svgid").appendChild(labDiv);
  //document.getElementById("labDiv").style.display = "block";


    //////////////////////////////////////////////////////////////

		/*  //palios tropos oi titloi twn labs mesa sto svg eksafanozondan me scroll 
		var typesData = d3.keys(labTitleY);
		var types = g_yearLabels.selectAll('.labs')
		  .data(typesData);

		types.enter().append('text')
		  .attr('class', 'labs')
		  .attr('x', 80)
		  .attr('y', function (d) { return labTitleY[d]; })
		  .attr('text-anchor', 'middle')
		  .text(function (d) { return d; });

		  */
	




//-----------------------   sleep fun   -----------------------------//

/*

      function mouseklick(){

        var myMouse = d3.mouse(this);
        var myMouseX = myMouse[0];
        var myMouseY = myMouse[1];

      }

      console.log("before sleep");
      setTimeout(function(){ 

        //do something
        
        console.log("after sleep");
      }, 10000); 
*/


//////////////////////////////////////////////////////////////



