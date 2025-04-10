import React from 'react'
import { useSelector } from 'react-redux'

import { questionsRéponduesEncoreApplicablesNomsSelector } from '@/store/selectors/questionsRéponduesEncoreApplicablesNoms.selector'

import { QuestionEnCours } from './QuestionEnCours'
import { VousAvezComplétéCetteSimulation } from './VousAvezComplétéCetteSimulation'
import { useNavigateQuestions } from './useNavigateQuestions'

type QuestionPublicodesProps = {
  customEndMessages?: React.ReactNode
  customSituationVisualisation?: React.ReactNode
}

/**
 * Composant qui affiche les questions générées automatiquement par le moteur Publicodes.
 * Il utilise le système existant de navigation des questions et de sélection basée sur les variables manquantes.
 */
export function QuestionPublicodes({
  customEndMessages,
  customSituationVisualisation,
}: QuestionPublicodesProps) {
  const previousAnswers = useSelector(
    questionsRéponduesEncoreApplicablesNomsSelector
  )

  const { currentQuestion } = useNavigateQuestions()

  return (
    <>
      {currentQuestion ? (
        <QuestionEnCours
          previousAnswers={previousAnswers}
          customSituationVisualisation={customSituationVisualisation}
        />
      ) : (
        <VousAvezComplétéCetteSimulation
          firstRenderDone={true}
          customEndMessages={customEndMessages}
          previousAnswers={previousAnswers}
          customSituationVisualisation={customSituationVisualisation}
        />
      )}
    </>
  )
}