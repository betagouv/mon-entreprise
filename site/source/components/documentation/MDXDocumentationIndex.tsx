import React from 'react'

import { TrackPage } from '@/components/ATInternetTracking'
import Meta from '@/components/utils/Meta'
import {
	Card,
	Grid,
	H1,
	Link,
	MDXContent,
	NavigationContainer,
	Spacing,
} from '@/design-system'

import { MDXDocumentation } from './createMDXDocumentation'

export interface MDXDocumentationIndexProps {
	documentations: MDXDocumentation[]
	baseUrl: string
	docUrl: string
	title: string
	trackingPageName: string
	metaTitle: string
	metaDescription: string
	indexComponent?: React.ComponentType
}

export const MDXDocumentationIndex = ({
	documentations,
	baseUrl,
	docUrl,
	title,
	trackingPageName,
	metaTitle,
	metaDescription,
	indexComponent: IndexComponent,
}: MDXDocumentationIndexProps) => {
	return (
		<>
			<TrackPage name={trackingPageName} />
			<Meta title={metaTitle} description={metaDescription} />

			<NavigationContainer>
				<Link to={baseUrl}>← Retour au simulateur</Link>
			</NavigationContainer>

			<H1>{title}</H1>

			{IndexComponent && (
				<MDXContent>
					<IndexComponent />
				</MDXContent>
			)}

			<Spacing lg />

			<Grid container spacing={3}>
				{documentations.map(({ path, title, description }) => (
					<Grid key={path} item xs={12} md={4}>
						<Card
							title={title}
							to={`${docUrl}/${path}`}
							ctaLabel="Lire la documentation"
						>
							{description || `Documentation sur ${title.toLowerCase()}`}
						</Card>
					</Grid>
				))}
			</Grid>
		</>
	)
}
