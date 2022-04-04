const {MessageEmbed} = require("discord.js");

async function LoadingScreen(interaction) {

    const embed = new MessageEmbed()
        .setColor('#25548c')
        .setTitle(`Loading...`)
        .setDescription(`_Please wait_~`)
        .setImage("https://media0.giphy.com/media/l2Sq87bt4GOdAnlGo/giphy.gif?cid=790b7611108bb0867ffa0f85a55a6c108cf348a7ff3336ea&rid=giphy.gif&ct=g")

    await interaction.reply({embeds : [embed]})
    embed.setImage(``)



}

module.exports = {LoadingScreen}