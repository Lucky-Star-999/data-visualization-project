async function loadRawDataTableAllColumns() {
    document.getElementById('main').hidden = true;

    // CSV file URL
    const csvFile = '../data/time_series_covid19_confirmed_global.csv';

    // Number of rows per page
    const rowsPerPage = 10;

    // Parse CSV and create table
    Papa.parse(csvFile, {
        header: true, // Treat the first row as the header
        download: true,
        complete: function (results) {
            document.getElementById("loading").remove();
            document.getElementById('main').hidden = false;

            const data = results.data;

            // Get the table element
            const table = document.getElementById('csvTable');

            // Create table header
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            Object.keys(data[0]).forEach(function (key) {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });
            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            // Create table body
            const tableBody = document.createElement('tbody');
            data.forEach(function (row, index) {
                if (index < rowsPerPage) {
                    const bodyRow = document.createElement('tr');
                    Object.values(row).forEach(function (value) {
                        const td = document.createElement('td');
                        td.textContent = value;
                        bodyRow.appendChild(td);
                    });
                    tableBody.appendChild(bodyRow);
                }
            });
            table.appendChild(tableBody);

            // Create pagination
            const pagination = document.getElementById('pagination');
            const pageCount = Math.ceil(data.length / rowsPerPage);
            for (let i = 1; i <= pageCount; i++) {
                const li = document.createElement('li');
                li.classList.add('page-item');
                const link = document.createElement('a');
                link.classList.add('page-link');
                link.textContent = i;
                li.appendChild(link);
                pagination.appendChild(li);
            }

            // Set first page as active
            const firstPageLink = pagination.querySelector('a');
            firstPageLink.classList.add('active');

            // Pagination event listener
            pagination.addEventListener('click', function (event) {
                const page = parseInt(event.target.textContent);
                const startIndex = (page - 1) * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;

                // Clear table body
                tableBody.innerHTML = '';

                // Populate table with data for the selected page
                data.slice(startIndex, endIndex).forEach(function (row) {
                    const bodyRow = document.createElement('tr');
                    Object.values(row).forEach(function (value) {
                        const td = document.createElement('td');
                        td.textContent = value;
                        bodyRow.appendChild(td);
                    });
                    tableBody.appendChild(bodyRow);
                });

                // Update active page
                const activeLink = pagination.querySelector('.active');
                if (activeLink) {
                    activeLink.classList.remove('active');
                }
                event.target.classList.add('active');
            });
        }
    });
}

async function loadRawDataTableByDate(recordDate) {
    document.getElementById('main').hidden = true;

    // CSV file URL
    const csvFile = '../data/time_series_covid19_confirmed_global.csv';

    // Number of rows per page
    const rowsPerPage = 10;

    // Columns to display
    let columnsToDisplay = ['Province/State', 'Country/Region', 'Lat', 'Long'];
    columnsToDisplay.push(recordDate);

    // Parse CSV and create table
    Papa.parse(csvFile, {
        header: true, // Treat the first row as the header
        download: true,
        complete: function (results) {
            document.getElementById("loading").remove();
            document.getElementById('main').hidden = false;

            const data = results.data;

            // Get the table element
            const table = document.getElementById('csvTable');

            // Create table header
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            columnsToDisplay.forEach(function (column) {
                const th = document.createElement('th');
                th.textContent = column;
                headerRow.appendChild(th);
            });
            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            // Create table body
            const tableBody = document.createElement('tbody');
            data.forEach(function (row, index) {
                if (index < rowsPerPage) {
                    const bodyRow = document.createElement('tr');
                    columnsToDisplay.forEach(function (column) {
                        const td = document.createElement('td');
                        td.textContent = row[column];
                        bodyRow.appendChild(td);
                    });
                    tableBody.appendChild(bodyRow);
                }
            });
            table.appendChild(tableBody);

            // Create pagination
            const pagination = document.getElementById('pagination');
            const pageCount = Math.ceil(data.length / rowsPerPage);
            for (let i = 1; i <= pageCount; i++) {
                const li = document.createElement('li');
                li.classList.add('page-item');
                const link = document.createElement('a');
                link.classList.add('page-link');
                link.textContent = i;
                li.appendChild(link);
                pagination.appendChild(li);
            }


            // Pagination event listener
            pagination.addEventListener('click', function (event) {
                const page = parseInt(event.target.textContent);
                const startIndex = (page - 1) * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;

                // Clear table body
                tableBody.innerHTML = '';

                // Populate table with data for the selected page
                data.slice(startIndex, endIndex).forEach(function (row) {
                    const bodyRow = document.createElement('tr');
                    columnsToDisplay.forEach(function (column) {
                        const td = document.createElement('td');
                        td.textContent = row[column];
                        bodyRow.appendChild(td);
                    });
                    tableBody.appendChild(bodyRow);
                });

                // Update active page
                const activeLink = pagination.querySelector('.active');
                if (activeLink) {
                    activeLink.classList.remove('active');
                }
                event.target.classList.add('active');
            });

        }
    });
}








// async function loadRawDataTable2(recordDate) {
//     document.getElementById('main').hidden = true;

//     // CSV file URL
//     const csvFile = '../data/time_series_covid19_confirmed_global.csv';

//     // Columns to display
//     let columnsToDisplay = ['Province/State', 'Country/Region', 'Lat', 'Long'];
//     columnsToDisplay.push(recordDate);

//     // Parse CSV and create table
//     Papa.parse(csvFile, {
//         header: true, // Treat the first row as the header
//         download: true,
//         complete: function (results) {
//             document.getElementById("loading").remove();
//             document.getElementById('main').hidden = false;

//             const data = results.data;

//             // Get the table element
//             const table = document.getElementById('csvTable');

//             // Create table header
//             const tableHeader = document.createElement('thead');
//             const headerRow = document.createElement('tr');
//             columnsToDisplay.forEach(function (column) {
//                 const th = document.createElement('th');
//                 th.textContent = column;
//                 headerRow.appendChild(th);
//             });
//             tableHeader.appendChild(headerRow);
//             table.appendChild(tableHeader);

//             // Create table body
//             const tableBody = document.createElement('tbody');
//             data.forEach(function (row) {
//                 const bodyRow = document.createElement('tr');
//                 columnsToDisplay.forEach(function (column) {
//                     const td = document.createElement('td');
//                     td.textContent = row[column];
//                     bodyRow.appendChild(td);
//                 });
//                 tableBody.appendChild(bodyRow);
//             });
//             table.appendChild(tableBody);
//         }
//     });

// }