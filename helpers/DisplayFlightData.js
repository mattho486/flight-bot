const {MessageEmbed, MessageButton, MessageActionRow} = require("discord.js");
const {FlightDataSelectBuilder} = require("./FlightDataSelectBuilder");

async function DisplayFlightData(interaction, data) {
   switch (data[`flight_status`]) {
       case `active` :
           let minute

           if (data.arrival[`delay`] !== null) {
               minute = data.arrival[`delay`]
           } else {
               minute = 0
           }

           const embed = new MessageEmbed()
               .setColor('#25548c')
               .setDescription(`**This flight is currently __active!__**\n\`\`\`yaml\nDestination: \"${data.arrival[`airport`]}\"\n\nScheduled to arrive on:\n${new Date(data.arrival[`scheduled`]).toUTCString()}\n\nEstimated to arrive on:\n${new Date(data.arrival[`estimated`]).toUTCString()}\n\nArrival is delayed by ${minute} minutes\`\`\``)
               .setAuthor({ name: 'Flight Lookup', iconURL: interaction.user.avatarURL()})
               .setTitle(`**Summary for Flight #${data.flight[`number`]} of ${data.airline[`name`]} on ${data[`flight_date`]}**`)

           let select = await FlightDataSelectBuilder(data, false, `Summary (Click for detailed info)`)

           const button = new MessageActionRow()
               .addComponents(
                   new MessageButton()
                       .setCustomId('summary')
                       .setLabel('Summary')
                       .setStyle('SECONDARY')
                       .setDisabled(true)
               );

           await interaction.reply({embeds : [embed], components : [select, button]})

           const collectorFilter = i => i.user.id === interaction.user.id && i.message.interaction.id === interaction.id;

           const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, idle: 90000 });

           collector.on('collect', async i => {
               let newDesc = ""
               if (i.customId === `select`) {
                   switch (i.values[0]) {
                       case `Departure`:
                           select = await FlightDataSelectBuilder(data,false, `o1`)
                           button.components[0].setDisabled(false)
                           if (data.arrival[`delay`] !== null) {
                               minute = data.arrival[`delay`]
                           } else {
                               minute = 0
                           }

                           newDesc+= `\`\`\`yaml\nAirport: ${data.departure[`airport`]}\n`
                           newDesc+= `Timezone: ${data.departure[`timezone`]}\n`
                           newDesc+= `Terminal: ${data.departure[`terminal`]}\n`
                           newDesc+= `Gate: ${data.departure[`gate`]}\n`
                           newDesc+= `Delay: ${minute} minutes\n`
                           newDesc+= `Scheduled Departure Time: ${new Date(data.departure[`scheduled`]).toUTCString()}\n`
                           newDesc+= `Estimated Departure Time: ${new Date(data.departure[`estimated`]).toUTCString()}\n`
                           newDesc+= `Actual Departure Time: ${new Date(data.departure[`actual`]).toUTCString()}\n\`\`\``

                           embed.setDescription(newDesc).setTitle(`**Detailed Departure Information for Flight #${data.flight[`number`]} of ${data.airline[`name`]} on ${data[`flight_date`]}**`)

                           await i.update({embeds: [embed], components: [select, button]})
                           break
                       case `Arrival`:
                           select = await FlightDataSelectBuilder(data,false, `o2`)
                           button.components[0].setDisabled(false)
                           if (data.arrival[`delay`] !== null) {
                               minute = data.arrival[`delay`]
                           } else {
                               minute = 0
                           }

                           newDesc+= `\`\`\`yaml\nAirport: ${data.arrival[`airport`]}\n`
                           newDesc+= `Timezone: ${data.arrival[`timezone`]}\n`
                           newDesc+= `Terminal: ${data.arrival[`terminal`]}\n`
                           newDesc+= `Gate: ${data.arrival[`gate`]}\n`
                           newDesc+= `Baggage Claim Gate: ${data.arrival[`baggage`]}\n`
                           newDesc+= `Delay: ${minute} minutes\n`
                           newDesc+= `Scheduled Arrival Time: ${new Date(data.arrival[`scheduled`]).toUTCString()}\n`
                           newDesc+= `Estimated Arrival Time: ${new Date(data.arrival[`estimated`]).toUTCString()}\n\`\`\``

                           embed.setDescription(newDesc).setTitle(`**Detailed Arrival Information for Flight #${data.flight[`number`]} of ${data.airline[`name`]} on ${data[`flight_date`]}**`)

                           await i.update({embeds: [embed], components: [select, button]})
                           break
                       case `Airline`:
                           select = await FlightDataSelectBuilder(data,false, `o3`)
                           button.components[0].setDisabled(false)

                           newDesc+= `\`\`\`yaml\nAirline Name: ${data.airline[`name`]}\n`
                           newDesc+= `Airline IATA code: ${data.airline[`iata`]}\n`
                           newDesc+= `Airline ICAO code: ${data.airline[`icao`]}\n\`\`\``

                           embed.setDescription(newDesc).setTitle(`**Detailed Airline Information for Flight #${data.flight[`number`]} of ${data.airline[`name`]} on ${data[`flight_date`]}**`)

                           await i.update({embeds: [embed], components: [select, button]})
                           break
                       case `Flight`:
                           select = await FlightDataSelectBuilder(data,false, `o4`)
                           button.components[0].setDisabled(false)

                           newDesc+= `\`\`\`yaml\nFlight Number: ${data.flight[`number`]}\n`
                           newDesc+= `Flight IATA code: ${data.flight[`iata`]}\n`
                           newDesc+= `Flight ICAO code: ${data.flight[`icao`]}\n\`\`\``

                           embed.setDescription(newDesc).setTitle(`**Detailed Flight Information for Flight #${data.flight[`number`]} of ${data.airline[`name`]} on ${data[`flight_date`]}**`)

                           await i.update({embeds: [embed], components: [select, button]})
                           break
                       case `Aircraft`:
                           select = await FlightDataSelectBuilder(data,false, `o5`)
                           button.components[0].setDisabled(false)

                           newDesc+= `\`\`\`yaml\nAircraft Registration ID: ${data.aircraft[`registration`]}\n`
                           newDesc+= `Flight IATA code: ${data.aircraft[`iata`]}\n`
                           newDesc+= `Flight ICAO code: ${data.aircraft[`icao`]}\n`
                           newDesc+= `Flight ICAO24 code: ${data.aircraft[`icao24`]}\n\`\`\``

                           embed.setDescription(newDesc).setTitle(`**Detailed Aircraft Information for Flight #${data.flight[`number`]} of ${data.airline[`name`]} on ${data[`flight_date`]}**`)

                           await i.update({embeds: [embed], components: [select, button]})
                           break
                       case `Live Tracking`:
                           select = await FlightDataSelectBuilder(data,false, `o6`)
                           button.components[0].setDisabled(false) //TODO ADD MAP?

                           newDesc+= `\`\`\`yaml\nLast Updated On ${new Date(data.live[`updated`]).toUTCString()}\n\n`
                           newDesc+= `Latitude: ${data.live[`latitude`]}\n`
                           newDesc+= `Longitude: ${data.live[`longitude`]}\n`
                           newDesc+= `Altitude: ${data.live[`altitude`]} meters\n`
                           newDesc+= `Direction: ${data.live[`direction`]} degrees\n`
                           newDesc+= `Horizontal Speed: ${data.live[`speed_horizontal`]} KPH\n`
                           newDesc+= `vertical Speed: ${data.live[`speed_vertical`]} KPH\n`

                           if (data.live[`is_ground`] === `false`) {
                               newDesc+= `Grounded?: No\n`
                           } else {
                               newDesc+= `Grounded?: Yes\n\`\`\``
                           }
                           embed.setDescription(newDesc).setTitle(`**Live tracking for Flight #${data.flight[`number`]} of ${data.airline[`name`]} on ${data[`flight_date`]}**`)

                           await i.update({embeds: [embed], components: [select, button]})
                           break
                   }
               } else {
                   if (data.arrival[`delay`] !== null) {
                       minute = data.arrival[`delay`]
                   } else {
                       minute = 0
                   }
                   embed.setDescription(`**This flight is currently __active!__**\n\`\`\`yaml\nDestination: \"${data.arrival[`airport`]}\"\n\nScheduled to arrive on:\n${new Date(data.arrival[`scheduled`]).toUTCString()}\n\nEstimated to arrive on:\n${new Date(data.arrival[`estimated`]).toUTCString()}\n\nArrival is delayed by ${minute} minutes\`\`\``)
                        .setTitle(`**Summary for flight #${data.flight[`number`]} of ${data.airline[`name`]} on ${data[`flight_date`]}**`)

                   button.components[0].setDisabled(true)
                   select = await FlightDataSelectBuilder(data,false, `Summary (Click for detailed info)`)

                   await i.update({embeds: [embed], components: [select, button]})
               }
           });

           collector.on('end', async collected => {
               button.components[0].setDisabled(true)
               select = await FlightDataSelectBuilder(data, true, `Timed Out!`)

               await interaction.editReply({embeds: [embed], components: [select, button]})
           });

           break
       case `scheduled`:
           console.log("hi")
   }

}

module.exports = {DisplayFlightData}