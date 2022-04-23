const { SlashCommandBuilder } = require('@discordjs/builders');
const {CreateDefaultEmbed} = require("../helpers/CreateDefaultEmbed");
const flightdata = require('flight-data');
const {DisplayFlightData} = require("../helpers/DisplayFlightData");
const {LoadingScreen} = require("../helpers/LoadingScreen");
const {CreateDefaultEmbedEdit} = require("../helpers/CreateDefaultEmbedEdit");
const fetch = require('node-fetch');
const {DisplayPlaces} = require("../helpers/DisplayPlaces");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attractions')
        .setDescription('Look up interesting places near a location')
        .addStringOption(option => option.setName('location').setDescription('Region, city, village, etc.').setRequired(true))
        .addStringOption(option => option.setName('radius').setDescription('Radius from location, 500 by default')),
    async execute(interaction) {

        const location = interaction.options.getString('location')
        let radius
        if (interaction.options.getString('radius') === null) {
            radius = "500"
        } else {
            radius = interaction.options.getString('radius')
        }

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

                const url = `https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?radius=${radius}&lon=${json.lon}&lat=${json.lat}`;

                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com',
                        'X-RapidAPI-Key': '191ead3c15msh823099d2d53b980p1910cejsnbfe892a19103'
                    }
                };

                const name = json.name
                const country = json.country

                fetch(url, options)
                    .then(res => res.json())
                    .then(json => {

                        const resArray = json.features
                        if (resArray.length === 0) {
                            CreateDefaultEmbedEdit(interaction, `No results found for that query.`)
                            return
                        }
                        DisplayPlaces(interaction, resArray, location, radius, name, country)

                    })
                    .catch(err => CreateDefaultEmbedEdit(interaction, `Error! Could not complete your request.`));


            })
            .catch(err => CreateDefaultEmbedEdit(interaction, `Error! Could not complete your request.`));











    },
};