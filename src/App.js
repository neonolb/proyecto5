import React, { useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState({});
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryTimezone, setSelectedCountryTimezone] = useState('');


  // paises con sus nombres, vamos agruparlos en continentes, vamos a traer la informacion paises (nombre, bandera, poblacion) y conectarnos con google maps para mostrar la ubicacion de los paises
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        setCountries(data);
        groupByContinent(data);
      });
  }, []);

  const groupByContinent = (countries) => {
    const grouped = countries.reduce((acc, country) => {
      const continent = country.region;
      if (!acc[continent]) acc[continent] = [];
      acc[continent].push(country);
      return acc;
    }, {});
    setContinents(grouped);
  };

  const handleContinentClick = (continent) => {
    setSelectedContinent(continent);
    setSelectedCountry(null);
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setSelectedCountryTimezone(country.timezones[0]);
  };




  return (
    <div>
      <h1>Países por Continente</h1>
      <p></p>

        <div>
          {Object.keys(continents).map(continent => (
            <button key={continent} onClick={() => handleContinentClick(continent)}>
              {continent}
            </button>
          ))}
        </div>
        {selectedContinent && (
          <div>
            <h2>{selectedContinent}</h2>
            <ul>
              {continents[selectedContinent].map(country => (
                <li key={country.cca3}>
                  <button onClick={() => handleCountryClick(country)}>
                    {country.name.common}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedCountry && (
          <div>
            <h2 className='text-3xl font-bold text-sky-800'>{selectedCountry.name.common}</h2>
            <p><strong>Capital:</strong> {selectedCountry.capital ? selectedCountry.capital[0] : 'N/A'}</p>
            <p><strong>Población:</strong> {selectedCountry.population.toLocaleString()}</p>
            <p><strong>Región:</strong> {selectedCountry.region}</p>
            <p><strong>Zona Horaria:</strong> {selectedCountryTimezone}</p>
            <p><strong>Bandera:</strong> <img src={selectedCountry.flags.png} alt={`Bandera de ${selectedCountry.name.common}`} style={{ width: '100px', height: 'auto' }} /></p>
            <div style={{ height: '100vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: 'Aca Va la Key de Google Maps' }}
                center={{
                  lat: selectedCountry.latlng[0],
                  lng: selectedCountry.latlng[1],
                }}
                zoom={7}  // Ajusta el valor del zoom si es necesario
              >
                <Marker
                  lat={selectedCountry.latlng[0]}
                  lng={selectedCountry.latlng[1]}
                  text={selectedCountry.name.common}
                />
              </GoogleMapReact>
            </div>
          </div>
        )}
      </div>
      );
}
const Marker = ({text}) => <div>{text}</div>;
export default App