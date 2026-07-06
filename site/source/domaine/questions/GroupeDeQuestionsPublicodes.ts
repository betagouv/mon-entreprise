import { TFunction } from 'i18next'
import Engine from 'publicodes'

import { QuestionPublicodes } from './QuestionPublicodes'

export type GroupeDeQuestionsPublicodes = {
	titre: (t: TFunction) => string
	réponse?: (engine: Engine, t: TFunction) => string
	liste: QuestionPublicodes[]
}
