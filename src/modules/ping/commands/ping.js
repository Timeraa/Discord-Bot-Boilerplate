var Discord = require('discord.js'),
	embed,
	ping;

module.exports.run = async (message) => {
	embed = new Discord.MessageEmbed({
		title: 'Ping',
		description: 'Pinging...'
	});

	message.channel.send(embed).then((msg) => {
		ping = msg.createdTimestamp - message.createdTimestamp;

		if (ping < 250) embed.setColor('#00ff00');
		if (ping > 250 && ping < 500) embed.setColor('#ffff00');
		if (ping > 500) embed.setColor('#ff0000');

		embed.setDescription(`**Discord** (\`\`${ping}ms\`\`)\n**Discord API** (\`\`${message.client.ws.ping}ms\`\`)`);

		msg.edit(embed).then((msg) => setTimeout(() => msg.delete(), 10 * 1000));
	});
	message.delete();
};

module.exports.config = {
	name: 'ping'
};
