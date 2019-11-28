import clipboard from 'clipboardy';
import commands from '../src/commands';

jest.mock('clipboardy', () => ({
    write: jest.fn()
}));

describe('copy commands', () => {
    test('can copy various strings to the clipboard', async () => {
        const options = {
            ip: '127.0.0.1',
            port: 4444
        };
        for (let [choice, [{task, condition}]] of Object.entries(commands.copy)) {
            await task(options);
            expect(choice).toMatchSnapshot();
            expect(condition()).toEqual(true);
        }
        expect(clipboard.write.mock.calls).toMatchSnapshot();
    });
});