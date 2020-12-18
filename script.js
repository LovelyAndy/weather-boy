// PAGE ELEMENTS

const inputBoxEl = document.querySelector('.input-box')
const tempEl = document.querySelector('.today__cur-temp')
const cityEl = document.querySelector('.location .location__city')
const dateEl = document.querySelector('.location .location__date')
const weatherTypeEl = document.querySelector('.today .today__cur-weather')
const hiLowEl = document.querySelector('.today .today__hi-low')
const notificationEl = document.querySelector('.notification')
const fahrenheitBtnEl = document.querySelector('.fahrenheit-btn')
const celsiusBtnEl = document.querySelector('.celsius-btn')
const locationButtonEl = document.querySelector('.location-btn')
const takeMeSomewhereEl = document.querySelector('.take-me-somewhere')
const errorMessageDisplay = document.querySelector('.error-message')
const loadingSvgEl = document.querySelector('.loading-svg-wrapper')

const state = {
  temperature: {
    unit: 'fahrenheit',
  },
  responseData: null,
}

window.addEventListener('load', function () {
  loadingSvgEl.classList.add('hidden')
  takeMeSomewhereEl.innerText = 'take me somewhere nice'
})

// SVG Elements//

const cloudyEl = document.querySelector('.cloudy') // 803 - 804
const thunderCloudEl = document.querySelector('.thunder-cloud') // 200 - 232
const rainCloudEl = document.querySelector('.rain-cloud') //300 - 321 and 500 - 531
const snowCloudEl = document.querySelector('.snow-cloud') // 600 - 622
const sunCloudEl = document.querySelector('.sun-cloud') // 801 - 802
const windyCloudEl = document.querySelector('.windy-cloud') // 701 - 781
const sunshineEl = document.querySelector('.sunshine') // 800

function hideAllWeatherSvgs() {
  const weatherSvgEls = [
    cloudyEl,
    thunderCloudEl,
    rainCloudEl,
    snowCloudEl,
    sunCloudEl,
    windyCloudEl,
    sunshineEl,
  ]
  weatherSvgEls.forEach((el) => {
    el.classList.add('hidden')
  })
}

function showWeatherSvgBasedOnId(weatherId) {
  hideAllWeatherSvgs()
  if (weatherId >= 200 && weatherId <= 232) {
    thunderCloudEl.classList.remove('hidden')
    return
  }
  if ((weatherId >= 300 && weatherId <= 321) || (weatherId >= 500 && weatherId <= 531)) {
    rainCloudEl.classList.remove('hidden')
    return
  }
  if (weatherId >= 600 && weatherId <= 622) {
    snowCloudEl.classList.remove('hidden')
    return
  }
  if (weatherId === 800) {
    sunshineEl.classList.remove('hidden')
    return
  }
  if (weatherId === 801 || weatherId === 802) {
    sunCloudEl.classList.remove('hidden')
    return
  }
  if (weatherId === 803 || weatherId === 804) {
    cloudyEl.classList.remove('hidden')
    return
  }
  windyCloudEl.classList.remove('hidden')
}

// SVG Elements//

function changeBackgroundByWeather(temp) {
  if (temp < 33) {
    document.body.style.backgroundImage = "url('imgs/snow-blue.jpg')"
    inputBoxEl.style.borderBottom = '3px solid #0c3b51'
    return
  }
  if (temp >= 33 && temp <= 49) {
    document.body.style.backgroundImage = "url('imgs/mountain-purple.jpg')"
    inputBoxEl.style.borderBottom = '3px solid #291969'
    return
  }
  if (temp >= 50 && temp <= 78) {
    document.body.style.backgroundImage = "url('imgs/mountain-yellow.jpg')"
    inputBoxEl.style.borderBottom = '3px solid #a06725'
    return
  }
  if (temp >= 79) {
    document.body.style.backgroundImage = "url('imgs/desert-hot.jpg')"
    inputBoxEl.style.borderBottom = '3px solid #4c1119'
    return
  }
  document.body.style.backgroundImage = "url('imgs/mountain-pink.png')"
  inputBoxEl.style.borderBottom = '3px solid #9e6262'
}

// inputBorderBottomColor.borderBottomColor = '3px solid #0c3b51'
inputBoxEl.addEventListener('keypress', searchCity)

function searchCity(e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    displayResultsBasedOnCity(inputBoxEl.value)
    inputBoxEl.value = ''
  }
}

function dateBuilder(d) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const day = days[d.getDay()]
  const dateEl = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()

  return `${day}, ${month} ${dateEl}, ${year}`
}

function emptyDisplay() {
  cityEl.innerHTML = ''
  tempEl.innerHTML = ''
  dateEl.innerText = ''
  weatherTypeEl.innerText = ''
  hiLowEl.innerHTML = ''
  hideAllWeatherSvgs()
  errorMessageDisplay.innerHTML = ``
  takeMeSomewhereEl.innerText = ''
}

function displayError() {
  emptyDisplay()
  errorMessageDisplay.innerHTML = `
      <h2>Make sure the city is spelled correctly!<h2>
      `
}

function displayAllEls(responseData) {
  const today = new Date()
  const weatherId = responseData.weather[0].id

  const temp = responseData.main.temp
  const temp_max = responseData.main.temp_max
  const temp_min = responseData.main.temp_min

  const fahrenheitTempArr = [temp, temp_max, temp_min]
  const fahrenheitTempArrToCelsius = fahrenheitTempArr.map(convertFToC)

  if (state.temperature.unit === 'fahrenheit') {
    tempEl.innerHTML = `${Math.round(temp).toFixed(0)}<span>°F<span>`
    hiLowEl.innerHTML = `High of ${Math.round(temp_max).toFixed(0)}<span>°F</span>
  Low of ${Math.round(temp_min).toFixed(0)}<span>°F</span>`
  }
  if (state.temperature.unit === 'celsius') {
    tempEl.innerHTML = `${Math.round(fahrenheitTempArrToCelsius[0]).toFixed(0)}<span>°C<span>`
    hiLowEl.innerHTML = `High of ${Math.round(fahrenheitTempArrToCelsius[1]).toFixed(
      0
    )}<span>°C</span>
      Low of ${Math.round(fahrenheitTempArrToCelsius[2]).toFixed(0)}<span>°C</span>`
  }

  cityEl.innerHTML = `${responseData.name} <span>${responseData.sys.country}</span>`
  dateEl.innerText = dateBuilder(today)
  weatherTypeEl.innerHTML = `${responseData.weather[0].description.toUpperCase()}`
  showWeatherSvgBasedOnId(weatherId)
  changeBackgroundByWeather(temp)
}

function displayResultsBasedOnCity(cityName) {
  loadingSvgEl.classList.remove('hidden')
  emptyDisplay()
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=6d124ff26c29724fc44ff7fdfc7a4e18&units=imperial`
  // show loading
  axios
    .get(url)
    .then(function (response) {
      const responseData = response.data
      state.responseData = responseData
      displayWeather(responseData)
      loadingSvgEl.classList.add('hidden')
    })
    .catch((err) => {
      console.error(err)
      emptyDisplay()
      displayError()
      loadingSvgEl.classList.add('hidden')
    })
}

function displayWeather(responseData) {
  emptyDisplay()
  if (state.temperature.unit === 'fahrenheit') {
    celsiusBtnEl.classList.remove('hidden')
  } else {
    fahrenheitBtnEl.classList.remove('hidden')
  }

  displayAllEls(responseData)
}

/////////// CELSIUS CONVERSION STUFF ////////////////////

function convertFToC(temp) {
  return (temp - 32) * (5 / 9)
}

celsiusBtnEl.addEventListener('click', changeWeatherToCelsius)

function changeWeatherToCelsius() {
  celsiusBtnEl.classList.add('hidden')
  fahrenheitBtnEl.classList.remove('hidden')
  state.temperature.unit = 'celsius'
  console.log(state.responseData)
  displayWeather(state.responseData)
}
/////////// FAHRENHEIT CONVERSION STUFF ////////////////////

function convertCToF() {
  return (temp * 9) / 5 + 32
}

fahrenheitBtnEl.addEventListener('click', changeWeatherToFahrenheit)

function changeWeatherToFahrenheit() {
  fahrenheitBtnEl.classList.add('hidden')
  celsiusBtnEl.classList.remove('hidden')
  state.temperature.unit = 'fahrenheit'
  console.log(state.responseData)
  displayWeather(state.responseData)
}

/////////////////////////// Geolocation Button Code/////////////////////////////

locationButtonEl.addEventListener('click', displayWeatherWithGeolocation)

function getLonLat() {
  let lon
  let lat
  if (navigator.geolocation) {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition((position) => {
        lon = position.coords.longitude
        lat = position.coords.latitude
        resolve({ lon, lat })
      })
    )
  } else {
    notificationEl.style.display = 'block'
    notificationEl.innerHTML = '<p>Browser Does Not Support Geolocation</p>'
  }
}

function makeCallWithLatLon(latLonObject) {
  emptyDisplay()
  loadingSvgEl.classList.remove('hidden')
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latLonObject.lat}&lon=${latLonObject.lon}&appid=6d124ff26c29724fc44ff7fdfc7a4e18&units=imperial
      `
  axios
    .get(url)
    .then(function (response) {
      const responseData = response.data
      state.responseData = responseData
      displayWeather(responseData)
      loadingSvgEl.classList.add('hidden')
    })
    .catch((err) => {
      console.error(err)
      emptyDisplay()
      displayError()
      loadingSvgEl.classList.add('hidden')
    })
}

async function displayWeatherWithGeolocation() {
  const results = await getLonLat()
  makeCallWithLatLon(results)
}
