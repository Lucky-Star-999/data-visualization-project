async function index() {
    // Init + Create SVG
    await loadSVG();

    // get GeoJSON Data
    let data = await getJSONData("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson");

    // Load the map
    await loadMap(data);
}

async function rawdata() {
    await loadRawDataTableAllColumns();
}
