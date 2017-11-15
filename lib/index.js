'use strict';

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _compromise = require('compromise');

var _compromise2 = _interopRequireDefault(_compromise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import request from 'request';
var request = function request(options, cb) {
	return console.log('Send message: ', options.body);
};

/******  */
/*** START UP */
/******  */

// setTimeout(() => {
// 	console.log('checking for tasks')
// }, 60000);

// const ws = new WebSocket('wss://beta.faithlife.com/messages/realtime', {
// 	headers: {
// 		Authorization: 'OAuth oauth_consumer_key="236FB6B8EAE9DF6FACCC90B00204AEC1FC6A737F",oauth_signature="532F6ED9C472A3089EC80CB6A3A35F73421FB787%2673B651EA8FF7695282E4B99615C9E7B049E156A7",oauth_signature_method="PLAINTEXT",oauth_version="1.0",oauth_token="D66BB7BDE8E5A55B000A1F41B1DAFE29BCF0F8AA"'
// 	}
// });

var validVerbs = ['remind', 'ressage'];

var ws = {
	on: function on() {}
};

/******  */
/****** util  */
/******  */

var sendMessage = function sendMessage(conversationId, messageText, mentions) {
	return new Promise(function (resolve, reject) {
		request({
			url: 'https://beta.faithlife.com/conversations/' + conversationId + '/create',
			method: 'POST',
			body: JSON.stringify({
				text: messageText,
				mentions: mentions
			}),
			headers: {
				Authorization: 'OAuth oauth_consumer_key="236FB6B8EAE9DF6FACCC90B00204AEC1FC6A737F",oauth_signature="532F6ED9C472A3089EC80CB6A3A35F73421FB787%2673B651EA8FF7695282E4B99615C9E7B049E156A7",oauth_signature_method="PLAINTEXT",oauth_version="1.0",oauth_token="D66BB7BDE8E5A55B000A1F41B1DAFE29BCF0F8AA"',
				'Content-Type': 'application/json'
			}
		}, function (error, response, body) {
			return resolve(error, response, body);
		});
	});
};

ws.on('open', function () {
	console.log("open");
});

ws.on('message', handleMessage);

var commandParser = {
	remind: {
		me: {
			to: 'What would you like me to remind you to do?'
		},
		other: {
			to: 'What would you like me to remind them to do?'
		}
	}
};

ws.on('error', function (data) {
	return console.log('error: ', data);
});

var handleMessage = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dataString) {
		var data, text, verbs, response, verb, words, subjectIndex, subject;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						data = JSON.parse(dataString);

						if (!(data.message == null || data.message.creator.id === 6928476)) {
							_context.next = 3;
							break;
						}

						return _context.abrupt('return');

					case 3:
						text = (0, _compromise2.default)(data.message.text);
						verbs = text.verbs().data();

						if (!(verbs.length === 0)) {
							_context.next = 11;
							break;
						}

						webSocket.send(JSON.stringify({ conversationId: data.conversationId, markRead: true, presence: { userId: 6928476, hasReadConversation: true } }));
						_context.next = 9;
						return sendMessage(data.conversationId, 'Thanks', []);

					case 9:
						response = _context.sent;
						return _context.abrupt('return');

					case 11:

						console.log(verbs.map(function (verb) {
							return { text: verb.text };
						}));

						if (!(validVerbs.indexOf(verbs[0].text.toLowerCase()) === -1)) {
							_context.next = 16;
							break;
						}

						_context.next = 15;
						return sendMessage(data.conversationId, 'Sorry, I don\'t understand that command', []);

					case 15:
						return _context.abrupt('return');

					case 16:
						_context.prev = 16;
						verb = verbs[0].text.toLowerCase();
						words = data.message.text.trim().split(' ');
						subjectIndex = words.indexOf(verbs[0].text);

						if (!(subjectIndex === words.length - 1)) {
							_context.next = 24;
							break;
						}

						_context.next = 23;
						return sendMessage(data.conversationId, verbs[0].text + ' who to do what?', []);

					case 23:
						return _context.abrupt('return');

					case 24:
						subject = words[subjectIndex + 1];


						console.log(words, subject);
						console.log(commandParser[verb], subject);
						_context.next = 29;
						return sendMessage(data.conversationId, commandParser[verb][subject].to, []);

					case 29:
						_context.next = 34;
						break;

					case 31:
						_context.prev = 31;
						_context.t0 = _context['catch'](16);

						console.log(_context.t0);

					case 34:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[16, 31]]);
	}));

	return function handleMessage(_x) {
		return _ref.apply(this, arguments);
	};
}();

/******  */
/******  local testing */
/******  */
var rl = _readline2.default.createInterface({
	input: process.stdin,
	output: process.stdout
});

// import './sqlservice.js';

var askQuestion = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return handleMessage(message);

					case 2:
						rl.question('Message: ', askQuestion);

					case 3:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function askQuestion(_x2) {
		return _ref2.apply(this, arguments);
	};
}();

rl.question('Message: ', askQuestion);