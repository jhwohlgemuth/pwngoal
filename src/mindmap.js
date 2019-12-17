/* eslint-disable max-len */
import {bold, dim} from 'chalk';
import {arrowRight} from 'figures';

const INDENT = '    ';
const note = message => `\n\n${INDENT}${bold('NOTE')} ${bold.dim(arrowRight)} ${dim(message)}`;
const tip = message => `\n\n${INDENT}${bold.magenta('TIP')} ${bold.magenta(arrowRight)} ${dim(message)}`;
const GIBU_TIP = tip(`find other NSE scripts with ${bold('gibu /usr/share/nmap/scripts -fr')}`);

const suggestions = {
    domain: [
        {
            title: 'Perform a "standard" DNS scan and brute force hostnames with a dictionary',
            command: ({ip}) => `${bold.green('dnsrecon')} -d ${bold.cyan(ip)} -D /usr/share/wordlists/dnsmap.txt -t std`
        },
        {
            title: 'Enumerate DNS information with dnsenum',
            command: ({ip}) => `${bold.green('dnsenum')} ${bold.cyan(ip)}`
        },
        {
            title: 'Scan for DNS vulnerabilties with nmap',
            command: ({ip}) => `${bold.green('nmap')} ${bold.cyan(ip)} --script "dns-*"${GIBU_TIP}`
        }
    ],
    ftp: [
        {
            title: 'Check for anonymous FTP login (username: "anonymous", password: <nothing>)',
            command: ({ip, port}) => `${bold.green('nmap')} ${bold.cyan(ip)} -p ${bold.cyan(port)} --script ftp-anon`
        }
    ],
    http: [
        {
            title: 'Scan web site for vulnerabilties with nikto',
            command: ({ip, port}) => `${bold.green('nikto')} -host ${bold.cyan(ip)} -port ${bold.cyan(port)}`
        },
        {
            title: 'Scan web server directories with gobuster',
            command: ({ip, port}) => `${bold.green('gobuster')} dir -w ${bold.cyan('/path/to/wordlist')} -u http://${bold.cyan(ip)}:${bold.cyan(port)}`
        },
        {
            title: 'Scan web server directories with dirb',
            command: ({ip}) => `${bold.green('dirb')} http://${bold.cyan(ip)} ${bold.cyan('/path/to/wordlist')}`
        },
        {
            title: 'Perform a "quicklook" at the website content in your terminal',
            command: ({ip, port}) => `${bold.green('curl')} -s http://${bold.cyan(ip)}:${bold.cyan(port)} | ${bold.green('html2text')} -style pretty`
        },
        {
            title: 'View colorized header data and website content with httpie',
            command: ({ip, port}) => `${bold.green('http')} ${bold.cyan(ip)}:${bold.cyan(port)}`
        },
        {
            title: 'Fingerprint web server with whatweb',
            command: ({ip, port}) => `${bold.green('whatweb')} -a 3 ${bold.cyan(ip)}:${bold.cyan(port)}`
        },
        {
            title: 'Take screenshot of server web page and identify default credentials with EyeWitness',
            command: ({ip}) => `${bold.green('./EyeWitness.py')} -f ${bold.cyan('/path/to/hosts')}\n${INDENT}${bold.green('./EyeWitness.py')} --single ${bold.cyan(ip)}`
        },
        {
            title: 'Brute force .htaccess directory with medusa',
            command: ({ip, user}) => `${bold.green('medusa')} -h ${bold.cyan(ip)} -u ${bold.cyan(user)} -P ${bold.cyan('/path/to/passwords')} -M http -m DIR:/${bold.cyan('directory')} -T 10`
        },
        {
            title: 'Brute force Wordpress login page with hydra',
            command: ({ip, user}) => `${bold.green('hydra')} -l ${bold.cyan(user)} -P ${bold.cyan('/path/to/passwords')} ${bold.cyan(ip)} -V http-form-post '/wp-login.php:${bold.cyan('POST header with ^USER^ and ^PASS^')}:F=login_error'`
        },
        {
            title: 'Detect WebDAV installations',
            command: ({ip, port}) => `${bold.green('nmap')} ${bold.cyan(ip)} -p ${bold.cyan(port)} --script http-webdav-scan`
        },
        {
            title: 'Scan for an IIS 5.1/6.0 WebDAV vulnerability',
            command: ({ip, port}) => `${bold.green('nmap')} ${bold.cyan(ip)} -p ${bold.cyan(port)} --script http-iis-webdav-vuln`
        },
        {
            title: 'Determine if enabled DAV services are exploitable',
            command: ({ip}) => `${bold.green('davtest')} -url http://${bold.cyan(ip)}`
        },
        {
            title: 'Enumerate Wordpress site with wpscan',
            command: ({ip}) => `${bold.green('wpscan')} --url http://${bold.cyan(ip)}`
        },
        {
            title: 'Brute force Wordpress login page with wpscan',
            command: ({ip}) => `${bold.green('wpscan')} --url ${bold.cyan(ip)} --password-attack wp-login --passwords ${bold.cyan('/path/to/passwords')}`
        },
        {
            title: 'Enumerate Drupal site with droopescan',
            command: ({ip}) => `${bold.green('droopescan')} scan -u ${bold.cyan(ip)}`
        }
    ],
    msrpc: [ // Microsoft Remote Procedure Call
        {
            title: 'Enumerate RPC shares with nmap',
            command: ({ip}) => `${bold.green('nmap')} ${bold.cyan(ip)} --script msrpc-enum`
        }
    ],
    nfs: [ // Network File System
        {
            title: 'Enumerate NFS with rpcinfo',
            command: ({ip}) => `${bold.green('rpcinfo')} -p ${bold.cyan(ip)}`
        },
        {
            title: `Show server's NFS export list`,
            command: ({ip}) => `${bold.green('showmount')} -a ${bold.cyan(ip)}`
        },
        {
            title: 'Run NFS nmap scripts',
            command: ({ip}) => `${bold.green('nmap')} ${bold.cyan(ip)} --script "nfs-*"${GIBU_TIP}`
        }
    ],
    'netbios-ssn': [
        {
            title: 'Enumerate SMB users with nmap',
            command: ({ip, port}) => `${bold.green('nmap')} ${bold.cyan(ip)} -p ${bold.cyan(port)} --script smb-enum-users`
        },
        {
            title: 'Enumerate SMB shares with nmap',
            command: ({ip, port}) => `${bold.green('nmap')} ${bold.cyan(ip)} -p ${bold.cyan(port)} --script smb-enum-shares${GIBU_TIP}`
        },
        {
            title: 'Enumerate SMB with enum4linux',
            command: ({ip}) => `${bold.green('enum4linux')} -a ${bold.cyan(ip)}`
        },
        {
            title: 'List SMB shares and connect to one',
            command: ({ip, user}) => `${bold.green('smbclient')} -U ${bold.cyan(user)} -L ${bold.cyan(`//${ip}`)}\n${INDENT}${bold.green('smbclient')} -U ${bold.cyan(user)} ${bold.cyan(`//${ip}/path/to/share`)}`
        },
        {
            title: 'Attempt SMB null connect',
            command: ({ip}) => `${bold.green('rpcclient')} -U "" ${bold.cyan(ip)}`
        }
    ],
    oracle: [
        {
            title: 'Enumerate Oracle server information with oscanner',
            command: ({ip, port}) => `${bold.green('oscanner')} -s ${bold.cyan(ip)} -P ${bold.cyan(port)}`
        },
        {
            title: 'Get information from the Oracle TNS listener',
            command: ({ip}) => `${bold.green('tnscmd10g')} version -h ${bold.cyan(ip)}${note('the default port is 1521/tcp')}`
        },
        {
            title: 'Brute force the Oracle SID with hydra',
            command: ({ip}) => `${bold.green('hydra')} -L /usr/share/oscanner/lib/services.txt -s 1521 ${bold.cyan(ip)} oracle-sid`
        },
        {
            title: 'Enumerate Oracle users with nmap',
            command: `${bold.green('nmap')} ${bold.cyan('$RHOST')} --script oracle-enum-users${GIBU_TIP}`
        }
    ],
    smtp: [ // Simple Mail Transfer Protocol
        {
            title: 'Check for available SMTP commands',
            command: ({ip, port}) => `${bold.green('nmap')} ${bold.cyan(ip)} -p ${bold.cyan(port)} --script smtp-commands`
        },
        {
            title: 'Enumerate users with smtp-enum-users and various SMTP commands (VRFY, EXPN, RCPT, etc...)',
            command: `${bold.green('smtp-user-enum')} -M ${bold.cyan('COMMAND')} -U ${bold.cyan('/path/to/users')} -t ${bold.cyan('$RHOST')}`
        },
        {
            title: 'Scan for SMTP vulnerabilties with nmap',
            command: ({ip}) => `${bold.green('nmap')} ${bold.cyan(ip)} --script "smtp-vuln-*"${GIBU_TIP}`
        }
    ],
    snmp: [ // Simple Network Management Protocol
        {
            title: 'Brute force SNMP community strings',
            command: `${bold.green('onesixtyone')} -i ${bold.cyan('/path/to/hosts')} -c ${bold.cyan('/path/to/strings')}`
        },
        {
            title: 'Enumerate with snmp-check',
            command: ({ip}) => `${bold.green('snmp-check')} ${bold.cyan(ip)}`
        },
        {
            title: 'Enumerate Windows information with snmpwalk',
            command: ({ip}) => `${bold.green('snmpwalk')} -c ${bold.cyan('community')} -v1 ${bold.cyan(ip)} ${bold.cyan('oid')}`
        }
    ],
    ssh: [
        {
            title: 'Brute force SSH login with hydra',
            command: ({ip, user}) => `${bold.green('hydra')} -l ${bold.cyan(user)} -P ${bold.cyan('/path/to/password/list')} -f -V ${bold.cyan(ip)}`
        },
        {
            title: 'Search for exploits that apply to the SSH server version',
            command: `${bold.green('searchsploit')} ${bold.cyan('version')}`
        }
    ],
    'ssl/https': [
        {
            title: 'Enumerate SSL configuration, check for heartbleed vulnerability, and determine supported SSL ciphers with sslscan',
            command: ({ip}) => `${bold.green('sslscan')} ${bold.cyan(ip)}`
        },
        {
            title: 'Evaluate the web server SSL/TLS (HTTPS) security with tlssled',
            command: ({ip, port}) => `${bold.green('tlssled')} ${bold.cyan(ip)} ${bold.cyan(port)}`
        },
        {
            title: 'Analyze server SSL configuration with "regular" sslyze scan',
            command: ({ip}) => `${bold.green('sslyze')} --regular ${bold.cyan(ip)}`
        },
        {
            title: 'Enumerate SSL ciphers with nmap',
            command: ({ip, port}) => `${bold.green('nmap')} ${bold.cyan(ip)} -p ${bold.cyan(port)} --script ssl-enum-ciphers${GIBU_TIP}`
        }
    ]
};
[ // Add aliases
    ['dns', 'domain'], // Domain Name System
    ['smb', 'netbios-ssn'], // Server Message Block
    ['https', 'ssl/https']
].forEach(([alias, old]) => {
    suggestions[alias] = suggestions[old];
});

export default suggestions;