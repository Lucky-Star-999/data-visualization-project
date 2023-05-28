// Hide the map
document.getElementById('map-container').hidden = true;

// Set up the map container
const container = d3.select("#map-container");

// Define the width and height of the map
const width = parseInt(container.style("width"));
const height = parseInt(container.style("height"));

// Create an SVG element within the container
const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);


// Load the GeoJSON data
d3.json("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson").then(
    function (data) {
        document.getElementById("loading").remove();
        document.getElementById('map-container').hidden = false;
        // Create a projection for the map
        const projection = d3.geoMercator()
            .fitSize([width, height], data);

        // Create a path generator
        const path = d3.geoPath().projection(projection);

        // Render the map
        svg.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country");


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
    });

async function run() {
    let data = await getJSONData("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson");
    console.log(data);
}

run();