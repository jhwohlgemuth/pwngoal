#!/usr/bin/env node
import React, {Fragment} from 'react';
import meow from 'meow';
import getStdin from 'get-stdin';
import {render} from 'ink';
// import updateNotifier from 'update-notifier';
import {
    getElapsedSeconds,
    getElapsedTime,
    showVersion
} from 'tomo-cli';
import UI from './main';
import commands from './commands';
import {descriptions, namespace, options} from './cli';
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
const appendTo = (store, key, value) => {
    const unsafe = store.get(key);
    Array.isArray(unsafe) || store.set(key, []);
    const safe = store.get(key);
    store.set(key, safe.concat(value));
};
const onComplete = (store, start) => {
    const tcp = store.get('tcp.ports') || [];
    const udp = store.get('udp.ports') || [];
    const runtime = getElapsedSeconds(getElapsedTime(start));
    runtime > 1 && appendTo(store, 'stats', {tcp, udp, runtime});
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
            onComplete={onComplete}
            flags={flags}
            input={input}
            namespace={namespace}
            stdin={stdin}
            customCommands={customCommands}/>
    </Fragment>;
    render(<Main/>, {exitOnCtrlC: true});
})();