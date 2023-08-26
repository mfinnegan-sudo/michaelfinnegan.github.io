// Fetch the JSON data from the API
fetch('https://script.google.com/macros/s/AKfycbxqMPzqZoFdW-6JoPf4EYCIs7TNgBi1wxsVeUP_qWPArV3gixxwFvvLJqPoz0TTigV7/exec')
    .then(response => response.json())
    .then(data => {
        // Calculate the sum of totals by date
        const totalsByDate = {};

        data.data.forEach(item => {
            const date = item.OrderDate.split('T')[0]; // Extract the date part
            if (totalsByDate[date]) {
                totalsByDate[date] += item.Total;
            } else {
                totalsByDate[date] = item.Total;
            }
        });

        // Create a line chart using Chart.js
        const chartLabels = Object.keys(totalsByDate);
        const chartData = Object.values(totalsByDate);

        const ctx = document.getElementById('lineChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Sum of Totals by Date',
                    data: chartData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Total'
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
