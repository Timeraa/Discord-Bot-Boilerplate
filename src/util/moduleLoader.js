var { info, error } = require('../util/debug'),
	fs = require('fs'),
	path = require('path'),
	moduleFolder = path.resolve('./modules');

module.exports = async (client) => {
	//* Load global events
	loadModules(client);
	loadEvents(path.resolve(`./events`), client);
};

/**
 * Load modules in the modules folder
 * @param {client} client 
 */
async function loadModules(client) {
	var files = await fs.readdirSync(moduleFolder);

	info(`Loading ${files.length} module${files.length == 1 ? '' : 's'}`);

	files.map(async (module) => {
		if (await fs.existsSync(`${moduleFolder}/${module}/commands`)) {
			loadCommands(`${moduleFolder}/${module}/commands`, client);
		}
	});

	files.map(async (module) => {
		if (await fs.existsSync(`${moduleFolder}/${module}/events`)) {
			loadEvents(`${moduleFolder}/${module}/events`, client);
		}
	});
}

/**
 * Load all commands in the given folder
 * @param {String} filePath Path to folder with command files
 * @param {client} client Client which will be used to save the command
 */
async function loadCommands(filePath, client) {
	var files = await fs.readdirSync(filePath);

	info(`Loading ${files.length} command${files.length == 1 ? '' : 's'} in ${path.basename(path.dirname(filePath))}`);

	files = files.map((file) => file.split('.')[0]);

	files.map((command) => {
		var props = require(`${filePath}/${command}`);
		if (typeof props['config'] == 'undefined') {
			error(
				`Command ${command} in module ${path.basename(path.dirname(filePath))} is missing required field config`
			);
			return;
		}

		if (typeof props.config.name == 'undefined') {
			error(
				`Command ${command} in module ${path.basename(
					path.dirname(filePath)
				)} is missing required property name`
			);
			return;
		}

		if (typeof props.config.enabled != 'undefined' && !props.config.enabled) return;

		client.commands.set(props.config.name, props);
		//* Only add aliases if there are any
		if (typeof props.config.aliases != 'undefined')
			props.config.aliases.forEach((alias) => {
				client.aliases.set(alias, props.config.name);
			});
	});
}

/**
 * Load all events in the given folder
 * @param {String} filePath Path to folder with event files
 * @param {client} client Client which will be used to bind the event
 */
async function loadEvents(filePath, client) {
	var eventFile,
		files = await fs.readdirSync(filePath);

	info(`Loading ${files.length} event${files.length == 1 ? '' : 's'} in ${path.basename(path.dirname(filePath))}`);
	files = files.map((file) => file.split('.')[0]);

	files.map((event) => {
		eventFile = require(`${filePath}/${event}.js`);
		if (typeof eventFile == 'function') client.on(event, eventFile);
		else {
			if (typeof eventFile.config == 'undefined') {
				error(
					`Event ${event} in module ${path.basename(path.dirname(filePath))} is missing required field config`
				);
				return;
			}

			if (typeof eventFile.config.clientOnly != 'undefined') client.on(event, () => eventFile.run(client));
		}
	});
}
