import React, { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import DashboardContainer from './DashboardContainer';
import fetchCryptoData from '../API/api';

const Body = () => {
    const [cryptoData, setCryptoData] = useState([]);

    useEffect(() => {
      const loadData = async () => {
        const data = await fetchCryptoData();
        setCryptoData(data);
      };
  
      loadData();
  
      // Set up polling
      const interval = setInterval(loadData, 60000); // Poll every 60 seconds
  
      // Clear the interval on component unmount
      return () => clearInterval(interval);
    }, []);

    return(
        <div>
            <NavigationBar username="Andrew"/>
            <DashboardContainer data = {cryptoData}/>
        </div>
    )
}

export default Body;