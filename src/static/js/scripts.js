// This file contains JavaScript code for client-side functionality. 
// It may include functions to handle user interactions and dynamically update the dashboard with data.

document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch data from the server
    async function fetchData() {
        try {
            const response = await fetch('/api/data'); // Adjust the endpoint as necessary
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            updateDashboard(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to update the dashboard with fetched data
    function updateDashboard(data) {
        const dashboardElement = document.getElementById('dashboard');
        dashboardElement.innerHTML = ''; // Clear existing content

        data.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'data-item';
            itemElement.textContent = JSON.stringify(item); // Customize how you display each item
            dashboardElement.appendChild(itemElement);
        });
    }

    // Initial data fetch
    fetchData();

    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const table = document.getElementById('data-table');
    const tbody = table.querySelector('tbody');
    const reportCountElement = document.getElementById('report-count');
    let lastSortedColumn = null;
    const originalRows = Array.from(tbody.querySelectorAll('tr'));

    function updateReportCount() {
        const visibleRows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.style.display !== 'none');
        const rowCount = visibleRows.length;
        const petroleumCount = visibleRows.filter(row => row.cells[3].textContent === 'Petroleum').length;
        const mineralsCount = visibleRows.filter(row => row.cells[3].textContent === 'Minerals').length;
        const consumerGoodsCount = visibleRows.filter(row => row.cells[3].textContent === 'Consumer Goods').length;
        const agricultureCount = visibleRows.filter(row => row.cells[3].textContent === 'Agriculture').length;
        const engineeringCount = visibleRows.filter(row => row.cells[3].textContent === 'Engineering').length;
        const steelCount = visibleRows.filter(row => row.cells[3].textContent === 'Steel').length;
        const administrativeCount = visibleRows.filter(row => row.cells[3].textContent === 'Administrative').length;
        const accidentCount = visibleRows.filter(row => row.cells[10].textContent === 'Accident').length;
        const eventCount = visibleRows.filter(row => row.cells[10].textContent === 'Event').length;
        const nearMissCount = visibleRows.filter(row => row.cells[10].textContent === 'Near Miss').length;

        reportCountElement.innerHTML = `
            <span>No. of Reports: ${rowCount}</span><span class="divider">|</span>
            <span>Petroleum: ${petroleumCount}</span><span class="divider">|</span>
            <span>Minerals: ${mineralsCount}</span><span class="divider">|</span>
            <span>Consumer Goods: ${consumerGoodsCount}</span><span class="divider">|</span>
            <span>Agriculture: ${agricultureCount}</span><span class="divider">|</span>
            <span>Engineering: ${engineeringCount}</span><span class="divider">|</span>
            <span>Steel: ${steelCount}</span><span class="divider">|</span>
            <span>Administrative: ${administrativeCount}</span><span class="divider">|</span>
            <span>Accident: ${accidentCount}</span><span class="divider">|</span>
            <span>Event: ${eventCount}</span><span class="divider">|</span>
            <span>Near Miss: ${nearMissCount}</span>
        `;
    }

    selectAllCheckbox.addEventListener('change', function() {
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!checkbox.checked) {
                selectAllCheckbox.checked = false;
            } else if (Array.from(rowCheckboxes).every(cb => cb.checked)) {
                selectAllCheckbox.checked = true;
            }
        });
    });

    window.sortTable = function(columnIndex) {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const headers = table.querySelectorAll('th');

        if (lastSortedColumn === columnIndex) {
            // If the same column is clicked again, unsort and revert color
            originalRows.forEach(row => tbody.appendChild(row));
            headers[columnIndex].style.backgroundColor = '';
            lastSortedColumn = null;
            return;
        }

        // Sort the rows alphabetically based on the column
        rows.sort((a, b) => {
            const aText = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.toLowerCase();
            const bText = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.toLowerCase();
            return aText.localeCompare(bText);
        });

        // Append sorted rows to tbody
        rows.forEach(row => tbody.appendChild(row));
        updateReportCount(); // Update report count after sorting

        // Change the color of the clicked header
        headers.forEach(header => header.style.backgroundColor = '');
        headers[columnIndex].style.backgroundColor = '#45a049';

        // Set last sorted column
        lastSortedColumn = columnIndex;
    }

    // Initial report count update
    updateReportCount();

    const filterButton = document.getElementById('filters-button');
    const modal = document.getElementById('filter-modal');
    const closeButton = document.querySelector('.close');
    const applyFiltersButton = document.getElementById('apply-filters');
    const generateReportButton = document.getElementById('generate-report-button');
    const reportModal = document.getElementById('report-modal');
    const closeReportModalButton = document.querySelector('.close-report-modal');
    const submitReportButton = document.getElementById('submit-report');
    const filterForm = document.getElementById('filter-form');
    const reportForm = document.getElementById('report-form');

    filterButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    closeReportModalButton.addEventListener('click', function() {
        reportModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
        if (event.target == reportModal) {
            reportModal.style.display = 'none';
        }
    });

    applyFiltersButton.addEventListener('click', function() {
        const formData = new FormData(filterForm);
        const selectedCommodities = formData.getAll('commodity');
        const selectedIncidents = formData.getAll('incident');
        const selectedLocations = formData.getAll('location');
        const selectedMonth = formData.get('month').toLowerCase();
        const selectedYear = formData.get('year');

        Array.from(tbody.querySelectorAll('tr')).forEach(row => {
            const commodity = row.cells[3].textContent;
            const incident = row.cells[10].textContent;
            const location = row.cells[4].textContent;
            const dateOfReport = new Date(row.cells[7].textContent);
            const month = dateOfReport.toLocaleString('default', { month: 'long' }).toLowerCase();
            const year = dateOfReport.getFullYear().toString();

            if ((selectedCommodities.length === 0 || selectedCommodities.includes(commodity)) &&
                (selectedIncidents.length === 0 || selectedIncidents.includes(incident)) &&
                (selectedLocations.length === 0 || selectedLocations.includes(location)) &&
                (selectedMonth === "" || selectedMonth === month) &&
                (selectedYear === "" || selectedYear === year)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        updateReportCount();
        modal.style.display = 'none';
    });

    generateReportButton.addEventListener('click', function() {
        reportModal.style.display = 'block';
    });

    submitReportButton.addEventListener('click', function() {
        const selectedRows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.querySelector('.row-checkbox').checked);
        const selectedData = selectedRows.map(row => {
            const rowData = {};
            row.querySelectorAll('td').forEach((cell, index) => {
                const header = table.querySelector(`th:nth-child(${index + 1})`).textContent;
                rowData[header] = cell.textContent;
            });
            return rowData;
        });

        const reportFormData = new FormData(reportForm);
        const reportData = {};
        reportFormData.forEach((value, key) => {
            reportData[key] = value;
        });

        fetch('/api/generate_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedData, reportData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Reports generated successfully!');
            } else {
                alert('Failed to generate reports.');
            }
        })
        .catch(error => {
            console.error('Error generating reports:', error);
            alert('An error occurred while generating reports.');
        });

        reportModal.style.display = 'none';
    });

    // Initial report count update
    updateReportCount();
});