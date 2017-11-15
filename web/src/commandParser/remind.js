export const createReminder = ({ who, to, when }) => {
	if (who.length === 0 && to.length === 0) {
		return 'I\'m sorry, I don\'t understand.';
	}

	const destination = who === 'me' ? 'you' : who;

	console.log('who: ', destination);
	console.log('to: ', to);
	console.log('when: ', when);


	if (to.length === 0) {
		return `Okay, what should I remind ${destination} to do?`;
	}

	return `Okay, I'll remind ${destination} to ${to}`;
}

export const reminderTests = [
	{ q: 'hello', a: {"text":"Okay","mentions":[]} },
	{ q: 'remind', a: {"text":"I'm sorry, I don't understand.","mentions":[]} },
	{ q: 'remind me', a: {"text":"Okay, what should I remind you to do?","mentions":[]} },
	{ q: 'remind bob', a: {"text":"Okay, what should I remind bob to do?","mentions":[]} },
	{ q: 'remind me in an hour', a: {"text":"Okay, what should I remind you to do in an hour?","mentions":[]} },
	{ q: 'remind me in 1 hour', a: 'Okay, what should I remind you to do in one hour?' },
	{ q: 'remind me in one hour', a: 'Okay, what should I remind you to do in one hour?' },
]
