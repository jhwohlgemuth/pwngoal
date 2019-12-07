import {isIP} from 'net';
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Color, Text} from 'ink';
import {bold, dim} from 'chalk';
import {arrowRight} from 'figures';
import {SubCommandSelect, dict} from 'tomo-cli';
import {byIpAddress} from '../utils';

const MAX_LENGTH = 60;
const truncate = (str, len) => {
    const {length} = str;
    return length < MAX_LENGTH ? str : str.substring(0, len).concat('...');
};
const getTableData = (store, value) => {
    const key = value.split('.').join('_');
    return (store.get(key) || []).map(row => {
        const {version} = row;
        return Object.assign(row, {
            version: truncate(version, MAX_LENGTH - '...'.length)
        });
    });
};
const Suggestion = ({command, title}) => <Box flexDirection="column" marginBottom={1}>
    <Text>{dim(title)}</Text>
    <Text>  ↳ {command}</Text>
</Box>;
const DisplaySuggestions = ({service}) => {
    const NL = `\n    `;
    const HINT = `${bold.magenta('HINT')}${bold.magenta(arrowRight)} `;
    const GIBU_HINT = `${HINT}${dim('remember to check for other NSE scripts with')} ${bold.dim('gibu /usr/share/nmap/script -fr')}`;
    const lookup = dict({
        ftp: [
            {
                title: 'Check for anonymous login (username: "anonymous", password: <nothing>)',
                command: `${bold.green('nmap')} --script ftp-anon -p ${bold.cyan('port')}`
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
                title: 'Brute force a GET/POST login page with hydra',
                command: `${bold.red('under construction')}`
            },
            {
                title: 'Brute force Wordpress login page with hydra',
                command: `${bold.red('under construction')}${NL}${GIBU_HINT}`
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
        nfs: [
            {
                title: 'Enumerate NFS with rpcinfo',
                command: `${bold.green('rcpinfo')} -p ${bold.cyan('ip')}${NL}${bold.green('showmount')} -a ${bold.cyan('ip')}`
            },
            {
                title: 'Run nmap scripts',
                command: `${bold.green('nmap')} --script "nfs-*"`
            }
        ],
        smb: [
            {
                title: 'Enumerate SMB users with nmap',
                command: `${bold.green('nmap')} --script smb-enum-users -p ${bold.cyan('port')}`
            },
            {
                title: 'Enumerate SMB shares with nmap',
                command: `${bold.green('nmap')} --script smb-enum-shares -p ${bold.cyan('port')}${NL}${GIBU_HINT}`
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
                title: 'Scan SMTP users with nmap',
                command: `${bold.green('nmap')} ${bold.cyan('ip')} --script "smtp-enum-users" -p ${bold.cyan('port')}`
            },
            {
                title: 'Scan for vulnerabilties with nmap',
                command: `${bold.green('nmap')} ${bold.cyan('ip')} --script "smtp-vuln-*"${NL}${GIBU_HINT}`
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
                command: `${bold.cyan('snmpwalk')} -c ${bold.cyan('community')} -v1 ${bold.cyan('ip')} ${bold.cyan('oid')}`
            }
        ]
    });
    const noSuggestion = [{
        title: `Sorry, no suggestions for ${bold(service)}...`,
        command: `Don't forget to TRY HARDER! You can do it!`
    }];
    const data = lookup.has(service) ? lookup.get(service) : noSuggestion;
    return <Box flexDirection="column" marginTop={1} marginLeft={1}>
        {data.map(({command, title}, index) => <Suggestion title={title} command={command} key={index}/>)}
    </Box>;
};
const NoResults = ({ip}) => {
    const isValid = value => (typeof value === 'string') && value.length > 0;
    return <Box flexDirection={'column'}>
        <Box>
            <Text>No suggestions for </Text>
            <Color bold red>{isValid(ip) ? ip : 'nothing'}</Color>
        </Box>
        {isValid(ip) ?
            <Fragment></Fragment> :
            <Note message={'Try "pwngoal scan ports --ip <IP> [--udp|--udpOnly]" to get some data to show'}/>}
    </Box>;
};
const Note = ({message}) => <Box marginBottom={2} marginLeft={1}>
    ↳ <Color dim>{message}</Color>
</Box>;
const SelectTarget = ({descriptions, fallback, store}) => {
    const [title, setTitle] = useState('');
    const [target, setTarget] = useState(undefined);
    const items = [...store]
        .map(([key]) => key)
        .filter(key => !['tcp', 'udp'].includes(key))
        .map(value => value.split('_').join('.'))
        .filter(value => isIP(value) > 0)
        .sort(byIpAddress())
        .map(value => ({value, label: value}));
    const onSelect = ({value}) => {
        const details = getTableData(store, value);
        setTitle(value);
        setTarget(details);
    };
    return items.length > 0 ?
        target ?
            <SelectService data={target} descriptions={descriptions} title={title}/> :
            <SubCommandSelect
                descriptions={Object.assign(descriptions, {default: fallback})}
                items={items}
                onSelect={onSelect}/> :
        <NoResults />;
};
const SelectService = ({data, descriptions}) => {
    const [service, setService] = useState(undefined);
    const isKnownService = name => !(name.endsWith('?') || name.includes('unknown'));
    const items = data
        .map(({service}) => service)
        .filter(isKnownService)
        .reduce((items, item) => items.includes(item) ? items : [...items, item], [])
        .map(value => ({value, label: value}));
    const onSelect = ({value}) => {
        setService(value);
    };
    return items.length > 0 ?
        service ?
            <DisplaySuggestions service={service}/> :
            <SubCommandSelect
                descriptions={Object.assign(descriptions, {default: service => `Show suggestions for ${service}`})}
                items={items}
                onSelect={onSelect}/> :
        <NoResults />;
};
const SuggestCommand = ({descriptions, options, store, terms}) => {
    const {ip} = options;
    const [firstTerm] = terms;
    const value = firstTerm || ip;
    const data = getTableData(store, value);
    return (firstTerm === undefined && ip === '') ?
        <SelectTarget store={store} descriptions={descriptions} fallback={target => `Select service for ${target}`}/> :
        data.length === 0 ?
            <NoResults ip={value}/> :
            <SelectService data={data} descriptions={descriptions} title={value}/>;
};
DisplaySuggestions.propTypes = {
    service: PropTypes.string
};
NoResults.propTypes = {
    ip: PropTypes.string
};
Note.propTypes = {
    message: PropTypes.string
};
SelectService.propTypes = {
    data: PropTypes.array,
    descriptions: PropTypes.object
};
SelectTarget.propTypes = {
    descriptions: PropTypes.object,
    fallback: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    store: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};
SuggestCommand.propTypes = {
    descriptions: PropTypes.object,
    options: PropTypes.object,
    store: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    terms: PropTypes.array
};
Suggestion.propTypes = {
    command: PropTypes.string,
    title: PropTypes.string
};
export default SuggestCommand;