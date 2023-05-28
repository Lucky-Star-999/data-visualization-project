async function index() {
    // Init + Create SVG
    await loadSVG();

    // get GeoJSON Data
    let data = await getJSONData("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson");

    // Load the map
    await loadMap(data);
}

async function rawdata() {
    await loadRawDataTableByDate('1/22/20');
}

async function analyzeddata(recordDate) {
    // Get top 5 countries having mose COVID cases
    let topCountries = await getTopCountriesData(recordDate);

    // Load the chart
    await loadChart(topCountries);
}
