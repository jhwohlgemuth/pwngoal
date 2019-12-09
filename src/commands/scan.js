import {EOL} from 'os';
import isElevated from 'is-elevated';
import execa from 'execa';
import Conf from 'conf';
import commandExists from 'command-exists';
import {
    debug,
    enumerate,
    getOpenPortsWithNmap,
    getOpenPortsWithMasscan,
    getOpenUdpPortsWithNmap,
    shouldScanWithAmap
} from '../utils';
import {projectName} from '../cli';

const store = new Conf({projectName});
const PRIMARY_SCANNER = 'masscan';
const SECONDARY_SCANNER = 'nmap';
const makeKey = ip => ip.split('.').join('_');
const shouldPerformEnumeration = () => {
    const tcp = store.get('tcp.ports') || [];
    const udp = store.get('udp.ports') || [];
    return [...tcp, ...udp].length > 0;
};

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
                store.delete(makeKey(ip));
                store.delete('tcp.ports');
                store.delete('udp.ports');
            },
            condition: () => true
        },
        {
            text: `Find open TCP ports with ${PRIMARY_SCANNER}`,
            task: async ({ip}) => {
                const ports = await getOpenPortsWithMasscan(ip);
                await debug({ports}, `TCP ports from ${PRIMARY_SCANNER}`);
                store.set('tcp.ports', ports);
            },
            condition: ({udpOnly}) => !udpOnly && commandExists.sync(PRIMARY_SCANNER),
            optional: () => commandExists.sync(PRIMARY_SCANNER)
        },
        {
            text: `Find open TCP ports with ${SECONDARY_SCANNER}`,
            task: async ({ip}) => {
                const ports = await getOpenPortsWithNmap(ip);
                await debug({ports}, `TCP ports from ${SECONDARY_SCANNER}`);
                store.set('tcp.ports', ports);
            },
            condition: ({udpOnly}) => !udpOnly && commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER),
            optional: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER)
        },
        {
            text: `Find open UDP ports with nmap`,
            task: async ({ip}) => {
                const ports = await getOpenUdpPortsWithNmap(ip);
                await debug({ports}, `UDP ports from nmap`);
                store.set('udp.ports', ports);
            },
            condition: ({udp, udpOnly}) => (udp || udpOnly) && commandExists.sync('nmap') && isElevated(),
            optional: ({udp, udpOnly}) => (udp || udpOnly) && commandExists.sync('nmap')
        },
        {
            text: 'Enumerate services with nmap and amap',
            task: async ({ip, udp, udpOnly}) => {
                let data = [];
                if (!udpOnly) {
                    const ports = store.get(`tcp.ports`) || [];
                    await debug({ports}, 'TCP ports passed to enumeration');
                    const details = await enumerate(ip, ports);
                    data = [...data, ...details];
                }
                if ((udp || udpOnly) && await isElevated()) {
                    const ports = store.get('udp.ports') || [];
                    await debug({ports}, 'UDP ports passed to enumeration');
                    const details = await enumerate(ip, ports, 'udp');
                    data = [...data, ...details];
                }
                if (await commandExists('amap')) {
                    for (const {port} of data.filter(shouldScanWithAmap)) {
                        const {stdout} = await execa('amap', ['-q', ip, port]);
                        await debug({port}, 'scanned with amap');
                        await debug(stdout, `amap -q ${ip} ${port}`);
                        const index = data.findIndex(row => row.port === port);
                        const version = stdout
                            .split(EOL)
                            .filter(line => line.includes('matches'))
                            .map(line => line.split(' ').filter(Boolean))
                            .flatMap(([,,,, service]) => service)
                            .join(' | ');
                        data[index].version = version || '???';
                    }
                }
                const key = makeKey(ip);
                await debug({data}, `Results of enumeration for ${key}`);
                store.set(key, data);
            },
            condition: () => commandExists.sync('nmap') && shouldPerformEnumeration(),
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