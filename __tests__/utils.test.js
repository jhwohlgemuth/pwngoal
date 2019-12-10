import execa from 'execa';
import {
    byIpAddress,
    enumerate,
    getOpenPortsWithMasscan,
    getOpenPortsWithNmap,
    getOpenUdpPortsWithNmap,
    shouldScanWithAmap
} from '../src/utils';

jest.mock('execa', () => jest.fn());
jest.mock('../src/utils', () => {
    const {
        byIpAddress,
        enumerate,
        getElapsedTime,
        getOpenPortsWithMasscan,
        getOpenPortsWithNmap,
        getOpenUdpPortsWithNmap,
        shouldScanWithAmap
    } = jest.requireActual('../src/utils');
    return {
        __esModule: true,
        byIpAddress,
        enumerate,
        debug: jest.fn(),
        getElapsedTime,
        getGateway: jest.fn(() => 'something something 10.11.0.1 via tap0'),
        getOpenPortsWithMasscan,
        getOpenPortsWithNmap,
        getOpenUdpPortsWithNmap,
        shouldScanWithAmap
    };
});
describe('Network utilities', () => {
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
    it('can execute nmap UDP scan and parse results', async () => {
        execa.mockImplementation(async () => {
            const stdout = `
                Starting Nmap 7.80 ( https://nmap.org ) at 2019-11-27 19:44 CST
                Nmap scan report for localhost (127.0.0.1)
                Host is up (0.00054s latency).
                Other addresses for localhost (not scanned): ::1 fe80::1
                Not shown: 958 closed ports, 36 filtered ports
                Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
                PORT     STATE SERVICE
                22/udp   open  ssh
                445/udp  open  microsoft-ds
                631/udp  open  ipp
                5900/udp open  vnc
                
                Nmap done: 1 IP address (1 host up) scanned in 10.20 seconds`;
            return {stdout};
        });
        const ports = await getOpenUdpPortsWithNmap('127.0.0.1');
        expect(ports).toEqual(['22', '445', '631', '5900']);
        expect(execa.mock.calls).toMatchSnapshot();
    });
    it('can handle bad nmap scan results', async () => {
        execa.mockImplementation(async () => {
            const stdout = null;
            return {stdout};
        });
        const ports = await getOpenPortsWithNmap('127.0.0.1');
        expect(ports).toEqual([]);
    });
    it('can handle bad nmap UDP scan results', async () => {
        execa.mockImplementation(async () => {
            const stdout = null;
            return {stdout};
        });
        const ports = await getOpenUdpPortsWithNmap('127.0.0.1');
        expect(ports).toEqual([]);
    });
    it('can enumerate services on TCP ports with "nmap -sV"', async () => {
        execa.mockImplementation(async () => {
            const stdout = `
                Starting Nmap 7.80 ( https://nmap.org ) at 2019-12-03 20:26 CST
                Nmap scan report for localhost (127.0.0.1)
                Host is up (0.00026s latency).
                Other addresses for localhost (not scanned): ::1 fe80::1

                PORT   STATE SERVICE VERSION
                22/tcp open  ssh     OpenSSH 7.8 (protocol 2.0)

                Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
                Nmap done: 1 IP address (1 host up) scanned in 0.70 seconds
            `;
            return {stdout};
        });
        const ip = '127.0.0.1';
        const ports = [22]; // eslint-disable-line no-magic-numbers
        const items = await enumerate(ip, ports);
        expect(items).toMatchSnapshot();
        expect(execa.mock.calls).toMatchSnapshot();
        expect(await enumerate(ip, ports, 'udp')).toEqual([]);
    });
    it('can enumerate services on UDP ports with "nmap -sV -sU"', async () => {
        execa.mockImplementation(async () => {
            const stdout = `
                Starting Nmap 7.80 ( https://nmap.org ) at 2019-12-03 20:26 CST
                Nmap scan report for localhost (127.0.0.1)
                Host is up (0.00026s latency).
                Other addresses for localhost (not scanned): ::1 fe80::1

                PORT   STATE SERVICE VERSION
                22/udp open  ssh     OpenSSH 7.8 (protocol 2.0)

                Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
                Nmap done: 1 IP address (1 host up) scanned in 0.70 seconds
            `;
            return {stdout};
        });
        const ip = '127.0.0.1';
        const ports = [22]; // eslint-disable-line no-magic-numbers
        const items = await enumerate(ip, ports, 'udp');
        expect(items).toMatchSnapshot();
        expect(execa.mock.calls).toMatchSnapshot();
        expect(await enumerate(ip, ports)).toEqual([]);
    });
    it('can determine when to perform amap scans', () => {
        const service = 'valid service';
        const version = 'valid version';
        expect(shouldScanWithAmap({service: 'unknown', version})).toEqual(true);
        expect(shouldScanWithAmap({service: 'service?', version})).toEqual(true);
        expect(shouldScanWithAmap({service, version: ''})).toEqual(true);
        expect(shouldScanWithAmap({service, version})).toEqual(false);
    });
    test('can sort IP addresses', () => {
        const input = [
            '123.4.245.23',
            '104.244.253.29',
            '1.198.3.93',
            '32.183.93.40',
            '104.30.244.2',
            '104.244.4.1'
        ];
        const sorted = input.sort(byIpAddress());
        expect(sorted).toMatchSnapshot();
    });
});