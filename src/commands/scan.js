import {EOL} from 'os';
import isElevated from 'is-elevated';
import execa from 'execa';
import Conf from 'conf';
import commandExists from 'command-exists';
import {
    debug,
    getOpenPortsWithNmap,
    getOpenPortsWithMasscan,
    getOpenUdpPortsWithNmap
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
                store.delete('tcp.ports');
                store.delete('udp.ports');
            },
            condition: () => true
        },
        {
            text: `Find open TCP ports with ${PRIMARY_SCANNER}`,
            task: async ({ip}) => {
                const ports = await getOpenPortsWithMasscan(ip);
                store.set('tcp.ports', ports);
                await debug({ports}, `TCP ports from ${PRIMARY_SCANNER}`);
            },
            condition: () => commandExists.sync(PRIMARY_SCANNER),
            optional: () => commandExists.sync(PRIMARY_SCANNER)
        },
        {
            text: `Find open TCP ports with ${SECONDARY_SCANNER}`,
            task: async ({ip}) => {
                const ports = await getOpenPortsWithNmap(ip);
                store.set('tcp.ports', ports);
                await debug({ports}, `TCP ports from ${SECONDARY_SCANNER}`);
            },
            condition: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER),
            optional: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER)
        },
        {
            text: `Find open UDP ports with nmap`,
            task: async ({ip}) => {
                const ports = await getOpenUdpPortsWithNmap(ip);
                store.set('udp.ports', ports);
                await debug({ports}, `UDP ports from nmap`);
            },
            condition: ({udp}) => udp && commandExists.sync('nmap') && isElevated(),
            optional: ({udp}) => udp && commandExists.sync('nmap')
        },
        {
            text: 'Enumerate services with nmap',
            task: async ({ip, udp}) => {
                const data = [];
                const ports = store.get('tcp.ports') || [];
                await debug({ports}, 'TCP ports passed to enumeration');
                for (const port of ports) {
                    const {stdout} = await execa('nmap', [ip, '-p', port, '-sV']);
                    stdout
                        .split(EOL)
                        .filter(line => line.includes('/tcp'))
                        .map(line => line.split(' ').filter(Boolean))
                        .forEach(([,, service, ...versionInformation]) => {
                            const protocol = 'TCP';
                            const version = versionInformation.join(' ');
                            data.push({protocol, port, service, version});
                        });
                }
                if (udp && await isElevated()) {
                    for (const port of (store.get('udp.ports') || [])) {
                        const {stdout} = await execa('nmap', [ip, '-p', port, '-sV', '-sU']);
                        stdout
                            .split(EOL)
                            .filter(line => line.includes('/udp'))
                            .map(line => line.split(' ').filter(Boolean))
                            .forEach(([,, service, ...versionInformation]) => {
                                const protocol = 'UDP';
                                const version = versionInformation.join(' ');
                                data.push({protocol, port, service, version});
                            });
                    }
                }
                store.set(ip, data);
                await debug({data}, 'Results of enumeration');
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