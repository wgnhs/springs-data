import {LitElement, html, css} from 'lit-element'; 

export class SiteBedMaterials extends LitElement{
    static get properties(){
        return{
            siteinfo: Object
        };
    }
    
    constructor() {
        super(); 
    }
    
    static get styles(){
        return css`
        :host {
            
        }
        text {
            font-size: var(--font-size-small); 
            font-weight: bold;
            fill: #414c43;

        }
        .donutSegments {

        }
        .chartLabels {

        }
        .leaderLines {

        }
        `;
    }
    
    
    render() {
        
        return html `
        <div>
        <h2>Spring-bed materials</h2>
        <svg id="bed-materials-chart"></svg>
        </div>
        `;
        
    }
    
    firstUpdated() {
        this.chart = d3.select(this.renderRoot.querySelector('#bed-materials-chart'));
    }
    
    updated() {
        
        var width = 500; 
        var height = 300;
        var margin = 15; //space between the circle and the edge of the SVG 
        var radius = (Math.min(width, height) / 2) - (margin * 2); //outer radius of the circle
        
        
        /* ~~~~~~~~~ SVG SETUP ~~~~~~~~~ */
        
        this.chart.attr("width", width).attr("height", height);
        
        // set up groups within the svg:  
        var masterGroup = this.chart.append("g").attr("transform", "translate("+width/2+","+height/2+")"); //append a group and move it to the center of the SVG.
        var donutGroup = masterGroup.append("g").attr("class", "donutSegments"); 
        var labelGroup = masterGroup.append("g").attr("class", "chartLabels"); 
        var linesGroup = masterGroup.append("g").attr("class", "leaderLines"); 
        
        
        /* ~~~~~~~~~ DATA ~~~~~~~~~ */
        
        var values = [
            {material: "organic", percent: this.siteinfo.Percent_organic, color: "#406058"}, 
            {material: "fines", percent: this.siteinfo.Percent_fines, color: "#adcaba"},  
            {material: "sand", percent: this.siteinfo.Percent_sand, color: "#b7b098"},  
            {material: "gravel", percent: this.siteinfo.Percent_gravel, color: "#cccccc"},  
            {material: "cobble", percent: this.siteinfo.Percent_cobble, color: "#7b6888"},  
            {material: "boulder", percent: this.siteinfo.Percent_boulder, color: "#685755"},  
            {material: "bedrock", percent: this.siteinfo.Percent_bedrock, color: "#98abc5"}
        ];
        
        //process the data array for use in the donut chart... 
         var pie = d3.pie()
                    .sort(null)             // do not sort by size 
                    .value(function(d){     // set the value that is used to size each pie chart segment     
                        return d.percent    // the data attribute that gives the charted value for each segment
                    })(values);             // call this function, giving it the values array     
        
        // the pie function returns an array of objects representing the segments, containing their the start and end angles, data value, etc. 
        
        
        // the pie function always returns 7 objects. filter it down to only the objects with a percent value greater than zero, so we are not going to draw any 0-dimension paths. 
        var filterpie = pie.filter(function(el){return el.value > 0;}); 
        
        //console.log("filtered pie is ", filterpie);
        
        /* ~~~~~~~~~ DONUT SEGMENTS ~~~~~~~~~ */ 
        // right now, the website is set up so that it re-renders everything in the side panel when a each spring is queried. 
        // therefore, everything is cleared and re-generated with each query. 
        // this code could be designed differently if more dynamic updating were required. 
        
       
        //define the properties of a donut arc. 
        var arc = d3.arc()
                    .outerRadius(radius)
                    .innerRadius(radius - 45)   //lower numbers here make a thinner ring 
                    .padAngle(0.025);              //about 0.025 is a good visible gap.                              
        
        
        donutGroup.selectAll("path")                            // we are using all paths within the group
            .data(filterpie)                                          // we want to use the data as processed by the pie function. this returns the update selection, which includes all data values that have corresponding DOM elements. 
            .enter()                                            // enter is a selection with placeholders for each data value (datum) that lacks a corresponding DOM element. 
            .append("path")                                     // for any datum missing a DOM element, create one of these. 
            .attr("d", arc)                                     // 
            .attr("fill", function(d){return (d.data.color);})  // apply fill color, which is a function of the color data attribute.  
            .style("opacity", 1)                                // apply any styles for the donut chart segments
            ;  
        
        
        /* ~~~~~~~~~~ LABELS ~~~~~~~~~~~ */ 
        
         // calculates the angle for the middle of a slice
        function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }    
        
        // arc for positioning labels; won't be drawn. 
        var outerArc = d3.arc()                         
                        .innerRadius(radius * 1.1)      
                        .outerRadius(radius * 1.1); 
        
        
        
        
        var label = this.chart.select(".chartLabels").selectAll("text")
            .data(filterpie)
            .enter()
            .append('text')
            .html(function(d){ return d.data.percent+"% "+d.data.material; })   // build the content of the label 
            .attr('dy', '.35em')                                                //vertical alignment
            .attr("transform", function(d){
                
                    var anchorpoint = outerArc.centroid(d);                             // initially, set the anchorpoint of text to be where the bisecting angle meets the outer arc  
                    anchorpoint[0] = radius * 1.15 * (midAngle(d) < Math.PI ? 1 : -1);  // then shift the anchorpoint on the x axis. 
                    // changes the point to be on left or right depending on where label is (multiply by 1 or by -1).
                
                    return 'translate('+anchorpoint+')';
            })
            .style('text-anchor', function(d){
                    // if slice centre is on the left, anchor text to start, otherwise anchor to end
                    return (midAngle(d)) < Math.PI ? 'start' : 'end';
            })            
            ; 
        
       
        /* ~~~~~~~~~ LEADER LINES ~~~~~~~~~ */ 
        var polyline = this.chart.select(".leaderLines").selectAll('polyline')
            .data(filterpie)
            .enter()
            .append('polyline')
            .attr('stroke', "#333333")      //set appearance
            .attr("stroke-width", 1)        //set appearance
            .style('fill', 'none')          //set appearance
            .attr('points', function(d){
               
                // three points on each line: 
                // A: centroid of the donut segment 
                // B: where the bisecting angle meets the outer arc (breakpoint in the line)
                // C: outer endpoint at the same y position as B, but with x coordinate near the side of the SVG
                
                var endpoint = outerArc.centroid(d);                            // initially, set the endpoint (C) to point B. 
                endpoint[0] = radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);  // then shift point C on the x axis. 
                
                return [arc.centroid(d), outerArc.centroid(d), endpoint]        // return A, B, and C 
            })
            ;
        
    } //close updated method.
} //close export 
customElements.define('site-bed-materials', SiteBedMaterials); 