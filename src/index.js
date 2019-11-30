#!/usr/bin/env node
import {join} from 'path';
import React, {Fragment} from 'react';
import {cyan, dim} from 'chalk';
import Conf from 'conf';
import meow from 'meow';
import read from 'read-pkg';
import getStdin from 'get-stdin';
import {render} from 'ink';
// import updateNotifier from 'update-notifier';
import {UnderConstruction} from 'tomo-cli';
import UI from './main';
import commands from './commands';
import {ShowCommand} from './components';

// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();

const projectName = 'pwngoal';
const terminalCommands = {
    show: ShowCommand,
    suggest: UnderConstruction
};

const showVersion = () => {
    const cwd = join(__dirname, '..');
    const {version} = read.sync({cwd});
    console.log(version); // eslint-disable-line no-console
    process.exit();
};
const help = `
    ${dim.bold('Usage')}

        ${cyan('>')} ${projectName} [commands] [terms] [options]
        
        ${cyan('>')} ${projectName} version


    ${dim.bold('Commands')}

        copy, scan, ...


    ${dim.bold('Terms')}

        [???]
        ???, ...


    ${dim.bold('Options')}

        --version, -v           Print version
        --ignore-warnings,      Ignore warning messages [Default: false]
        --debug                 Show debug data [Default: false]
        --ip,               -i  IP address [Default: 127.0.0.1]
        --port,             -p  Port [Default: 80]
`;
const options = {
    help,
    flags: {
        version: {
            type: 'boolean',
            default: false,
            alias: 'v'
        },
        help: {
            type: 'boolean',
            default: false,
            alias: 'h'
        },
        ignoreWarnings: {
            type: 'boolean',
            default: false
        },
        debug: {
            type: 'boolean',
            default: false
        },
        ip: {
            type: 'string',
            default: '',
            alias: 'i'
        },
        port: {
            type: 'number',
            default: 80,
            alias: 'p'
        }
    }
};
const {input, flags} = meow(options);
(input[0] === 'version' || flags.version) && showVersion();
(async () => {
    const done = () => typeof global._pwngoal_callback === 'function' && global._pwngoal_callback();
    const stdin = await getStdin();
    const store = new Conf({projectName});
    const Main = () => <Fragment>
        <UI
            commands={commands}
            done={done}
            flags={flags}
            input={input}
            stdin={stdin}
            store={store}
            terminalCommands={terminalCommands}/>
    </Fragment>;
    render(<Main/>, {exitOnCtrlC: true});
})();