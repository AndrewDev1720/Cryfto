// ChartComponent.js
import React, { useState, useEffect } from 'react';
import  expandData  from '../API/utils';
import 'chartjs-adapter-date-fns';
import Paper from '@mui/material/Paper';
import { Line } from 'react-chartjs-2';

import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
        Title, Tooltip, Legend, TimeSeriesScale, Filler} from 'chart.js';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement,
                  Title, Tooltip, Legend, TimeSeriesScale, Filler );

//TODO: Add a new dataset for the predicted price
const ChartComponent = ({data, predict}) => {
  
  
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
    var coindata = [...data];
    var coinpredict = [...predict];
    const process =  () => {
      if (coinpredict != null && coinpredict.length > 0 && coindata.length > 0) {
        const start = coindata[0].time
        const end = coinpredict[coinpredict.length-1].time
        const diff = coindata[coindata.length-1].close - coinpredict[0].close
        console.log(coinpredict[0].close)
        coindata =   expandData(coindata, start, end,0)
        coinpredict =  expandData(coinpredict, start, end, diff)
      }
      for (var i = coindata.length-1; i >=1 ; i--) {
        if (coindata[i-1].close == null) {
          coindata[i-1].close = coindata[i].close
        }
      }
    }

    process()
    console.log(coinpredict)
    console.log(coindata)
    if (coinpredict != null && coinpredict.length > 0) {
      setChartData({
        labels: coindata.map(d => d.time),
        datasets: [
          {
            label: 'Predict Price',
            data: coinpredict.map(d => d.close),
            fill: {
              target: 'origin',
              above: 'rgba(192,75,0,0.5)', // And blue below the origin
            },
            backgroundColor: 'rgba(192,75,0,0.2)',
            borderColor: 'rgba(192,75,0,1)',
            borderWidth: 1.5,
            pointRadius: 0, // Set point radius to 0 to remove the bubbles
            pointHoverRadius: 5, // S
          },
          {
            label: 'Closing Price',
            data: coindata.map(d => d.close),
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
          

        ],
      });
    }
    else{
      setChartData({
        labels: coindata.map(d => d.time),
        datasets: [
          {
            label: 'Closing Price',
            data: coindata.map(d => d.close),
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
        ]
        });
    }
  }, [data, predict]);
  //console.log(typeof(data[0].time))
  return (
  <div>
    <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white', minHeight : '380px' }}>
      <Line data={chartData} options={chartOptions} />
    </Paper>
    
  </div>
  );
};

export default ChartComponent;
