import { LitElement, html, css } from 'lit-element';

export class SiteWaterQuality extends LitElement {
  static get properties() {
    return {
        siteinfo: Object
    };
  }

  constructor() {
    super();
  }
    static get styles(){
        return css`
            .label{
               font-weight: bold;
            }
            .tick {
               font-size: 13px;

               /* why did I have to add this in?? */
               font-family: 'open_sansregular','Open Sans',sans_serif; 

               color: #777;
            }
            .tick line {
               stroke: #777;
            }
            .highlight {
               font-size: 14px;
            }

        `; 
    }

  render() {
    return html`
        <div>
        <h2>Water quality</h2>
        
        <span class="label">conductivity: </span><span>${this.siteinfo.Conductivity_uS}</span><br>
        <span class="label">temperature: </span><span>${this.siteinfo.Water_Temp_C}</span><br>
        <span class="label">pH: </span><span>${this.siteinfo.pH}</span><br>
         <svg id="ph-chart"></svg>
        </div>
    `;
  } //end render 
    
   firstUpdated() {
      this.phchart = d3.select(this.renderRoot.querySelector('#ph-chart')); 
   }
   
   updated() {
      
      var fakeoveralldataset = [
         {OBJECTID: 463, pH: 7.13, Conductivity_uS: 1450, Water_Temp_C: 5.7}, 
         {OBJECTID: 464, pH: 7.18, Conductivity_uS: 123, Water_Temp_C: 6.7}, 
         {OBJECTID: 465, pH: 7.5, Conductivity_uS: 60, Water_Temp_C: 6}, 
         {OBJECTID: 466, pH: 7.9, Conductivity_uS: 56, Water_Temp_C: 8}, 
         {OBJECTID: 467, pH: 6.98, Conductivity_uS: 75, Water_Temp_C: 16}, 
         {OBJECTID: 468, pH: 7.0, Conductivity_uS: 1000, Water_Temp_C: 14}, 
         {OBJECTID: 469, pH: 7.3, Conductivity_uS: 589, Water_Temp_C: 12}, 
         {OBJECTID: 470, pH: 7.3, Conductivity_uS: 555, Water_Temp_C: 11}, 
         {OBJECTID: 471, pH: 7.3, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 472, pH: 7.3, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 473, pH: 8.0, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 478, pH: 6.6, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 477, pH: 6.7, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 476, pH: 6.3, Conductivity_uS: 67, Water_Temp_C: 12}, 
         {OBJECTID: 474, pH: 8.1, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 475, pH: 7.4, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 479, pH: 6.6, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 463, pH: 7.13, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 464, pH: 7.18, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 465, pH: 7.5, Conductivity_uS: 67, Water_Temp_C: 10.6}, 
         {OBJECTID: 466, pH: 7.9, Conductivity_uS: 67, Water_Temp_C: 12}, 
         {OBJECTID: 467, pH: 6.98, Conductivity_uS: 67, Water_Temp_C: 12}, 
         {OBJECTID: 468, pH: 7.0, Conductivity_uS: 1257, Water_Temp_C: 12}, 
         {OBJECTID: 469, pH: 7.3, Conductivity_uS: 1167, Water_Temp_C: 12}, 
         {OBJECTID: 470, pH: 7.3, Conductivity_uS: 1367, Water_Temp_C: 12}, 
         {OBJECTID: 471, pH: 7.3, Conductivity_uS: 167, Water_Temp_C: 12}, 
         {OBJECTID: 472, pH: 7.5, Conductivity_uS: 1617, Water_Temp_C: 16.2}, 
         {OBJECTID: 473, pH: 8.0, Conductivity_uS: 58, Water_Temp_C: 16.8}, 
         {OBJECTID: 478, pH: 6.6, Conductivity_uS: 367, Water_Temp_C: 12.2}, 
         {OBJECTID: 477, pH: 6.9, Conductivity_uS: 258, Water_Temp_C: 12.3}, 
         {OBJECTID: 476, pH: 7.71, Conductivity_uS: 178, Water_Temp_C: 12.4}, 
         {OBJECTID: 474, pH: 8.0, Conductivity_uS: 596, Water_Temp_C: 12.5}, 
         {OBJECTID: 475, pH: 7.7, Conductivity_uS: 67, Water_Temp_C: 12.8}, 
         {OBJECTID: 479, pH: 8.6, Conductivity_uS: 67, Water_Temp_C: 12.96}, 
         {OBJECTID: 476, pH: 9.3, Conductivity_uS: 67, Water_Temp_C: 12.5}, 
         {OBJECTID: 474, pH: 8.1, Conductivity_uS: 67, Water_Temp_C: 11.6}, 
         {OBJECTID: 475, pH: 7.4, Conductivity_uS: 167, Water_Temp_C: 11.5}, 
         {OBJECTID: 479, pH: 9.6, Conductivity_uS: 267, Water_Temp_C: 14.3}, 
         {OBJECTID: 463, pH: 9.13, Conductivity_uS: 367, Water_Temp_C: 12}, 
         {OBJECTID: 464, pH: 7.18, Conductivity_uS: 467, Water_Temp_C: 11.8}, 
         {OBJECTID: 465, pH: 7.5, Conductivity_uS: 567, Water_Temp_C: 12}, 
         {OBJECTID: 466, pH: 7.9, Conductivity_uS: 667, Water_Temp_C: 12}, 
         {OBJECTID: 467, pH: 9.98, Conductivity_uS: 767, Water_Temp_C: 11}, 
         {OBJECTID: 468, pH: 9.0, Conductivity_uS: 867, Water_Temp_C: 12}, 
         {OBJECTID: 469, pH: 7.3, Conductivity_uS: 967, Water_Temp_C: 10}, 
         {OBJECTID: 470, pH: 8.3, Conductivity_uS: 1067, Water_Temp_C: 9.5}, 
         {OBJECTID: 471, pH: 7.3, Conductivity_uS: 167, Water_Temp_C: 12}, 
         {OBJECTID: 472, pH: 8.5, Conductivity_uS: 467, Water_Temp_C: 12}, 
         {OBJECTID: 473, pH: 7.0, Conductivity_uS: 567, Water_Temp_C: 12}, 
         {OBJECTID: 478, pH: 6.6, Conductivity_uS: 687, Water_Temp_C: 7.8}, 
         {OBJECTID: 477, pH: 6.9, Conductivity_uS: 617, Water_Temp_C: 6.2}, 
         {OBJECTID: 476, pH: 7.71, Conductivity_uS: 67, Water_Temp_C: 5.3}, 
         {OBJECTID: 474, pH: 9.0, Conductivity_uS: 1400, Water_Temp_C: 6}, 
         {OBJECTID: 475, pH: 9.7, Conductivity_uS: 67, Water_Temp_C: 7}, 
         {OBJECTID: 479, pH: 8.6, Conductivity_uS: 67, Water_Temp_C: 8}]; 
      
      var siteph = [{pH:this.siteinfo.pH}];
      
      
      
      /* ~~~~~~~~~ SVG SETUP ~~~~~~~~~ */
      
      var container_height = 130;
      var container_width = 550;
      var margin = {
                     top: 50,
                     right: 20,
                     bottom: 50,
                     left: 20  
                   }
      var width = container_width - margin.left - margin.right,
      height = container_height - margin.top - margin.bottom;
      
      this.phchart.attr('width', container_width).attr("height", container_height)
        // .style('background', "#cecece")
      ;
      
      var phgroup = this.phchart.append("g").attr("class", "phgroup").attr("transform", "translate("+margin.left+", "+margin.top+")"); //append a group. 
      
      /* ~~~~~~~~~ Draw the chart ~~~~~~~~~ */
      
      var x_scale = d3.scaleLinear().domain([6, 10]).range([0, width]); 
            
      var y_scale = d3.scaleBand().domain([""]).rangeRound([0, height]); 
      
      
      var xAxis = phgroup.append("g").attr("class", "x-axis");
      xAxis
         .attr("transform", "translate(0," + height + ")")
         .call(
           d3
             .axisBottom(x_scale)
             .tickSizeInner(-height)
             .tickSizeOuter(0)
             .tickPadding(5)
             .tickValues([6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0])
         )
         .call(g => g.select(".domain").remove())              // remove the horizontal line of the x axis
      
      
      var yAxis = phgroup.append("g").attr("class", "y-axis");
      yAxis
         .call(
           d3
             .axisLeft(y_scale)
             .tickSizeInner(-width)
             .tickSizeOuter(0)
             .tickPadding(0)
         )
         .call(g => g.select(".domain").remove())
         .call(g => g.selectAll("text").remove());

     
     /* ~~~~~~~~~ circles ~~~~~~~~~ */ 
      
     var circles = phgroup.append("g").attr("class", "circles");
      
      circles.selectAll("circle")
         .data(fakeoveralldataset)
         .enter()
         .append("circle")
         .attr("cx", function(d){return x_scale(d.pH)})     // x position
         .attr("cy", function(d){return height/2})          // y position
         .attr('r', 5)                                      // radius 
         .attr("fill", "#406058")                           // fill color
         .attr("opacity", "0.7");                           // opacity
      
      
      var highlight = phgroup.append("g").attr("class", "highlight"); 
      var highlightRadius = 8;
      var highlightLineLength = 20; 
      var highlightLabelPadding = 5;
      
      highlight.selectAll("circle")
         .data(siteph)
         .enter()
         .append("circle")
         .attr("cx", function(d){
                        return x_scale(d.pH)})              // x position
         .attr("cy", function(d){return height/2})          // y position
         .attr('r', highlightRadius)                        // radius 
         .attr("fill", "#406058")                           // fill color
         .attr("stroke", "#000")
         .attr("stroke-width", 2)
         .attr("opacity", "0.85");                           // opacity
      
      highlight.selectAll("polyline")
         .data(siteph)
         .enter()
         .append("polyline")
         .attr('stroke', "#333333")      //set appearance
         .attr("stroke-width", 2)        //set appearance
         .style('fill', 'none')          //set appearance
         .attr('points', function(d){
               
                // two points on each line: 
                // A: centroid of the circle
                // B: 10 px above the circle
                // each point is defined by an [x, y] 
               var startpoint = [0,0]
                   startpoint[0] = x_scale(d.pH);
                   startpoint[1] = height/2-highlightRadius; 
         
               var endpoint = [0,0];
                   endpoint[0] = x_scale(d.pH);
                   endpoint[1] = (height/2)-highlightRadius-highlightLineLength; 
         
                console.log("start, end", startpoint, endpoint)
                return [startpoint, endpoint]        // return A, B
         })
         
      highlight.selectAll("text")
         .data(siteph)
         .enter()
         .append("text")
         .attr("font-weight", "bold")
         .html(function(d){ return "pH: "+d.pH})
         .attr("transform", function(d){
            var textpoint = [0, 0]
                textpoint[0] = x_scale(d.pH);
                textpoint[1] = (height/2)-highlightRadius-highlightLineLength-highlightLabelPadding; 
         return 'translate('+textpoint+')'

         })
         .style('text-anchor', "middle")
     
  
      
   }
    
}
customElements.define('site-water-quality', SiteWaterQuality);