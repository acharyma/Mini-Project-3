export default function WorldMap(map, data){
        //var margin = {top: 50, right: 50, bottom: 50, left: 50};
    const width = 1000;
    const height = 500;

    const svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")


    const devLvl = ["Developing", "In Transition", "Developed"]
    const colScale = d3.scaleOrdinal()
                     .domain([1, 3])
                    .range(["#e5f5e0","#31a354", "#a1d99b"])


    const path = d3.geoPath().projection(d3.geoNaturalEarth1());
    svg.append("path")
        .attr("class", "initpath")
        const world = map;
        const economies = data.filter(function(d){return d.time == "2014"})
        const features = topojson.feature(world, world.objects.countries).features
        var countries = []
        for (var i in topojson.feature(world, world.objects.countries).features){
                countries.push(topojson.feature(world, world.objects.countries).features[i].properties.name)}
        
        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "azure");
        
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
                    d3.select(this).transition().duration(1000).style("fill", developmentCol)
                }
                else{
                    console.log("No data on " + i.properties.name)
                }            return developmentCol;
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
                if (!match.development){
                    d3.select("#QOL").html("<h1>No data for " + i.properties.name +"</h1>")
                }
                }
            
        )
            .on('mouseout', function(d, i){
                d3.select(this).style("stroke", "black").style("stroke-width", .5)
            })
            
        d3.select("#QOL").style("display", "inline-block").html(
                "HOVER OVER SOMETHING!").attr("height", "30%")
        
        var zoom = d3.zoom()
            .scaleExtent([1, 40])
            .on('zoom', function(event) {
                svg.selectAll('path')
                .attr('transform', event.transform);
        });

        svg.call(zoom);
/*
        d3.select("#fill").on("click", function () {
            svg.selectAll("path")
            .transition()
            .duration(2000)
            .style("fill", function(d){
                var match = economies.filter(function(i){
                    if(d){
                    return i.countryName == d.properties.name}[0]})
                if (match[0]){
                    if (match[0].development){
                    return colScale(match[0].development)
                    }
                }
                else{
                    return "#654321"
                }
            })
        });
     */   
        var dropdown = d3.select("#selectbutton").append('select')
        dropdown.selectAll("options")
            .data(["None"].concat([1,2,3].concat(["All"])))
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
                if (d=="None"){
                    return "None"
                }
                else{
                    return "All"
                }
        })
            .attr("value", function (d) {return d;}) // corresponding value returned by the button

        dropdown.on("change", function(d){
            var selected = d3.select(this).property("value")
            if (selected == "None"){
                svg.selectAll("path").transition().duration(1000).style("fill", "#654321")
            }
            if (selected == "All"){
                svg.selectAll("path")
            .transition()
            .duration(2000)
            .style("fill", function(d){
                var match = economies.filter(function(i){
                    if(d){
                    return i.countryName == d.properties.name}[0]})
                if (match[0]){
                    if (match[0].development){
                    return colScale(match[0].development)
                    }
                }
                else{
                    return "#654321"
                }
            })
            }
            else{
                svg.selectAll("path")
                    .transition()
                    .duration(1000)
                    .style("fill", function(d){
                        var match = economies.filter(function(i){
                            if(d){
                                return i.countryName == d.properties.name}[0]})
                        if (match[0]){
                            if (match[0].development==selected){
                                return colScale(match[0].development)
                            }
                            else{
                                //console.log(match[0].countryName)
                                return "#654321";
                            }
                        }
                        else{
                            return "#654321"
                        }
                        

            }
                    )
        }
    })
        
        return
        {update}}
        
        

