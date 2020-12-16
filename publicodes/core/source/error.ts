<<<<<<< HEAD:publicodes/core/source/error.ts
const coerceArray = (x) => (Array.isArray(x) ? x : [x])
=======
import { Logger } from '.'
import { Context } from './parsePublicodes'
>>>>>>> 2c06fb45 (:fire: Ajoute la possibilité de définir un logger pour l'engine):publicodes/source/error.ts

export class EngineError extends Error {}
export function syntaxError(
	dottedName: string,
	message: string,
	originalError?: Error
) {
	throw new EngineError(
		`\n[ Erreur syntaxique ]
➡️  Dans la règle "${dottedName}"
✖️  ${message}
    ${originalError ? originalError.message : ''}
`
	)
}
export function warning(
	logger: Logger,
	rule: string,
	message: string,
	originalError?: Error
) {
	logger.warn(
		`\n[ Avertissement ]
➡️  Dans la règle "${rule}"
⚠️  ${message}
${originalError ? `ℹ️  ${originalError.message}` : ''}
`
	)
}

export function evaluationError(
	logger: Logger,
	rule: string,
	message: string,
	originalError?: Error
) {
	logger.error(
		`\n[ Erreur d'évaluation ]
➡️  Dans la règle "${rule}"
✖️  ${message}
    ${originalError ? originalError.message : ''}
`
	)
}

export class InternalError extends EngineError {
	constructor(payload) {
		super(
			`
Erreur interne du moteur.

Cette erreur est le signe d'un bug dans publicodes. Pour nous aider à le résoudre, vous pouvez copier ce texte dans un nouveau ticket : https://github.com/betagouv/mon-entreprise/issues/new.

payload:
\t${JSON.stringify(payload, null, 2)}
`
		)
	}
}
