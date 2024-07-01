import { useState, useEffect } from 'react'
import axios from 'axios'


//### DISPLAY: component for determining what to display based on length of filtered results
const Display = ({filteredCountries, setCountryDetails, filterValue}) => {

    useEffect(() => {
        if (filteredCountries.length === 1) {
          setCountryDetails(filteredCountries[0])
        }
    }, [filteredCountries, setCountryDetails])
    
    if (filteredCountries.length > 10 && filterValue !== "") {
        return (
            <div>Too many matches, specify another filter</div>
        )
    } else if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
        return(
            <div>
                {filteredCountries.map((country, index) => (
                    <li key={index}>
                        {country.name.common}
                        <button onClick={()=>setCountryDetails(country)}>show</button>
                        {console.log(`clicked, value sent: ${country}`)}
                    </li>
                ))}
            </div>
    )} else if (filteredCountries.length === 1) {
        return null
      }
      return <div></div>
}

//### DISPLAY COUNTRY: component to display single country details
const api_key = import.meta.env.VITE_SOME_KEY
const DisplayCountry = ({country}) => {

    console.log(`Displaying country: ${country.name.common}`)

    const [temp, setTemp] = useState([])
    const [wind, setWind] = useState([])
    const [icon, setIcon] = useState([])

    //get weather data for the country when countryDetails changes
    useEffect(() => {
    if (country) {
        const capital = country.capital
        console.log(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${api_key}&units=metric`)
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${api_key}&units=metric`)
            .then(response => {
                console.log("Weather data:", response.data)
                setTemp(response.data.main.temp)
                setWind(response.data.wind)
                setIcon(response.data.weather[0].icon)
        })
    }},[country])

    console.log(`Temp at ${country.name.common}: ${temp}`)
    console.log(`Icon: ${icon}`)

    if (!country) { 
        return null 
    } else if (temp){
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>capital {country.capital}</p>
                <p>area {country.area}</p>
                <h3>languages:</h3>
                <ul>
                {Object.values(country.languages).map((language, index) => (
                    <li key={index}>{language}</li>
                ))}
                </ul>
                <div style={{ width: '200px' }}>
                    <img src={country.flags.png} style={{ width: '100%' }} />
                </div>
                <h2>Weather in {country.name.common}</h2>
                <p>temperature {temp} Celsius</p>
                {icon && (
                <div>
                    <img src={iconUrl} alt="Weather icon" />
                </div>
                )}
                <p>wind {wind.speed} m/s</p>
            </div>
        )}
}

//### FILTER: component for search filter
const Filter = ({filterValue, handleFilter}) => {
    const handleChange = (event) => {
        handleFilter(event.target.value)
    }
    return (
        <div>
          <form>
            <div>
              find countries {' '}
              <input
                value={filterValue}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      )
}

//### APP: component for main functions and state handling
const App = () => {

    const [countries, setCountries] = useState([])
    const [filteredCountries, setFilteredCountries] = useState(countries)
    const [filterValue, setFilter] = useState('') //controlling the form input element for Filter.
    const [countryDetails, setCountryDetails] = useState(null)

    // get all and set initial list of countries
    useEffect(() => {
        axios
          .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
          .then(response => {
            setCountries(response.data)
          })
      }, [])

    // set filter when filter input changes
    useEffect(() => {
        const filtered = filterValue === ''
        ? countries
        : countries.filter((country) =>
            country.name.common.toLowerCase().includes(filterValue.toLowerCase())
            )
        setFilteredCountries(filtered)
    }, [countries, filterValue])

    const handleFilter = (value) => {
    setFilter(value)
    }

    // reset displayed country details as filter changes
    useEffect(() => {
        setCountryDetails(null)
    }, [filterValue])

    return (
        <div>
            <Filter filterValue={filterValue} handleFilter={handleFilter} />
            <Display filteredCountries={filteredCountries} setCountryDetails={setCountryDetails} filterValue={filterValue}/>
            {countryDetails && <DisplayCountry country={countryDetails}/>}
        </div>
    )
}
export default App