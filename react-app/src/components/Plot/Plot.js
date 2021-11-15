import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userPortfolios } from "../../store/portfolio";
import { getUserTransactions } from "../../store/transaction";
import {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import { Simulation, log_normal } from "../../utilities/statistics.js";

export const SimPlot = ({coin, setPrice, setHist}) => {
  let distribution = log_normal;
  let test_sim;
  let data;

  const [mu, setMean] = useState(1000);
  const [sigma, setDeviation] = useState(100);
  const [X, setDomain] = useState(Simulation.initialize(50,log_normal,mu,sigma).domain);
  const [Y, setRange] = useState(Simulation.initialize(50,log_normal,mu,sigma).range);

  useEffect(() => {
    data = Simulation.zip(X,Y,distribution)
    test_sim = new Simulation(data, distribution, mu, sigma);
    setPrice(test_sim.range[49].toFixed(2))
  }, []);

  // NOTE: useEffect ensures that simulation will not run again needlessly.
  useEffect(() => {
    const intervalPointer = setInterval(() => {
      test_sim.proceed();
      setDomain([...test_sim.domain]);
      setRange([...test_sim.range]);
      setPrice(test_sim.range[49].toFixed(2))
    }, 1000)
    return () => clearInterval(intervalPointer);
  }, [])

  if(true) {
    const layout = {
      autosize: true,
      plot_bgcolor: 'black',
      paper_bgcolor: 'black',
      title: coin,
      font: {color: 'white'},
      xaxis: {
        type:'date',
      },
      yaxis: {
        range: [mu - 20*sigma,
                mu + 20*sigma],
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

export const MarketPlot = ({coin, setHist}) => {
  const [X, setDomain] = useState([]);
  const [Y, setRange] = useState([]);
  const lower_coin = coin.toLowerCase()
  // Setting day interval to 30 for debugging, implement as variable later
  const marketData = async (coin) => {
    const res = await fetch(`/api/cryptocurrencies/${coin}`);
    const history = await res.json();
    const domain = history.prices.map(dp => dp[0]).slice(-30)
    const range = history.prices.map(dp => dp[1].toFixed(2)).slice(-30)
    setDomain([...domain]);
    setRange([...range]);
    const d_daily = range[range.length-1] - range[range.length-2];
    const d_daily_p = 100*(d_daily / range[range.length-2])
    const d_monthly = range[range.length-1] - range[0];
    const d_monthly_p = 100*(d_monthly / range[0])
    setHist({time: domain, price: range,
             d_daily: d_daily, d_daily_p: d_daily_p,
             d_monthly: d_monthly, d_monthly_p: d_monthly_p});
  }

  useEffect(() => {
    marketData(lower_coin);
  }, [lower_coin])

    const layout = {
      autosize: true,
      plot_bgcolor: 'black',
      paper_bgcolor: 'black',
      font: {color: 'white'},
      xaxis: {
        type:'date',
      },
      yaxis: {
        type: 'linear'
      },
    }

   const data=[{
      x: X,
      y: Y,
      type: 'scatter',
      showlegend: true,
      legendgrouptitle: {font: {color: 'white'}, text: 'price'},
      mode: 'lines+markers',
      marker: {color: 'green'},
    }];

    return (
      <Plot
        data={data}
        layout={layout}
        style={{'width':'100%', height:'100%'}}
        config={{scrollZoom: true}}
        useResizeHandler={true}
      />);
}

export const PortPlot = ()  => {
  const user = useSelector(state => state.session.user);
  const portfolios = useSelector((state) => state.portfolio.portfolio);
  const cryptos = useSelector((state) => state.crypto.list);
  const dispatch = useDispatch();
  const transactions = useSelector(state => Object.values(state.transaction));
  const [X, setDomain] = useState([])
  const [Y, setRange] = useState([])

  const marketData = async () => {
    const res = await fetch(`/api/cryptocurrencies/bitcoin`);
    const history = await res.json();
    const domain = history.prices.map(dp => dp[0]).slice(-30)
    const range = history.prices.map(dp => dp[1].toFixed(2)).slice(-30)
    setDomain([...domain]);
    setRange([...range]);
  }

  useEffect(() => {
    marketData()
    dispatch(userPortfolios(user?.id));
    dispatch(getUserTransactions(user?.id));
  }, [dispatch]);

  const transaction_data = {
    number_purchases: transactions?.length,
    total_purchases: transactions?.filter(t => t.type==='buy')
                                  .map(t => t.price)
                                  .reduce((t,n) => t + n, 0),
    cashed_out: transactions?.filter(t => t.type==='sell')
                              .map(t => t.price)
                              .reduce((t,n) => t + n, 0),
    average_investment: transactions?.filter(t => t.type==='buy')
                                  .map(t => t.price)
                                  .reduce((t,n) => t + n, 0)
                                  / transactions?.filter(t => t.type==='buy').length
  }

  // function computeProfitCurve() {
  //   for (let t = 0; t < X.length; t++) {
  //     transactions.filter(T => {
  //       const uT = new Date(T).getTime() / 1000
  //       if (X[t])
  //     })
  //   }
  //   const unix_purchase_time = new Date(purchase_date).getTime() / 1000
  //   const unix_price_time =() / 1000
  // }
  console.log(X[0]/1000);


  const layout = {
    autosize: true,
    plot_bgcolor: 'black',
    paper_bgcolor: 'black',
    font: {color: 'white'},
    xaxis: {
      type:'date',
    },
    yaxis: {
      type: 'linear'
    },
  }

  const data=[{
    x: X,
    y: Y,
    type: 'scatter',
    showlegend: true,
    legendgrouptitle: {font: {color: 'white'}, text: 'price'},
    mode: 'lines+markers',
    marker: {color: 'green'},
  }];

  return (
    <Plot
      data={data}
      layout={layout}
      style={{'width':'100%', height:'100%'}}
      config={{scrollZoom: true}}
      useResizeHandler={true}
    />);
}
