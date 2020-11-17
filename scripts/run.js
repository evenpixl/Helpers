const execFile = require('util').promisify(require('child_process').execFile);
const { resolve } = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = async opt => {
	// Define a list of extensions for each platform
	const extensions = {
		win32: 'exe',
		linux: 'sh'
	};

	try {
		// Will be defined to run different files depending on the platform
		let version;

		// If platform is Linux, check if WSL / WSL 2
		if (process.platform === 'linux') {
			// Workaround to detect the release's name
			const procVersion = await fs.readFile('/proc/version').then(r => r.toString());

			if (procVersion.includes('microsoft')) {
				version = 'win32';
			} else {
				version = 'linux';
			}
		} else {
			version = process.platform;
		}

		// Launch CorruptedKingdoms by executing the corresponding file
		await execFile(resolve(opt.output, `CorruptedKingdoms.${extensions[version] || 'sh'}`), { cwd: opt.output });
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(chalk.red(`${new RegExp(`CorruptedKingdoms.(${Object.values(extensions).join('|')})$`).test(error.path) ? 'File' : 'Folder'} "${error.path}" doesn't exist.`));
		} else {
			// Error happened... How can it be?
			console.error(error.stack);
		}

		// Stop it now!
		process.exit(42);
	}

	return true;
};
