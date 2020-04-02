import React, { Component } from 'react'
import { Col } from 'reactstrap';

class Prevision extends React.Component{

    render() {
        return (

        <Col className="prevision" xs="12" md="5">
            <h2>Prévision +1</h2>
            <div className="prevSynth">
                <img className="weatherIcon" id="weatherIcon1" src={`https://openweathermap.org/img/w/${this.props.prevision.icon}.png`} alt="" />
                <div className="minMax">
                    <p className="min" id="prev1Min">{this.props.prevision.tempMin}</p>
                    <p id="prev1Max" className="max">{this.props.prevision.tempMax}</p>
                </div>
            </div>
            <p className="weatherDesc" id="weatherDesc1">{this.props.prevision.desc}</p>
        </Col>
        );        
    }
}

export default Prevision;