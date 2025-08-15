
import  { useState } from 'react'
import './App.css'
import CountryList from './components/CountryList'
import CombinedFlag from './components/CombinedFlag'
import { countriesData, type Country } from './data/countries'

// Function to get all country codes from the data
const getAllCountryCodes = () => {
  return countriesData.flatMap(continent =>
    continent.countries.map(country => country.code)
  )
}

// Function to get two random different countries
const getRandomCountries = (count: number = 2) => {
  const allCountryCodes = getAllCountryCodes()
  const shuffled = [...allCountryCodes].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Function to get country name from code
const getCountryNameFromCode = (code: string): string => {
  for (const continent of countriesData) {
    const country = continent.countries.find((c: Country) => c.code === code)
    if (country) {
      return country.name
    }
  }
  return code // Return code if country not found
}

function App() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(() => getRandomCountries())
  const [isCountriesListVisible, setIsCountriesListVisible] = useState<boolean>(true)

  const handleCountrySelect = (countryCode: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCountries(prev => [...prev, countryCode])
    } else {
      setSelectedCountries(prev => prev.filter(code => code !== countryCode))
    }
  }

  const handleSelectAllInContinent = (continentName: string, isSelected: boolean) => {
    // Find the continent in countriesData
    const continent = countriesData.find(c => c.name === continentName)
    if (!continent) return

    if (isSelected) {
      // Add all countries in the continent that aren't already selected
      const newCountries = continent.countries
        .map(country => country.code)
        .filter(code => !selectedCountries.includes(code))
      
      setSelectedCountries(prev => [...prev, ...newCountries])
    } else {
      // Remove all countries in the continent
      const continentCountryCodes = continent.countries.map(country => country.code)
      setSelectedCountries(prev => prev.filter(code => !continentCountryCodes.includes(code)))
    }
  }

  const handleRandomSelection = () => {
    const randomCountries = getRandomCountries(2) // Select 2 random countries
    setSelectedCountries(randomCountries)
  }

  return (
    <>
      <h1>Flag Jockey</h1>
      <CombinedFlag selectedCountries={selectedCountries} />
      <div className="selected-countries">
        <div className="selected-countries-header">
          <h2>Selected Countries ({selectedCountries.length})</h2>
          <div className="header-buttons">
            <button
              className="random-button"
              onClick={handleRandomSelection}
            >
              Random
            </button>
            <button
              className="toggle-button"
              onClick={() => setIsCountriesListVisible(!isCountriesListVisible)}
            >
              {isCountriesListVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {isCountriesListVisible && (
          <ul>
            {selectedCountries.map(code => (
              <li key={code}>{getCountryNameFromCode(code)}</li>
            ))}
          </ul>
        )}
      </div>
      <p></p>
      <CountryList
        onCountrySelect={handleCountrySelect}
        onSelectAllInContinent={handleSelectAllInContinent}
        selectedCountries={selectedCountries}
      />
    </>
  )
}

export default App
