const {MessageEmbed} = require("discord.js");

async function CreateDefaultEmbed(interaction, description) {

    const embed = new MessageEmbed()
        .setColor('#25548c')
        .setDescription(description)

    await interaction.reply({embeds : [embed]})

}

module.exports = {CreateDefaultEmbed}