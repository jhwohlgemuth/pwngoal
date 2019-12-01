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
export const getGateway = async (networkInterface = 'tap0') => {
    const {stdout} = await execa('ip', ['route']);
    const [gateway] = (stdout || '')
        .split(EOL)
        .filter(includes('via'))
        .filter(includes(networkInterface))
        .map(line => line.split(' ')[2]);
    return gateway;
};
export const getOpenPortsWithNmap = async ip => {
    const {stdout} = await execa('nmap', [ip, '--open', '-p', '0-65535']);
    const ports = (stdout || '')
        .split(EOL)
        .filter(includes('/tcp'))
        .map(getPort);
    return ports;
};
export const getOpenUdpPortsWithNmap = async ip => {
    const {stdout} = await execa('nmap', [ip, '--open', '-sU', '-T4', '--max-retries', 1]);
    const ports = (stdout || '')
        .split(EOL)
        .filter(includes('/udp'))
        .map(getPort);
    return ports;
};
export const getOpenPortsWithMasscan = async (ip, networkInterface = 'tap0') => {
    const rate = 500;
    const gateway = await getGateway();
    debug({ip, rate, networkInterface, gateway});
    const {stdout} = await execa('masscan', [ip, '-e', networkInterface, '--router-ip', gateway, '-p', '0-65535', '--rate', rate]);
    debug(`stdout: ${stdout}`);
    const ports = (stdout || '')
        .split(EOL)
        .filter(includes('/tcp'))
        .map(getPort)
        .sort((a, b) => a - b);
    debug({ports});
    return ports;
};