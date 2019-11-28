import { coerceArray } from '../utils'
export function syntaxError(
	dottedName: string,
	message: string,
	originalError: Error
) {
	throw new Error(
		`[ Erreur syntaxique ]
➡️ Dans la règle \`${dottedName}\`,
✖️ ${message}
  ${originalError && originalError.message}
`
	)
}

export function typeWarning(
	rules: string[] | string,
	message: string,
	originalError?: Error
) {
	console.warn(
		`[ Erreur de type ]
➡️ Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`,
✖️ ${message}
  ${originalError && originalError.message}
`
	)
}

export function warning(dottedName: string, message: string, solution: string) {
	console.warn(
		`[ Avertissement ]
➡️ Dans la règle \`${dottedName}\`,
⚠️ ${message}
💡${solution}
`
	)
}
