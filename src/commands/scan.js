import {EOL} from 'os';
import isElevated from 'is-elevated';
import execa from 'execa';
import commandExists from 'command-exists';
import {debug} from 'tomo-cli';
import {
    enumerate,
    getOpenPortsWithNmap,
    getOpenPortsWithMasscan,
    getOpenUdpPortsWithNmap,
    shouldScanWithAmap
} from '../utils';
import {namespace} from '../cli';

const PRIMARY_SCANNER = 'masscan';
const SECONDARY_SCANNER = 'nmap';
const makeKey = ip => ip.split('.').join('_');
const shouldPerformEnumeration = store => {
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
            task: async ({ip, store}) => {
                store.delete(makeKey(ip));
                store.delete('tcp.ports');
                store.delete('udp.ports');
            },
            condition: () => true
        },
        {
            text: `Find open TCP ports with ${PRIMARY_SCANNER}`,
            task: async ({ip, networkInterface, store}) => {
                const ports = await getOpenPortsWithMasscan(ip, networkInterface);
                await debug({ports}, {
                    title: `TCP ports from ${PRIMARY_SCANNER}`,
                    filename: namespace
                });
                store.set('tcp.ports', ports);
            },
            condition: ({nmapOnly, udpOnly}) => !nmapOnly && !udpOnly && commandExists.sync(PRIMARY_SCANNER),
            optional: ({nmapOnly}) => !nmapOnly && commandExists.sync(PRIMARY_SCANNER)
        },
        {
            text: `Find open TCP ports with ${SECONDARY_SCANNER}`,
            task: async ({ip, store}) => {
                const ports = await getOpenPortsWithNmap(ip);
                await debug({ports}, {
                    title: `TCP ports from ${SECONDARY_SCANNER}`,
                    filename: namespace
                });
                store.set('tcp.ports', ports);
            },
            condition: ({udpOnly}) => !udpOnly && commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER),
            optional: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER)
        },
        {
            text: `Find open UDP ports with nmap`,
            task: async ({ip, store}) => {
                const ports = await getOpenUdpPortsWithNmap(ip);
                await debug({ports}, {
                    title: 'UDP ports from nmap',
                    filename: namespace
                });
                store.set('udp.ports', ports);
            },
            condition: ({udp, udpOnly}) => (udp || udpOnly) && commandExists.sync('nmap') && isElevated(),
            optional: ({udp, udpOnly}) => (udp || udpOnly) && commandExists.sync('nmap')
        },
        {
            text: 'Enumerate services with nmap and amap',
            task: async ({ip, store, udp, udpOnly}) => {
                let data = [];
                if (!udpOnly) {
                    const ports = store.get(`tcp.ports`) || [];
                    await debug({ports}, {
                        title: 'TCP ports passed to enumeration',
                        filename: namespace
                    });
                    const details = await enumerate(ip, ports);
                    data = [...data, ...details];
                }
                if ((udp || udpOnly) && await isElevated()) {
                    const ports = store.get('udp.ports') || [];
                    await debug({ports}, {
                        title: 'UDP ports passed to enumeration',
                        filename: namespace
                    });
                    const details = await enumerate(ip, ports, 'udp');
                    data = [...data, ...details];
                }
                try {
                    await commandExists('amap');
                    for (const {port, protocol} of data.filter(shouldScanWithAmap)) {
                        const {stdout} = await execa('amap', ['-q', ip, port]);
                        await debug({port, protocol}, {
                            title: 'Port to scan with amap',
                            filename: namespace
                        });
                        await debug(stdout, {
                            title: `amap -q ${ip} ${port}`,
                            filename: namespace
                        });
                        const index = data.findIndex(row => row.port === port && row.protocol === protocol);
                        const version = stdout
                            .split(EOL)
                            .filter(line => line.includes('matches'))
                            .map(line => line.split(' ').filter(Boolean))
                            .flatMap(([,,,, service]) => service)
                            .join(' | ');
                        data[index].version = version || '???';
                    }
                } catch (_) {
                    await debug('amap not installed', {
                        filename: namespace
                    });
                }
                const key = makeKey(ip);
                await debug({data}, {
                    title: `Results of enumeration for ${key}`,
                    filename: namespace
                });
                store.set(key, data);
            },
            condition: ({store}) => commandExists.sync('nmap') && shouldPerformEnumeration(store),
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