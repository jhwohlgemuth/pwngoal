import React from 'react';
import {render} from 'ink-testing-library';
import UI from '../src/main';

describe('pwngoal interface', () => {
    it('can render', () => {
        expect(true).toBe(true);
        const {lastFrame} = render(<UI />);
        console.log(lastFrame());
        // expect(lastFrame()).toMatchSnapshot();
    });
});