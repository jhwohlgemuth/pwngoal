import {isIP} from 'net';
import {init, last} from 'ramda';
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Color, Text} from 'ink';
import {bold, dim} from 'chalk';
import {arrowRight} from 'figures';
import {SubCommandSelect, SubCommandMultiSelect, dict} from 'tomo-cli';
import {byIpAddress} from '../utils';
import mindmap from '../mindmap';

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
const Suggestion = ({command, options, title}) => <Box flexDirection="column" marginTop={1} marginBottom={1}>
    <Text>{bold.blue('TRY')} {dim.blue(arrowRight)} {dim(title)}</Text>
    <Text>  {dim.blue('↳')} {typeof command === 'function' ? command(options) : command}</Text>
</Box>;
const DisplaySuggestions = ({items, options}) => {
    const lookup = dict(mindmap);
    const services = items.map(({label}) => label);
    const data = items
        .map(({value}) => value)
        .filter(service => lookup.has(service))
        .map(service => lookup.get(service));
    const format = items => {
        const {length} = items;
        const style = bold.red;
        return length === 1 ? style(items[0]) : init(items)
            .map(item => style(item))
            .join(', ')
            .concat(`${length === 2 ? '' : ','} or ${style(last(items))}`);
    };
    return <Box margin={1} flexDirection="column">
        {data.length === 0 ?
            <Text>Sorry, no suggestions for {format(services)}...</Text> :
            data.map((suggestions, index) => <Fragment key={index}>
                <Box flexDirection="column" marginLeft={1}>
                    {suggestions.map(({command, title}, index) => <Suggestion options={options} title={title} command={command} key={index}/>)}
                </Box>
            </Fragment>)}
    </Box>;
};
const NoResults = ({ip}) => {
    const isValid = value => (typeof value === 'string') && value.length > 0;
    return <Box flexDirection={'column'} margin={1}>
        <Box>
            <Text>No suggestions for </Text>
            <Color bold red>{isValid(ip) ? ip : 'nothing'}</Color>
        </Box>
        {isValid(ip) ?
            <Fragment></Fragment> :
            <Box marginLeft={1}>
                ↳ <Color dim>{'Try "pwngoal scan ports --ip <IP> [--udp|--udpOnly]" to get some data to show'}</Color>
            </Box>}
    </Box>;
};
const SelectTarget = ({descriptions, fallback, options = {}, store}) => {
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
            <SelectService data={target} descriptions={descriptions} options={{...options, ip: title}} title={title}/> :
            <SubCommandSelect
                descriptions={Object.assign(descriptions, {default: fallback})}
                items={items}
                onSelect={onSelect}/> :
        <NoResults/>;
};
const SelectService = ({data, descriptions, options = {}}) => {
    const [services, setServices] = useState([]);
    const isKnownService = name => !(name.endsWith('?') || name.includes('unknown') || name.includes('ERROR'));
    const items = data
        .map(({service}) => service)
        .filter(isKnownService)
        .reduce((items, item) => items.includes(item) ? items : [...items, item], [])
        .map(value => ({value, label: value}));
    const onSubmit = items => {
        setServices(items);
    };
    return items.length > 0 ?
        services.length > 0 ?
            <DisplaySuggestions items={services} options={options}/> :
            <SubCommandMultiSelect
                descriptions={Object.assign(descriptions, {default: service => `Show suggestions for ${service}`})}
                items={items}
                onSubmit={onSubmit}/> :
        <NoResults/>;
};
const SuggestCommand = ({descriptions, options = {}, store, terms}) => {
    const {ip, port, service = '', user = 'user'} = options;
    const [firstTerm] = terms;
    const target = firstTerm || ip;
    const data = getTableData(store, target);
    const items = service.split(',').map(value => ({label: value, value}));
    return service ?
        <DisplaySuggestions items={items} options={{ip: ip || '$RHOST', port, user}}/> :
        (firstTerm === undefined && ip === '') ?
            <SelectTarget
                store={store}
                descriptions={descriptions}
                fallback={target => `Select service for ${target}`}
                options={{...options, ip: target || '$RHOST', port}}/> :
            data.length === 0 ?
                <NoResults ip={target}/> :
                <SelectService data={data} descriptions={descriptions} options={{...options, ip: target, port}} title={target}/>;
};
DisplaySuggestions.propTypes = {
    items: PropTypes.array,
    options: PropTypes.object
};
NoResults.propTypes = {
    ip: PropTypes.string
};
SelectService.propTypes = {
    data: PropTypes.array,
    descriptions: PropTypes.object,
    options: PropTypes.object
};
SelectTarget.propTypes = {
    descriptions: PropTypes.object,
    fallback: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    options: PropTypes.object,
    store: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};
SuggestCommand.propTypes = {
    descriptions: PropTypes.object,
    options: PropTypes.object,
    store: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    terms: PropTypes.array
};
Suggestion.propTypes = {
    command: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    options: PropTypes.object,
    title: PropTypes.string
};
export default SuggestCommand;