#!/usr/bin/env node
import React, {Fragment} from 'react';
import Conf from 'conf';
import meow from 'meow';
import getStdin from 'get-stdin';
import {render} from 'ink';
// import updateNotifier from 'update-notifier';
import {showVersion} from 'tomo-cli';
import UI from './main';
import commands from './commands';
import {descriptions, options, projectName} from './cli';
import Show from './components/ShowCommand';
import Suggest from './components/SuggestCommand';

// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();

const terminalCommands = {
    show: Show,
    suggest: Suggest,
    wat: Suggest
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