import { useSelector } from 'react-redux'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { questionsSuivantesSelector } from '@/store/selectors/simulation/questions/questionsSuivantes.selector'

export const useNextQuestions = (): Array<DottedName> =>
	useSelector(questionsSuivantesSelector) || []
