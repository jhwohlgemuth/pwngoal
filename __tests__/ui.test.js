import React from 'react';
import {render} from 'ink-testing-library';
import UI from '../src/main';

describe('penny interface', () => {
    it('can render', () => {
        const {lastFrame} = render(<UI />);
        expect(lastFrame()).toMatchSnapshot();
    });
});