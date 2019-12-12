import {join} from 'path';
import {copy} from 'fs-extra';
import {promisify} from 'util';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Box, Color, Text} from 'ink';

const copyFile = promisify(copy);

const Backup = ({options, store}) => {
    const {output} = options;
    const filename = `${Date.now()}-pwngoal.backup`;
    useEffect(() => {
        const backup = async () => {
            await copyFile(store.path, join(output, filename));
        };
        backup();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return <Box margin={1}>
        <Text>Data backed up to </Text>
        <Color cyan>{output}/</Color>
        <Color bold cyan>{filename}</Color>
    </Box>;
};
Backup.propTypes = {
    options: PropTypes.object,
    store: PropTypes.object
};

export default Backup;