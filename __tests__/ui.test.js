import React from 'react';
import {render} from 'ink-testing-library';
import commands from '../src/commands';
import mindmap from '../src/mindmap';
import {descriptions} from '../src/cli';
import UI from '../src/main';
import Show from '../src/components/Show';
import Suggest from '../src/components/Suggest';

const SCAN_DATA = {
    '127_0_0_1': [
        {protocol: 'tcp', port: '21', service: 'ftp', version: '???'},
        {protocol: 'tcp', port: '22', service: 'ssh', version: 'OpenSSH 7.8 (protocol 2.0)'},
        {protocol: 'tcp', port: '25', service: 'smtp', version: '???'},
        {protocol: 'tcp', port: '53', service: 'dns', version: '???'},
        {protocol: 'tcp', port: '110', service: 'pop3', version: '???'},
        {protocol: 'tcp', port: '135', service: 'msrpc', version: '???'},
        {protocol: 'tcp', port: '143', service: 'imap', version: '???'},
        {protocol: 'tcp', port: '161', service: 'snmp', version: '???'},
        {protocol: 'tcp', port: '443', service: 'https', version: '???'},
        {protocol: 'tcp', port: '445', service: 'smb', version: '???'},
        {protocol: 'tcp', port: '631', service: 'ipp', version: 'CUPS 2.2'},
        {protocol: 'tcp', port: '1521', service: 'oracle', version: '???'},
        {protocol: 'tcp', port: '17600', service: 'http', version: 'Tornado httpd 4.2'},
        {protocol: 'tcp', port: '45295', service: 'ERROR', version: 'ERROR'}
    ],
    '10_11_0_1': [
        {version: 'version', protocol: 'protocol', service: 'service'}
    ],
    '192_168_1_42': [
        {version: 'version', protocol: 'protocol', service: 'service'}
    ],
    '192_2_1_41': [
        {version: 'version', protocol: 'protocol', service: 'service'}
    ]
};
const store = new Map(Object.entries(SCAN_DATA));

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
            const options = {
                user: 'USER',
                group: 'GROUP'
            };
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
        const customCommands = {show: Show};
        test('-i 127.0.0.1', () => {
            const terms = [];
            const options = {
                ip: '127.0.0.1'
            };
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                flags={options}
                input={[command, ...terms]}
                store={store}
                customCommands={customCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        test('127.0.0.1', () => {
            const terms = ['127.0.0.1'];
            const options = {
                ip: ''
            };
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                flags={options}
                input={[command, ...terms]}
                store={store}
                customCommands={customCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        test('doesNotExist', () => {
            const terms = ['doesNotExist'];
            const options = {};
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                flags={options}
                input={[command, ...terms]}
                store={store}
                customCommands={customCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        it('will render with no terms or options', () => {
            const terms = [];
            const options = {
                ip: '' // '' needed since meow is not applying default values
            };
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                flags={options}
                input={[command, ...terms]}
                store={store}
                customCommands={customCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        test('--ip doesNotExist', () => {
            const terms = [];
            const options = {
                ip: 'doesNotExist'
            };
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                flags={options}
                input={[command, ...terms]}
                store={store}
                customCommands={customCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        test('ipPassedAsTerm --ip doesNotExist', () => {
            const terms = ['ipPassedAsTerm'];
            const options = {
                ip: 'ip passed as option'
            };
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                flags={options}
                input={[command, ...terms]}
                store={store}
                customCommands={customCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
    });
    describe('suggest', () => {
        const command = 'suggest';
        const customCommands = {suggest: Suggest};
        it('will render with no terms or options', () => {
            const terms = [];
            const options = {
                ip: ''
            };
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                flags={options}
                input={[command, ...terms]}
                store={store}
                customCommands={customCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        it('will display service select menu when passed IP term', () => {
            const terms = ['127.0.0.1'];
            const options = {
                ip: ''
            };
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                flags={options}
                input={[command, ...terms]}
                store={store}
                customCommands={customCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
        it('can display suggestions for various services', () => {
            const terms = [];
            const options = {
                ip: '',
                port: '$RPORT'
            };
            const services = Object.keys(mindmap);
            services.forEach(service => {
                const {lastFrame} = render(<UI
                    commands={commands}
                    descriptions={descriptions}
                    flags={{...options, service}}
                    input={[command, ...terms]}
                    store={store}
                    customCommands={customCommands}/>);
                expect(lastFrame()).toMatchSnapshot();
            });
        });
        it('will interpolate suggestions with passed options (ip, port, user)', () => {
            const terms = [];
            const options = {
                ip: 'IP',
                port: 'PORT',
                service: 'http',
                user: 'LEROY',
                group: 'JENKINS'
            };
            const services = Object.keys(mindmap);
            services.forEach(service => {
                const {lastFrame} = render(<UI
                    commands={commands}
                    descriptions={descriptions}
                    flags={{...options, service}}
                    input={[command, ...terms]}
                    store={store}
                    customCommands={customCommands}/>);
                expect(lastFrame()).toMatchSnapshot();
            });
        })
        it('can handle services with no suggestions', () => {
            const terms = [];
            const options = {ip: ''};
            const {lastFrame} = render(<UI
                commands={commands}
                descriptions={descriptions}
                flags={{...options, service: 'does-not-exist'}}
                input={[command, ...terms]}
                store={store}
                customCommands={customCommands}/>);
            expect(lastFrame()).toMatchSnapshot();
        });
    });
});