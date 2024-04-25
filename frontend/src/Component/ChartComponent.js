// ChartComponent.js
import React, { useState, useEffect } from 'react';
import 'chartjs-adapter-date-fns';
import Paper from '@mui/material/Paper';
import { Line } from 'react-chartjs-2';

import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
        Title, Tooltip, Legend, TimeSeriesScale, Filler} from 'chart.js';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement,
                  Title, Tooltip, Legend, TimeSeriesScale, Filler );

//TODO: Add a new dataset for the predicted price
const ChartComponent = ({ data,predict }) => {
  function expandData(data, start, end) {
    const expandedArray = [];
    for (let d = new Date(start); d <= end; d.setMinutes(d.getMinutes() + 1)) {
      const existingItem = data.find(item => item.time.getTime() === d.getTime());
      if (existingItem) {
        expandedArray.push(existingItem);
      } else {
        expandedArray.push({ time: new Date(d), value: null });
      }
    }
    return expandedArray;
  }

  if (predict != null && predict.length > 0) {
    var start = data[0].time
    var end = predict[predict.length-1].time
    data = expandData(data, start, end)
    predict = expandData(predict, start, end)
    
  }
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
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
      },
      filler: {
        propagate: true
      },
    },
    interaction: {
      intersect: false, // Ensures the hover is not dependent on exact point intersection
      mode: 'index' // 'index' will show the tooltip for all items at the same index
    },
  });
  useEffect(() => {
    console.log(data)
    if (data.length > 0) {
      setChartData({
        labels: data.map(d => d.time),
        datasets: [
          {
            label: 'Closing Price',
            data: data.map(d => d.close),
            fill: {
              target: 'origin',
              above: 'rgba(75,192,192,0.5)', // And blue below the origin
            },
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1.5,
            pointRadius: 0, // Set point radius to 0 to remove the bubbles
            pointHoverRadius: 5, // S
          },
          {
            label: 'Predict Price',
            data: predict.map(d => d.value-1000),
            // fill: {
            //   target: 'origin',
            //   above: 'rgba(5,132,72,0.5)', // And blue below the origin
            // },
            // backgroundColor: 'rgba(75,12,192,0.2)',
            borderColor: 'rgba(192,75,0,1)',
            borderWidth: 1.5,
            pointRadius: 0, // Set point radius to 0 to remove the bubbles
            pointHoverRadius: 5, // S
          },

        ],
      });
    }
  }, [data]);
  //console.log(typeof(data[0].time))
  return (
  <div>
    <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white', minHeight : '380px' }}>
      <Line data={chartData} options={chartOptions} />
    </Paper>
    {predict != null && predict.length > 0 ? (predict) : (<p>loading prediction</p>)}
  </div>
  );
};

export default ChartComponent;
