#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');

const opt = yargs
	.usage('Usage: -m <mode>')
	.alias('help', 'h')
	.alias('version', 'v')
	.option(
		'mode',
		{
			'alias': 'm',
			'choices': ['run', 'move', 'moveRun'],
			'default': 'move'
		}
	)
	.option(
		'entry',
		{
			'alias': 'e',
			'default': path.resolve(__dirname, '..', '_mods'),
			'description': 'The path to look for the mods.'
		}
	)
	.option(
		'output',
		{
			'alias': 'o',
			'default': path.resolve(__dirname, '..', '_game'),
			'description': 'Where to output the mods. Must be a valid RenPy directory.'
		}
	)
	.option(
		'api',
		{
			'alias': 'a',
			'default': true,
			'description': 'Move required APIs to the game directory?',
			'type': 'boolean'
		}
	)
	// TODO: Enable this when kill code is done
	// .option(
	// 	'kill',
	// 	{
	// 		'alias': 'k',
	// 		'default': false,
	// 		'description': 'Kill the launched CorruptedKingdoms instances.',
	// 		'type': 'boolean'
	// 	}
	// )
	.argv;

const modes = {
	run() { require('./scripts/run')(opt); },
	move() { require('./scripts/move')(opt); },
	moveRun() { require('./scripts/move')(opt) && require('./scripts/run')(opt); },
	api() { require('./scripts/api')(opt); }
};

if (opt.api) {
	modes.api();
}

modes[opt.mode]();
