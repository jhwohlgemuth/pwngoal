import {EOL} from 'os';
import execa from 'execa';
import Conf from 'conf';
import commandExists from 'command-exists';
import {
    debug,
    getOpenPortsWithNmap,
    getOpenPortsWithMasscan
} from '../utils';

const store = new Conf({
    projectName: 'pwngoal'
});

const PRIMARY_SCANNER = 'masscan';
const SECONDARY_SCANNER = 'nmap';

export default {
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
            task: async ({ip}) => {
                store.delete(ip);
            },
            condition: () => true
        },
        {
            text: `Find open ports with ${PRIMARY_SCANNER}`,
            task: async ({ip}) => {
                const ports = await getOpenPortsWithMasscan(ip);
                store.set('tcp.ports', ports);
                await debug(`Ports from ${PRIMARY_SCANNER}:`);
                await debug({ports});
            },
            condition: () => commandExists.sync(PRIMARY_SCANNER),
            optional: () => commandExists.sync(PRIMARY_SCANNER)
        },
        {
            text: `Find open ports with ${SECONDARY_SCANNER}`,
            task: async ({ip}) => {
                const ports = await getOpenPortsWithNmap(ip);
                store.set('tcp.ports', ports);
                await debug(`Ports from ${SECONDARY_SCANNER}:`);
                await debug({ports});
            },
            condition: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER),
            optional: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER)
        },
        {
            text: 'Enumerate services with nmap',
            task: async ({ip}) => {
                const data = [];
                const ports = store.get('tcp.ports') || [];
                await debug({ports});
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
                store.set(ip, data);
                await debug({data});
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
};