const {MessageActionRow, MessageSelectMenu} = require("discord.js");

async function FlightDataSelectBuilder(data, disabled, placeHolder) {
    let holder = ``
    let o1, o2, o3, o4, o5, o6 = false

    switch(placeHolder) {
        case 'o1'   :  holder = `Departure`; o1 = true;  break;
        case 'o2'   :  holder = `Arrival`; o2 = true; break;
        case 'o3'   :  holder = `Airline`; o3 = true; break;
        case 'o4'   :  holder = `Flight`; o4 = true; break;
        case 'o5'   :  holder = `Aircraft`; o5 = true; break;
        case 'o6'   :  holder = `Live Tracking`; o6 = true; break;
        default     :  holder = placeHolder;  break;
    }

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select')
                .setDisabled(disabled)
                .setPlaceholder(holder)
                .addOptions([
                    {
                        label: 'Departure',
                        description: 'View the flight\'s departure information',
                        value: "Departure",
                        default: o1
                    },
                    {
                        label: 'Arrival',
                        description: 'View the flight\'s arrival information',
                        value: "Arrival",
                        default: o2
                    },
                    {
                        label: 'Airline',
                        description: 'View the flight\'s airline information',
                        value: `Airline`,
                        default: o3
                    },
                    {
                        label: 'Flight',
                        description: 'View the flight\'s information',
                        value: `Flight`,
                        default: o4
                    }]),)

    if (data.aircraft !== null) {
        row.components[0].addOptions([
            {
                label: 'Aircraft',
                description: 'View flight\'s aircraft information',
                value: 'Aircraft',
                default: o5
            }
        ])
    }

    if (data.live !== null) {
        row.components[0].addOptions([
            {
                label: 'Live Tracking',
                description: 'Track the flight live!',
                value: 'Live Tracking',
                default: o6
            }
        ])
    }


    return row
}

module.exports = {FlightDataSelectBuilder}