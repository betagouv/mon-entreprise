import { TFunction } from 'i18next'

import { DottedName } from '../publicodes/DottedName'

export interface QuestionPublicodes {
	_tag: 'QuestionPublicodes'
	id: DottedName
	libellé: (t: TFunction) => string
	applicable: () => boolean
	Valeur: React.FunctionComponent
}
