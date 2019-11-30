import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Box, Color, Text} from 'ink';
import InkBox from 'ink-box';
import Table from 'ink-table';

export const ShowCommand = ({options, store, terms}) => {
    const {ip} = options;
    const [firstTerm] = terms;
    const value = firstTerm || ip;
    const data = store.get(value) || [];
    const NoResults = ({ip}) => {
        const isValid = value => (typeof value === 'string') && value.length > 0;
        return <Box flexDirection={'column'}>
            <Box>
                <Text>No results for </Text>
                <Color bold red>{isValid(ip) ? ip : 'nothing'}</Color>
            </Box>
            {isValid(ip) ? <Fragment></Fragment> : <Box marginLeft={1}>↳  <Color dim>Did you mean to use &ldquo;pwngoal --help&rdquo;?</Color></Box>}
        </Box>;
    };
    NoResults.propTypes = {
        ip: PropTypes.string
    };
    return data.length === 0 ? <NoResults ip={value}/> : <Fragment>
        <InkBox padding={{left: 1, right: 1}} borderColor="cyan">
            <Color bold cyan>{value}</Color>
        </InkBox>
        <Table data={data}/>
        <Box marginBottom={2} marginLeft={1}>
            ↳  <Color dim>Try &ldquo;pwngoal suggest&rdquo; to get some suggestions on what to do next</Color>
        </Box>
    </Fragment>;
};
ShowCommand.propTypes = {
    done: PropTypes.func,
    options: PropTypes.object,
    store: PropTypes.object,
    terms: PropTypes.array
};