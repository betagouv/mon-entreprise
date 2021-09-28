import { useButton } from '@react-aria/button'
import { useSearchField } from '@react-aria/searchfield'
import { useSearchFieldState } from '@react-stately/searchfield'
import { ReactNode, useEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { animated, useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'
import { Etablissement } from '../api/sirene'
import InfoBulle from './ui/InfoBulle'

export function CompanySearchField(props: {
	label?: ReactNode
	onValue?: () => void
	onClear?: () => void
}) {
	const { t } = useTranslation()
	const searchFieldProps = {
		...props,
		label: t("Nom de l'entreprise, SIREN ou SIRET"),
		description: (
			<Trans>
				Le numéro Siret est un numéro de 14 chiffres unique pour chaque
				entreprise. Ex : 40123778000127
			</Trans>
		),
		placeholder: t('Café de la gare ou 40123778000127'),
	}
	const state = useSearchFieldState(props)
	const inputRef = useRef<HTMLInputElement>(null)
	const clearButtonRef = useRef<HTMLButtonElement>(null)
	const { labelProps, inputProps, descriptionProps, clearButtonProps } =
		useSearchField(searchFieldProps, state, inputRef)

	const { buttonProps } = useButton(
		{ ...clearButtonProps, 'aria-label': 'Effacer la recherche' },
		clearButtonRef
	)

	const results = useSearchCompany(state.value)

	const { onValue = () => {}, onClear = () => {} } = props
	useEffect(
		() => (!state.value ? onClear() : onValue()),
		[state.value, onValue, onClear]
	)

	const [ref, { width }] = useMeasure()
	const inputStyle = useSpring({
		width,
		config: { mass: 0.5, tension: 250, friction: 25 },
	})

	return (
		<div css={'display: flex, flex-direction: column, width: 100%'} ref={ref}>
			<label className="ui__ notice" {...labelProps}>
				{searchFieldProps.label}
			</label>{' '}
			<InfoBulle>
				<span {...descriptionProps}>{searchFieldProps.description}</span>
			</InfoBulle>
			<animated.div
				css={`
					position: relative;
					margin-top: 0.3rem;
				`}
				style={inputStyle}
			>
				<input
					className="ui__ cta"
					css={`
						width: 100%;
						margin: 0 !important;
					`}
					{...inputProps}
					ref={inputRef}
				/>
				{state.value !== '' && (
					<button
						ref={clearButtonRef}
						css={`
							position: absolute;
							padding: 0 1rem;
							right: 0;
							height: 100%;
							font-size: 2rem;
							color: var(--lighterTextColor);
							text-decoration: none;
						`}
						{...buttonProps}
					>
						×
					</button>
				)}
			</animated.div>
		</div>
	)
}

function useSearchCompany(value: string): Array<Etablissement> {
	return []
}
