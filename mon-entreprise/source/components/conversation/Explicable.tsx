import { explainVariable } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import { EngineContext } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import React, { useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import usePortal from 'react-useportal'
import './Explicable.css'

export function ExplicableRule({ dottedName }: { dottedName: DottedName }) {
	const engine = useContext(EngineContext)
	const dispatch = useDispatch()

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) return null
	const rule = engine.getRule(dottedName)

	if (rule.rawNode.description == null) return null

	//TODO montrer les variables de type 'une possibilité'

	return (
		<button
			className="ui__ link-button"
			onClick={(e) => {
				dispatch(explainVariable(dottedName))
				e.preventDefault()
				e.stopPropagation()
			}}
			css={`
				vertical-align: middle;
				font-size: 110% !important;
			`}
		>
			{emoji('ℹ️')}
		</button>
	)
}

export function Explicable({ children }: { children: React.ReactNode }) {
	const { Portal } = usePortal({
		bindTo: document.getElementsByClassName('app-container')[0] as HTMLElement,
	})
	const [isOpen, setIsOpen] = useState(false)
	return (
		<>
			{isOpen && (
				<Portal>
					<Overlay onClose={() => setIsOpen(false)}>{children}</Overlay>
				</Portal>
			)}
			<button
				className="ui__ link-button"
				onClick={() => setIsOpen(true)}
				css={`
					margin-left: 0.3rem !important;
					vertical-align: middle;
					font-size: 110% !important;
					> img {
						border: 1px solid hsla(0, 0%, 100%, 0.7) !important;
						border-radius: 0.1rem;
					}
				`}
			>
				{emoji('ℹ️')}
			</button>
		</>
	)
}
