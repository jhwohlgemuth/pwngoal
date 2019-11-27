import {homedir, EOL} from 'os';
import {join} from 'path';
import {promisify} from 'util';
import {appendFile, mkdirp} from 'fs-extra';
import execa from 'execa';
import {format} from 'tomo-cli';
const append = promisify(appendFile);

export const debug = async val => {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const savepath = join(homedir(), '.pwngoal');
    await mkdirp(savepath);
    await append(`${savepath}/debug`, `[${timestamp}]${EOL}`);
    await append(`${savepath}/debug`, format(val));
    await append(`${savepath}/debug`, `${EOL}${EOL}`);
};
export const getOpenPortsWithNmap = async ip => {
    const {stdout} = await execa('nmap', [ip, '--open']);
    const ports = stdout
        .split(EOL)
        .filter(line => line.includes('/tcp'))
        .map(line => line.split('/')[0]);
    return ports || [];
};
export const getGateway = async (networkInterface = 'tap0') => {
    const {stdout} = await execa('ip', ['route']);
    const [gateway] = stdout
        .filter(line => line.includes('via'))
        .filter(line => line.includes(networkInterface))
        .map(line => line.split(' ')[2]);
    return gateway;
};
export const getOpenPortsWithMasscan = async (ip, networkInterface = 'tap0') => {
    const rate = 500;
    const {stdout} = await execa('masscan', [ip, '-e', networkInterface, '--router-ip', getGateway(), '-p', '0-65535', '--rate', rate]);
    const ports = stdout
        .split(EOL)
        .filter(line => line.startsWith('open'))
        .map(line => line.split(' ')[2]);
    return ports || [];
};