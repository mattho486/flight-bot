const {MessageEmbed} = require("discord.js");

async function CreateDefaultEmbedEdit(interaction, description) {

    const embed = new MessageEmbed()
        .setColor('#25548c')
        .setDescription(description)

    await interaction.editReply({embeds : [embed]})

}

module.exports = {CreateDefaultEmbedEdit}