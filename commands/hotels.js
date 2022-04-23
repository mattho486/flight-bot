const request = require('request');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {CreateDefaultEmbed} = require("../helpers/CreateDefaultEmbed");
const flightdata = require('flight-data');
const {DisplayFlightData} = require("../helpers/DisplayFlightData");
const {LoadingScreen} = require("../helpers/LoadingScreen");
const {CreateDefaultEmbedEdit} = require("../helpers/CreateDefaultEmbedEdit");
const {DisplayPlaces} = require("../helpers/DisplayPlaces");
const {DisplayHotels} = require("../helpers/DisplayHotels");
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hotels')
        .setDescription('Look up hotels within a location')
        .addStringOption(option => option.setName('location').setDescription('Region, city, village, etc.').setRequired(true))
        .addStringOption(option => option.setName('checkindate').setDescription('Date to check in: yyyy-MM-dd').setRequired(true))
        .addStringOption(option => option.setName('checkoutdate').setDescription('Date to check out: yyyy-MM-dd').setRequired(true))
        .addStringOption(option => option.setName('numadults').setDescription('Number of adults').setRequired(true)),
    async execute(interaction) {

        const location = interaction.options.getString('location')
        const checkInDate = interaction.options.getString('checkindate')
        const checkOutDate = interaction.options.getString('checkoutdate')
        const numAdults = interaction.options.getString('numadults')

        await LoadingScreen(interaction)

        const url = `https://opentripmap-places-v1.p.rapidapi.com/en/places/geoname?name=${location}`;

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com',
                'X-RapidAPI-Key': '191ead3c15msh823099d2d53b980p1910cejsnbfe892a19103'
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                console.log(json)

                const options = {
                    method: 'GET',
                    url: 'https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby',
                    qs: {
                        latitude: json.lat,
                        currency: 'USD',
                        longitude: json.lon,
                        checkout_date: checkOutDate,
                        sort_order: 'STAR_RATING_HIGHEST_FIRST',
                        checkin_date: checkInDate,
                        adults_number: numAdults,
                        locale: 'en_US'
                    },
                    headers: {
                        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com',
                        'X-RapidAPI-Key': '191ead3c15msh823099d2d53b980p1910cejsnbfe892a19103',
                        useQueryString: true
                    }
                };

                request(options, function (error, response, body) {
                    if (error) CreateDefaultEmbedEdit(interaction, `Error! Could not complete your request.`)

                    const res = JSON.parse(body)
                    console.log(res);
                    if (!res.searchResults || res.searchResults.results.length === 0) {
                        CreateDefaultEmbedEdit(interaction, `No results found for that query. Make sure your query is in correct format and the dates are valid.`)
                        return
                    }

                    DisplayHotels(interaction, res, location.replace(/\b\w/g, l => l.toUpperCase()), checkInDate, checkOutDate, numAdults)

                });


            })
            .catch(err => CreateDefaultEmbedEdit(interaction, `Error! Could not complete your request.`));


    },
};