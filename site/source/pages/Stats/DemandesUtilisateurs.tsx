import { H2, H3 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Li, Ul } from 'DesignSystem/typography/list'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useState } from 'react'
import styled from 'styled-components'
import stats from 'Data/stats.json'

export default function DemandeUtilisateurs() {
	return (
		<section>
			<H2 id="demandes-utilisateurs">Demandes utilisateurs</H2>
			<Body>
				Demandes formulées en utilisant le bouton "faire une suggestion" présent
				sur toutes les pages
			</Body>

			<H3>En attente d'implémentation</H3>
			<Pagination items={stats.retoursUtilisateurs.open} />

			<H3>Réalisées</H3>
			<Pagination items={stats.retoursUtilisateurs.closed} />
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
}

function Pagination({ items }: PaginationProps) {
	const [currentPage, setCurrentPage] = useState(0)
	return (
		<>
			<Ul>
				{items.slice(currentPage * 10, (currentPage + 1) * 10).map((item) => (
					<Issue key={`issue-${item.number}`} {...item} />
				))}
			</Ul>
			<Pager>
				{[...Array(Math.ceil(items.length / 10)).keys()].map((i) => (
					<PagerButton
						onClick={() => setCurrentPage(i)}
						currentPage={currentPage === i}
						key={i}
					>
						{i + 1}
					</PagerButton>
				))}
			</Pager>
		</>
	)
}

function Issue({ title, number, count, closedAt }: IssueProps) {
	return (
		<Li>
			{count > 1 && <span>{count} demandes</span>}{' '}
			<Link
				href={`https://github.com/betagouv/mon-entreprise/issues/${number}`}
			>
				{title}
			</Link>{' '}
			{closedAt && <small>(Résolu en {formatMonth(new Date(closedAt))})</small>}
		</Li>
	)
}

function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'long',
		year: 'numeric',
	})
}

type PagerButtonProps = {
	currentPage: boolean
}

const PagerButton = styled.button<PagerButtonProps>`
	padding: 0.375rem 0.5rem;
	border: 1px solid
		${({ theme, currentPage }) =>
			currentPage
				? theme.colors.bases.primary[500]
				: theme.colors.extended.grey[300]};
	margin-right: 0.25rem;
	background-color: ${({ theme, currentPage }) =>
		currentPage
			? theme.colors.bases.primary[100]
			: theme.colors.extended.grey[100]};

	&:hover {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	}

	&:first-child {
		border-top-left-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	&:last-child {
		border-top-right-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
		margin-right: 0;
	}
`

const Pager = styled.div`
	font-family: ${({ theme }) => theme.fonts.main};
	text-align: center;
	margin: auto;
`
