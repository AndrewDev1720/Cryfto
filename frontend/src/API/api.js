// api.js
const fetchCryptoData = async (symbol = 'BTC') => { // Default to BTC if no symbol is provided
  const url = `https://min-api.cryptocompare.com/data/histominute?fsym=${symbol}&tsym=USD&limit=600`;
  try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response !== 'Success') {
          throw new Error('API response is not successful.');
      }
      
      return data.Data.map((item) => ({
          time: new Date(item.time * 1000), // Convert UNIX timestamp to JavaScript Date object
          close: item.close // Use the closing price
      }));
  } catch (error) {
      console.error('Error fetching data:', error);
      return []; // Return empty array in case of error
  }
};

export default fetchCryptoData;
