import React from 'react';
import {Container, Row, Col } from 'reactstrap';

class Meteo extends React.Component {
/**
 * Recupere et affiche les infos meteo 'synthese'
 * 
 * 
 */
    render() {
        return (
            <Container>
            <Row className="synth">
              <Col className="villeSynth">
                <h1 id="villeSynth">{this.props.meteo.ville}</h1>
                <p>aujourd'hui</p>
              </Col>
            </Row>
            <Row className="synth">
              <Col className="tempSynthIcon"><img id="tempSynthIcon" src="" alt="" /></Col>
              <Col className="tempSynth"><span id="currentTemp" className="tempSyntNnbr"></span><span id="tempUnit" className="tempUnit"></span></Col>
              <Col className="tempSynth"><p className="max" id="synthMax"></p><p className="min" id="synthMin"></p></Col>
            </Row>
          </Container>
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
        );
    }

}

export default Meteo;