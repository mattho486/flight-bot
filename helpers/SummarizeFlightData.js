async function SummarizeFlightData(data) {
    let summary
    let minute

    if (data.arrival[`delay`] !== null) {
        minute = data.arrival[`delay`]
    } else {
        minute = 0
    }

    switch (data[`flight_status`]) {
        case `scheduled`:
        summary = `**This flight is currently __${data[`flight_status`]}__**\n\`\`\`yaml\n${data.departure[`airport`]} -> ${data.arrival[`airport`]}\n\nScheduled to depart on:\n${new Date(data.departure[`scheduled`]).toUTCString()}\n\nEstimated to depart on:\n${new Date(data.departure[`estimated`]).toUTCString()}\n\nDeparture is delayed by ${minute} minutes\`\`\``
            break
        case `active`:
            summary = `**This flight is currently __${data[`flight_status`]}__**\n\`\`\`yaml\n${data.departure[`airport`]} -> ${data.arrival[`airport`]}\n\nDeparted on:\n${new Date(data.departure[`actual`]).toUTCString()}\n\nScheduled to arrive on:\n${new Date(data.arrival[`scheduled`]).toUTCString()}\n\nEstimated to arrive on:\n${new Date(data.arrival[`estimated`]).toUTCString()}\n\nArrival is delayed by ${minute} minutes\`\`\``
            break
        case `landed`:
            summary = `**This flight has __${data[`flight_status`]}__**\n\`\`\`yaml\n${data.departure[`airport`]} -> ${data.arrival[`airport`]}\n\nDeparted on:\n${new Date(data.departure[`actual`]).toUTCString()}\n\nArrived on:\n${new Date(data.arrival[`actual`]).toUTCString()}\`\`\``
            break
        case `cancelled`:
            summary = `**This flight was __${data[`flight_status`]}__**\n\`\`\`yaml\n${data.departure[`airport`]} -> ${data.arrival[`airport`]}\`\`\``
            break
        case `incident`:
            summary = `**An __${data[`flight_status`]}__ has occurred with this flight**\n\`\`\`yaml\n${data.departure[`airport`]} -> ${data.arrival[`airport`]}\`\`\``
            break
        case `diverted`:
            summary = `**This flight has been __${data[`flight_status`]}__**\n\`\`\`yaml\n${data.departure[`airport`]} -> ${data.arrival[`airport`]}\`\`\``
            break

    }

    return summary
}

module.exports = {SummarizeFlightData}