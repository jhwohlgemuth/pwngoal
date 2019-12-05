import Conf from 'conf';
import {debug} from '../utils';
import {projectName} from '../cli';

const store = new Conf({projectName});
const makeKey = ip => ip.split('.').join('_');

export default {
    all: [{
        text: 'Clear all saved data',
        task: async () => {
            store.clear();
        },
        condition: () => true
    }],
    host: [{
        text: 'Clear data for single host',
        task: async ({ip}) => {
            const key = makeKey(ip);
            const data = store.get(key);
            await debug(data, `Clear data for ${ip}`);
            store.delete(key);
        },
        condition: ({ip}) => store.has(makeKey(ip))
    }]
};