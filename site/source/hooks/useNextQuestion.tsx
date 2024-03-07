import { DottedName } from 'modele-social'
import { useSelector } from 'react-redux'

import { questionsSuivantesSelector } from '@/store/selectors/questionsSuivantes.selector'

export const useNextQuestions = (): Array<DottedName> =>
	useSelector(questionsSuivantesSelector) || []
