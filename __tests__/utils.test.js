import execa from 'execa';
import {getOpenPortsWithMasscan, getOpenPortsWithNmap} from '../src/utils';

jest.mock('execa', () => jest.fn());
jest.mock('../src/utils', () => {
    const {getElapsedTime, getOpenPortsWithMasscan, getOpenPortsWithNmap} = jest.requireActual('../src/utils');
    return {
        __esModule: true,
        debug: jest.fn(),
        getElapsedTime,
        getGateway: jest.fn(() => 'something something 10.11.0.1 via tap0'),
        getOpenPortsWithMasscan,
        getOpenPortsWithNmap
    };
});

describe('Utilities', () => {
    beforeEach(() => {
        execa.mockClear();
    });
    it('can execute masscan scan and parse results', async () => {
        execa.mockImplementation(async () => {
            const stdout = `
                Discovered open port 139/tcp on 10.11.1.5                                      
                Discovered open port 1025/tcp on 10.11.1.5                                     
                Discovered open port 135/tcp on 10.11.1.5                                      
                Discovered open port 445/tcp on 10.11.1.5                                      
                Discovered open port 3389/tcp on 10.11.1.5`;
            return {stdout};
        });
        const ports = await getOpenPortsWithMasscan('127.0.0.1');
        expect(ports).toMatchSnapshot();
        expect(execa.mock.calls).toMatchSnapshot();
    });
    it('can handle bad masscan results', async () => {
        execa.mockImplementation(async () => {
            const stdout = null;
            return {stdout};
        });
        const ports = await getOpenPortsWithMasscan('127.0.0.1');
        expect(ports).toEqual([]);
    });
    it('can execute nmap scan and parse results', async () => {
        execa.mockImplementation(async () => {
            const stdout = `
                Starting Nmap 7.80 ( https://nmap.org ) at 2019-11-27 19:44 CST
                Nmap scan report for localhost (127.0.0.1)
                Host is up (0.00054s latency).
                Other addresses for localhost (not scanned): ::1 fe80::1
                Not shown: 958 closed ports, 36 filtered ports
                Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
                PORT     STATE SERVICE
                22/tcp   open  ssh
                445/tcp  open  microsoft-ds
                631/tcp  open  ipp
                3031/tcp open  eppc
                3283/tcp open  netassistant
                5900/tcp open  vnc
                
                Nmap done: 1 IP address (1 host up) scanned in 10.20 seconds`;
            return {stdout};
        });
        const ports = await getOpenPortsWithNmap('127.0.0.1');
        expect(ports).toMatchSnapshot();
        expect(execa.mock.calls).toMatchSnapshot();
    });
    it('can handle bad nmap results', async () => {
        execa.mockImplementation(async () => {
            const stdout = null;
            return {stdout};
        });
        const ports = await getOpenPortsWithNmap('127.0.0.1');
        expect(ports).toEqual([]);
    });
});