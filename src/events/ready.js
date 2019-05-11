var { success } = require('../util/debug');

module.exports.run = (client) => {
	success(`Connected to Discord as ${client.user.tag}`);
};

module.exports.config = {
	clientOnly: true
};
