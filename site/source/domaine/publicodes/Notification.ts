// To add a new notification to a simulator, you should create a publicodes rule
// with the "type: notification" attribute. The display can be customized with
// the "sévérité" attribute. The notification will only be displayed if the

import { Option } from 'effect'
import Engine, { RuleNode } from 'publicodes'

import { PublicodesAdapter } from '../engine/PublicodesAdapter'
import { DottedName } from './DottedName'

// publicodes rule is applicable.
export type Notification = {
	dottedName: DottedName | 'inversion fail'
	sévérité: 'avertissement' | 'information'
	description: RuleNode['rawNode']['description']
	résumé?: RuleNode['rawNode']['description']
}

export const getNotification = (engine: Engine, dottedName: DottedName) => {
	const rules = engine.getParsedRules()
	if (!(dottedName in rules)) {
		return null
	}

	const rule = rules[dottedName]

	if (rule.rawNode.type !== 'notification') {
		return null
	}

	const estNoficationActive = PublicodesAdapter.decode(
		engine.evaluate(dottedName)
	)

	if (
		Option.isNone(estNoficationActive) ||
		estNoficationActive.value !== 'oui'
	) {
		return null
	}

	return getNotificationFromRawNode(rule)
}

export const getNotifications = (engine: Engine) =>
	Object.values(engine.getParsedRules())
		.filter(
			(rule) =>
				rule.rawNode.type === 'notification' &&
				!!engine.evaluate(rule.dottedName).nodeValue
		)
		.map(getNotificationFromRawNode)

const getNotificationFromRawNode = ({
	dottedName,
	rawNode: { sévérité, résumé, description },
}: RuleNode) =>
	({
		dottedName,
		sévérité,
		résumé,
		description,
	}) as Notification
