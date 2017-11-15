import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import { dumbHandle, handleMessage } from './util/messaging';
import { processJenkins } from './util/jenkins';
import Readline from 'readline';
import WebSocket from 'ws';

export default (server, taskRunner, websocket) => {
	const app = express();
	app.use(bodyParser.json());
	const ws = {
		on: () => {},
	};

	if (websocket) {
		// WEBSOCKET
		const ws = new WebSocket('wss://beta.faithlife.com/messages/realtime', {
			headers: {
				Authorization: 'OAuth oauth_consumer_key="236FB6B8EAE9DF6FACCC90B00204AEC1FC6A737F",oauth_signature="532F6ED9C472A3089EC80CB6A3A35F73421FB787%2673B651EA8FF7695282E4B99615C9E7B049E156A7",oauth_signature_method="PLAINTEXT",oauth_version="1.0",oauth_token="D66BB7BDE8E5A55B000A1F41B1DAFE29BCF0F8AA"'
			}
		});
		
		ws.on('open', () => {
		  console.log("open");
		});
		
		ws.on('message', handleMessage);
		
		ws.on('error', data => console.log('error: ', data));
	} else {
		const rl = Readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		const askQuestion = async (message) => {
			dumbHandle(message);
			rl.question('Message: ', askQuestion);
		}

		rl.question('Message: ', askQuestion);
	}

	if (taskRunner) {
		// TASK RUNNER
		setTimeout(() => {
			console.log('checking for tasks')
		}, 60000);
	}

	if (server) {

		app.get('/', (req, res) => {
			console.log(req);
			console.log(req.body);
			res.send('hello world');
		});

		app.post('/:conversationId/post-build', (req, res) => {
			processJenkins(req.body, req.params.conversationId);
			res.status(204).send();
		});

		app.listen(3000, () => {
			console.log('Example app listening on port 3000!');
		});
	}
}