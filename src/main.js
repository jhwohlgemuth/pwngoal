import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
import commands from './commands';

const descriptions = {
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
    'python trick for enhanced shell (linux)': `Spawn a TTY shell with ${bold.yellow('Python')}`
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