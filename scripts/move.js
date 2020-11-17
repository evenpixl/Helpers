const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');

module.exports = async opt => {
	try {
		// If one of the folder doesn't exist, throw
		await Promise.all(
			[opt.entry, opt.output].map(p => fs.readdir(p))
		);

		// Regex that checks for invalid mods filenames
		const invalidMods = /^\./;
		// Get both success and fails
		const modsList = await Promise.allSettled(
			opt._.map(mod => invalidMods.test(mod)
				? chalk.red`Mod ${chalk.bold.cyan(mod)} ignored. Mods starting with "${chalk.bold.yellowBright('.')}" are not allowed.`
				: fs.copy(
					path.resolve(opt.entry, mod),
					path.resolve(opt.output, 'game', 'script', mod)
				)
					.then(() => chalk.green`Mod ${chalk.bold.cyan(mod)} successfully moved.`)
					.catch(() => chalk.red`Mod ${chalk.bold.cyan(mod)} not moved.`))
		);

		// Did we succeed or failed miserably? We need to know!
		modsList.forEach(m => console.log(m.value));
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(chalk.red(`Folder "${error.path}" doesn't exist.`));
		} else {
			// Error happened... How can it be?
			console.error(error.stack);
		}

		// Stop it now!
		process.exit(42);
	}

	return true;
};
