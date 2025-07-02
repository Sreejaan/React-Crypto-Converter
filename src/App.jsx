import {useState, useEffect} from 'react';
import './App.css';
function App(){

  const [curr1, setCurr1] = useState("bitcoin");
  const [curr2, setCurr2] = useState("bitcoin");
  const [allCurrency, setAllCurrency] = useState(null);
  const [input, setInput] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [result, setResult] = useState('');


  
  const fetchAllCurrency = async() => {
    const APIKEY = import.meta.env.VITE_COINGECKO_API_KEY;
    try {
      const currency = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1`);
      if (!currency.ok) throw new Error("API limit or CORS error");
      const currencyData = await currency.json();
      setAllCurrency(currencyData);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  }

  useEffect(() => {
    fetchAllCurrency();
  },[]);


  const calculate = async() => {
    const currencyPrice = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${curr1},${curr2}`
    );
    const currenctPriceData = await currencyPrice.json();

    const priceFrom = currenctPriceData.find(c => c.id===curr1)?.current_price;
    const priceTo = currenctPriceData.find(c => c.id === curr2)?.current_price;
    console.log(curr1);
    if(priceFrom && priceTo){
      const out = (input*priceFrom)/priceTo;
      setResult(out);
    }
    else{
      const out = -1;
      setResult(out);
    }
    
  }

  
    return (
    <div className="app">
      <h1 className="title">Crypto Converter</h1>
      <div className="converter-box">
        <input
          type="number"
          className="input-field"
          placeholder="Amount"
          onChange={(e) => setInput(e.target.value)}
        />
          <div className="dropdown-group">
            <select className="dropdown" value={curr1} onChange={(e) => setCurr1(e.target.value)}>
              {allCurrency && allCurrency.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.symbol.toUpperCase()})
                </option>
              ))}
            </select>

            <span className="to-text">to</span>

            <select className="dropdown" value={curr2} onChange={(e) => setCurr2(e.target.value)}>
              {allCurrency && allCurrency.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

        <button className="convert-btn" onClick={calculate}>Convert</button>
        <p className="result-text">
          {result !== '' ? `${input} ${curr1.toUpperCase()} = ${result.toFixed(5)} ${curr2.toUpperCase()}` : ''}
        </p>
      </div>
    </div>
  );
}

export default App;