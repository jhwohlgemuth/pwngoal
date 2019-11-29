import React from 'react';
import {render} from 'ink-testing-library';
import UI from '../src/main';

describe('pwngoal interface', () => {
    it('can render with no results', () => {
        const options = {
            ip: 'not an actual ip'
        };
        expect(true).toBe(true);
        const {lastFrame} = render(<UI flags={options}/>);
        expect(lastFrame()).toMatchSnapshot();
    });
    it('can render with empty IP', () => {
        const options = {
            ip: '' // needed since meow is not applying default values
        };
        expect(true).toBe(true);
        const {lastFrame} = render(<UI flags={options}/>);
        expect(lastFrame()).toMatchSnapshot();
    });
});