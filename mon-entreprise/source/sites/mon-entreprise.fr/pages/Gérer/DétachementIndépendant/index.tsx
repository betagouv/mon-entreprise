import RuleInput from 'Components/conversation/RuleInput'
import * as Animate from 'Components/ui/animate'
import InfoBulle from 'Components/ui/InfoBulle'
import { Markdown } from 'Components/utils/markdown'
import Engine from 'publicodes'
import React, { useCallback, useState, Suspense } from 'react'
import formulaire from './formulaire-détachement.yaml'
import { usePersistingState } from 'Components/utils/persistState'
import { hash } from '../../../../../utils'
import Overlay from 'Components/Overlay'
import { useDebounce } from 'Components/utils'
import emoji from 'react-easy-emoji'
export default function FormulaireDétachementIndépendant() {
	const engine = new Engine(formulaire)
	return (
		<>
			<h1>Demande de mobilité en Europe pour travailleur indépendant</h1>
			<p>
				Vous exercez une activité non salariée ou salariée dans un ou plusieurs
				Etats (pays) membres de l’UE, de l’EEE ou en Suisse. Remplissez ce
				formulaire pour définir votre régime de Sécurité sociale applicable, et
				envoyez la demande générée à l'adresse :{' '}
				<a href="mailto:relations.internationales@urssaf.fr">
					relations.internationales@urssaf.fr
				</a>
				.
			</p>
			<FormulairePublicodes engine={engine} dottedName="formulaire" />
		</>
	)
}

const useFields = (engine: Engine<string>, fieldNames: Array<string>) => {
	const fields = fieldNames
		.map(name => engine.evaluate(name))
		.filter(node => node.isApplicable !== false && node.isApplicable !== null)
	return fields
}

const VERSION = hash(JSON.stringify(Object.keys(formulaire)))
function FormulairePublicodes({ engine }) {
	const [situation, setSituation] = usePersistingState(
		`formulaire-détachement:${VERSION}`,
		{}
	)
	const [renderPdf, setRenderPdf] = useState(false)
	const onChange = useCallback(
		(dottedName, value) => {
			setSituation(situation => ({
				...situation,
				[dottedName]: value
			}))
			setRenderPdf(false)
		},
		[setSituation, setRenderPdf]
	)
	engine.setSituation(situation)
	const fields = useFields(engine, Object.keys(formulaire))
	const isMissingValues = fields.some(
		({ dottedName, type }) =>
			type !== 'groupe' &&
			(situation[dottedName] == null || situation[dottedName] === '')
	)
	return (
		<Animate.fromTop>
			{fields.map(field => (
				<Animate.fromTop key={field.dottedName}>
					{field.type === 'groupe' ? (
						<>
							{React.createElement(
								`h${Math.min(field.dottedName.split(' . ').length + 1, 6)}`,
								{},
								field.title
							)}
							{field.description && <Markdown source={field.description} />}
						</>
					) : (
						<label
							css={`
								display: block;
							`}
						>
							{field.question ? (
								<div
									css={`
										margin-top: 0.6rem;
									`}
								>
									{field.question}
								</div>
							) : (
								<small>{field.title}</small>
							)}{' '}
							{field.description && (
								<InfoBulle>
									<Markdown source={field.description} />
								</InfoBulle>
							)}
							<RuleInput
								dottedName={field.dottedName}
								rules={engine.getParsedRules()}
								value={situation[field.dottedName]}
								onChange={value => onChange(field.dottedName, value)}
							/>
						</label>
					)}
				</Animate.fromTop>
			))}

			<LazyPDFButton
				className="ui__ plain cta button"
				fields={fields}
				disabled={isMissingValues}
			>
				Générer la demande
			</LazyPDFButton>
		</Animate.fromTop>
	)
}

const LazyPDFDownloadLink = React.lazy(() => import('./FormPDF'))
function LazyPDFButton({ fields, className, disabled, children }) {
	const fieldsDebounced = useDebounce(fields.slice(1), 1000)
	const DisabledButton = (
		<button className={className} disabled>
			{children}
		</button>
	)
	if (disabled) {
		return DisabledButton
	}
	return (
		<Suspense fallback={DisabledButton}>
			<LazyPDFDownloadLink
				className={className}
				fields={fieldsDebounced}
				fileName={'demande-détachement.pdf'}
				title={'Demande de mobilité en Europe'}
				description="Afin d’examiner votre situation au regard des règlements communautaires UE/EEE de Sécurité sociale (CE 883/2004), veuillez envoyer ce document à relations.internationales@urssaf.fr"
			>
				{children}
			</LazyPDFDownloadLink>
		</Suspense>
	)
}
