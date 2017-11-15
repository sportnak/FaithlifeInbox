import { sendMessage } from './messaging';
const builds = [];

export const processJenkins = async (jenkinsMessage, conversationId) => {
	if (jenkinsMessage.build != null) {
		console.log(jenkinsMessage);
		switch(jenkinsMessage.build.phase) {
			case 'FINALIZED':
				console.log(builds[jenkinsMessage.name]);
				if (builds[jenkinsMessage.name] != null) {
					if (builds[jenkinsMessage.name].status !== jenkinsMessage.build.status) {
						await sendMessage(conversationId, `${jenkinsMessage.display_name}: build went from ${builds[jenkinsMessage.name].status} to ${jenkinsMessage.build.status}`, []);
						builds[jenkinsMessage.name].status = jenkinsMessage.build.status;
						builds[jenkinsMessage.name].count = 1;
					} else if (builds[jenkinsMessage.name].count % 10 === 0) {
						await sendMessage(conversationId, `${jenkinsMessage.display_name} #${jenkinsMessage.build.number}: ${jenkinsMessage.build.status} - ${builds[jenkinsMessage.name].count++} consecutive times.`, []);
					} else if (builds[jenkinsMessage.name].count < 10) {
						await sendMessage(conversationId, `${jenkinsMessage.display_name} #${jenkinsMessage.build.number}: ${jenkinsMessage.build.status} - ${builds[jenkinsMessage.name].count++} consecutive times.`, []);
					}
					return;
				} else {
					builds[jenkinsMessage.name] = { status: jenkinsMessage.build.status, count: 1 };
				}
				await sendMessage(conversationId, `${jenkinsMessage.display_name} #${jenkinsMessage.build.number}: ${jenkinsMessage.build.status}`, []);
				return;
			case 'STARTED':
				await sendMessage(conversationId, `${jenkinsMessage.display_name} #${jenkinsMessage.build.number}: Build started. ${jenkinsMessage.build.full_url}`, []);
				return;
			default:
				break;
		}
	}
	// const response = await sendMessage(conversationId, JSON.stringify(jenkinsMessage), []);
	// console.log(response);
}