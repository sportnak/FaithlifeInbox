import { commandParser } from '../commandParser/index';
import nlp from 'compromise';
import { request } from './request.js';

const validVerbs = Object.keys(commandParser);

export const dumbHandle = async (message) => {
	return await handleMessage(JSON.stringify({ message: { text: message, creator: { id: 1 }}, conversationId: 1 }));
}

export const sendMessage = (conversationId, messageText, mentions) => (
	new Promise((resolve, reject) => {
		request({
			url: `https://beta.faithlife.com/conversations/${conversationId}/create`,
			method: 'POST',
			body: JSON.stringify({
				text: messageText,
				mentions,
			}),
			headers: {
				Authorization: 'OAuth oauth_consumer_key="236FB6B8EAE9DF6FACCC90B00204AEC1FC6A737F",oauth_signature="532F6ED9C472A3089EC80CB6A3A35F73421FB787%2673B651EA8FF7695282E4B99615C9E7B049E156A7",oauth_signature_method="PLAINTEXT",oauth_version="1.0",oauth_token="D66BB7BDE8E5A55B000A1F41B1DAFE29BCF0F8AA"',
				'Content-Type': 'application/json',
			},
		 }, (error, response, body) => resolve(error, response, body));
	}));

export const handleMessage = async (dataString) => {
	const data = JSON.parse(dataString);
	if (data.message == null || data.message.creator.id === 6928476) {
		return;
	}

	const message = data.message.text.toLowerCase();
	const text = nlp(message);
	const verbs = text.verbs().data();
	const questions = text.questions().data();
	const numbers = text.values().data();
	const nouns = text.nouns().data();

	// console.log('nouns: ', nouns, '\n');
	// console.log('numbers: ', numbers, '\n');
	// console.log('dates: ', text.dates().data(), '\n');
	// console.log('questions: ', questions, '\n');

	if (verbs.length === 0) {
		return await sendMessage(data.conversationId, 'Okay', []);
	}
	
	// console.log(verbs.map(verb => ({ text: verb.text })));
	if (validVerbs.indexOf(verbs[0].text.trim()) === -1) {
		return await sendMessage(data.conversationId, 'Sorry, I don\'t understand', []);
	}

	try {
		const verb = verbs[0].text.trim();
		const words = data.message.text.trim().split(' ');
		const subjectIndex = words.indexOf(verb);
		const toIndex = words.indexOf('to', subjectIndex);

		// if (subjectIndex === words.length - 1) {
		// 	sendMessage(data.conversationId, verbs[0].text + ' who to do what?', []);
		// 	return verbs[0].text + ' who to do what?', [];
		// }

		const subject = words.slice(subjectIndex + 1, toIndex).join(' ');
		const result = commandParser[verb].action(Object.keys(commandParser[verb]).reduce((acc, key) => {
			if (key !== 'action') {
				return {
					...acc,
					[key]: commandParser[verb][key](data.message.text),
				};
			}
		}, {}));
		
		return await sendMessage(data.conversationId, result, []);
	} catch (e) {
		console.log(e);
	}

	return 'oops';
};
