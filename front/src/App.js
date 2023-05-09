import "./App.css";
import React from "react";

function App() {
  const API_URL = "https://node-s2-mongo.vercel.app/";
  const [brands, setBrands] = React.useState();
  React.useEffect(() => {
    fetch(API_URL)
      .then((brands) => brands.json())
      .then((brandsParsed) => setBrands(brandsParsed));
  }, []);

  return (
    <div className="App">
      <h2>Marcas</h2>
      <ul>
        {brands?.data.map((brand) => {
          return <li key={brand._id}>{brand.name}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
