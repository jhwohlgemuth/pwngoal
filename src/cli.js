import {cyan, dim, bold} from 'chalk';

export const projectName = 'pwngoal';
export const descriptions = {
    default: item => `Execute for ${item}`,
    enum: 'Enumerate stuff',
    scan: 'Scan stuff',
    port: `Scan a port with nmap`,
    ports: `Perform a full TCP port scan with masscan (or nmap)`,
    'reverse shell (php)': `Copy one-line reverse shell written in ${bold.magenta('PHP')}`,
    'reverse shell (python)': `Copy one-line reverse shell written in ${bold.yellow('Python')}`,
    'reverse shell (perl)': `Copy one-line reverse shell written in ${bold.blue('Perl')}`,
    'reverse shell (ruby)': `Copy one-line reverse shell written in ${bold.red('Ruby')}`,
    'reverse shell (bash)': `Copy one-line reverse shell written in ${bold.bgBlack.white(' Bash ')}`,
    'reverse shell (awk)': `Copy one-line reverse shell written in ${bold.bgBlack.white(' awk ')}`,
    'find files/folders with write access (linux)': `Find locations with ${bold('write')} access during Linux ${bold.cyan('privilege escalation')}`,
    'spawn a TTY shell (linux)': `Spawn a TTY shell with ${bold.yellow('Python')}`
};
export const help = `
    ${dim.bold('Usage')}

        ${cyan('>')} ${projectName} [commands] [terms] [options]

        ${cyan('>')} pwn [commands] [terms] [options]

    ${dim.bold('Commands')}

        backup, clear, copy, help, scan, show, suggest, version, wat

        ${bold.magenta('TIP:')} ${bold('wat')} is an alias for ${bold('suggest')}

    ${dim.bold('Options')}

        --version, -v           Print version
        --ignore-warnings,      Ignore warning messages [Default: false]
        --debug                 Show debug data [Default: false]
        --escaped           -e  Wrap copy command in quotes, escape internal quotes [Default: false]
        --ip,               -i  IP address of target, sometimes referred to as RHOST
        --port,             -p  Port [Default: $RPORT]
        --network-interface -I  Network interface (like eth0 or fxp1) [Default: tap0]
        --service,          -s  Service
        --udp               -u  Include UDP ports in scan [Default: false]
        --udp-only              Only scan UDP ports [Default: false]
        --nmap-only             Use nmap only, even if masscan is available [Default: false]
        --user                  User name for functions that need it [Default: 'user']
        --group                 Group name for functions that need it [Default: 'user']
        --output            -o  Path to output directory when backing up data [Default: cwd]

        ${bold.magenta('TIP:')} set your interface with ${bold('--network-interface')} when you want to use masscan

    ${dim.bold('Examples')}

        ${dim('Scan open TCP ports, enumerate services')}
        ${cyan('>')} ${projectName} scan ports -i IP [--nmap-only]

        ${dim('Scan open TCP and UDP ports, enumerate services')}
        ${cyan('>')} ${projectName} scan ports -i IP --udp

        ${dim('Scan open UDP ports only, enumerate services')}
        ${cyan('>')} ${projectName} scan ports -i IP --udp-only

        ${dim('Select a command to be copied to your clipboard')}
        ${cyan('>')} ${projectName} copy [-i IP | -p PORT | --user USER | --group GROUP | --escaped]

        ${dim('View suggestions for PWNing http')}
        ${cyan('>')} ${projectName} suggest -s http [-i HOST | -p PORT | --user USER | --group GROUP]

        ${dim('Display scan results in a neatly organized table, right in your terminal')}
        ${cyan('>')} ${projectName} show [-i IP]

        ${bold.magenta('TIP:')} pwngoal works well with ${bold('gibu')}, ${cyan('https://github.com/jhwohlgemuth/gibu')}


`;
export const options = {
    help,
    flags: {
        version: {
            type: 'boolean',
            default: false,
            alias: 'v'
        },
        help: {
            type: 'boolean',
            default: false,
            alias: 'h'
        },
        ignoreWarnings: {
            type: 'boolean',
            default: false
        },
        debug: {
            type: 'boolean',
            default: false
        },
        escaped: {
            type: 'boolean',
            default: false,
            alias: 'e'
        },
        ip: {
            type: 'string',
            default: '',
            alias: 'i'
        },
        port: {
            type: 'number',
            default: '$RPORT',
            alias: 'p'
        },
        networkInterface: {
            type: 'string',
            default: 'tap0',
            alias: 'I'
        },
        service: {
            type: 'string',
            default: '',
            alias: 's'
        },
        udp: {
            type: 'boolean',
            default: false,
            alias: 'u'
        },
        udpOnly: {
            type: 'boolean',
            default: false
        },
        nmapOnly: {
            type: 'boolean',
            default: false
        },
        user: {
            type: 'string',
            default: 'USER'
        },
        group: {
            type: 'string',
            default: 'GROUP'
        },
        output: {
            type: 'string',
            default: process.cwd(),
            alias: 'o'
        }
    }
};