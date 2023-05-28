async function getTopCountriesData(recordDate) {
    // CSV file URL
    const csvFile = '../data/time_series_covid19_confirmed_global.csv';

    return new Promise((resolve, reject) => {
        Papa.parse(csvFile, {
            header: true, // Treat the first row as the header
            download: true,
            complete: function (results) {
                const data = results.data;

                // Aggregate the COVID cases by 'Country/Region'
                const countriesData = {};

                data.forEach(function (row) {
                    const country = row['Country/Region'];
                    const cases = parseInt(row[recordDate]);

                    if (!countriesData[country]) {
                        countriesData[country] = cases;
                    } else {
                        countriesData[country] += cases;
                    }
                });

                // Convert countriesData object to an array of objects
                const countriesArray = Object.entries(countriesData).map(([country, cases]) => ({
                    country,
                    cases
                }));

                // Sort the countriesArray in descending order based on cases
                countriesArray.sort((a, b) => b.cases - a.cases);

                // Return the top 5 countries
                resolve(countriesArray.slice(0, 5));
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

async function loadChart(topCountries) {
    const width = 1150;
    const height = 350;
    const margin = {
        top: 20,
        right: 300,
        bottom: 20,
        left: 150
    };

    document.getElementById("chart").innerHTML = '';

    // Select the SVG container
    const svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);

    // Create x-axis scale
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(topCountries, d => d.cases)])
        .range([margin.left, width - margin.right]);

    // Create y-axis scale
    const yScale = d3.scaleBand()
        .domain(topCountries.map(d => d.country))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

    // Create chart bars
    svg.selectAll(".bar")
        .data(topCountries)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", xScale(0))
        .attr("y", d => yScale(d.country))
        .attr("width", d => xScale(d.cases) - xScale(0))
        .attr("height", yScale.bandwidth())

    // Add labels to the chart
    svg.selectAll(".bar-label")
        .data(topCountries)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.cases) + 5) // Adjust the value as needed for desired position
        .attr("y", d => yScale(d.country) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .style("fill", "black")
        .style("font-size", "14px")
        .style("text-anchor", "start")
        .text(d => d.cases.toLocaleString());

    // Add x-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".2s")));

    // Add y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));
}




// async function getTopCountriesData() {
//     // CSV file URL
//     const csvFile = '../data/time_series_covid19_confirmed_global.csv';

//     return new Promise((resolve, reject) => {
//         Papa.parse(csvFile, {
//             header: true, // Treat the first row as the header
//             download: true,
//             complete: function (results) {
//                 const data = results.data;

//                 // Aggregate the COVID cases by 'Country/Region'
//                 const countriesData = {};

//                 data.forEach(function (row) {
//                     const country = row['Country/Region'];
//                     const cases = parseInt(row['12/22/20']);

//                     if (!countriesData[country]) {
//                         countriesData[country] = cases;
//                     } else {
//                         countriesData[country] += cases;
//                     }
//                 });

//                 // Convert countriesData object to an array of objects
//                 const countriesArray = Object.entries(countriesData).map(([country, cases]) => ({
//                     country,
//                     cases
//                 }));

//                 // Sort the countriesArray in descending order based on cases
//                 countriesArray.sort((a, b) => b.cases - a.cases);

//                 // Return the top 5 countries
//                 resolve(countriesArray.slice(0, 5));
//             },
//             error: function (error) {
//                 reject(error);
//             }
//         });
//     });
// }
