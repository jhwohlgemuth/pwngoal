import {isIP} from 'net';
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import Conf from 'conf';
import {Box, Color, Text} from 'ink';
import InkBox from 'ink-box';
import Table from 'ink-table';
import {SubCommandSelect} from 'tomo-cli';
import {descriptions, projectName} from '../cli';

const store = new Conf({projectName});

const MAX_LENGTH = 60;
const truncate = (str, len) => {
    const {length} = str;
    return length < MAX_LENGTH ? str : str.substring(0, len).concat('...');
};
const getData = value => {
    const key = value.split('.').join('_');
    return (store.get(key) || []).map(row => {
        const {version} = row;
        return Object.assign(row, {
            version: truncate(version, MAX_LENGTH - '...'.length)
        });
    });
};
const NoResults = ({ip}) => {
    const isValid = value => (typeof value === 'string') && value.length > 0;
    return <Box flexDirection={'column'}>
        <Box>
            <Text>No results for </Text>
            <Color bold red>{isValid(ip) ? ip : 'nothing'}</Color>
        </Box>
        {isValid(ip) ? <Fragment></Fragment> : <Box marginLeft={1}>↳ <Color dim>Try &ldquo;pwngoal scan&rdquo; to get some data to show</Color></Box>}
    </Box>;
};
const DisplayTable = ({data, title}) => <Fragment>
    <InkBox padding={{left: 1, right: 1}} borderColor="cyan">
        <Color bold cyan>{title}</Color>
    </InkBox>
    <Table data={data}/>
    <Box marginBottom={2} marginLeft={1}>
        ↳ <Color dim>Try &ldquo;pwngoal suggest&rdquo; to get some suggestions on what to do next</Color>
    </Box>
</Fragment>;
const SelectTarget = ({store}) => {
    const [title, setTitle] = useState('');
    const [target, setTarget] = useState(undefined);
    const items = [...store]
        .map(([key]) => key)
        .filter(key => !['tcp', 'udp'].includes(key))
        .map(value => value.split('_').join('.'))
        .filter(value => isIP(value) > 0)
        .map(value => ({value, label: value}));
    const onSelect = ({value}) => {
        const details = getData(value);
        setTitle(value);
        setTarget(details);
    };
    return items.length > 0 ?
        target ?
            <DisplayTable data={target} title={title}/> :
            <SubCommandSelect
                descriptions={Object.assign(descriptions, {default: ip => `Show scan results for ${ip}`})}
                items={items}
                onSelect={onSelect}/> :
        <NoResults />;
};
const ShowCommand = ({options, store, terms}) => {
    const {ip} = options;
    const [firstTerm] = terms;
    const value = firstTerm || ip;
    const data = getData(value);
    return (firstTerm === undefined && ip === '') ?
        <SelectTarget store={store}/> :
        data.length === 0 ?
            <NoResults ip={value}/> :
            <DisplayTable data={data} title={value}/>;
};
DisplayTable.propTypes = {
    data: PropTypes.array,
    title: PropTypes.string
};
NoResults.propTypes = {
    ip: PropTypes.string
};
SelectTarget.propTypes = {
    store: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};
ShowCommand.propTypes = {
    done: PropTypes.func,
    options: PropTypes.object,
    store: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    terms: PropTypes.array
};
export default ShowCommand;