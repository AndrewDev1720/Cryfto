// TradeActionArea.js
import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, TextField, Button, Paper } from '@mui/material';

const TradeActionArea = ({ balanceUSD, balanceCoin, latestPrice, currency }) => {
  const [tab, setTab] = useState(0);
  const [usdAmount, setUsdAmount] = useState('');
  const [coinAmount, setCoinAmount] = useState('');
  const [balance, setBalance] = useState(balanceUSD);
  const [coinBalance, setCoinBalance] = useState(balanceCoin);

  useEffect (() => {
    setBalance(balanceUSD);
    setCoinAmount(usdAmount / latestPrice);
    currency === 'BTC' ? setCoinBalance(balanceCoin) : setCoinBalance(0);
  }, [balanceUSD, balanceCoin, latestPrice, currency])

  const handleTabChange = (event, newValue) => {
    setUsdAmount('');
    setCoinAmount('');
    setTab(newValue);
  };

  const handleUsdAmountChange = (event) => {
    const newUsdAmount = event.target.value;
    setUsdAmount(newUsdAmount);
    setCoinAmount(newUsdAmount / latestPrice);
  };

  const handleCoinAmountChange = (event) => {
    const newCoinAmount = event.target.value;
    setCoinAmount(newCoinAmount);
    setUsdAmount(newCoinAmount * latestPrice);
  };

  const handlePurchase = () => {
    console.log(balanceCoin);
    if (tab === 0 && usdAmount > balanceUSD) {
      alert("Insufficient USD balance.");
      return;
    }

    if (tab === 1 && coinAmount > coinBalance) {
      alert("Insufficient coin balance.");
      return;
    }

    alert(`Transaction confirmed: ${tab === 0 ? 'Buy' : 'Sell'} ${coinAmount} coins for ${usdAmount} USD`);
    if (tab === 0){
      setBalance((prevBalance) => prevBalance - usdAmount);
      setCoinBalance((prevBalance) => prevBalance + coinAmount);
    }

    if (tab === 1){
      setBalance((prevBalance) => prevBalance + usdAmount);
      setCoinBalance((prevBalance) => prevBalance - coinAmount);
    }
    // Here you would add the logic to actually execute the transaction
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white', padding: '20px' }}>
      <Typography variant="h6" component="div" align="left">
        Account Balance: $ {balance}
      </Typography>
      <Typography variant="h6" sx={{ mt: 1, mb: 1 }} align="left">
        {currency} Balance: {coinBalance}
      </Typography>
      {/* Assuming you want to display the actual balance here */}
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Buy" />
        <Tab label="Sell" />
      </Tabs>
      {/* <Typography variant="h6" sx={{ mt: 2 }}>
        {tab === 0 ? 'Buy Transaction' : 'Sell Transaction'} 
      </Typography> */}
      <TextField
        label={tab === 0 ? 'USD' : 'Coin'}
        variant="outlined"
        value={tab === 0 ? usdAmount : coinAmount}
        onChange={tab === 0 ? handleUsdAmountChange : handleCoinAmountChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label={tab === 0 ? 'Coin' : 'USD'}
        variant="outlined"
        value={tab === 0 ? coinAmount : usdAmount}
        onChange={tab === 0 ? handleCoinAmountChange : handleUsdAmountChange}
        fullWidth
        margin="normal"
        disabled
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        fullWidth
        onClick={handlePurchase}
      >
        {tab === 0 ? 'Confirm Purchase' : 'Confirm Sell'}
      </Button>
    </Paper>
  );
};

export default TradeActionArea;
