import React, { useState } from 'react'
import { countriesData } from '../data/countries'

interface CountryListProps {
  onCountrySelect: (countryCode: string, isSelected: boolean) => void
  onSelectAllInContinent: (continentName: string, isSelected: boolean) => void
  selectedCountries: string[]
}

const CountryList: React.FC<CountryListProps> = ({ onCountrySelect, onSelectAllInContinent, selectedCountries }) => {
  const [expandedContinents, setExpandedContinents] = useState<Record<string, boolean>>({})

  const toggleContinent = (continentName: string) => {
    setExpandedContinents(prev => ({
      ...prev,
      [continentName]: !prev[continentName]
    }))
  }

  const handleCountryChange = (countryCode: string, isChecked: boolean) => {
    onCountrySelect(countryCode, isChecked)
  }

  const handleSelectAllInContinent = (continentName: string, isSelected: boolean) => {
    onSelectAllInContinent(continentName, isSelected)
  }

  // Determine if all countries in a continent are selected
  const areAllSelected = (continentName: string) => {
    const continent = countriesData.find(c => c.name === continentName)
    if (!continent) return false
    
    return continent.countries.every(country =>
      selectedCountries.includes(country.code)
    )
  }

  // Determine if no countries in a continent are selected
  const areNoneSelected = (continentName: string) => {
    const continent = countriesData.find(c => c.name === continentName)
    if (!continent) return true
    
    return continent.countries.every(country =>
      !selectedCountries.includes(country.code)
    )
  }

  return (
    <div className="country-list">
              <p className="flag-description">Select countries to see their combined flag</p>

      {countriesData.map(continent => (
        <div key={continent.name} className="continent-section">
          <div className="continent-header">
            <div
              className="continent-title"
              onClick={() => toggleContinent(continent.name)}
            >
              <h4>{continent.name}</h4>
              <span>{expandedContinents[continent.name] ? '▼' : '►'}</span>
            </div>
            <div className="continent-actions">
              <button
                className="select-all-btn"
                onClick={() => handleSelectAllInContinent(continent.name, true)}
                disabled={areAllSelected(continent.name)}
              >
                Select All
              </button>
              <button
                className="deselect-all-btn"
                onClick={() => handleSelectAllInContinent(continent.name, false)}
                disabled={areNoneSelected(continent.name)}
              >
                Deselect All
              </button>
            </div>
          </div>
          
          {expandedContinents[continent.name] && (
            <div className="countries-grid">
              {continent.countries.map(country => (
                <label key={country.code} className="country-item">
                  <input
                    type="checkbox"
                    checked={selectedCountries.includes(country.code)}
                    onChange={(e) => handleCountryChange(country.code, e.target.checked)}
                  />
                  <img
                    src={new URL(`../assets/flags/${country.code}.svg`, import.meta.url).href}
                    alt={`${country.name} flag`}
                    className="country-flag"
                    onError={(e) => {
                      // Handle missing flag images gracefully
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  <span className="country-name">{country.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CountryList