#!/usr/bin/env node
import React from 'react';
import meow from 'meow';
import getStdin from 'get-stdin';
import {render} from 'ink';
import updateNotifier from 'update-notifier';
import {
    Main,
    getElapsedSeconds,
    getElapsedTime,
    showVersion
} from 'tomo-cli';
import commands from './commands';
import {descriptions, namespace, options} from './cli';
import Backup from './components/Backup';
import Show from './components/Show';
import Suggest from './components/Suggest';

// Notify updater
const pkg = require(`../package.json`);
updateNotifier({pkg}).notify();

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
    const stdin = await getStdin();
    const properties = {commands, customCommands, descriptions, onComplete, flags, input, namespace, stdin};
    render(<Main {...properties}/>, {exitOnCtrlC: true});
})();