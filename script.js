d3.csv('cleanData.csv', d3.autoType).then(data=>{
    d3.json("world-110m.json").then(world=>{
        const cleanData = data;
        const map = world;            

    //var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 1000
        height = 500

    var svg = d3.select("#map").append("svg")
        .attr("width", width )
        .attr("height", height)
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const g = svg.append("g");

    const devLvl = ["Developing", "In Transition", "Developed"]
    const colScale = d3.scaleOrdinal()
                     .domain([1, 3])
                    .range(["#e5f5e0","#31a354", "#a1d99b"])


    var path = d3.geoPath().projection(d3.geoNaturalEarth1());

        const economies = cleanData.filter(function(d){return d.time == "2014"})
        const features = topojson.feature(map, map.objects.countries).features
                
        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "azure");
        
        svg.append("g")
            .selectAll("path")
            .data(features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr('fill', "#654321")
            .style("stroke", "black")
            .style("stroke-width", .5)
            .on('mousedown', function (d, i) {
                var match = economies.filter(function(d){return d.countryName == i.properties.name})[0]
                if (match != undefined && match.development){
                    var developmentCol = colScale(match.development)
                    d3.select(this).transition().duration(500).style("fill", developmentCol)
                }
                else{
                    console.log("No data on " + i.properties.name)
                var clicked = 1;
                }            return clicked, developmentCol;
            })
            .on('mouseover', function(d, i){
                d3.select(this).style("stroke", "white").style("stroke-width", 2)
                var match = economies.filter(function(d){return d.countryName == i.properties.name})[0]
                if (match != undefined && match.development){
                    d3.select("#QOL").style("display", "inline-block").html(
                        "<h1>" + match.countryName + "'s Statistics</h1>"+
                        "GDP per Capita w/ PPP: " + Math.round(match.gdpPerCapitaPPP) +
                        "<br>Individuals Using Internet: " + Math.round(match.individualsUsingInternetPercent) + "%" +
                        "<br>Access to Electricity: " + Math.round(match.accessToElectricityPercent) + "%" +
                        "<br>Cellphone Subscriptions per Hundred: " + Math.round(match.mobileCellularSubscriptionsPerHundred) +
                        "<br>Male Life Expectancy: " + match.birthLifeExpectancyMale +
                        "<br>Female Life Expectancy: " + match.birthLifeExpectancyFemale +
                        "<br>Consumer Price Index: " + Math.round(match.consumerPriceIndex)
                    )}
                else{
                    d3.select("#QOL").html("<h1>No info for " + i.properties.name +"</h1>")
                }
                }
            
        )
            .on('mouseout', function(d, i){
                d3.select(this).style("stroke", "black").style("stroke-width", .5)
            })
            
        
        var zoom = d3.zoom()
            .scaleExtent([1, 40])
            .on('zoom', function(event) {
                svg.selectAll('path')
                .attr('transform', event.transform);
        });

        svg.call(zoom);
            
        d3.select("#fillbutton").on("click", function () {
            svg.selectAll("path")
            .transition()
            .duration(2000)
            .attr("fill", function(d){
                var match = economies.filter(function(i){
                    return i.countryName == d.properties.name})[0]
                console.log(match)
                if (match && match.development){
                    return colScale(match.development)
                }
                else{
                    return "black"
                }
            })
        });
        
        svg.selectAll("legend")
                .data(devLvl)
                .enter()
                .append("circle")
                .attr("cx", width-300)
                .attr("cy", function(d,i){return height -100 + i * 25})
                .attr("r", 5)
                .style("fill", function(d,i){return colScale(i+1)})
        
        svg.selectAll("legend")
                .data(devLvl)
                .enter()
                .append("text")
                .attr("x", width-290)
                .attr("y", function(d,i){return height - 95 + i * 25})
                .text(function(d){return d})
        
            })})