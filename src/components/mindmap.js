import {bold, dim} from 'chalk';
import {arrowRight} from 'figures';

const NL = `\n    `;
const TIP = `${bold.magenta('TIP')} ${bold.magenta(arrowRight)} `;
const GIBU_TIP = `${TIP}${dim('check for other NSE scripts with')} ${bold.dim('gibu /usr/share/nmap/script -fr')}`;
export const suggestions = {
    domain: [// DNS
        {
            title: 'Perform a "standard" scan and brute-force hostnames with a dictionary',
            command: `${bold.green('dnsrecon')} -d ${bold.cyan('domain')} -D /usr/share/wordlists/dnsmap.txt -t std`
        },
        {
            title: 'Enumerate DNS information with dnsenum',
            command: `${bold.green('dnsenum')} ${bold.cyan('domain')}`
        },
        {
            title: 'Scan for vulnerabilties with nmap',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script "dns-*"${NL}${GIBU_TIP}`
        }
    ],
    ftp: [
        {
            title: 'Check for anonymous login (username: "anonymous", password: <nothing>)',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script ftp-anon -p ${bold.cyan('port')}`
        }
    ],
    http: [
        {
            title: 'Scan web site for vulnerabilties with nikto',
            command: `${bold.green('nikto')} -host ${bold.cyan('ip')} -port ${bold.cyan('port')}`
        },
        {
            title: 'Scan web server directories with gobuster',
            command: `${bold.green('gobuster')} dir -w ${bold.cyan('/path/to/wordlist')} -u http://${bold.cyan('ip')}:${bold.cyan('port')}`
        },
        {
            title: 'Scan web server directories with dirb',
            command: `${bold.green('dirb')} http://${bold.cyan('ip')} ${bold.cyan('/path/to/wordlist')}`
        },
        {
            title: 'Perform a "quicklook" at the website content in your terminal',
            command: `${bold.green('curl')} -s http://${bold.cyan('ip')}:${bold.cyan('port')} | ${bold.green('html2text')} -style pretty`
        },
        {
            title: 'View colorized header data and website content with httpie',
            command: `${bold.green('http')} ${bold.cyan('ip')}:${bold.cyan('port')}`
        },
        {
            title: 'Fingerprint web server with whatweb',
            command: `${bold.green('whatweb')} -a 3 ${bold.cyan('ip')}:${bold.cyan('port')}`
        },
        {
            title: 'Brute force .htaccess directory with medusa',
            command: `${bold.green('medusa')} -h ${bold.cyan('target')} -u ${bold.cyan('user')} -P ${bold.cyan('/path/to/passwords')} -M http -m DIR:/${bold.cyan('directory')} -T 10`
        },
        {
            title: 'Brute force Wordpress login page with hydra',
            command: `${bold.green('hydra')} -l ${bold.cyan('user')} -P ${bold.cyan('/path/to/passwords')} ${bold.cyan('target')} -V http-form-post '/wp-login.php:${bold.cyan('POST header with ^USER^ and ^PASS^')}:F=login_error'`
        },
        {
            title: 'Detect WebDAV installations',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script "http-webdav-scan" -p ${bold.cyan('port')}`
        },
        {
            title: 'Scan for an IIS 5.1/6.0 WebDAV vulnerability',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script "http-iis-webdav-vuln" -p ${bold.cyan('port')}`
        },
        {
            title: 'Determine if enabled DAV services are exploitable',
            command: `${bold.green('davtest')} -url http://${bold.cyan('ip')}`
        }
    ],
    msrpc: [
        {
            title: 'Enumerate shares with nmap',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script "msrpc-enum"`
        }
    ],
    nfs: [
        {
            title: 'Enumerate NFS with rpcinfo',
            command: `${bold.green('rpcinfo')} -p ${bold.cyan('ip')}`
        },
        {
            title: `Show server's export list`,
            command: `${bold.green('showmount')} -a ${bold.cyan('ip')}`
        },
        {
            title: 'Run nmap scripts',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script "nfs-*"${NL}${GIBU_TIP}`
        }
    ],
    'netbios-ssn': [// SMB
        {
            title: 'Enumerate SMB users with nmap',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script smb-enum-users -p ${bold.cyan('port')}`
        },
        {
            title: 'Enumerate SMB shares with nmap',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script smb-enum-shares -p ${bold.cyan('port')}${NL}${GIBU_TIP}`
        },
        {
            title: 'Enumerate with enum4linux',
            command: `${bold.green('enum4linux')} -a ${bold.cyan('ip')}`
        },
        {
            title: 'Connect to share',
            command: `${bold.green('smbclient')} ${bold.cyan('//mount/share')}`
        },
        {
            title: 'Attempt null connect',
            command: `${bold.green('rpcclient')} -U "" ${bold.cyan('ip')}`
        }
    ],
    smtp: [
        {
            title: 'Check for available SMTP commands',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script smtp-commands -p ${bold.cyan('port')}`
        },
        {
            title: 'Enumerate users with smtp-enum-users and various SMTP commands (VRFY, EXPN, RCPT, etc...)',
            command: `${bold.green('smtp-user-enum')} -M ${bold.cyan('COMMAND')} -U ${bold.cyan('/path/to/users')} -t ${bold.cyan('ip')}`
        },
        {
            title: 'Scan SMTP users with nmap',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script smtp-enum-users -p ${bold.cyan('port')}`
        },
        {
            title: 'Scan for vulnerabilties with nmap',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script "smtp-vuln-*"${NL}${GIBU_TIP}`
        }
    ],
    snmp: [
        {
            title: 'Brute force community strings',
            command: `${bold.green('onesixtyone')} -i ${bold.cyan('/path/to/hosts')} -c ${bold.cyan('/path/to/strings')}`
        },
        {
            title: 'Enumerate with snmp-check',
            command: `${bold.green('snmp-check')} ${bold.cyan('ip')}`
        },
        {
            title: 'Enumerate Windows information with snmpwalk',
            command: `${bold.green('snmpwalk')} -c ${bold.cyan('community')} -v1 ${bold.cyan('ip')} ${bold.cyan('oid')}`
        }
    ],
    ssh: [
        {
            title: 'Brute force login password with hydra',
            command: `${bold.green('hydra')} -l ${bold.cyan('user')} -P ${bold.cyan('/path/to/password/list')} -f -V ${bold.cyan('ip')}`
        },
        {
            title: 'Search for exploits that apply to the SSH server version',
            command: `${bold.green('searchsploit')} ${bold.cyan('version')}`
        }
    ],
    'ssl/http': [// https
        {
            title: 'Enumerate configuration, check for heartbleed vulnerability, and determine supported ciphers with sslscan',
            command: `${bold.green('sslscan')} ${bold.cyan('ip')}`
        },
        {
            title: 'Evaluate the web server SSL/TLS (HTTPS) security with tlssled',
            command: `${bold.green('tlssled')} ${bold.cyan('ip')} ${bold.cyan('port')}`
        },
        {
            title: 'Analyze server SSL configuration with "regular" sslyze scan',
            command: `${bold.green('sslyze')} --regular ${bold.cyan('ip')}`
        },
        {
            title: 'Enumerate SSL ciphers with nmap',
            command: `${bold.green('nmap')} ${bold.cyan('ip')} --script ssl-enum-ciphers -p ${bold.cyan('port')}${NL}${GIBU_TIP}`
        }
    ]
};
export default suggestions;