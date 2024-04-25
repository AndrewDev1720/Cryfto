// Dashboard.js
import React, { useState, useEffect } from 'react';
import {Container, Grid, Button, TextField, InputAdornment, MenuItem, 
        Select, FormControl, InputLabel, Box} from '@mui/material';
import ChartComponent from './ChartComponent';
import TradeActionArea from './TradeActionArea';
import fetchCryptoData from '../API/api';
import { socket } from '../API/socket';
const DashboardContainer = ({ data }) => {
  
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [cryptoData, setCryptoData] = useState(data);
  const [btcdata, setBtcdata] = useState([]);
  const [ethdata, setEthdata] = useState([]);
  const [predict, setPredict] = useState([]);
  const [currency, setCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [deposit, setDeposit] = useState('');
  const [priceInUSD, setPriceInUSD] = useState('');
  const [timeRange, setTimeRange] = useState('720');
  const latestData = cryptoData[cryptoData.length - 1];
  const [exchangeRate, setExchangeRate] = useState(latestData ? latestData.close : 0);

  const [balance, setBalance] = useState(1000); // Example USDT balance
  const [coinBalance, setCoinBalance] = useState(0); // Example coin amount

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

  const onChangeTimeRange = (event) => {
    const selectedTimeRange = event.target.value;
    setTimeRange(selectedTimeRange);
  }

  const handleDeposit = () => {
    // Assuming you have a state for the account balance and the amount to add
    setBalance((prevBalance) => prevBalance + Number(deposit));
    // Reset the input field after deposit
    setDeposit('');
  };

  useEffect(() => {
    
    socket.on('btc', (newData) => {
      // console.log(newData[0]);
      newData = newData.map((d) => {
        d = JSON.parse(d);
        return {
          time: new Date(d.time*1000),
          close: d.close,
        };
      }).sort((a, b) => a.time - b.time);
      //console.log(newData);
      setBtcdata(newData);
    });
    socket.on('eth', (newData) => {
      // console.log(newData[0]);
      newData = newData.map((d) => {
        d = JSON.parse(d);
        return {
          time: new Date(d.time*1000),
          close: d.close,
        };
      }).sort((a, b) => a.time - b.time);
      //console.log(newData);
      setEthdata(newData);
    });
    socket.on('predict', (newData) => {
      newData = newData.map((d) => {
        d = JSON.parse(d);
        return {
          time: new Date(d.time*1000),
          close: d.close,
        };
      }).sort((a, b) => a.time - b.time);
      setPredict(newData);
    });


    const loadData = async () => {
      const newData = await fetchCryptoData(selectedSymbol, timeRange);
      setCryptoData(newData);
      setExchangeRate(newData.length ? newData[newData.length - 1].close : 0);
      setPriceInUSD(amount*exchangeRate);
    };
    // Load data on component mount and when selectedSymbol changes
    loadData();
    // setPriceInUSD(amount*exchangeRate);

    // Set up polling
    const interval = setInterval(loadData, 50000); // Poll every 50 seconds
    //console.log(btcdata[0])
    // Clear the interval on component unmount
    return () => {
      socket.off('btc');
      socket.off('eth')
      socket.off('predict');
      clearInterval(interval);
    }

  }, [selectedSymbol, timeRange, exchangeRate, amount]);

  

  return (
    <Container maxWidth="lg">
      <h1>Cryfto Dashboard</h1>
      <p>{data.length}</p>
      <Grid container spacing={3}>
        {/* Amount and currency input Grid */}
        <Grid item md={8} sm = {12}>
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
                width: '15%',
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
                width: '25%', 
                backgroundColor: 'white',
              }}
            >
              <InputLabel id="currency-label">Currency </InputLabel>
              <Select
                labelId="currency-label"
                id="currency-select"
                value={currency}
                label="Currency"
                onChange={handleCurrencyChange}
              >
                <MenuItem value="BTC">BTC</MenuItem>
                <MenuItem value="ETH">Etherium</MenuItem>
                {/* <MenuItem value="SOL">Solana</MenuItem> */}
                {/* Add other currencies as MenuItem components */}
              </Select>
            </FormControl>

            <TextField
              sx={{
                width: '25%', 
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

            <FormControl
              sx={{
                width: '25%', 
                backgroundColor: 'white',
              }}
            >
              <InputLabel id="timerange-label">Time Range</InputLabel>
              <Select
                labelId="timerange-label"
                id="timerange-select"
                variant="outlined"
                value={timeRange}
                label="Time Range"
                onChange={onChangeTimeRange}
              >
                <MenuItem value="60">1 hour</MenuItem>
                <MenuItem value="360">6 hours</MenuItem>
                <MenuItem value="720">12 hours</MenuItem>
                {/* Add other currencies as MenuItem components */}
              </Select>
            </FormControl>

          </Box>
          {/* Chart Component */}
          {/* <ChartComponent data={cryptoData || data} /> */}
          {
          (selectedSymbol === 'BTC') ?
          (<ChartComponent 
          predict = {predict}
          data={btcdata.filter( d => d.time >= new Date(new Date().setMinutes( new Date().getMinutes()-timeRange)) ) || data }
           />) 
           :
           (<ChartComponent data = {ethdata.filter( d => d.time >= new Date(new Date().setMinutes( new Date().getMinutes()-timeRange)) ) || data } />)
          }
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
            sx={{ whiteSpace: 'nowrap' , width: '25%'}}
          >
            Deposit
          </Button>
        </Box>
        <TradeActionArea 
            balanceUSD={balance} 
            balanceCoin={coinBalance} 
            latestPrice={exchangeRate} 
            currency={selectedSymbol}
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
