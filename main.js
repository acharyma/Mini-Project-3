import scatterPlot from './scatterPlot.js';
import WorldMap from './WorldMap.js';
d3.csv('cleanData.csv', d3.autoType).then(data=>{
    d3.json("world-110m.json").then(world=>{
        const cleanData = data;
        const map = world;
        const mapVis = WorldMap(map, data);
        var scatterData = data.filter(d => d.time === 2014).filter(d => d.development !== null).filter(d => d.agriculturePercentGDP != "..").filter(d => d.manufacturingPercentGDP != "..").filter(d => d.industryPercentGDP != "..");
        const scatter = scatterPlot("#scatter", scatterData);
        scatter.update(scatterData);
            })})