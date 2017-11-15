import moment from 'moment';
import nlp from 'compromise';

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const shortDays = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun'];
const units = ['day', 'week', 'month', 'year', 'hour', 'minute'];

const numberAndUnit = (remaining) => {
	let value = null;
	let index = 0;
	let next = '';

	while (index < remaining.length) {
		next = remaining.slice(index, index + 1)[0].toLowerCase();
		const numbers = nlp(next).values().data();

		if (next === 'and') {
			index++;
			continue;
		}

		if (next === 'a' || next === 'an') {
			value = 1;
			index++;
			continue;
		}

		if (numbers.length === 0) {
			break;
		}

		value = numbers[0].number;
		index++;
	}

	if (units.indexOf(next) === -1 && units.indexOf(next.substring(0, next.length - 1)) ===  -1) {
		return null;
	}

	return {
		[next]: value,
		remaining: remaining.slice(index + 1),
	};
}

export const extractTime = (message) => {
	const words = message.split(' ');
	const inIndex = words.indexOf('in');
	const atIndex = words.indexOf('at');
	const onIndex = words.indexOf('on');

	if (inIndex === -1 && atIndex === -1 && onIndex === -1) {
		return null;
	}

	if (inIndex !== -1) {
		// in
		let rem = words.slice(inIndex + 1);
		let result = {
			year: 0,
			month: 0,
			week: 0,
			day: 0,
			hour: 0,
			minute: 0,
		};

		while (true) {
			const next = numberAndUnit(rem);
			if (next == null) {
				break;
			}

			result = {
				...result,
				...next,
			};

			rem = next.remaining;
		}

		const { remaining, ...res } = result;
		const time = moment();

		Object.keys(res).forEach(key => {
			time.add(result[key], key);
		});

		return time;

		// const year = next.indexOf('year') !== -1  ? value : 0;
		// const month = next.indexOf('month') !== -1  ? value : 0;
		// const day = next.indexOf('day') !== -1 ? value : 0;
		// const hour = next.indexOf('hour') !== -1  ? value : 0;

		// console.log(value, next);
		// console.log(index);
	} else if (atIndex !== -1) {
		// at
		const rem = words.find((value, index) => {
			if (value === 'at') {
				let temp = words.slice(index + 1);
				const nextWord = temp[0].match(/([0-9]+)\ *([(am)(pm)]{1})/)
				if (nextWord != null) {
					const number = nextWord[1];
				}
			}

			if (value === 'at' || value.match(/([0-9]+)\ *[(am)(pm)]+/)) {
				return index;
			}
		});
		// at 3pm, remind me to look at this
		// remind me to look at this at 3pm.
	}
}