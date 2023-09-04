document.addEventListener("DOMContentLoaded", function () {
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const productSelect = document.getElementById("product");
    const applyFiltersButton = document.getElementById("apply-filters");
    const tableContainer = document.getElementById("table-container");
    const barChartContainer = document.getElementById("bar-chart-container");
    const lineChartContainer = document.getElementById("line-chart");

    // Load data from API
    async function fetchData() {
        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbxqMPzqZoFdW-6JoPf4EYCIs7TNgBi1wxsVeUP_qWPArV3gixxwFvvLJqPoz0TTigV7/exec");
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Apply filters to data
    function applyFilters(data, startDate, endDate, product) {
        let filteredData = data;

        if (startDate) {
            filteredData = filteredData.filter(item => item.OrderDate >= startDate);
        }

        if (endDate) {
            filteredData = filteredData.filter(item => item.OrderDate <= endDate);
        }

        if (product) {
            filteredData = filteredData.filter(item => item.Item === product);
        }

        return filteredData;
    }

    // Function to update the table
    function updateTable(filteredData) {
        tableContainer.innerHTML = "";

        const table = document.createElement("table");
        table.innerHTML = `
            <tr>
                <th>Order Date</th>
                <th>Region</th>
                <th>Rep</th>
                <th>Item</th>
                <th>Units</th>
                <th>Total</th>
            </tr>
        `;

        filteredData.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.OrderDate}</td>
                <td>${item.Region}</td>
                <td>${item.Rep}</td>
                <td>${item.Item}</td>
                <td>${item.Units}</td>
                <td>${item.Total}</td>
            `;
            table.appendChild(row);
        });

        tableContainer.appendChild(table);
    }

    // Function to update the bar chart
    function updateBarChart(filteredData) {
        barChartContainer.innerHTML = "";

        const reps = Array.from(new Set(filteredData.map(item => item.Rep)));
        const totalSales = reps.map(rep => {
            return {
                rep: rep,
                totalSales: filteredData
                    .filter(item => item.Rep === rep)
                    .reduce((sum, item) => sum + item.Total, 0)
            };
        });

        const barChartData = [{
            x: reps,
            y: totalSales.map(item => item.totalSales),
            type: "bar"
        }];

        const barChartLayout = {
            title: "Total Sales by Representative",
            xaxis: { title: "Representative" },
            yaxis: { title: "Total Sales" }
        };

        Plotly.newPlot("bar-chart-container", barChartData, barChartLayout);
    }

    // Function to update the line chart
    function updateLineChart(filteredData) {
        lineChartContainer.innerHTML = "";

        const dates = filteredData.map(item => item.OrderDate);
        const totalSales = filteredData.map(item => item.Total);

        const lineChartData = [{
            x: dates,
            y: totalSales,
            mode: "lines+markers",
            type: "scatter"
        }];

        const lineChartLayout = {
            title: "Total Sales over Time",
            xaxis: { title: "Order Date" },
            yaxis: { title: "Total Sales" }
        };

        Plotly.newPlot("line-chart", lineChartData, lineChartLayout);
    }

    // Initialize the dashboard with data
    async function initializeDashboard(data) {
        const filteredData = applyFilters(data);

        updateTable(filteredData);
        updateBarChart(filteredData);
        updateLineChart(filteredData);
    }

    // Load data and initialize the dashboard
    fetchData().then(data => {
        initializeDashboard(data);
    });
});
