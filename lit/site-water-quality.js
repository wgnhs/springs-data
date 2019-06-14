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
      
      var fakeoveralldataset = [{OBJECTID: 463, pH: 7.13}, {OBJECTID: 464, pH: 7.18}, {OBJECTID: 465, pH: 7.5}, {OBJECTID: 466, pH: 7.9}, {OBJECTID: 467, pH: 6.98}, {OBJECTID: 468, pH: 7.0}, {OBJECTID: 469, pH: 7.3}, {OBJECTID: 470, pH: 7.3}, {OBJECTID: 471, pH: 7.3}, {OBJECTID: 472, pH: 7.3}, {OBJECTID: 473, pH: 8.0}, {OBJECTID: 478, pH: 6.6}, {OBJECTID: 477, pH: 6.7}, {OBJECTID: 476, pH: 6.3}, {OBJECTID: 474, pH: 8.1}, {OBJECTID: 475, pH: 7.4}, {OBJECTID: 479, pH: 6.6}, {OBJECTID: 463, pH: 7.13}, {OBJECTID: 464, pH: 7.18}, {OBJECTID: 465, pH: 7.5}, {OBJECTID: 466, pH: 7.9}, {OBJECTID: 467, pH: 6.98}, {OBJECTID: 468, pH: 7.0}, {OBJECTID: 469, pH: 7.3}, {OBJECTID: 470, pH: 7.3}, {OBJECTID: 471, pH: 7.3}, {OBJECTID: 472, pH: 7.5}, {OBJECTID: 473, pH: 8.0}, {OBJECTID: 478, pH: 6.6}, {OBJECTID: 477, pH: 6.9}, {OBJECTID: 476, pH: 7.71}, {OBJECTID: 474, pH: 8.0}, {OBJECTID: 475, pH: 7.7}, {OBJECTID: 479, pH: 8.6}, {OBJECTID: 476, pH: 9.3}, {OBJECTID: 474, pH: 8.1}, {OBJECTID: 475, pH: 7.4}, {OBJECTID: 479, pH: 9.6}, {OBJECTID: 463, pH: 9.13}, {OBJECTID: 464, pH: 7.18}, {OBJECTID: 465, pH: 7.5}, {OBJECTID: 466, pH: 7.9}, {OBJECTID: 467, pH: 9.98}, {OBJECTID: 468, pH: 9.0}, {OBJECTID: 469, pH: 7.3}, {OBJECTID: 470, pH: 8.3}, {OBJECTID: 471, pH: 7.3}, {OBJECTID: 472, pH: 8.5}, {OBJECTID: 473, pH: 7.0}, {OBJECTID: 478, pH: 6.6}, {OBJECTID: 477, pH: 6.9}, {OBJECTID: 476, pH: 7.71}, {OBJECTID: 474, pH: 9.0}, {OBJECTID: 475, pH: 9.7}, {OBJECTID: 479, pH: 8.6}]; 
      
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