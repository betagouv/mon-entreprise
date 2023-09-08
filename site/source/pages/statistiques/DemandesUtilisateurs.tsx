import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { css, styled } from 'styled-components'

import { Chip } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ol } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { useFetchData } from '@/hooks/useFetchData'

import { StatsStruct } from './types'

export default function DemandeUtilisateurs() {
	// Waiting for #2552 to be implemented
	return null

	const { data: stats } = useFetchData<StatsStruct>('/data/stats.json')
	const { t } = useTranslation()

	return (
		<section>
			<H2 id="demandes-utilisateurs">Demandes utilisateurs</H2>
			<Body>
				Demandes formulées en utilisant le bouton "<Emoji emoji="👋" />" à
				droite de votre écran.{' '}
				<Link
					href="https://github.com/betagouv/mon-entreprise/blob/master/CONTRIBUTING.md#retours-utilisateurs"
					target="_blank"
					aria-label={t(
						'Comment ça marche ? Voir la page explicative sur la page du dépôt github, nouvelle fenêtre'
					)}
				>
					Comment ça marche ?
				</Link>
			</Body>

			<H3>En attente d'implémentation</H3>
			<Pagination
				items={stats?.retoursUtilisateurs.open ?? []}
				title="Liste des demandes utilisateurs en attente d'implémentation"
			/>

			<H3>Réalisées</H3>
			<Pagination
				items={stats?.retoursUtilisateurs.closed ?? []}
				title="Liste des demandes utilisateurs réalisées"
			/>
		</section>
	)
}

type IssueProps = {
	title: string
	number: number
	count: number
	closedAt: string | null
}

type PaginationProps = {
	items: Array<IssueProps>
	title: string
}

function Pagination({ title, items }: PaginationProps) {
	const state: Record<string, number> = useLocation().state ?? {}
	const currentPage = state[title] ?? 0

	return (
		<nav aria-label={`${title} : menu de navigation paginée`}>
			<Ol>
				{items.slice(currentPage * 10, (currentPage + 1) * 10).map((item) => (
					<Issue key={`issue-${item.number}`} {...item} />
				))}
			</Ol>
			<Pager>
				{[...Array(Math.ceil(items.length / 10)).keys()].map((i) => (
					<li key={i}>
						<PagerButton
							light
							size="XXS"
							replace
							to=""
							state={{ ...state, [title]: i }}
							aria-label={`${title}, Page numéro ${i + 1}`}
							currentPage={currentPage === i}
							aria-selected={currentPage === i ? true : undefined}
							aria-current={currentPage === i ? 'page' : undefined}
						>
							{i + 1}
						</PagerButton>
					</li>
				))}
			</Pager>
		</nav>
	)
}

function Issue({ title, number, count, closedAt }: IssueProps) {
	const { t } = useTranslation()

	// Remove emojis from title string
	title = title.replace(
		/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
		''
	)

	return (
		<StyledLi>
			{count > 1 && <Chip>{count} demandes</Chip>}{' '}
			<Link
				href={`https://github.com/betagouv/mon-entreprise/issues/${number}`}
				aria-label={t(
					'{{title}}, voir la demande sur github.com, nouvelle fenêtre',
					{ title }
				)}
			>
				{title}
			</Link>{' '}
			{closedAt && <small>(Résolu en {formatMonth(new Date(closedAt))})</small>}
		</StyledLi>
	)
}

const StyledLi = styled(Li)`
	list-style: none;
	&::before {
		content: '●' !important;
		font-size: 80% !important;
		display: inline-block !important;
		position: absolute !important;
		left: 0 !important;
		width: ${({ theme }) => theme.spacings.lg}!important;
		text-align: center !important;
		color: ${({ theme }) => theme.colors.bases.secondary[400]}!important;
		background-color: inherit !important;
		margin-bottom: ${({ theme }) => theme.spacings.xs}!important;
	}
`

function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'long',
		year: 'numeric',
	})
}

type PagerButtonProps = {
	currentPage: boolean
}

const PagerButton = styled(Button)<PagerButtonProps>`
	border: ${({ theme, currentPage }) =>
		currentPage
			? `2px solid ${theme.colors.bases.primary[600]}`
			: `2px solid ${theme.colors.extended.grey[400]}`};
	background-color: ${({ theme, currentPage }) =>
		currentPage &&
		css`
			${theme.colors.bases.primary[100]}
		`};
	&:hover {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	}
`

const Pager = styled.ol`
	font-family: ${({ theme }) => theme.fonts.main};
	text-align: center;
	margin: auto;

	& li {
		list-style: none;
		display: inline-block;
		margin-right: 0.25rem;
	}

	& li:first-child {
		button {
			border-top-left-radius: 0.25rem;
			border-top-right-radius: 0;
			border-bottom-left-radius: 0.25rem;
			border-bottom-right-radius: 0;
		}
	}

	& li:last-child {
		button {
			border-top-right-radius: 0.25rem;
			border-bottom-right-radius: 0.25rem;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			margin-right: 0;
		}
	}
`
