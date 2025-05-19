import React from 'react'

import { Situation } from '@/domaine/Situation'
import { ChangeHandler } from '@/utils/ChangeHandler'

export interface Objectif<S extends Situation, T> {
	_tag: 'Objectif'
	id: string
	libellé: string
	renseigne: (situation: S, réponse: T) => S
	renderField: React.FunctionComponent<{ value: T; onChange: ChangeHandler<T> }>
}
