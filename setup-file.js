import { config } from '@vue/test-utils';

config.global.mocks['__'] = jest.fn().mockImplementation((string) => string);

global._ = {
	tap: jest.fn(),
};
