#!/usr/bin/env node
import React, {Fragment} from 'react';
import {cyan, dim} from 'chalk';
import Conf from 'conf';
import meow from 'meow';
import getStdin from 'get-stdin';
import {render} from 'ink';
// import updateNotifier from 'update-notifier';
import {UnderConstruction, showVersion} from 'tomo-cli';
import UI from './main';
import commands from './commands';
import descriptions from './descriptions';
import {ShowCommand} from './components';

// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();

const projectName = 'pwngoal';
const terminalCommands = {
    show: ShowCommand,
    suggest: UnderConstruction
};

const help = `
    ${dim.bold('Usage')}

        ${cyan('>')} ${projectName} [commands] [terms] [options]
        
        ${cyan('>')} ${projectName} version


    ${dim.bold('Commands')}

        copy, scan, show


    ${dim.bold('Terms')}

        [???]
        ???, ...


    ${dim.bold('Options')}

        --version, -v           Print version
        --ignore-warnings,      Ignore warning messages [Default: false]
        --debug                 Show debug data [Default: false]
        --ip,               -i  IP address [Default: 127.0.0.1]
        --port,             -p  Port [Default: 80]
        --udp               -u  Include UDP ports in scan [Default: false]
        --udp-only              Only scan UDP ports [Default: false]
        --user                  User name for functions that need it [Default: 'user']
        --group                 Group name for functions that need it [Default: 'user']
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
        },
        udp: {
            type: 'boolean',
            default: false,
            alias: 'u'
        },
        udpOnly: {
            type: 'boolean',
            default: false
        },
        user: {
            type: 'string',
            default: 'USER'
        },
        group: {
            type: 'string',
            default: 'GROUP'
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
            descriptions={descriptions}
            done={done}
            flags={flags}
            input={input}
            stdin={stdin}
            store={store}
            terminalCommands={terminalCommands}/>
    </Fragment>;
    render(<Main/>, {exitOnCtrlC: true});
})();