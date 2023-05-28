// Sizing
var width;
var height;

// Elements
var svg;

// Countries
var countryName;
var countryCode;


async function getJSONData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('An error occurred while loading the data: ', error);
        throw error;
    }
}

// Init and Load SVG
async function loadSVG() {
    // Hide the map
    document.getElementById('main').hidden = true;

    // Set up the map container
    const container = d3.select("#map-container");

    // Define the width and height of the map
    width = parseInt(container.style("width"));
    height = parseInt(container.style("height")) + 250;

    // Create an SVG element within the container
    svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height);
}

// Load the map
async function loadMap(data) {
    document.getElementById("loading").remove();
    document.getElementById('main').hidden = false;

    // Create a projection for the map
    const projection = d3.geoMercator()
        .fitSize([width, height], data);

    // Create a path generator
    const path = d3.geoPath().projection(projection);

    // Color scale for different colors in the map
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Render the map
    svg.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "country")
        .attr("fill", (d, i) => colorScale(i));

    let zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function (event, d) {
            svg.selectAll('path').attr('transform', event.transform);
        });

    svg.call(zoom);


    // Add hover interaction to the country elements
    svg.selectAll(".country")
        .on("mouseover", function (event, d) {
            //d3.select(this).attr("fill", "red");
            countryName = d.properties.ADMIN;
            countryCode = d.properties.ISO_A2;
            console.log(countryName + ` (${countryCode})`);
        })
        .on("mouseout", function (event, d) {
            //d3.select(this).attr("fill", "initial");
        });
}







// // Load the GeoJSON data
// d3.json("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson").then(
//     function (data) {
//         document.getElementById("loading").remove();
//         document.getElementById('map-container').hidden = false;
//         // Create a projection for the map
//         const projection = d3.geoMercator()
//             .fitSize([width, height], data);

//         // Create a path generator
//         const path = d3.geoPath().projection(projection);

//         // Render the map
//         svg.selectAll("path")
//             .data(data.features)
//             .enter()
//             .append("path")
//             .attr("d", path)
//             .attr("class", "country");


//         // Add hover interaction to the country elements
//         svg.selectAll(".country")
//             .on("mouseover", function (event, d) {
//                 //d3.select(this).attr("fill", "red");
//                 countryName = d.properties.ADMIN;
//                 countryCode = d.properties.ISO_A2;
//                 console.log(countryName + ` (${countryCode})`);
//             })
//             .on("mouseout", function (event, d) {
//                 //d3.select(this).attr("fill", "initial");
//             });
//     });