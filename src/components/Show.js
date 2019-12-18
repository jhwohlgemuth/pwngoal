import {isIP} from 'net';
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Color, Text} from 'ink';
import InkBox from 'ink-box';
import Table from 'ink-table';
import {SubCommandSelect} from 'tomo-cli';
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
const Cell = ({children}) => {
    const hasError = children.some(val => val.includes('ERROR'));
    return hasError ? <Color bold red>{children}</Color> : <Text>{children}</Text>;
};
const NoResults = ({ip}) => {
    const isValid = value => (typeof value === 'string') && value.length > 0;
    return <Box flexDirection={'column'}>
        <Box marginTop={1} marginLeft={1} marginBottom={1}>
            <Text>No results for </Text>
            <Color bold red>{isValid(ip) ? ip : 'nothing'}</Color>
        </Box>
        {isValid(ip) ?
            <Fragment></Fragment> :
            <Box marginBottom={2} marginLeft={1}>
                ↳ <Color dim>{'Try "pwngoal scan ports --ip <IP> [--udp|--udpOnly]" to get some data to show'}</Color>
            </Box>}
    </Box>;
};
const DisplayTable = ({data, title}) => <Fragment>
    <InkBox padding={{left: 1, right: 1}} borderColor="gray" dimBorder>
        <Color dim>{title}</Color>
    </InkBox>
    <Table data={data} cell={Cell}/>
    <Box marginBottom={2} marginLeft={1}>
        ↳ <Color dim>{`Try "pwngoal suggest ${title}" to get some suggestions on what to do next`}</Color>
    </Box>
</Fragment>;
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
            <DisplayTable data={target} title={title}/> :
            <SubCommandSelect
                descriptions={Object.assign(descriptions, {default: fallback})}
                items={items}
                onSelect={onSelect}/> :
        <NoResults />;
};
const ShowCommand = ({descriptions, options, store, terms}) => {
    const {ip} = options;
    const [firstTerm] = terms;
    const value = firstTerm || ip;
    const data = getTableData(store, value);
    return (firstTerm === undefined && ip === '') ?
        <SelectTarget store={store} descriptions={descriptions} fallback={ip => `Show scan results for ${ip}`}/> :
        data.length === 0 ?
            <NoResults ip={value}/> :
            <DisplayTable data={data} title={value}/>;
};
Cell.propTypes = {
    children: PropTypes.node
};
DisplayTable.propTypes = {
    data: PropTypes.array,
    title: PropTypes.string
};
NoResults.propTypes = {
    ip: PropTypes.string
};
SelectTarget.propTypes = {
    descriptions: PropTypes.object,
    fallback: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    store: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};
ShowCommand.propTypes = {
    descriptions: PropTypes.object,
    options: PropTypes.object,
    store: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    terms: PropTypes.array
};
export default ShowCommand;