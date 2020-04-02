import React, { Component } from 'react';

class ApiCall extends React.Component {

    constructor(props) {
        super(props);
        this.search = this.search.bind(this)

    }

    search(searchVille, searchByGeo, coords) {
        let key = '1dd3c8021c34d1578422220b96a85c1a'
        let prevMax = 4 //prevision sur 4 jours max
        let urls;
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
                    let meteo = {}
                    return meteo = {
                        ville: meteoDay.name,
                        temp: meteoDay.main.temp,
                        tempMin: meteoDay.main.temp_min,
                        tempMax: meteoDay.main.temp_max,
                        icon: meteoDay.weather[0].icon,
                        desc: meteoDay.weather[0].main.desc,
                        prev: meteoPrev //on injecte l'objet meteoPrev dans l'objet global meteo pour pouvoir y accéder plus simplement
                    };

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
}
export default ApiCall;