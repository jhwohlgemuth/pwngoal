import {homedir, EOL} from 'os';
import {join} from 'path';
import {promisify} from 'util';
import {appendFile, mkdirp} from 'fs-extra';
import execa from 'execa';
import {format} from 'tomo-cli';
const append = promisify(appendFile);

const includes = str => line => line.includes(str);
const getPort = line => /\d*?(?=\/)/i.exec(line)[0];

export const debug = async val => {
    const timestamp = new Date().toISOString().replace(/T/, ' ')
        .replace(/\..+/, '');
    const savepath = join(homedir(), '.pwngoal');
    await mkdirp(savepath);
    await append(`${savepath}/debug`, `[${timestamp}]${EOL}`);
    await append(`${savepath}/debug`, format(val));
    await append(`${savepath}/debug`, `${EOL}${EOL}`);
};
export const getGateway = async (networkInterface = 'tap0') => {
    const {stdout} = await execa('ip', ['route']);
    const [gateway] = stdout
        .split(EOL)
        .filter(includes('via'))
        .filter(includes(networkInterface))
        .map(line => line.split(' ')[2]);
    return gateway;
};
export const getOpenPortsWithNmap = async ip => {
    const {stdout} = await execa('nmap', [ip, '--open', '-p', '0-65535']);
    const ports = stdout
        .split(EOL)
        .filter(includes('/tcp'))
        .map(getPort);
    return ports || [];
};
export const getOpenPortsWithMasscan = async (ip, networkInterface = 'tap0') => {
    const rate = 500;
    const gateway = await getGateway();
    const {stdout} = await execa('masscan', [ip, '-e', networkInterface, '--router-ip', gateway, '-p', '0-65535', '--rate', rate]);
    const ports = stdout
        .split(EOL)
        .filter(includes('Discovered'))
        .map(getPort)
        .sort((a, b) => a - b);
    return ports || [];
};