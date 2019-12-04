import {homedir, EOL} from 'os';
import {join} from 'path';
import {promisify} from 'util';
import {appendFile, mkdirp} from 'fs-extra';
import execa from 'execa';
import {format} from 'tomo-cli';
const append = promisify(appendFile);

const includes = str => line => line.includes(str);
const getPort = line => /\d*?(?=\/)/i.exec(line)[0];

export const debug = async (data, title = '') => {
    const savepath = join(homedir(), '.pwngoal');
    const [date] = (new Date()).toISOString().split('T');
    const time = new Date().toLocaleTimeString('en-US', {hour12: false});
    const timestamp = `${date} ${time}`;
    try {
        await mkdirp(savepath);
        await append(`${savepath}/debug`, `[${timestamp}] ${title}${EOL}`);
        await append(`${savepath}/debug`, format(data));
        await append(`${savepath}/debug`, `${EOL}`);
    } catch (_) {
        /* do nothing */
    }
};
export const enumerate = async (ip, ports, type = 'tcp') => {
    const data = [];
    for (const port of ports) {
        const args = [ip, '-p', port, '-sV'].concat(type === 'udp' ? '-sU' : []);
        const {stdout} = await execa('nmap', args);
        await debug(stdout, `nmap ${args.join(' ')}`);
        stdout
            .split(EOL)
            .filter(includes(`/${type}`))
            .map(line => line.split(' ').filter(Boolean))
            .forEach(([,, service, ...versionInformation]) => {
                const protocol = type.toUpperCase();
                const version = versionInformation.join(' ');
                data.push({protocol, port, service, version});
            });
    }
    return data;
};
export const getGateway = async (networkInterface = 'tap0') => {
    const args = ['route'];
    const {stdout} = await execa('ip', args);
    await debug(stdout, `ip ${args.join(' ')}`);
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
    await debug(stdout, `nmap ${args.join(' ')}`);
    const ports = (stdout || '')
        .split(EOL)
        .filter(includes('/tcp'))
        .map(getPort);
    return ports;
};
export const getOpenUdpPortsWithNmap = async ip => {
    const args = [ip, '--open', '-sU', '-T4', '--max-retries', 1];
    const {stdout} = await execa('nmap', args);
    await debug(stdout, `nmap ${args.join(' ')}`);
    const ports = (stdout || '')
        .split(EOL)
        .filter(includes('/udp'))
        .map(getPort);
    return ports;
};
export const getOpenPortsWithMasscan = async (ip, networkInterface = 'tap0') => {
    const rate = 500;
    const gateway = await getGateway();
    await debug({ip, rate, networkInterface, gateway});
    const args = [ip, '-e', networkInterface, '--router-ip', gateway, '-p', '0-65535', '--rate', rate];
    const {stdout} = await execa('masscan', args);
    await debug(stdout, `masscan ${args.join(' ')}`);
    const ports = (stdout || '')
        .split(EOL)
        .filter(includes('/tcp'))
        .map(getPort)
        .sort((a, b) => a - b);
    await debug({ports}, 'TCP ports found with masscan');
    return ports;
};
export const shouldScanWithAmap = ({service, version}) => {
    const hasUnknownService = service === 'unknown' || service.includes('?');
    const hasNoVersionInformation = version.length === 0;
    return hasUnknownService || hasNoVersionInformation;
};