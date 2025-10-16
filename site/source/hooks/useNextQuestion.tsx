import { useSelector } from 'react-redux'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { questionsSuivantesSelector } from '@/store/selectors/questionsSuivantes.selector'

export const useNextQuestions = (): Array<DottedName> =>
	useSelector(questionsSuivantesSelector) || []
