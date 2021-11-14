import React from 'react';
import {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import { useSelector } from 'react-redux';
// Simulation class
import { Simulation, Market } from "../../utilities/statistics.js";
// Transformation from uniform -> normal distributions
import { log_normal } from "../../utilities/statistics.js";
// Finnhub API
// const finnhub = require('finnhub');
// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = 'sandbox_c65h2eqad3i9pn79qhkg';
// const finnhubClient = new finnhub.DefaultApi();

export const SimPlot = () => {
  // const data = async () => {
  //   const res = await fetch("/api/cryptocurrencies/prices");
  //   const d = await res.json();
  //   setMarket(d);
  // };

  // useEffect(() => {data()}, []);
  // console.log(market)

  // mu = mean value; sigma = standard deviation

  const test_sim = new Simulation([], log_normal, 1000, 100);

  const coin = 'bitcoin';
  const [X, setDomain] = useState(test_sim.domain);
  const [Y, setRange] = useState(test_sim.range);

  // NOTE: useEffect ensures that simulation will not run again needlessly.
  useEffect(() => test_sim.initialize(), []);

  useEffect(() => {
    const intervalPointer = setInterval(() => {
      test_sim.proceed();
      setDomain(test_sim.domain);
      setRange(test_sim.range);
    }, 1000)
    return () => clearInterval(intervalPointer);
  }, [])

  if(true) {
    const layout = {
      autosize: true,
      plot_bgcolor: 'black',
      paper_bgcolor: 'black',
      title: 'Lognormal',
      font: {color: 'white'},
      xaxis: {
        type:'date',
      },
      yaxis: {
        range: [test_sim.mu - 20*test_sim.sigma,
                test_sim.mu + 20*test_sim.sigma],
        type: 'linear'
      },
    }
    return (
      <Plot
        data={[
          {
            x: X,
            y: Y,
            type: 'scatter',
            showlegend: true,
            legendgrouptitle: {font: {color: 'white'}, text: 'hello world'},
            mode: 'lines+markers',
            marker: {color: 'green'},
          },
        ]}
        layout={layout}
        style={{'width':'100%', height:'100%'}}
        config={{scrollZoom: true}}
        useResizeHandler={true}
      />
    )
  }
}

export const MarketPlot = ({price,coin}) => {
  const test_sim = new Market([], price);

  const [X, setDomain] = useState(test_sim.domain);
  const [Y, setRange] = useState(test_sim.range);

  // NOTE: useEffect ensures that simulation will not run again needlessly.
  useEffect(() => test_sim.initialize(), []);

  useEffect(() => {
    const intervalPointer = setInterval(() => {
      test_sim.proceed();
      setDomain(test_sim.domain);
      setRange(test_sim.range);
    }, 8000)
    return () => clearInterval(intervalPointer);
  }, [])

  if(true) {
    const layout = {
      autosize: true,
      plot_bgcolor: 'black',
      paper_bgcolor: 'black',
      font: {color: 'white'},
      xaxis: {
        type:'date',
      },
      yaxis: {
        range: [price - 100,
                price + 100],
        type: 'linear'
      },
    }
    return (
      <Plot
        data={[
          {
            x: X,
            y: Y,
            type: 'scatter',
            showlegend: true,
            legendgrouptitle: {font: {color: 'white'}, text: 'hello world'},
            mode: 'lines+markers',
            marker: {color: 'green'},
          },
        ]}
        layout={layout}
        style={{'width':'100%', height:'100%'}}
        config={{scrollZoom: true}}
        useResizeHandler={true}
      />);
  }
}
