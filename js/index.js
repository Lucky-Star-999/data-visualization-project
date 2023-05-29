// Sizing
var width;
var height;

// Elements
var svg;

// Countries
var countryName;
var countryCode;

// Date
var choosenDate;

// Date
var choosenDate;

// COVID Cases
var covidCase;

//////////////////////////////////////////////////////

// Render the result in the panel
async function showPanel() {
    // Render country
    document.getElementById("result-country").innerText = countryName + ` (${countryCode})`;

    // Get COVID Case
    let csvDate = await getCsvDate();
    let covidCase = await getCountryData(countryName, csvDate);

    // Render the result case
    document.getElementById("result-case").innerHTML = `COVID Cases: <b>${covidCase}</b>`;

    // Render date
    let resultDate = await getFormattedDate();
    document.getElementById("result-date").innerText = resultDate;
}

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

async function getChoosenDate() {
    let rawDate = document.getElementById("datepicker").value;
    choosenDate = rawDate;
    return rawDate;
}

async function getFormattedDate() {
    let rawDate = document.getElementById("datepicker").value;
    choosenDate = rawDate;
    return `Record date: ${rawDate[8]}${rawDate[9]}/${rawDate[5]}${rawDate[6]}/${rawDate[0]}${rawDate[1]}${rawDate[2]}${rawDate[3]}`;
}

async function getCsvDate() {
    let rawDate = document.getElementById("datepicker").value;

    let formattedDate;

    if (rawDate[5].toString() === '0' && rawDate[8].toString() === '0') {
        formattedDate = `${rawDate[6]}/${rawDate[9]}/${rawDate[2]}${rawDate[3]}`;
    } else if (rawDate[5].toString() === '0') {
        formattedDate = `${rawDate[6]}/${rawDate[8]}${rawDate[9]}/${rawDate[2]}${rawDate[3]}`;
    } else if (rawDate[8].toString() === '0') {
        formattedDate = `${rawDate[5]}${rawDate[6]}/${rawDate[9]}/${rawDate[2]}${rawDate[3]}`;
    } else {
        formattedDate = `${rawDate[5]}${rawDate[6]}/${rawDate[8]}${rawDate[9]}/${rawDate[2]}${rawDate[3]}`;
    }

    return formattedDate;
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
            // console.log(countryName + ` (${countryCode})`);
            showPanel();
        })
        .on("mouseout", function (event, d) {
            //d3.select(this).attr("fill", "initial");
        });
}


async function getCountryData(country, recordDate) {
    // CSV file URL
    const csvFile = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

    try {
        const data = await d3.csv(csvFile);

        // Filter data by country
        const filteredData = data.filter(row => row['Country/Region'] === country);

        // Return the country data
        return filteredData[0][recordDate.toString()];
    } catch (error) {
        return 0;
    }
}