import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { css, styled } from 'styled-components'

import { Button, Chip, Emoji, theme, typography } from '@/design-system'
import { useFetchData } from '@/hooks/useFetchData'

import { StatsStruct } from './types'

const { headings, Link, lists, paragraphs } = typography
const { H2, H3 } = headings
const { Li, Ul } = lists
const { Body } = paragraphs

export default function DemandeUtilisateurs() {
	const { data: stats } = useFetchData<StatsStruct>('/data/stats.json')
	const { t } = useTranslation()

	return (
		<section>
			<H2 id="demandes-utilisateurs">Demandes utilisateurs</H2>
			<Body>
				Demandes formulées en utilisant le bouton "<Emoji emoji="👋" />"
				<span className="sr-only">"Donner votre avis"</span> à droite de votre
				écran.{' '}
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
				title="Demandes en attente d'implémentation"
			/>

			<H3>Réalisées</H3>
			<Pagination
				items={stats?.retoursUtilisateurs.closed ?? []}
				title="Demandes réalisées"
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
	const currentSearch = useLocation().search

	return (
		<>
			<Ul>
				{items.slice(currentPage * 10, (currentPage + 1) * 10).map((item) => (
					<Issue key={`issue-${item.number}`} {...item} />
				))}
			</Ul>
			<nav aria-label={`Navigation pour ${title}`} role="navigation">
				<Pager>
					{[...Array(Math.ceil(items.length / 10)).keys()].map((i) => (
						<li key={i}>
							<PagerButton
								light
								size="XXS"
								replace
								to={{
									search: currentSearch,
								}}
								state={{ ...state, [title]: i }}
								aria-label={`${title}, Page ${i + 1}${
									currentPage === i ? ', page actuelle' : ''
								}`}
								currentPage={currentPage === i}
								aria-current={currentPage === i}
							>
								{i + 1}
							</PagerButton>
						</li>
					))}
				</Pager>
			</nav>
		</>
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
	border: none;
	text-decoration: underline;
	text-underline-offset: ${theme.spacings.xxs};

	${({ theme, currentPage }) =>
		currentPage &&
		css`
			color: ${theme.colors.extended.grey[100]};
			background: ${theme.colors.bases.primary[600]};
			pointer-events: none;
			text-decoration: none;

			&:hover {
				background: ${theme.colors.bases.primary[600]};
			}
		`};
`

const Pager = styled.ol`
	display: flex;
	gap: ${theme.spacings.xs};
	justify-content: center;
	font-family: ${({ theme }) => theme.fonts.main};

	& li {
		list-style: none;
		display: inline-block;
	}
`
