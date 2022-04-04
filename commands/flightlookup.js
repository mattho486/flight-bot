const { SlashCommandBuilder } = require('@discordjs/builders');
const {CreateDefaultEmbed} = require("../helpers/CreateDefaultEmbed");
const flightdata = require('flight-data');
const {DisplayFlightData} = require("../helpers/DisplayFlightData");
const {LoadingScreen} = require("../helpers/LoadingScreen");
const {CreateDefaultEmbedEdit} = require("../helpers/CreateDefaultEmbedEdit");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flightlookup')
        .setDescription('Look up historical/future or real-time flight information')
        .addStringOption(option => option.setName('flightnumber').setDescription('The flight\'s number').setRequired(true))
        .addStringOption(option => option.setName('airline').setDescription('The flight\'s airline').setRequired(true)),
    async execute(interaction) {

        const flightNumber = interaction.options.getString('flightnumber')
        const airline = interaction.options.getString('airline')

        await LoadingScreen(interaction)

        let testResponseScheduled = {
            data:[{
                flight_date: '2022-02-25',
                flight_status: 'scheduled',
                departure: {
                    airport: 'Dallas/Fort Worth International',
                    timezone: 'America/Chicago',
                    iata: 'DFW',
                    icao: 'KDFW',
                    terminal: 'B',
                    gate: 'B9',
                    delay: 224,
                    scheduled: '2022-02-25T12:49:00+00:00',
                    estimated: '2022-02-25T12:49:00+00:00',
                    actual: '2022-02-25T16:33:00+00:00',
                    estimated_runway: '2022-02-25T16:33:00+00:00',
                    actual_runway: '2022-02-25T16:33:00+00:00'
                },
                arrival: {
                    airport: 'John F Kennedy International',
                    timezone: 'America/New_York',
                    iata: 'JFK',
                    icao: 'KJFK',
                    terminal: '8',
                    gate: '38',
                    baggage: null,
                    delay: 181,
                    scheduled: '2022-02-25T17:16:00+00:00',
                    estimated: '2022-02-25T17:16:00+00:00',
                    actual: null,
                    estimated_runway: null,
                    actual_runway: null
                },
                airline: {name: 'American Airlines', iata: 'AA', icao: 'AAL'},
                flight: {number: '606', iata: 'AA606', icao: 'AAL606', codeshared: null},
                aircraft: null,
                live: null
            }]
            }


        let testResponseLanded = {       //TODO REMOVE AFTER TEST
            data :[{
            flight_date: '2022-02-25',
            flight_status: 'landed',
            departure: {
                 airport: 'Simmons Nott',
                 timezone: 'America/New_York',
                 iata: 'EWN',
                 icao: 'KEWN',
                 terminal: null,
                 gate: '3',
                 delay: 16,
                 scheduled: '2022-02-25T18:17:00+00:00',
                 estimated: '2022-02-25T18:17:00+00:00',
                 actual: '2022-02-25T18:37:00+00:00',
                 estimated_runway: '2022-02-25T18:37:00+00:00',
                 actual_runway: '2022-02-25T18:37:00+00:00'
               },
           arrival: {
                 airport: 'Charlotte Douglas',
                 timezone: 'America/New_York',
                 iata: 'CLT',
                 icao: 'KCLT',
                 terminal: '1',
                 gate: 'E8',
                 baggage: 'E',
                 delay: null,
                 scheduled: '2022-02-25T19:39:00+00:00',
                 estimated: '2022-02-25T19:39:00+00:00',
                 actual: '2022-02-25T19:33:00+00:00',
                 estimated_runway: '2022-02-25T19:33:00+00:00',
                 actual_runway: '2022-02-25T19:33:00+00:00'
               },
           airline: { name: 'American Airlines', iata: 'AA', icao: 'AAL' },
           flight: { number: '5349', iata: 'AA5349', icao: 'AAL5349', codeshared: null },
           aircraft: null,
           live: null
            }]
        }

        let testResponseActive = {    //TODO REMOVE AFTER TEST
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
        //let data = testResponseActive.data[0]  //TODO UNDO DECLARATION AFTER TEST
        let data
        let errorFlag = false

          //TODO UNCOMMENT AFTER TEST

        //real time

        flightdata.flights(
            {
                API_TOKEN: 'd2db267b08e16708696251624d3a23c1',
                options: {
                    limit: 1,
                    airline_name : airline,
                    flight_number: flightNumber
                    //arr_iata: 'SEA'
                }
            })
            .then(response => {
                //console.log(response.data[0])
                data = response.data[0]
            })
            .catch(error => {
                errorFlag = true
                //console.log(error)
            }).then(response => {
                if (errorFlag) {
                    CreateDefaultEmbedEdit(interaction, `An error occured!`)
                    return
                }

                if (!data) {
                    CreateDefaultEmbedEdit(interaction, `Could not find flight! Please make sure that you have entered the right flight number and the airline name.`)
                    return
                }

                DisplayFlightData(interaction, data)
            })

        //await DisplayFlightData(interaction, data)









    },
};