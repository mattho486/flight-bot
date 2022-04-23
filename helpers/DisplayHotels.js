const {MessageEmbed, MessageButton, MessageActionRow} = require("discord.js");
const {FlightDataSelectBuilder} = require("./FlightDataSelectBuilder");
const {SummarizeFlightData} = require("./SummarizeFlightData");
const fetch = require('node-fetch');
const {PlacesButtonBuilder} = require("./PlacesButtonBuilder");
const request = require('request');


async function DisplayHotels(interaction, data, location, checkInDate, checkOutDate ,numAdults) {

    async function setDescription(curr, em) {
        let address
        if (!res[curr].address.streetAddress)
            address = `Address: ${res[curr].address.locality}, ${res[curr].address.region}`
        else {
            address = `Address: ${res[curr].address.streetAddress}, ${res[curr].address.locality}, ${res[curr].address.region}`
        }
        try {
            em.setDescription(`\`\`\`yaml\nName: ${res[curr].name}\nRating: ${res[curr].starRating} / 5, ${res[curr].guestReviews.badgeText}\n${address}\nPrice: ${res[curr].ratePlan.price.current}\n\nClick on "Details" button for more information\`\`\``)
        } catch (e) {
            em.setDescription(`\`\`\`yaml\nName: ${res[curr].name}\nRating: ${res[curr].starRating} / 5\n${address}\nPrice: ${res[curr].ratePlan.price.current}\n\nClick on "Details" button for more information\`\`\``)
        }

    }

    let currIndex = 0
    const res = data.searchResults.results
    const length = res.length

    let checkin = checkInDate.split(`-`)
    let checkout = checkOutDate.split(`-`)
    for(let i = 0; i < 3; i++) {
        checkin[i] = parseInt(checkin[i])
        checkout[i] = parseInt(checkout[i])
    }

    const embed = new MessageEmbed()
        .setColor('#25548c')
        .setAuthor({ name: 'Hotels', iconURL: interaction.user.avatarURL()})
        .setTitle(`**Hotels in ${location}**\n${checkin.join(`/`)} -> ${checkout.join(`/`)}`)
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

            let xid = res[currIndex].id

            const options = {
                method: 'GET',
                url: 'https://hotels-com-provider.p.rapidapi.com/v1/hotels/booking-details',
                qs: {
                    adults_number: numAdults,
                    checkin_date: checkInDate,
                    locale: 'en_US',
                    currency: 'USD',
                    hotel_id: xid,
                    checkout_date: checkOutDate
                },
                headers: {
                    'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com',
                    'X-RapidAPI-Key': '191ead3c15msh823099d2d53b980p1910cejsnbfe892a19103',
                    useQueryString: true
                }
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                const result = JSON.parse(body)
                console.log(result);
                let lat = result.header.hotelLocation.coordinates.latitude
                let lon = result.header.hotelLocation.coordinates.longitude
                let googleLink = `https://maps.google.com/?q=${lat},${lon}`
                let newDesc = ""
                let address = ""

                if (!res[currIndex].address.streetAddress)
                    address = `Address: ${res[currIndex].address.locality}, ${res[currIndex].address.region}`
                else {
                    address = `Address: ${res[currIndex].address.streetAddress}, ${res[currIndex].address.locality}, ${res[currIndex].address.region}`
                }

                try {
                    newDesc = `\`\`\`yaml\nName: ${res[currIndex].name}\nRating: ${res[currIndex].starRating} / 5, ${res[currIndex].guestReviews.badgeText}\n${address}\nPrice: ${res[currIndex].ratePlan.price.current}\nComplimentary Services: ${result.freebies.length > 0 ? result.freebies[0] : "None"}\n\`\`\``
                } catch (e) {
                    newDesc = `\`\`\`yaml\nName: ${res[currIndex].name}\nRating: ${res[currIndex].starRating} / 5\n${address}\nPrice: ${res[currIndex].ratePlan.price.current}\nComplimentary Services: ${result.freebies.length > 0 ? result.freebies[0] : "None"}\n\`\`\``
                }

                newDesc += `\n[Hotel on Google Maps](${googleLink})`

                embed.setImage(result.mapWidget.staticMapUrl)
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
            });

            // fetch(url, options)
            //     .then(res => res.json())
            //     .then(json => {
            //         console.log(json)
            //
            //         try{
            //             embed.setImage(json.preview.source)
            //         } catch (e){
            //
            //         }
            //         let newDesc = ""
            //
            //         try {
            //             newDesc = `\`\`\`yaml\nName: ${json.name}\nRating: ${data[curr].properties.rate} / 10\nDistance: ${Math.round(data[currIndex].properties.dist)} meters\nAddress: ${json.address.road} ${json.address.city}, ${json.address.state}\n\n${json.wikipedia_extracts.text}\`\`\``
            //         } catch (e) {
            //             newDesc = `\`\`\`yaml\nName: ${json.name}\nRating: ${data[curr].properties.rate} / 10\nDistance: ${Math.round(data[currIndex].properties.dist)} meters\nAddress: ${json.address.road} ${json.address.city}, ${json.address.state}\`\`\``
            //         }
            //         embed.setDescription(newDesc)
            //
            //         if (currIndex !== 0) {
            //             buttons.components[0].setDisabled(false)
            //             buttons.components[1].setDisabled(false)
            //         }
            //         if (currIndex !== length-1) {
            //             buttons.components[2].setDisabled(false)
            //             buttons.components[3].setDisabled(false)
            //         }
            //
            //         i.editReply({embeds: [embed], components: [buttons]})
            //     })
            //     .catch(err => console.error('error:' + err));

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

module.exports = {DisplayHotels}