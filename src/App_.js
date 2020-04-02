import React, { useState } from 'react';
import ApiCall from './components/apiMeteo/apiMeteo'
import SearchBar from './components/searchBar/SearchBar'
import { Input, InputGroup, InputGroupAddon, Button, Navbar, Nav, NavbarBrand, NavItem, NavLink, Container, Row, Col, NavbarToggler, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faCloudShowersHeavy, faCloud, faSun, faStreetView } from '@fortawesome/free-solid-svg-icons'

// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);

  const prevMax = 4;//prevision à <prev> jours max

  let searchVille; //recup du form qui agit sur la recherche meteo
  var urls; //list of urls to fecth

  //localisation
  var searchByGeo = "N" //par defaut nous ne sommes pas en geoloc
  var coords;
  // onError Callback receives a PositionError object
  //
  function onError(error) {
    alert('code: ' + error.code + '\n' +
      'message: ' + error.message + '\n');
  }
  function showLatLng(position) {
    coords = position.coords //recup des data de geoloc
  }

  // let e;
  //gestion action sur geoloc
  function searchByCoordMgt(e) {
    if (document.getElementById('ville').value !== "") {
      document.getElementById('ville').value = ""
    }
    searchByGeo = "Y"
    navigator.geolocation.watchPosition(showLatLng, onError, {enableHighAccuracy: true,timeout: 30000})
    callApi(e)
  }

  //appal à l'API
  function callApi(e) {
    const key = '1dd3c8021c34d1578422220b96a85c1a'

    // (e) ? e.preventDefault() : false //si pas d'evenement capté, on ne fait rien

    searchVille = document.getElementById('ville').value
    if (searchVille !== "") {
      urls = [`https://api.openweathermap.org/data/2.5/find?q=${searchVille}&units=metric&appid=${key}&lang=fr`, `https://api.openweathermap.org/data/2.5/forecast?q=${searchVille}&units=metric&appid=${key}&lang=fr`];
    } else if (searchByGeo == "Y") {
      urls = [`https://api.openweathermap.org/data/2.5/find?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${key}&lang=fr`, `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${key}&lang=fr`];
    }

    if (urls !== "") {

      Promise.all(urls.map(url =>
        fetch(url).then(responseJSON => responseJSON.json())
      )).then(jsonResponse => {
        console.log(jsonResponse);
        if (jsonResponse[0].cod == "200") {
          //recup des erreur if any et gestion plus fine
          console.log('reponse' + jsonResponse);

          //meteo du jour
          let meteoDay = jsonResponse[0].list[0];

          //formatage en tableau des donnée sur les <prevMax> jours à venir
          let meteoPrev = new Object(); //objet qui contiendra toutes les prev
          let iconList = [] //sous tableau qui sera dans l'attribut icones
          let minTemp = [] //sous tableau qui sera dans l'attribut temp min
          let maxTemp = [] //sous tableau qui sera dans l'attribut temp max
          let desc = [] //sous tableau qui sera dans l'attribut description
          for (let prev = 1; prev <= prevMax; prev++) {
            iconList.push(jsonResponse[1].list[prev * 8].weather[0].icon) //feedeing des tableaux
            minTemp.push(Math.round(jsonResponse[1].list[prev * 8].main.temp_min))
            maxTemp.push(Math.round(jsonResponse[1].list[prev * 8].main.temp_max))
            desc.push(jsonResponse[1].list[prev * 8].weather[0].description)
          }
          //assignation des tableaux en valuer des attiributs de l'objet meteoPrev
          meteoPrev.icon = iconList
          meteoPrev.minTemp = minTemp
          meteoPrev.maxTemp = maxTemp
          meteoPrev.desc = desc

          // console.log(meteoPrev)

          let meteo = {
            ville: meteoDay.name,
            temp: meteoDay.main.temp,
            tempMin: meteoDay.main.temp_min,
            tempMax: meteoDay.main.temp_max,
            icon: meteoDay.weather[0].icon,
            desc: meteoDay.weather[0].main.desc,
            prev: meteoPrev //on injecte l'objet meteoPrev dans l'objet global meteo pour pouvoir y accéder plus simplement
          };

          // console.log("meteo")
          // console.log(meteo)

          document.getElementById('villeSynth').textContent = meteo.ville
          document.getElementById('tempSynthIcon').setAttribute('src', `https://openweathermap.org/img/wn/${meteo.icon}@2x.png`)
          document.getElementById('tempSynthIcon').setAttribute('alt', `${meteo.desc}`)
          document.getElementById('currentTemp').textContent = `${Math.round(meteo.temp)}°`
          document.getElementById('tempUnit').textContent = `C`
          document.getElementById('synthMin').textContent = `Min: ${Math.round(meteo.tempMin)}°C`
          document.getElementById('synthMax').textContent = `Max: ${Math.round(meteo.tempMax)}°C`


          for (let prev = 0; prev <= prevMax - 1; prev++) {
            document.getElementById(`weatherIcon${prev + 1}`).setAttribute('src', `https://openweathermap.org/img/wn/${meteo.prev.icon[prev]}@2x.png`)
            document.getElementById(`weatherDesc${prev + 1}`).textContent = `${meteo.prev.desc[prev]}`
            document.getElementById(`prev${prev + 1}Min`).textContent = `Min: ${meteo.prev.minTemp[prev]}°C`
            document.getElementById(`prev${prev + 1}Max`).textContent = `Max: ${meteo.prev.maxTemp[prev]}°C`
          }

        } else if (jsonResponse[0].cod == "401") {
          console.log(jsonResponse.message);
        }
      })
        .catch(function (error) {
          //recup des erreur if any
          console.log(error);
        });
    }
  }

  //rendu html react
  return (
    <div className="App">
      <Navbar expand="md" color="light" light>
        <NavbarBrand href="/" className="mr-auto"><img className="logo" src="img/meteo-logo.png" alt="logo" /></NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink href="">Lien1</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="">Lien2</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="">Lien3</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <header className="App-header">
        <Container>
          <Row className="synth">
            <Col className="villeSynth">
              <h1 id="villeSynth"></h1>
              <p>aujourd'</p>
            </Col>
          </Row>
          <Row className="synth">
            <Col className="tempSynthIcon"><img id="tempSynthIcon" src="" alt="" /></Col>
            <Col className="tempSynth"><span id="currentTemp" className="tempSyntNnbr"></span><span id="tempUnit" className="tempUnit"></span></Col>
            <Col className="tempSynth"><p className="max" id="synthMax"></p><p className="min" id="synthMin"></p></Col>
          </Row>
          {/* import du component avec les champs de recherche */}
          <SearchBar />
        </Container>
      </header>

      <main className="App-main">
        <Container>
          <Row className="previsions">
            <Col className="prevision" xs="12" md="5"><h2>Prévision +1</h2><div className="prevSynth"><img className="weatherIcon" id="weatherIcon1" src="" alt="" /><div className="minMax"><p className="min" id="prev1Min"></p><p id="prev1Max" className="max"></p></div></div><p className="weatherDesc" id="weatherDesc1"></p></Col>
            <Col className="prevision" xs="12" md="5"><h2>Prévision +2</h2><div className="prevSynth"><img className="weatherIcon" id="weatherIcon2" src="" alt="" /><div className="minMax"><p className="min" id="prev2Min"></p><p id="prev2Max" className="max"></p></div></div><p className="weatherDesc" id="weatherDesc2"></p></Col>
            <Col className="prevision" xs="12" md="5"><h2>Prévision +3</h2><div className="prevSynth"><img className="weatherIcon" id="weatherIcon3" src="" alt="" /><div className="minMax"><p className="min" id="prev3Min"></p><p id="prev3Max" className="max"></p></div></div><p className="weatherDesc" id="weatherDesc3"></p></Col>
            <Col className="prevision" xs="12" md="5"><h2>Prévision +4</h2><div className="prevSynth"><img className="weatherIcon" id="weatherIcon4" src="" alt="" /><div className="minMax"><p className="min" id="prev4Min"></p><p id="prev4Max" className="max"></p></div></div><p className="weatherDesc" id="weatherDesc4"></p></Col>
          </Row>
        </Container>
      </main>
      <footer>&copy; First React App</footer>
    </div>
  );
}

export default App;
