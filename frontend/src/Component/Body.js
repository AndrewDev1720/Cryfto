import React, { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import DashboardContainer from './DashboardContainer';
import fetchCryptoData from '../API/api';

const Body = () => {
    const loadData = async ()=> {const data = await fetchCryptoData();}
    const cryptoData = loadData();
    return(
        <div>
            <NavigationBar username="Andrew"/>
            <DashboardContainer data={cryptoData}/>
        </div>
    )
}

export default Body;