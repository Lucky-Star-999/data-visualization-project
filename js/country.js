function formatDate(date) {
    const month = date.getMonth() + 1,
        day = date.getDate(),
        year = date.getFullYear().toString().slice(2);

    return [month, day, year].join("/");
}

function getDateRange(startDate, endDate) {
    const dateArray = [];

    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dateArray.push(formatDate(currentDate));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dateArray;
}

async function getCountryData(countryName) {
    const csvFile = '../data/time_series_covid19_confirmed_global.csv';
    const countryData = [];

    try {
        const data = await d3.csv(csvFile);
        const dateRange = getDateRange("1/22/20", "3/9/23");

        dateRange.forEach(function(value) {
            const casesOfDate = {
                "date": value,
                "cases": 0
            };
            countryData.push(casesOfDate);
        });

        data.forEach(function(row) {
            if (row["Country/Region"] === countryName) {
                dateRange.forEach(function(value, index) {
                    countryData[index].cases += parseInt(row[value]);
                });
            }
        });
    } catch (error) {
        throw error;
    }

    return countryData;
}

async function loadChart() {
    const data = await getCountryData(countryName);
    // Hide the map
    document.getElementById('main').hidden = true;

    // Set up the map container
    const container = d3.select("#map-container");

    const margin = {top: 15, bottom: 65, left: 100, right: 220};
    const plotWidth = 600;
    const plotHeight = 500;
    const width = plotWidth + margin.left + margin.right;
    const height = plotHeight + margin.top + margin.bottom;

    // Create an SVG element within the container
    svg = container.append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleTime()
                .domain(d3.extent(data, d => (new Date(d.date))))
                .range([0, plotWidth]);

    const y = d3.scaleLinear()
                .domain([0, Math.max(...data.map(d => d.cases))])
                .range([plotHeight, 0]);

    svg.append("g")
        .attr("transform", `translate(0, ${plotHeight})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(new Date(d.date)))
            .y(d => y(d.cases))
        );
    
    svg.append("g")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", item => x(new Date(item.date)))
        .attr("cy", item => y(item.cases))
        .attr("r", 4)
        .style("fill", "red");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", plotWidth / 2 + 20)
        .attr("y", plotHeight + 50)
        .text("Date");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", -plotHeight / 2 + 40)
        .attr("y", -80)
        .text("Cases");

    const bisect = d3.bisector(d => (new Date(d.date))).left;

    const focus = svg.append('circle')
                    .style("fill", "none")
                    .attr("stroke", "black")
                    .attr('r', 8.5)
                    .style("opacity", 0);

    const focusText = svg.append('g')
                        .append('text')
                        .style("opacity", 0)
                        .attr("text-anchor", "left")
                        .attr("alignment-baseline", "middle");
    
    const mouseover = () => {
        focus.style("opacity", 1);
        focusText.style("opacity", 1);
    }

    const mousemove = (e) => {
        const x0 = x.invert(d3.pointer(e)[0]);
        const i = bisect(data, x0);
        selectedData = data[i];

        document.getElementById("result-case").innerHTML = selectedData.cases;
        document.getElementById("result-date").innerHTML = selectedData.date;

        focus.attr("cx", x(new Date(selectedData.date)))
            .attr("cy", y(selectedData.cases));
            
        focusText.html(new Date(selectedData.date).toLocaleDateString("en-US") + ": " + selectedData.cases + " cases")
                .attr("x", x(new Date(selectedData.date)) + 15)
                .attr("y", y(selectedData.cases))
    }

    const mouseout = () => {
        focus.style("opacity", 0);
        focusText.style("opacity", 0);
    }

    svg.append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', plotWidth)
        .attr('height', plotHeight)
        .on('mouseover', mouseover)
        .on('mousemove', e => mousemove(e))
        .on('mouseout', mouseout);
}