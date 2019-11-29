import React, {Component, Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Conf from 'conf';
import {bold} from 'chalk';
import {play} from 'figures';
import {is} from 'ramda';
import {Box, Color, Text} from 'ink';
import Table from 'ink-table';
import {
    ErrorBoundary,
    SubCommandSelect,
    TaskList,
    UnderConstruction,
    Warning,
    getIntendedInput
} from 'tomo-cli';
import {getElapsedTime} from './utils';
import commands from './commands';

const store = new Conf({
    projectName: 'pwngoal'
});
const isTerminal = command => [
    'show',
    'suggest'
].includes(command);
const AnimatedIndicator = ({complete, elapsed}) => {
    const Active = () => <Color cyan>{play}</Color>;
    const Inactive = () => <Color dim>{play}</Color>;
    const gate = Number(elapsed.split(':')[2]) % 3;
    return complete ? <Color dim>runtime</Color> : <Box>
        {gate === 0 ? <Active /> : <Inactive />}
        {gate === 1 ? <Active /> : <Inactive />}
        {gate === 2 ? <Active /> : <Inactive />}
    </Box>;
};
const Timer = () => {
    const [start] = process.hrtime();
    const [complete, setComplete] = useState(false);
    const [elapsed, setElapsed] = useState('00:00:00');
    useEffect(() => {
        const id = setInterval(() => {
            setElapsed(getElapsedTime(start));
        }, 1000);
        global.PWNGOAL_CALLBACK = () => {
            setComplete(true);
            clearInterval(id);
        };
    }, []);
    return <Box marginTop={1} marginLeft={1}>
        <AnimatedIndicator elapsed={elapsed} complete={complete}/>
        <Text> {elapsed}</Text>
    </Box>;
};
const TerminalCommand = () => {
    useEffect(() => {

    }, []);
    return <UnderConstruction />;
};
const NoCommand = ({store}) => {
    const data = store.get('data') || [];
    useEffect(() => {

    }, []);
    return <Table data={data}/>;
};
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
    'spawn a TTY shell (linux)': `Spawn a TTY shell with ${bold.yellow('Python')}`
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
                    <Fragment>
                        <Timer />
                        <TaskList commands={commands} command={intendedCommand} terms={intendedTerms} options={flags} done={done}></TaskList>
                    </Fragment> :
                    hasCommand ?
                        (isTerminal(intendedCommand) ?
                            <TerminalCommand command={intendedCommand} store={store} options={flags} done={done}/> :
                            <SubCommandSelect
                                command={intendedCommand}
                                descriptions={descriptions}
                                items={Object.keys(commands[intendedCommand]).map(command => ({label: command, value: command}))}
                                onSelect={this.updateTerms}>
                            </SubCommandSelect>) :
                        <NoCommand store={store} options={flags} done={done}/>
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
AnimatedIndicator.propTypes = {
    complete: PropTypes.bool,
    elapsed: PropTypes.string
};
NoCommand.propTypes = {
    done: PropTypes.func,
    options: PropTypes.object,
    store: PropTypes.object
};
TerminalCommand.propTypes = {
    command: PropTypes.string,
    done: PropTypes.func,
    options: PropTypes.object,
    store: PropTypes.object
};
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