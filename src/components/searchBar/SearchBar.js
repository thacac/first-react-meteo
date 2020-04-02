import React from 'react';
// import Meteo from '../Meteo/Meteo'
import './SearchBar.css';
import { Input, InputGroup, InputGroupAddon, Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faStreetView } from '@fortawesome/free-solid-svg-icons'

class SearchBar extends React.Component {
    /**affiche le formumaire de recherche et lance l'api */
    constructor(props) {
        super(props);
        this.state = {
            searchVille: null,
            searchByGeo: 'N',
            coords: null,
            meteo: {} //sortie de l'api
        }
    }

    outData = () => {
        this.props.handleSearch(this.state.meteo) //on renvoie les param attendues par la props 'handlesearch' attendue par app.js
    }

    searchGo = (event) => {
        this.apiCall(this.state.searchVille, this.state.searchByGeo, this.state.coords);
        event.preventDefault();
    }

    cityChange = (event) => {
        event.preventDefault();
        this.setState({ searchVille: event.target.value });
    }

    handleSearchByGeo = (event) => {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({ coords: position.coords })//recup des data de geoloc
        });
        console.log('coords' + this.state.coords)
        this.setState({ searchVille: null, searchByGeo: 'Y' });
        this.searchGo(event);
    }

    apiCall = (searchVille, searchByGeo, coords) => {
        let key = "1dd3c8021c34d1578422220b96a85c1a";
        let urls = [];
        let prevMax = 4 //prevision sur 4 jours max
        if (!!(searchVille)) {
            urls = [`https://api.openweathermap.org/data/2.5/find?q=${searchVille}&units=metric&appid=${key}&lang=fr`,
            `https://api.openweathermap.org/data/2.5/forecast?q=${searchVille}&units=metric&appid=${key}&lang=fr`];
        } else if (searchByGeo == "Y") {
            urls = [`https://api.openweathermap.org/data/2.5/find?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${key}&lang=fr`,
            `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${key}&lang=fr`];
        }

        Promise.all(
            urls.map(url =>
                fetch(url).then(responseJSON => responseJSON.json())
            )
        )
            .then(jsonResponse => {
                // console.log(jsonResponse);
                if (jsonResponse[0].cod == "200") {
                    //recup des erreur if any et gestion plus fine
                    // console.log('reponse' + jsonResponse);

                    //meteo du jour
                    let meteoDay = jsonResponse[0].list[0];
                    //formatage en tableau des donnée sur les <prevMax> jours à venir
                    let meteoPrev = [] //objet qui contiendra toutes les prev
                    for (let prev = 1; prev <= prevMax; prev++) {
                        meteoPrev[prev] = {
                            ['icon'] : jsonResponse[1].list[prev * 8].weather[0].icon,
                            ['tempMin'] : jsonResponse[1].list[prev * 8].main.temp_min,
                            ['tempMax']: jsonResponse[1].list[prev * 8].main.temp_max,
                            ['desc'] :jsonResponse[1].list[prev * 8].weather[0].description
                        }
                    }

                    // console.log(meteoPrev)

                    let meteoApi
                    //    return
                    meteoApi = {
                        ville: meteoDay.name,
                        temp: meteoDay.main.temp,
                        tempMin: meteoDay.main.temp_min,
                        tempMax: meteoDay.main.temp_max,
                        icon: meteoDay.weather[0].icon,
                        desc: meteoDay.weather[0].main.desc,
                        prev: meteoPrev //on injecte l'objet meteoPrev dans l'objet global meteo pour pouvoir y accéder plus simplement
                    };
                    this.setState({ meteo: meteoApi })
                    this.outData() //on met à jour la finction de sortie des data mises en forme dans le tableau

                    // return this.state.meteo

                } else if (jsonResponse[0].cod == "401") {
                    console.log(jsonResponse.message);
                } else {
                    console.log("Saisissez une ville ou géolocalisez vous")
                }
            })
            .catch(error => {
                //recup des erreur if any
                console.log(error);
            });
    }

    render() {
        return (
            <Row>
                <Col>
                    <InputGroup className="input-group-lg">
                        <Input type="text" id="ville" name="ville" onChange={this.cityChange} placeholder="Recherche ville..." />
                        <InputGroupAddon addonType="append"><Button id="searchBtn" onClick={this.searchGo}><FontAwesomeIcon icon={faSearch} /></Button></InputGroupAddon>
                        <InputGroupAddon addonType="append"><Button id="geoBtn" onClick={this.handleSearchByGeo}><FontAwesomeIcon icon={faStreetView} /></Button></InputGroupAddon>
                    </InputGroup>
                </Col>
            </Row>
            // <Meteo meteoData={this.state.meteo} />
        );
    }
}

export default SearchBar;