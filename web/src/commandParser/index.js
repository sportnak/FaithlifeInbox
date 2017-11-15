import { createReminder } from './remind.js';
import { extractTime } from '../util/time.js';

const splitUtil = (str, delim) => str.split(delim).slice(1).join(delim);

const directObjectWords = ['to'];

export const commandParser = {
	remind: {
		action: createReminder,
		to: (message) => splitUtil(message, 'to').trim(),
		who: (message) => splitUtil(message, 'remind').split('to')[0].trim(),
		when: (message) => extractTime(message),
	}
}