const { SlashCommandBuilder } = require('@discordjs/builders');
const {CreateDefaultEmbed} = require("../helpers/CreateDefaultEmbed");
const flightdata = require('flight-data');
const {DisplayFlightData} = require("../helpers/DisplayFlightData");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flightlookup')
        .setDescription('Look up historical/future or real-time flight information')
        .addStringOption(option => option.setName('flightnumber').setDescription('The flight\'s number').setRequired(true))
        .addStringOption(option => option.setName('airline').setDescription('The flight\'s airline').setRequired(true))
        .addStringOption(option => option.setName('flightdate').setDescription('The flight\'s date: YYYY-MM-DD')),
    async execute(interaction) {

        const flightNumber = interaction.options.getString('flightnumber')
        const airline = interaction.options.getString('airline')
        const flightDate = interaction.options.getString('flightdate')
        let testResponse = {    //TODO REMOVE AFTER TEST
            "pagination": {
                "limit": 100,
                "offset": 0,
                "count": 100,
                "total": 1669022
            },
            "data": [
                {
                    "flight_date": "2019-12-12",
                    "flight_status": "active",
                    "departure": {
                        "airport": "San Francisco International",
                        "timezone": "America/Los_Angeles",
                        "iata": "SFO",
                        "icao": "KSFO",
                        "terminal": "2",
                        "gate": "D11",
                        "delay": 13,
                        "scheduled": "2019-12-12T04:20:00+00:00",
                        "estimated": "2019-12-12T04:20:00+00:00",
                        "actual": "2019-12-12T04:20:13+00:00",
                        "estimated_runway": "2019-12-12T04:20:13+00:00",
                        "actual_runway": "2019-12-12T04:20:13+00:00"
                    },
                    "arrival": {
                        "airport": "Dallas/Fort Worth International",
                        "timezone": "America/Chicago",
                        "iata": "DFW",
                        "icao": "KDFW",
                        "terminal": "A",
                        "gate": "A22",
                        "baggage": "A17",
                        "delay": 0,
                        "scheduled": "2019-12-12T04:20:00+00:00",
                        "estimated": "2019-12-12T04:20:00+00:00",
                        "actual": null,
                        "estimated_runway": null,
                        "actual_runway": null
                    },
                    "airline": {
                        "name": "American Airlines",
                        "iata": "AA",
                        "icao": "AAL"
                    },
                    "flight": {
                        "number": "1004",
                        "iata": "AA1004",
                        "icao": "AAL1004",
                        "codeshared": null
                    },
                    "aircraft": {
                        "registration": "N160AN",
                        "iata": "A321",
                        "icao": "A321",
                        "icao24": "A0F1BB"
                    },
                    "live": {
                        "updated": "2019-12-12T10:00:00+00:00",
                        "latitude": 36.28560000,
                        "longitude": -106.80700000,
                        "altitude": 8846.820,
                        "direction": 114.340,
                        "speed_horizontal": 894.348,
                        "speed_vertical": 1.188,
                        "is_ground": false
                    }
                },
            ]
        }
       // let data = testResponse.data[0]  //TODO UNDO DECLARATION AFTER TEST
        let data
        let errorFlag = false

          //TODO UNCOMMENT AFTER TEST
        if (flightDate === null) {
            //real time
            flightdata.flights(
                {
                    API_TOKEN: 'b5409bfc9962b2f21819efecc0adec2b',
                    options: {
                        limit: 1,
                        airline_name : airline,
                        flight_number: flightNumber
                        //arr_iata: 'SEA'
                    }
                })
                .then(response => {
                    console.log(response.data[0])
                    data = response.data[0]
                })
                .catch(error => {
                    errorFlag = true
                }).then(response => {
                    if (errorFlag) {
                        CreateDefaultEmbed(interaction, `An error occured!`)
                        return
                    }

                    if (!data) {
                        CreateDefaultEmbed(interaction, `Could not find flight!`)
                        return
                    }

                    DisplayFlightData(interaction, data)
                })
        } else {
            //historical/future
            flightdata.flights(
                {
                    API_TOKEN: 'b5409bfc9962b2f21819efecc0adec2b',
                    options: {
                        limit: 1,
                        flight_number: flightNumber,
                        airline_name : airline,
                        flight_date: flightDate,
                        //arr_iata: 'SEA'
                    }
                })
                .then(response => {
                    data = response.data[0]
                })
                .catch(error => {
                    errorFlag = true
                }).then(response => {
                    if (errorFlag) {
                        CreateDefaultEmbed(interaction, `An error occured!`)
                        return
                    }

                    if (!data) {
                        CreateDefaultEmbed(interaction, `Could not find flight!`)
                        return
                    }

                    DisplayFlightData(interaction, data)
                })
        }







    },
};