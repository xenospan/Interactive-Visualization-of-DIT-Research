
/*
selectAll(".circleCPIFore")
    .filter(function(d) { d.someProp == someCriteria;})
    .style("display","none");
*/


/*
 * 
 *
 */

var simulation = simulationInit();

var textSimulation = simulationInitText();

searchFiltersInit();

yearSliderFilterInit();

visInit();

slideBarFilterInit();  //slide bar zoom!!

/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */
function bubbleChart() {
  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
  var width = 8000; //3000
  var height = 700; //540

    var rows = rawData;

    var html = dataToHtml(rows); //Metatrepei ta rawData se html gia na mpoun mesa sto html document san table list.

    document.getElementById('myContainer').innerHTML = html; //Metaferei to idi kataskevasmeno html mesa sto Element myContainer.
 
    //convert raw data into nodes data
    //var temp_nodes = createNodes(rawData);
    var temp_nodes = filterNodes(rawData);

    nodes = temp_nodes.filter( value => value != 0 );

    //console.log(nodes);
  
    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('id','svgid');

    /* Make it Zoom */
    svg.call(d3.zoom().on('zoom',() => {
      zoomedLabs();
    }));

    g_yearLabels = d3.select('svg').append('g')
      .attr('id', "yearLabels")
      .attr('class','yearLabels');

    grid = d3.select('svg').append('g')
      .attr('id', "grid")
      .attr('class','grid');

    g_vis = d3.select('svg').append('g')
      .attr('id', "bubblesGroup")
      .attr('class','bubblesGroup');

    labsLabels = d3.select('svg').append('g')
      .attr('id', "labsLabels")
      .attr('class','labsLabels');

    typeLabels = d3.select('svg').append('g')
      .attr('id', "typeLabels")
      .attr('class','typeLabels');


    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = g_vis.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });


    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')      
      .attr('class',  function (d){ return  ('bubble ' +'y'+d.year.toString()) +' '+ d.lab; })
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.type); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.type)).darker(); })
      .attr('stroke-width', 2)
      .attr('id', function (d) {return "id"+d.id})
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail)
      //.attr('onmouseover', function (d) {   return('onhoverRectAndYearFill('+d+')'); } )
      //.attr('onmouseout', function (d) {   return('onhoveroutRectAndYearFill('+d+')'); } );
      .on('click', click)
      ;
        /// .on('dblclick', bubbleMouseLeave) ///
       /// .on('dblclick', bubbleDblclick)   ///
      /// .classed('bubble', true)          ///


      svg.on("click", function() {
        var coords = d3.mouse(this);
        console.log(coords)
      });
      

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // remove bubbles prin apo to 1989!!
    //d3.selectAll('.y1987').remove(); ///$$$



    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    //groupBubbles();
    //splitBubbles();
    splitBubblesToLabs();

  };


	/*
	* Externally accessible function (this is attached to the
	* returned chart function). Allows the visualization to toggle
	* between "single group" ,"split by labs" and "split by type" modes.
	*
	* displayName is expected to be a string and either 'lab_year','type_year' or 'all'.
	*/
	chart.toggleDisplay = function (displayName) {
		if (displayName === 'all') {
			splitBubbles();
			setTimeout(function(){ 
				groupBubbles();
			}, 500); 
      
     var t = {k:1,x:1,y:1};
      g_vis.attr('transform', t);
      g_yearLabels.attr('transform', t);
      grid.attr('transform', t);
      labsLabels.attr('transform', t);

      /* Make it Zoom */
      svg.call(
        d3.zoom()
        .on('zoom',()=>{zoomedAll();} )
      );

    }else if(displayName === 'lab_year'){
      splitBubblesToLabs();
      
/*
      g_vis.attr('transform', 'translate(-6805 0)');
      g_yearLabels.attr('transform', 'translate(-6805 0)');
      grid.attr('transform', 'translate(-6805 0)');
      labsLabels.attr('transform', 'translate(-6805 0)');
*/
      /* Make it Zoom */
      svg.call(d3.zoom().on('zoom',() => {
        zoomedLabs();
      }));
		}else if(displayName === 'type_year'){
			splitBubbles();
/*
      var t = {k:1,x:-6805,y:1};
      g_vis.attr('transform', t);
      g_yearLabels.attr('transform', t);
      grid.attr('transform', t);
      labsLabels.attr('transform', t);
*/
      /* Make it Zoom */
      svg.call(d3.zoom().on('zoom',() => {
        zoomedTypes();
      }));
    }
	};


	// return the chart function from closure.
	return chart;
}


/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */
var myBubbleChart = bubbleChart();


////- Load the data. -////
//d3.csv('data/test_labs.csv', display);
d3.tsv('final_tab_outFile.csv', display);


// setup the toolbar buttons.
setupButtons();

