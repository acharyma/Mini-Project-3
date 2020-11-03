export default function ScatterPlot(container, data) {
    // initialization
    const margin = ({top: 20, right: 20, bottom: 20, left: 20});
    const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft().scale(yScale);

    svg.append("text")
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .attr("x", width + 30)
        .attr("y", height - 0)
        .text("Manufacturing % Added to GDP + Industry % Added to GDP");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y",30)
        .attr("dy", "6px")
        .attr("transform", "rotate(-90)")
        .text("Agricultural % Added to GDP")
        .style("font-size", "10px");

    const ordinalColorScale = d3.scaleOrdinal(d3.schemeTableau10);


    const xAxisUp = svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
    .call(xAxis);

    const yAxisUp = svg
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(yAxis);

    
    var dropdown = d3.select("#scatterselect").append('select')
        dropdown.selectAll("options")
            .data(["None"].concat([1,2,3]))
            .enter()
            .append("option")
            .text(function(d){
                if (d==1){
                return "Developing";
            }
                if (d==2){
                    return "In Transition";
                }
                if (d==3){
                    return "Developed";
                }
                else{
                    return "None"
                }
        })
        .attr("value", function (d) {return d;})
    
    
    dropdown.on("change", function(d){
            var selected = d3.select(this).property("value")
            console.log(selected)
            if (selected == "None"){
                update(data);
            }
            else{
                var matches = data.filter(d => d.development == selected);
                update(matches)
            }
        })
        
        


    function update(data){ 
        svg.selectAll("circle").remove()
        svg.selectAll("squares").remove()
        svg.selectAll("legendTags").remove()
        console.log(d3.extent(data.map((d) => d.manufacturingPercentGDP + d.industryPercentGDP)));
        console.log(d3.extent(data, (d => d.agriculturePercentGDP)));

        xScale.domain(d3.extent(data.map((d) => d.manufacturingPercentGDP + d.industryPercentGDP)));
        yScale.domain(d3.extent(data, (d => d.agriculturePercentGDP)));

        xAxisUp.call(xAxis);
        yAxisUp.call(yAxis);

        //offsets window scrolling on the tooltip
        const winScroll = function (e) {
            return (window.scrollY); // Value of scroll Y in px
        }

        const legendInfo = new Set(data.map((d) => d.development));
        console.log(legendInfo);

        svg
        .append("g")
        .selectAll("squares")
        .data(legendInfo)
        .enter()
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", width - 120)
        .attr("y", (d, i) => height + i * 20 - 185)
        .attr("fill", (d) => ordinalColorScale(d));

        svg
        .append("g")
        .selectAll("legendTags")
        .data(legendInfo)
        .enter()
        .append("text")
        .attr("x", width - 105)
        .attr("y", (d, i) => height + i * 20 - 176)
        .text((d) => (d == 1) ? "Developing Countries" : (d==2) ? "Transitioning Countries" : "Developed Countries")
        .attr("font-size", "10px");

        var circle = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("fill", (d) => ordinalColorScale(d.development))
        .attr('cx', d => margin.left+xScale(d.manufacturingPercentGDP + d.industryPercentGDP))
        .attr('cy', d => margin.top+yScale(d.agriculturePercentGDP))
        .attr("r", 4)
        .on("mouseenter", (event, d) => {
            // show the tooltip
            const pos = d3.pointer(event, window);
            d3
            .select(".tooltip")
            .style("position", "fixed")
            .style("left", pos[0] + 10 + "px")
            .style("top", pos[1] - winScroll() + "px")
            .style("padding", 5 + "px")
            .style("background", "darkgrey")
            .style("font-size", "9px")
            .style("display", "block").html(`
                <div>
                <span>
                Country:</span>
                <span>
                ${d.countryName}</span>
                </div>
                '
                <div>
                <span>
                Agriculture GDP:</span>
                <span>
                ${d3.format(",.3r")(d.agriculturePercentGDP)}</span>
                </div>

                <div>
                <span>
                Year:</span>
                <span>
                ${d3.format(".4d")(d.time)}</span>
                </div>

                <div>
                <span>
                Manufacturing:</span>
                <span>
                ${d3.format(",.2r")(d.manufacturingPercentGDP)}</span>
                </div>

                <div>
                <span>
                Industry:</span>
                <span>
                ${d3.format(",.2r")(d.industryPercentGDP)}</span>
                </div>
            `);
        })
        .on("mouseleave", (event, d) => {
            // hide the tooltip
            d3.select(".tooltip").style("display","none");
        });


        /*
        var brush = d3.brush()
                        .on("brush", highlightBrushedCircles).on("end", displayCountry);
        svg.append("g").call(brush);
        
        function highlightBrushedCircles(){
            var brush_coords = d3.brushSelection(this);
            console.log(brush_coords);

            // style brushed circles
            circle.filter(function () {

                var cx = d3.select(this).attr("cx"),
                    cy = d3.select(this).attr("cy");

                // return isBrushed(brush_coords, cx, cy);
            })
            .attr("class", "brushed");
        }
*/
        function displayCountry() {
            if (!d3.event.selection) return;
            d3.select(this).call(brush.move, null);
            var d_brushed =  d3.selectAll(".brushed").data();
            console.log(d_brushed);

        }

        

    }

    

	return {
        update, // ES6 shorthand for "update": update
        // on,
	};
}
