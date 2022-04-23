const { MessageActionRow, MessageButton } = require('discord.js');

async function PlacesButtonBuilder(o1, o2, o3, o4, o5) {

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('leftmost')
                .setEmoji('⏪')
                .setStyle('SECONDARY')
                .setDisabled(o1),
            new MessageButton()
                .setCustomId('left')
                .setEmoji('◀')
                .setStyle('SECONDARY')
                .setDisabled(o2),
            new MessageButton()
                .setCustomId('right')
                .setEmoji('▶')
                .setStyle('SECONDARY')
                .setDisabled(o3),
            new MessageButton()
                .setCustomId('rightmost')
                .setEmoji(`⏩`)
                .setStyle('SECONDARY')
                .setDisabled(o4),
            new MessageButton()
                .setCustomId('details')
                .setLabel('Details')
                .setStyle('SECONDARY')
                .setDisabled(o5),
        );
    return row
}

module.exports = {PlacesButtonBuilder}