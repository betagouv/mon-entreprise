import { coerceArray } from '../utils'
export function syntaxError(
	rules: string[] | string,
	message: string,
	originalError?: Error
) {
	throw new Error(
		`\n[ Erreur syntaxique ]
➡️ Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`
✖️ ${message}
  ${originalError && originalError.message}
`
	)
}

export function evaluationError(
	rules: string[] | string,
	message: string,
	originalError?: Error
) {
	throw new Error(
		`\n[ Erreur d'évaluation ]
➡️ Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`
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
		`\n[ Erreur de type ]
➡️ Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`
✖️ ${message}
  ${originalError && originalError.message}
`
	)
}

export function warning(
	rules: string[] | string,
	message: string,
	solution: string
) {
	console.warn(
		`\n[ Avertissement ]
➡️ Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`
⚠️ ${message}
💡${solution}
`
	)
}
