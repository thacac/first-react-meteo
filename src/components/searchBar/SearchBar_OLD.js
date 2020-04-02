import React from 'react';
import './SearchBar.css';
import { Input, InputGroup, InputGroupAddon, Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faStreetView } from '@fortawesome/free-solid-svg-icons'

class SearchBar extends React.Component {
    /**affiche le formumaire de recherche et lance l'api */
    constructor(props) {
        super(props);
        this.state = {
            searchVille: '',
            searchByGeo: 'N',
            coords: [],
            meteo:{}
        }

        this.cityChange = this.cityChange.bind(this)
        this.handleSearchByGeo = this.handleSearchByGeo.bind(this)
        this.searchGo = this.searchGo.bind(this)
        this.apiCall = this.apiCall.bind(this)
    }

    searchGo(event) {
        // console.log(this.state.searchVille)
        // console.log(this.state.searchByGeo)
        // console.log(this.state.coords)
        this.apiCall(this.state.searchVille, this.state.searchByGeo, this.state.coords);
        event.preventDefault();
    }

    cityChange(event) {
        event.preventDefault();
        this.setState({ searchVille: event.target.value });
        console.log(this.state.searchVille);
    }

    handleSearchByGeo(event) {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({ coords: position.coords })//recup des data de geoloc
        });
        this.setState({ searchVille: '', searchByGeo: 'Y' });
        this.searchGo(event);
    }

    apiCall(searchVille, searchByGeo, coords) {
        let key = "1dd3c8021c34d1578422220b96a85c1a";
        let urls = [];
        let prevMax = 4 //prevision sur 4 jours max
        if (searchVille !== "") {
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
                console.log(jsonResponse);
                if (jsonResponse[0].cod == "200") {
                    //recup des erreur if any et gestion plus fine
                    console.log('reponse' + jsonResponse);

                    //meteo du jour
                    let meteoDay = jsonResponse[0].list[0];

                    //formatage en tableau des donnée sur les <prevMax> jours à venir
                    let meteoPrev = {}; //objet qui contiendra toutes les prev
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
                    let apiMeteo = {
                        ville: meteoDay.name,
                        temp: meteoDay.main.temp,
                        tempMin: meteoDay.main.temp_min,
                        tempMax: meteoDay.main.temp_max,
                        icon: meteoDay.weather[0].icon,
                        desc: meteoDay.weather[0].main.desc,
                        prev: meteoPrev //on injecte l'objet meteoPrev dans l'objet global meteo pour pouvoir y accéder plus simplement
                    };
                    this.setState({meteo: apiMeteo})

                    console.log(this.state.meteo)

                } else if (jsonResponse[0].cod == "401") {
                    console.log(jsonResponse.message);
                } else {
                    console.log("Saisissez une ville ou géolocalisez vous")
                }
            })
            .catch(function (error) {
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
        );
    }
}

export default SearchBar;