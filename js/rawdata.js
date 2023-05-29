async function loadRawDataTableByDate(recordDate) {
    document.getElementById('main').hidden = true;
  
    // CSV file URL
    const csvFile = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  
    // Number of rows per page
    const rowsPerPage = 10;
  
    // Columns to display
    let columnsToDisplay = ['Province/State', 'Country/Region', 'Lat', 'Long'];
    columnsToDisplay.push(recordDate);
  
    try {
      const data = await d3.csv(csvFile);
  
      if (document.getElementById("loading") != null) {
        document.getElementById("loading").remove();
      }
      document.getElementById('main').hidden = false;
  
      // Get the table element
      const table = document.getElementById('csvTable');
  
      // Clear table content
      table.innerHTML = '';
  
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
  
      // Clear pagination
      pagination.innerHTML = '';
  
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
    } catch (error) {
      console.error(error);
    }
  }
