import {debug} from 'tomo-cli';
import {namespace} from '../cli';

const makeKey = ip => ip.split('.').join('_');

export default {
    all: [{
        text: 'Clear all saved data',
        task: async ({store}) => {
            store.clear();
        },
        condition: () => true
    }],
    host: [{
        text: 'Clear data for single host',
        task: async ({ip, store}) => {
            const key = makeKey(ip);
            const data = store.get(key);
            await debug(data, {
                title: `Clear data for ${ip}`,
                filename: namespace
            });
            store.delete(key);
        },
        condition: ({ip, store}) => store.has(makeKey(ip))
    }]
};