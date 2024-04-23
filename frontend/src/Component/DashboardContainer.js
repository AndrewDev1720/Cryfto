// Dashboard.js
import React, { useState, useEffect } from 'react';
import {Container, Grid, Button, TextField, InputAdornment, MenuItem, 
        Select, FormControl, InputLabel, Box} from '@mui/material';
import ChartComponent from './ChartComponent';
import TradeActionArea from './TradeActionArea';
import fetchCryptoData from '../API/api';

const DashboardContainer = ({ data }) => {
  // Placeholder for state and functions that will handle graph changing, buy orders, etc.
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [cryptoData, setCryptoData] = useState(data);
  const [currency, setCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [deposit, setDeposit] = useState('');
  const [priceInUSD, setPriceInUSD] = useState('');
  const latestData = cryptoData[cryptoData.length - 1];
  const [exchangeRate, setExchangeRate] = useState(latestData ? latestData.close : 0);

  const [balance, setBalance] = useState(1000); // Example USDT balance
  const [coinBalance, setCoinBalance] = useState(2); // Example coin amount

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

  const onChangeAddBalance = (event) => {
    const amount = event.target.value;
    setDeposit(amount); // Convert amount to USD
  };

  const handleDeposit = () => {
    // Assuming you have a state for the account balance and the amount to add
    setBalance((prevBalance) => prevBalance + Number(deposit));
    // Reset the input field after deposit
    setDeposit('');
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
        <Grid item md={8}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 2, 
            }}
          >
            <TextField
              sx={{
                width: '25%',
                backgroundColor: 'white',
              }}
              id="crypto-amount"
              label="Amount"
              variant="outlined"
              value={amount}
              onChange={handleAmountChange}
            />

            <FormControl
              sx={{
                width: '35%', 
                backgroundColor: 'white',
              }}
            >
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

            <TextField
              sx={{
                width: '35%', 
                backgroundColor: 'white',
              }}
              id="usd-price"
              label="USD"
              variant="outlined"
              value={priceInUSD}
              onChange={handlePriceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          {/* Chart Component */}
          <ChartComponent data={cryptoData || data} /* pass necessary props */ />
        </Grid>


        {/* Controls Grid */}
        <Grid item xs={12} md={4}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 2, 
          }}
        >
          <TextField
            sx={{ backgroundColor: 'white', width: '70%'}}
            id="amount-adding"
            label="Amount Deposit"
            variant="outlined"
            value={deposit}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            onChange={onChangeAddBalance}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeposit}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Deposit
          </Button>
        </Box>
        <TradeActionArea 
            balanceUSD={balance} 
            balanceCoin={coinBalance} 
            latestPrice={exchangeRate} 
            currency={currency}
            onTransactionComplete={(newBalance, newCoinBalance) => {
              // Update balance and coin amount after a transaction
              setBalance(newBalance);
              setCoinBalance(newCoinBalance);
            }}
          />
        </Grid>

        {/* Order Form Grid */}
      </Grid>
    </Container>
  );
};

export default DashboardContainer;
