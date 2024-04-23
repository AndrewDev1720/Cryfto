// Dashboard.js
import React, { useState, useEffect } from 'react';
import {Container, Grid, Button, TextField, InputAdornment, MenuItem, 
        Select, FormControl, InputLabel} from '@mui/material';
import ChartComponent from './ChartComponent';
import TradeActionArea from './TradeActionArea';
import fetchCryptoData from '../API/api';

const DashboardContainer = ({ data }) => {
  // Placeholder for state and functions that will handle graph changing, buy orders, etc.
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [cryptoData, setCryptoData] = useState(data);
  const [currency, setCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [priceInUSD, setPriceInUSD] = useState('');
  const latestData = cryptoData[cryptoData.length - 1];
  const [exchangeRate, setExchangeRate] = useState(latestData ? latestData.close : 0);

  const [balance, setBalance] = useState(1000); // Example USDT balance
  const [coinAmount, setCoinAmount] = useState(2); // Example coin amount

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    setSelectedSymbol(event.target.value);
  };

  const handleAmountChange = (event) => {
    const amount = event.target.value;
    setAmount(amount);
    setPriceInUSD(amount * exchangeRate); // Convert amount to USD
  };

  const handlePriceChange = (event) => {
    const price = event.target.value;
    setPriceInUSD(price);
    setAmount(price / exchangeRate); // Convert USD to the selected currency amount
  };

  useEffect(() => {
    const loadData = async () => {
      const newData = await fetchCryptoData(selectedSymbol);
      setCryptoData(newData);
      setExchangeRate(newData.length ? newData[newData.length - 1].close : 0);
    };

    // Load data on component mount and when selectedSymbol changes
    loadData();

    // Set up polling
    const interval = setInterval(loadData, 50000); // Poll every 50 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  

  return (
    <Container maxWidth="lg">
      <h1>Cryfto Dashboard</h1>
      <Grid container spacing={3}>
        {/* Amount and currency input Grid */}
        <Grid item>
          <TextField sx={{backgroundColor: 'white'}}
            id="crypto-amount"
            label="Amount"
            variant="outlined"
            value={amount}
            onChange={handleAmountChange}
          />
        </Grid>

        {/* Currency selection Grid */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth sx={{backgroundColor: 'white'}}>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select 
              labelId="currency-label"
              id="currency-select"
              value={currency}
              label="Currency"
              onChange={handleCurrencyChange}
            >
              <MenuItem value="BTC">BTC</MenuItem>
              <MenuItem value="ETH">Etherium</MenuItem>
              <MenuItem value="SOL">Solana</MenuItem>
              {/* Add other currencies as MenuItem components */}
            </Select>
          </FormControl>
        </Grid>

        {/* Current price Grid */}
        <Grid item xs={12} sm={3}>
          <TextField sx={{backgroundColor: 'white'}}
            id="usd-price"
            label="USD"
            variant="outlined"
            value={priceInUSD}
            onChange={handlePriceChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        {/* Chart Grid */}
        <Grid item xs={12} md={8}>
            <ChartComponent data={cryptoData ? cryptoData : data} /* pass necessary props */ />
        </Grid>

        {/* Controls Grid */}
        <Grid item xs={12} md={4}>
            <TradeActionArea/>
        </Grid>

        {/* Order Form Grid */}
      </Grid>
    </Container>
  );
};

export default DashboardContainer;
