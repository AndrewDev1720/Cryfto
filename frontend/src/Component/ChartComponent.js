// ChartComponent.js
import React, { useState, useEffect } from 'react';
import 'chartjs-adapter-date-fns';
import Paper from '@mui/material/Paper';
import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeSeriesScale, // This may need to be imported for time series
  } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeSeriesScale // Ensure this is registered if using a time series scale
  );

const ChartComponent = ({ data }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    scales: {
      x: {
        type: 'timeseries',
        time: {
            parser: 'HH:mm', // Specify the parser if needed for custom formats
            tooltipFormat: 'HH:mm',
            unit: 'minute',
            stepSize: 30, // Set to 30 to show a label every 30 minutes
        },
        title: {
            display: true,
            text: 'Time'
        },
        ticks: {
            autoSkip: true,
            maxTicksLimit: 10 
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  });

  useEffect(() => {
    if (data.length > 0) {
      setChartData({
        labels: data.map(d => d.time),
        datasets: [
          {
            label: 'BTC Closing Price',
            data: data.map(d => d.close),
            fill: false,
            // backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1.5,
            pointRadius: 0.5, // Set point radius to 0 to remove the bubbles
            pointHoverRadius: 5, // S
          },
        ],
      });
    }
  }, [data]);

  return (
    <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white' }}>
      <Line data={chartData} options={chartOptions} />
    </Paper>
  );
};

export default ChartComponent;
