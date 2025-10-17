import { DottedName } from 'modele-social'
import Engine, { ASTNode, PublicodesExpression } from 'publicodes'
import React from 'react'

import { Contexte } from '@/domaine/Contexte'

export type ValueProps<Names extends string> = {
	expression: PublicodesExpression
	unit?: string
	engine?: Engine<Names>
	displayedUnit?: string
	precision?: number
	documentationPath?: string
	linkToRule?: boolean
	flashOnChange?: boolean
} & React.HTMLAttributes<HTMLSpanElement>

export type ConditionProps = {
	expression: PublicodesExpression | ASTNode
	children: React.ReactNode
	engine?: Engine<DottedName>
	contexte?: Contexte
	non?: boolean
}
