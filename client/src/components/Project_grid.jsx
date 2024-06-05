import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import the Calendar component
import 'react-calendar/dist/Calendar.css'; // Import the default calendar styles
import Chart from 'chart.js/auto';

function ProjectGrid() {
  const [date, setDate] = useState(new Date()); // State to manage the selected date
  const [selectedTask, setSelectedTask] = useState('All Tasks'); // State to manage the selected task

  const allData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Airsial Website',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: [30,20], // Time taken in days
      },
      {
        label: 'Veet',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        data: [0,0,0,8], // Time taken in days
      },
      {
        label: 'Video',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [8, 12, 16, 20, 24, 28], // Time taken in days
      },
      {
        label: 'Website',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        data: [12, 18, 24, 30, 36, 42], // Time taken in days
      },
      {
        label: 'API Testing',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        data: [7, 14, 21, 28, 35, 42], // Time taken in days
      },
    ],
  };

  // Filter data based on the selected task
  const filteredData = {
    labels: allData.labels,
    datasets:
      selectedTask === 'All Tasks'
        ? allData.datasets
        : allData.datasets.filter((dataset) => dataset.label === selectedTask),
  };

  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy(); // Destroy existing chart instance
      }
      const ctx = chartRef.current.getContext('2d');
      chartRef.current.chart = new Chart(ctx, {
        type: 'bar',
        data: filteredData,
        options: {
          scales: {
            x: {
              stacked: true, // Stack the bars if showing all tasks
              title: {
                display: true,
                text: 'Month',
              },
            },
            y: {
              stacked: selectedTask === 'All Tasks', // Stack the bars if showing all tasks
              title: {
                display: true,
                text: 'Time Taken (days)',
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const dataset = filteredData.datasets[context.datasetIndex];
                  if (dataset) {
                    const label = dataset.label || '';
                    const value = context.parsed.y !== null ? context.parsed.y : '';
                    return label + ': ' + value + ' days';
                  }
                  return '';
                },
              },
            },
          },
        },
      });
    }
  }, [filteredData]);

  return (
    <>
      <div className="grid lg:grid-cols-6 md:grid-cols-6 grid-cols-1 gap-8 mt-8">
        <div className="h-auto bg-white lg:col-span-2 md:col-span-3 md:p-6 rounded-3xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Calendar</h2>
          <Calendar
            onChange={setDate} // Handle change of date
            value={date} // Set the selected date
            className="border-none rounded-md contents" // Customizing calendar style
          />
        </div>

        <div className="h-auto bg-white lg:col-span-4 md:col-span-3 p-6 rounded-3xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Project Progress</h2>
          <div className="mb-4">
            <label htmlFor="taskSelect" className="mr-2">Select Task:</label>
            <select
              id="taskSelect"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="All Tasks">All Tasks</option>
              <option value="Airsial Website">Airsial Website</option>
              <option value="Veet">Veet</option>
              <option value="Video">Video</option>
              <option value="Website">Website</option>
              <option value="API Testing">API Testing</option>
            </select>
          </div>
          <canvas id="projectProgressChart" ref={chartRef} width="400" height="200"></canvas>
        </div>
      </div>
    </>
  );
}

export default ProjectGrid;
