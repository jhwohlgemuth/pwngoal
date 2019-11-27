import {EOL} from 'os';
import execa from 'execa';
import Conf from 'conf';
import commandExists from 'command-exists';
import {
    debug,
    getOpenPortsWithNmap,
    getOpenPortsWithMasscan
} from '../utils';
import copy from './copy';

const PRIMARY_SCANNER = 'masscan';
const SECONDARY_SCANNER = 'nmap';

const store = new Conf({
    projectName: 'pwngoal'
});

export default {
    copy,
    scan: {
        port: [
            {
                text: 'Scan TCP ports with nmap',
                task: async () => {

                },
                condition: () => true,
                optional: () => commandExists.sync('nmap')
            },
            {
                text: 'You need to install nmap to scan a port...',
                task: async () => {},
                condition: () => false,
                optional: () => !commandExists.sync('nmap')
            }

        ],
        ports: [
            {
                text: 'Clear saved data',
                task: async () => {
                    store.clear();
                },
                condition: () => true
            },
            {
                text: `Find open ports with ${PRIMARY_SCANNER}`,
                task: async ({ip}) => {
                    const ports = await getOpenPortsWithMasscan(ip);
                    store.set('ports', ports);
                    await debug('boot');
                },
                condition: () => commandExists.sync(PRIMARY_SCANNER),
                optional: () => commandExists.sync(PRIMARY_SCANNER)
            },
            {
                text: `Find open ports with ${SECONDARY_SCANNER}`,
                task: async ({ip}) => {
                    const ports = await getOpenPortsWithNmap(ip);
                    store.set('ports', ports);
                    debug(ports);
                },
                condition: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER),
                optional: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER)
            },
            {
                text: 'Enumerate services with nmap',
                task: async ({ip}) => {
                    const data = [];
                    const ports = store.get('ports') || [];
                    for (const port of ports) {
                        const {stdout} = await execa('nmap', [ip, '-p', port, '-sV']);
                        stdout
                            .split(EOL)
                            .filter(line => line.includes('/tcp'))
                            .map(line => line.split(' ').filter(Boolean))
                            .forEach(([,, service, ...version]) => {
                                data.push({port, service, version: version.join(' ')});
                            });
                    }
                    store.set('data', data);
                    debug(data);
                },
                condition: () => commandExists.sync('nmap'),
                optional: () => commandExists.sync('nmap')
            },
            {
                text: 'You need to install masscan or nmap to run a scan...',
                task: async () => {},
                condition: () => false,
                optional: () => !(commandExists.sync(PRIMARY_SCANNER) || commandExists.sync(SECONDARY_SCANNER))
            }
        ]
    }
};