import React, { useState } from 'react';
import CustomNavbar from './components/CustomNavbar/CustomNavbar'
import SearchBar from './components/searchBar/SearchBar'
import Prevision from './components/Prevision/Prevision'
import { Container, Row, Col } from 'reactstrap';

// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meteo: {
        prev:[]
      }
    }
  }

  handleSearch = (meteo) => {
    this.setState({ meteo});
    console.log(meteo)
  }

  render() {
    //rendu html react
    return (
      <div className="App">
        <CustomNavbar />
        <header className="App-header">
          <SearchBar handleSearch={this.handleSearch} />
          <Row className="synth">
            <Col className="villeSynth">
              <h1 id="villeSynth">{this.state.meteo.ville}</h1>
              <p>aujourd'hui</p>
            </Col>
          </Row>
          <Row className="synth">
            <Col className="tempSynthIcon"><img id="tempSynthIcon" src={`https://openweathermap.org/img/w/${this.state.meteo.icon}.png`} alt="" /></Col>
            <Col className="tempSynth"><span id="currentTemp" className="tempSyntNnbr">{this.state.meteo.temp}</span><span id="tempUnit" className="tempUnit">°C</span></Col>
            <Col className="tempSynth"><p className="max" id="synthMax">{this.state.meteo.tempMax} MAX</p><p className="min" id="synthMin">{this.state.meteo.tempMin} MIN</p></Col>
          </Row>
        </header>
        <Container>

        </Container>
        <main className="App-main">
          <Container>
            <Row className="previsions">
              {
              this.state.meteo.prev.map(prevision =>(
                <Prevision prevision={prevision}/>
              ))
              }
            </Row>
          </Container>
        </main>
        <footer>&copy; First React App</footer>
      </div>
    );
  }
}

export default App;
