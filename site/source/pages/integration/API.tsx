import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import illustration from '@/assets/images/illustrations/api.svg'
import PageHeader from '@/components/PageHeader'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { Button, typography } from '@/design-system'

import Meta from '../../components/utils/Meta'
import { CasParticuliers } from './components/CasParticuliers'
import StepByStep from './components/StepByStep'

const { Body, Li, Link, Ul, H2, H3, Intro, Code, Ol, Strong } = typography

export default function API() {
	const { t } = useTranslation()

	return (
		<div>
			<ScrollToTop />
			<Meta
				title={t('api.title', 'Utiliser notre API REST')}
				description={t('api.description', 'Outils pour les développeurs')}
			/>
			<Trans i18nKey="pages.développeur.api">
				<PageHeader titre="API REST de simulation" picture={illustration}>
					<Intro>
						Vous pouvez réutiliser les calculs de mon-entreprise sur votre site
						ou service très facilement grâce à notre API REST ouverte et sans
						authentification.
					</Intro>
					<Button size="XL" href="/api/v1/doc">
						Accéder au Swagger
					</Button>
				</PageHeader>
				<H2>Comment effectuer un calcul via l'API ?</H2>
				<Body>
					Pour effectuer un calcul, il vous suffit de faire un <Code>POST</Code>{' '}
					sur la route correspondant au modèle de règles que vous souhaitez
					utiliser.
				</Body>

				<Body>
					Trois modèles de règles sont actuellement utilisés par
					mon-entreprise&nbsp;:
				</Body>

				<Ul>
					<Li>
						<Code>/evaluate</Code>&nbsp;: le modèle historique{' '}
						<Code>modele-social</Code>
					</Li>
					<Li>
						<Code>/modeles/as/evaluate</Code>&nbsp;: le modèle{' '}
						<Code>modele-as</Code>, pour les assimilé·es salarié·es
					</Li>
					<Li>
						<Code>/modeles/ti/evaluate</Code>&nbsp;: le modèle{' '}
						<Code>modele-ti</Code>, pour les travailleurs/travailleuses
						indépendantes
					</Li>
				</Ul>

				<Body>
					Quelle que soit la route utilisée, les paramètres de la requête sont
					les mêmes&nbsp;:
				</Body>

				<Ul>
					<Li>
						<Code>expressions</Code>&nbsp;: le nom des règles dont vous voulez
						calculer la valeur
					</Li>
					<Li>
						<Code>situation</Code>&nbsp;: la situation pour le paramétrage du
						calcul
					</Li>
				</Ul>

				<Body>
					<Link href="/api/v1/doc">Voir les exemples dans le Swagger</Link>
				</Body>

				<H2>Comment consulter les règles disponibles ?</H2>

				<Body>
					L'API permet également de consulter les règles utilisées par les
					différents modèles.
				</Body>

				<H3>Consulter toutes les règles d'un modèle</H3>

				<Ul>
					<Li>
						<Code>/rules</Code>&nbsp;: règles de <Code>modele-social</Code>
					</Li>
					<Li>
						<Code>/modeles/as/rules</Code>&nbsp;: règles de{' '}
						<Code>modele-as</Code>
					</Li>
					<Li>
						<Code>/modeles/ti/rules</Code>&nbsp;: règles de{' '}
						<Code>modele-ti</Code>
					</Li>
				</Ul>

				<H3>Consulter une règle précise</H3>

				<Ul>
					<Li>
						<Code>/rules/&#123;rule&#125;</Code>&nbsp;: règle de{' '}
						<Code>modele-social</Code>
					</Li>
					<Li>
						<Code>/modeles/as/rules/&#123;rule&#125;</Code>&nbsp;: règle de{' '}
						<Code>modele-as</Code>
					</Li>
					<Li>
						<Code>/modeles/ti/rules/&#123;rule&#125;</Code>&nbsp;: règle de{' '}
						<Code>modele-ti</Code>
					</Li>
				</Ul>

				<Body>
					<Link href="/api/v1/doc">
						Retrouver toutes les routes et leurs exemples dans le Swagger
					</Link>
				</Body>

				<H2>Comment reproduire un calcul d'un simulateur ?</H2>

				<Body>
					Pour répliquer un calcul d'un simulateur de mon-entreprise dans la
					bibliothèque, voici la marche à suivre&nbsp;:
				</Body>

				<Ol>
					<StepByStep />
					<Li>
						<Strong>
							Dans la section «&nbsp;Règle et situation&nbsp;», vous trouverez
							le nom de la règle, le modèle de règles et la situation à utiliser
							pour effectuer le calcul via l'API.
						</Strong>
						<br /> Vous pouvez également retrouver la requête API à
						copier-coller sous forme d'appel <Code>curl</Code> ou de{' '}
						<Code>fetch</Code> JavaScript dans la section «&nbsp;Réutiliser ce
						calcul&nbsp;».
					</Li>
				</Ol>

				<CasParticuliers />

				<H2>Exemple</H2>

				<Body>
					Voici un exemple d'utilisation des différentes routes, vous pouvez
					explorer leur code dans le dossier <Code>example</Code>
				</Body>

				<div
					style={{
						textAlign: 'center',
					}}
				>
					<StyledExempleIframe
						src="https://stackblitz.com/edit/api-mon-entreprise?ctl=1&embed=1&file=main.js"
						title="Exemple d'intégration dans un éditeur de code en ligne"
					/>
				</div>
			</Trans>
		</div>
	)
}

export const StyledExempleIframe = styled.iframe`
	width: 100%;
	max-width: 1200px;
	height: 500px;
	border: 0;
	margin-bottom: 2rem;
	border-radius: 4px;
	overflow: hidden;
`
