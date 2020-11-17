const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');

module.exports = async opt => {
	try {
		const gameDir = path.resolve(opt.output, 'game');// Absolute path to game directory
		const apiDir = path.resolve(opt.entry, 'api'); // Absolute path to API directory

		const apiFiles = await fs.readdir(apiDir); // Files inside API directory
		let gameFiles = await fs.readdir(gameDir); // Files inside game directory
		gameFiles = gameFiles.filter(f => f.endsWith('.py')); // Only keep python files

		await Promise.all(gameFiles.map(f => fs.remove(`${gameDir}/${f}`))); // Delete all the python files in game directory

		Promise.all(
			apiFiles.map(f => fs.copy(
				`${apiDir}/${f}`,
				`${gameDir}/${f}`
			))
		);
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
