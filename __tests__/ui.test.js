import React from 'react';
import {render} from 'ink-testing-library';
import UI from '../src/main';
import {ShowCommand} from '../src/components';
import commands from '../src/commands';
import descriptions from '../src/descriptions';

describe('pwngoal', () => {
    describe('copy', () => {
        const command = 'copy';
        const store = {get() {}};
        it('will prompt for term when not provided', () => {
            const terms = [];
            const options = {};
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                input={[command, ...terms]}
                flags={options}
                store={store}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        it('will auto-suggest terms', () => {
            const terms = ['spawn a tty shell'];
            const options = {};
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                input={[command, ...terms]}
                flags={options}
                store={store}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
    });
    describe('scan', () => {
        const command = 'scan';
        const store = {get() {}};
        it('will prompt for term when not provided', () => {
            const terms = [];
            const options = {};
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                input={[command, ...terms]}
                flags={options}
                store={store}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        it('will auto-suggest terms', () => {
            const terms = ['pts'];
            const options = {};
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                input={[command, ...terms]}
                flags={options}
                store={store}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
    });
    describe('show', () => {
        const command = 'show';
        const store = {get() {}};
        const terminalCommands = {show: ShowCommand};
        it('doesNotExist', () => {
            const terms = ['doesNotExist'];
            const options = {};
            const {lastFrame} = render(<UI
                commands={commands}
                flags={options}
                input={[command, ...terms]}
                store={store}
                terminalCommands={terminalCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        it('can render with no input', () => {
            const terms = [];
            const options = {
                ip: '' // '' needed since meow is not applying default values
            };
            const {lastFrame} = render(<UI
                commands={commands}
                flags={options}
                input={[command, ...terms]}
                store={store}
                terminalCommands={terminalCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        it('--ip doesNotExist', () => {
            const terms = [];
            const options = {
                ip: 'doesNotExist'
            };
            const {lastFrame} = render(<UI
                commands={commands}
                flags={options}
                input={[command, ...terms]}
                store={store}
                terminalCommands={terminalCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        it('ipPassedAsTerm --ip doesNotExist', () => {
            const terms = ['ipPassedAsTerm'];
            const options = {
                ip: 'ip passed as option'
            };
            const {lastFrame} = render(<UI
                commands={commands}
                flags={options}
                input={[command, ...terms]}
                store={store}
                terminalCommands={terminalCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
    });
});