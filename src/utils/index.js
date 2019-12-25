import {EOL} from 'os';
import execa from 'execa';
import {debug} from 'tomo-cli';
import {namespace} from '../cli';

const includes = str => line => line.includes(str);
const getPort = line => /\d*?(?=\/)/i.exec(line)[0];

export const byIpAddress = () => {
    const format = val => Number(val.split('.').map(num => (`000${num}`).slice(-3)).join('')); // eslint-disable-line no-magic-numbers
    return (a, b) => format(a) - format(b);
};
export const enumerate = async (ip, ports, type = 'tcp') => {
    const data = [];
    const protocol = type.toUpperCase();
    for (const port of ports) {
        const args = [ip, '-p', port, '-sV'].concat(protocol === 'UDP' ? '-sU' : []);
        try {
            const {stdout} = await execa('nmap', args);
            await debug(stdout, {
                title: `nmap ${args.join(' ')}`,
                filename: namespace
            });
            stdout
                .split(EOL)
                .filter(includes(`/${type}`))
                .map(line => line.split(' ').filter(Boolean))
                .forEach(([,, service, ...versionInformation]) => {
                    const version = versionInformation.join(' ');
                    data.push({protocol, port, service, version});
                });
        } catch (err) {
            await debug(err, {
                title: `Error during "nmap ${args.join(' ')}"`,
                filename: namespace
            });
            const service = 'ERROR';
            const version = 'Read debug log for details';
            data.push({protocol, port, service, version});
        }
    }
    return data;
};
export const getGateway = async (networkInterface = 'tap0') => {
    const args = ['route'];
    const {stdout} = await execa('ip', args);
    await debug(stdout, {
        title: `ip ${args.join(' ')}`,
        filename: namespace
    });
    const [gateway] = (stdout || '')
        .split(EOL)
        .filter(includes('via'))
        .filter(includes(networkInterface))
        .map(line => line.split(' ')[2]);
    return gateway;
};
export const getOpenPortsWithNmap = async ip => {
    const args = [ip, '--open', '-p', '0-65535'];
    const {stdout} = await execa('nmap', args);
    await debug(stdout, {
        title: `nmap ${args.join(' ')}`,
        filename: namespace
    });
    const ports = (stdout || '')
        .split(EOL)
        .filter(includes('/tcp'))
        .map(getPort);
    return ports;
};
export const getOpenUdpPortsWithNmap = async ip => {
    const args = [ip, '--open', '-sU', '-T4', '--max-retries', 1];
    const {stdout} = await execa('nmap', args);
    await debug(stdout, {
        title: `nmap ${args.join(' ')}`,
        filename: namespace
    });
    const ports = (stdout || '')
        .split(EOL)
        .filter(includes('/udp'))
        .map(getPort);
    return ports;
};
export const getOpenPortsWithMasscan = async (ip, networkInterface = 'tap0') => {
    const rate = 500;
    const gateway = await getGateway(networkInterface);
    await debug({ip, rate, networkInterface, gateway}, {filename: namespace});
    const args = [ip, '-e', networkInterface, '--router-ip', gateway, '-p', '0-65535', '--rate', rate];
    const {stdout} = await execa('masscan', args);
    await debug(stdout, {
        title: `masscan ${args.join(' ')}`,
        filename: namespace
    });
    const ports = (stdout || '')
        .split(EOL)
        .filter(includes('/tcp'))
        .map(getPort)
        .sort((a, b) => a - b);
    await debug({ports}, {
        title: 'TCP ports found with masscan',
        filename: namespace
    });
    return ports;
};
export const shouldScanWithAmap = ({service, version}) => {
    const hasUnknownService = service === 'unknown' || service.includes('?');
    const hasNoVersionInformation = version.length === 0;
    return hasUnknownService || hasNoVersionInformation;
};