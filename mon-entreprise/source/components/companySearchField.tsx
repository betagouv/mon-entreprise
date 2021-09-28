import { useButton } from '@react-aria/button'
import { useSearchField } from '@react-aria/searchfield'
import { useSearchFieldState } from '@react-stately/searchfield'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { animated, useSpring, useTrail } from 'react-spring'
import useMeasure from 'react-use-measure'
import { Etablissement, searchDenominationOrSiren } from '../api/sirene'
import CompanyDetails from './CompanyDetails'
import InfoBulle from './ui/InfoBulle'
import { useDebounce } from './utils'

const config = { mass: 0.5, tension: 250, friction: 25 }
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

	const { onValue = () => {}, onClear = () => {} } = props
	useEffect(
		() => (!state.value ? onClear() : onValue()),
		[state.value, onValue, onClear]
	)

	const [ref, { width }] = useMeasure()
	const inputStyle = useSpring({
		width,
		config,
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
			<Results value={state.value} />
		</div>
	)
}

function useSearchCompany(value: string): [boolean, Array<Etablissement>] {
	const [result, setResult] = useState<Array<Etablissement>>([])
	const [searchPending, setSearchPending] = useState(!!value)
	useEffect(() => {
		setSearchPending(!!value)
		if (!value) {
			setResult([])
		}
	}, [value, setResult, setSearchPending])

	const debouncedValue = useDebounce(value, 300)
	useEffect(() => {
		if (!debouncedValue) {
			return
		}
		searchDenominationOrSiren(debouncedValue).then((établissements) => {
			setResult(établissements || [])
			setSearchPending(false)
		})
	}, [debouncedValue, setResult, setSearchPending])

	return [searchPending, result.slice(0, 5)]
}

function Results({ value }: { value: string }) {
	const [searchPending, results] = useSearchCompany(value)
	const [showSearchIndicator, setShowSearchIndicator] = useState(false)
	useEffect(() => {
		if (!searchPending) {
			setShowSearchIndicator(false)
			return
		}
		const timeout = setTimeout(() => setShowSearchIndicator(true), 500)
		return () => clearTimeout(timeout)
	}, [searchPending, setShowSearchIndicator])
	const [styles, api] = useTrail(results.length, () => ({
		opacity: 1,
		x: 0,
		y: 0,
		from: { opacity: 0, x: 5, y: -15 },
		config,
	}))
	useEffect(() => {
		if (value && results.length) {
			api.start()
		}
	})
	return showSearchIndicator ? (
		<p
			className="ui__ notice"
			css={`
				margin-top: 1rem;
			`}
		>
			Recherche en cours
		</p>
	) : !searchPending && value && !results.length ? (
		<p
			className="ui__ notice"
			css={`
				margin-top: 1rem;
			`}
		>
			Aucun résultat trouvé
		</p>
	) : (
		<>
			{results.map((r, i) => (
				<animated.a
					key={r.siren}
					style={styles[i]}
					className="ui__ interactive card"
					href={`/entreprise/${r.siren}`}
					css={`
						position: relative;
						display: flex;
						margin-top: 0.4rem;
						flex-direction: column;
						text-decoration: none;
					`}
				>
					<CompanyDetails {...r} />
				</animated.a>
			))}
		</>
	)
}
