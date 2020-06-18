import React from 'react'
import { evaluateNode } from '../evaluation'
import { RuleLinkWithContext } from '../components/RuleLink'
import { Mecanism } from '../components/mecanisms/common'

const evaluate = (cache, situation, parsedRules, node) => {
	return { ...node }
}

export const mecanismPossibility = (recurse, k, v) => {
	return {
		explanation: {},
		evaluate,
		jsx: function Synchronisation({ explanation }) {
			return null
		},
		category: 'mecanism',
		name: 'possibilité',
		type: 'possibilité'
	}
}
