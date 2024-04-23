// TradeActionArea.js
import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, TextField, Button } from '@mui/material';

const TradeActionArea = ({ balanceUSD, balanceCoin, latestPrice }) => {
  const [tab, setTab] = useState(0);
  const [usdAmount, setUsdAmount] = useState('');
  const [coinAmount, setCoinAmount] = useState('');

  const handleTabChange = (event, newValue) => {
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
    if (tab === 0 && usdAmount > balanceUSD) {
      alert("Insufficient USD balance.");
      return;
    }

    if (tab === 1 && coinAmount > balanceCoin) {
      alert("Insufficient coin balance.");
      return;
    }

    alert(`Transaction confirmed: ${tab === 0 ? 'Buy' : 'Sell'} ${coinAmount} coins for ${usdAmount} USD`);
    // Here you would add the logic to actually execute the transaction
  };

  return (
    <Box>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Buy" />
        <Tab label="Sell" />
      </Tabs>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {tab === 0 ? 'Buy' : 'Sell'} {tab === 0 ? balanceCoin : balanceUSD} 
      </Typography>
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
        {tab === 0 ? 'Preview Purchase' : 'Confirm Sell'}
      </Button>
    </Box>
  );
};

export default TradeActionArea;
