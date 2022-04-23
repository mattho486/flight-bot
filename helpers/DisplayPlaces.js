const {MessageEmbed, MessageButton, MessageActionRow} = require("discord.js");
const {FlightDataSelectBuilder} = require("./FlightDataSelectBuilder");
const {SummarizeFlightData} = require("./SummarizeFlightData");
const fetch = require('node-fetch');
const {PlacesButtonBuilder} = require("./PlacesButtonBuilder");




async function DisplayPlaces(interaction, data, location, radius, name, country) {

    async function setDescription(curr, em) {
        em.setDescription(`\`\`\`yaml\nName: ${data[curr].properties.name}\nRating: ${data[curr].properties.rate} / 10\nDistance: ${Math.round(data[curr].properties.dist)} meters\n\nClick on "Details" button for more information\`\`\``)
    }

    let currIndex = 0
    const length = data.length

    const embed = new MessageEmbed()
        .setColor('#25548c')
        .setAuthor({ name: 'Attractions', iconURL: interaction.user.avatarURL()})
        .setTitle(`**Interesting places near ${name}, ${country} within ${radius} meters**`)
        .setFooter({ text: `Showing result ${currIndex+1} of ${length}`});


    await setDescription(currIndex, embed)

    let buttons
    if (length === 1) {
        buttons = await PlacesButtonBuilder(true, true, true, true, false)
    } else {
        buttons = await PlacesButtonBuilder(true, true, false, false, false)
    }

    await interaction.editReply({embeds : [embed], components:[buttons]})

    const collectorFilter = i => i.user.id === interaction.user.id && i.message.interaction.id === interaction.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, idle: 90000 });

    collector.on('collect', async i => {
        embed.setImage("")
        if (i.customId === `leftmost`) {
            currIndex = 0
            await setDescription(currIndex, embed)
            embed.setFooter({ text: `Showing result ${currIndex+1} of ${length}`});
            buttons = await PlacesButtonBuilder(true, true, false, false, false)

            await i.update({embeds: [embed], components: [buttons]})
        } else if (i.customId === 'left') {
            currIndex -= 1
            await setDescription(currIndex, embed)
            embed.setFooter({ text: `Showing result ${currIndex+1} of ${length}`});
            if (currIndex === 0) {
                buttons = await PlacesButtonBuilder(true, true, false, false, false)
            } else {
                buttons = await PlacesButtonBuilder(false, false, false, false, false)
            }

            await i.update({embeds: [embed], components: [buttons]})
        } else if (i.customId === 'right') {
            currIndex += 1
            await setDescription(currIndex, embed)
            embed.setFooter({ text: `Showing result ${currIndex+1} of ${length}`});
            if (currIndex === length - 1) {
                buttons = await PlacesButtonBuilder(false, false, true, true, false)
            } else {
                buttons = await PlacesButtonBuilder(false, false, false, false, false)
            }

            await i.update({embeds: [embed], components: [buttons]})
        } else if (i.customId === 'rightmost') {
            currIndex = length - 1
            await setDescription(currIndex, embed)
            embed.setFooter({ text: `Showing result ${currIndex+1} of ${length}`});

            buttons = await PlacesButtonBuilder(false, false, true, true, false)

            await i.update({embeds: [embed], components: [buttons]})
        } else {
            await i.deferUpdate(interaction)
            buttons.components[0].setDisabled(true)
            buttons.components[1].setDisabled(true)
            buttons.components[2].setDisabled(true)
            buttons.components[3].setDisabled(true)
            buttons.components[4].setDisabled(true)
            embed.setDescription(`_Loading details please wait..._`)
            await i.editReply({embeds: [embed], components: [buttons]})

            let xid = data[currIndex].properties.xid

            const url = `https://opentripmap-places-v1.p.rapidapi.com/en/places/xid/${xid}`;
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

                    try{
                        embed.setImage(json.preview.source)
                    } catch (e){

                    }
                    let newDesc = ""
                    let lat = json.point.lat
                    let lon = json.point.lon
                    let googleLink = `https://maps.google.com/?q=${lat},${lon}`

                    try {
                        newDesc = `\`\`\`yaml\nName: ${json.name}\nRating: ${data[currIndex].properties.rate} / 10\nDistance: ${Math.round(data[currIndex].properties.dist)} meters\nAddress: ${json.address.road}, ${json.address.city}, ${json.address.state}\n\n${json.wikipedia_extracts.text}\`\`\``
                    } catch (e) {
                        newDesc = `\`\`\`yaml\nName: ${json.name}\nRating: ${data[currIndex].properties.rate} / 10\nDistance: ${Math.round(data[currIndex].properties.dist)} meters\nAddress: ${json.address.road}, ${json.address.city}, ${json.address.state}\`\`\``
                    }
                    newDesc += `\n[Attraction on Google Maps](${googleLink})`
                    embed.setDescription(newDesc)

                    if (currIndex !== 0) {
                        buttons.components[0].setDisabled(false)
                        buttons.components[1].setDisabled(false)
                    }
                    if (currIndex !== length-1) {
                        buttons.components[2].setDisabled(false)
                        buttons.components[3].setDisabled(false)
                    }

                    i.editReply({embeds: [embed], components: [buttons]})
                })
                .catch(err => console.error('error:' + err));

        }
    });

    collector.on('end', async collected => {
        buttons.components[0].setDisabled(true)
        buttons.components[1].setDisabled(true)
        buttons.components[2].setDisabled(true)
        buttons.components[3].setDisabled(true)
        buttons.components[4].setDisabled(true)

        await interaction.editReply({embeds: [embed], components: [buttons]})
    });

}

module.exports = {DisplayPlaces}