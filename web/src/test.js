import { reminderTests } from './commandParser/remind';
import { dumbHandle } from './util/messaging';

export const assert = (expression, expectation, result) => {
	if (!expression) {
		console.error('Failed expected: ' + expectation + ' === ' + result);
	} else {
		console.log('Passed ' + result);
	}
}

const test = async () => {
	for (let index in reminderTests) {
		const test = reminderTests[index];
		console.log(test.q);
		console.log('================');
		const result = await dumbHandle(test.q);
		assert(result === JSON.stringify(test.a), JSON.stringify(test.a), result);
		console.log('\n');
	}
}

test();
// reminderTests.forEach(async (test) => {
// });