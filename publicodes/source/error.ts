import { coerceArray } from './utils'

export class EngineError extends Error {}
export function syntaxError(
	rules: string[] | string,
	message: string,
	originalError?: Error
) {
	throw new EngineError(
		`\n[ Erreur syntaxique ]
➡️  Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`
✖️  ${message}
    ${originalError ? originalError.message : ''}
`
	)
}

export function compilationError(
	rules: string[] | string,
	message: string,
	originalError?: Error
) {
	throw new Error(
		`\n[ Erreur de compilation ]
➡️ Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`
✖️ ${message}
  ${originalError?.message}
`
	)
}

export function evaluationError(
	rules: string[] | string,
	message: string,
	originalError?: Error
) {
	throw new EngineError(
		`\n[ Erreur d'évaluation ]
➡️  Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`
✖️  ${message}
    ${originalError ? originalError.message : ''}
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
➡️  Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`
✖️  ${message}
    ${originalError ? originalError.message : ''}
`
	)
}

export function warning(
	rules: string[] | string,
	message: string,
	solution?: string
) {
	console.warn(
		`\n[ Avertissement ]
➡️  Dans la règle \`${coerceArray(rules).slice(-1)[0]}\`
⚠️  ${message}
💡  ${solution ? solution : ''}
`
	)
}
