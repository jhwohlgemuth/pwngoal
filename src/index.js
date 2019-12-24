#!/usr/bin/env node
import React, {Fragment} from 'react';
import meow from 'meow';
import getStdin from 'get-stdin';
import {render} from 'ink';
// import updateNotifier from 'update-notifier';
import {showVersion} from 'tomo-cli';
import UI from './main';
import commands from './commands';
import {descriptions, options} from './cli';
import Backup from './components/Backup';
import Show from './components/Show';
import Suggest from './components/Suggest';

// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();

const customCommands = {
    backup: Backup,
    show: Show,
    suggest: Suggest,
    wat: Suggest
};
const {input, flags} = meow(options);
(input[0] === 'version' || flags.version) && showVersion();
(async () => {
    const done = () => typeof global._tomo_tasklist_callback === 'function' && global._tomo_tasklist_callback();
    const stdin = await getStdin();
    const Main = () => <Fragment>
        <UI
            commands={commands}
            descriptions={descriptions}
            done={done}
            flags={flags}
            input={input}
            stdin={stdin}
            customCommands={customCommands}/>
    </Fragment>;
    render(<Main/>, {exitOnCtrlC: true});
})();