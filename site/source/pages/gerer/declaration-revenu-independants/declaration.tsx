import { Condition } from '@/components/EngineValue'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { Message } from '@/design-system'
import Accordion from '@/design-system/accordion'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ol } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { getMeta } from '@/utils'
import { Grid } from '@mui/material'
import { Item } from '@react-stately/collections'
import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { SimpleField } from '../_components/Fields'
import {
	DéclarationRevenuSection,
	useDéclarationRevenuFields,
} from './_components/DéclarationRevenu'
import { useApplicableFields, useProgress } from './_components/hooks'

export interface Meta {
	requis?: 'oui' | 'non'
	section?: 'oui' | 'non'
	affichage?: string
	cases?: string[] | { défaut: string[]; 'sans OGA': string[] }
}

export function useObjectifs(): Array<DottedName> {
	const déclarationFields = useDéclarationRevenuFields()
	const liasseFields = useLiasseFiscaleFields()
	if (useEngine().evaluate('DRI . déclaration revenus manuelle').nodeValue) {
		return déclarationFields.map(([dottedName]) => dottedName)
	}

	return liasseFields
		.filter(([, rule]) => {
			const meta = getMeta<Meta>(rule.rawNode, {})

			return meta?.requis === 'oui'
		})
		.map(([dottedName]) => dottedName)
}
export default function Déclaration() {
	const engine = useEngine()
	const liasseDottedName = useApplicableFields(
		/^DRI \. liasse \. [^.]*$/
	)[0]?.[0]

	const liasse = engine.getRule(liasseDottedName)
	const progress = useProgress(useObjectifs())

	return (
		<>
			<Condition expression="DRI . déclaration revenus manuelle = non">
				<Grid container spacing={2} alignItems="flex-end">
					<Grid item lg={10} xl={8}>
						<FromTop>
							<Trans i18nKey="assistant-DRI.declaration.intro">
								<Intro>
									Nous allons maintenant vous indiquer comment{' '}
									<Strong>
										remplir votre déclaration de revenu personnelle
									</Strong>{' '}
									à partir de la déclaration de résultat de votre entreprise.
								</Intro>
							</Trans>
							<H3 as="h2">
								Où trouver la déclaration de résultat de l'entreprise ?
							</H3>

							<Body>
								C'est le comptable qui se charge de remplir la déclaration de
								résultat. Il s'occupe également de la transmettre aux impôts en
								début d'année.
							</Body>

							<Accordion>
								<Item
									title="Récupérer le formulaire complété sur «&nbsp;impot.gouv.fr&nbsp;»"
									key="impot.gouv.fr"
									hasChildItems={false}
								>
									<Body>
										Si le formulaire de déclaration de résultat de votre
										entreprise a déjà été envoyé aux impôts, vous pouvez y
										accéder en suivant ces étapes :{' '}
									</Body>
									<Ol>
										<Li>
											Connectez-vous à votre espace professionnel sur{' '}
											<Link
												href="https://cfspro.impots.gouv.fr/mire/accueil.do"
												title="Accéder à mon espace professionnel"
											>
												impot.gouv.fr
											</Link>
										</Li>
										<Li>
											Dans le menu «&nbsp;<Strong>consulter</Strong>&nbsp;»,
											cliquez sur «&nbsp;<Strong>compte fiscal</Strong>&nbsp;»
										</Li>
										<Li>
											Dans le menu «&nbsp;<Strong>Accès par impôt</Strong>
											&nbsp;», allez sur «&nbsp;
											<Strong>
												<Condition expression="entreprise . imposition . IR . type de bénéfices . BNC">
													Bénéfices non commerciaux
												</Condition>
												<Condition expression="entreprise . imposition . IR . type de bénéfices . BIC">
													Bénéfices industriels et commerciaux
												</Condition>
												<Condition expression="entreprise . imposition . IS">
													Impôt sur les sociétés
												</Condition>
											</Strong>
											&nbsp;», puis sur «&nbsp;
											<Strong>Déclarations</Strong>&nbsp;»
										</Li>
										<Li>
											Cliquez sur la première ligne{' '}
											<Strong>«&nbsp;Exercice clos le 31/12/2021&nbsp;»</Strong>
										</Li>
										<Li>
											Cliquez sur la <Strong>date en gras</Strong> dans la
											colonne « date de dépôt&nbsp;»
										</Li>
									</Ol>
									<Spacing md />
									<Message type="info" icon border={false}>
										Si votre déclaration n'est pas présente, ou si vous n'avez
										pas accès à votre espace professionnel sur impot.gouv.fr,
										vous pouvez demander à votre comptable.
									</Message>
								</Item>

								<Item
									title="Demander à mon comptable la liste des cases"
									key="comptable"
									hasChildItems={false}
								>
									<MessageComptable />
								</Item>
							</Accordion>
							<H2>{liasse.title}</H2>
							<Body>
								Pour connaître les cases à remplir dans votre déclaration de
								revenu personnelle, copiez les montants renseignés dans la
								déclaration de résultat de votre entreprise dans le formulaire
								suivant.
							</Body>
						</FromTop>
					</Grid>

					<LiasseFiscale />

					<Grid item xs={12}>
						<H2>Renseignements complémentaires</H2>
						<SimpleField dottedName="DRI . informations complémentaires . OGA" />
						<SimpleField dottedName="DRI . informations complémentaires . rémunération dirigeant" />
					</Grid>
				</Grid>

				<Spacing xxl />
			</Condition>
			<DéclarationRevenuSection progress={progress} />
		</>
	)
}

const ModeleMessageComptable = `
Bonjour,

Je souhaite procéder à la déclaration de mes revenus
d'indépendant sur impot.gouv.fr. J'aurais besoin pour cela des
informations suivantes contenues dans les cases suivantes de
la déclaration de résultat de l'entreprise :

Case {{cases}}

Je vous remercie de m'envoyer ces informations ou directement
un exemplaire de la déclaration déjà remplie.

Bien à vous,`

function useModeleMessageComptable() {
	const fields = useLiasseFiscaleFields()

	return ModeleMessageComptable.replace(
		'{{cases}}',
		fields
			.filter(
				([, { rawNode }]) =>
					getMeta<{ section?: 'oui' | 'non' }>(rawNode, {}).section !== 'oui'
			)
			.map(([, { title }]) => title)
			.join(', ')
	)
}

function MessageComptable() {
	const { t } = useTranslation()

	const modeleMessage = useModeleMessageComptable()
	const [msgCopied, setMsgCopied] = useState(false)
	useEffect(() => {
		const handler = setTimeout(() => setMsgCopied(false), 5000)

		return () => {
			clearTimeout(handler)
		}
	}, [msgCopied])

	return (
		<>
			<Body>
				Si le formulaire de déclaration de résultat de votre entreprise
				n'apparaît pas encore sur le site des impôts, vous pouvez demander
				directement à votre comptable les montants nécessaire.
			</Body>
			<Body>Voici un modèle de message à transmettre :</Body>
			<Message type="secondary">
				<Markdown>{modeleMessage}</Markdown>
			</Message>
			{navigator.clipboard && (
				<Button
					light
					size="XS"
					onPress={() => {
						navigator.clipboard.writeText(modeleMessage).catch((err) =>
							// eslint-disable-next-line no-console
							console.error(err)
						)
						setMsgCopied(true)
					}}
				>
					{msgCopied ? (
						<>✅ {t('copied', 'Copié')}</>
					) : (
						<>📋 {t('copyMessage', 'Copier le message')}</>
					)}
				</Button>
			)}
		</>
	)
}

function useLiasseFiscaleFields(): Array<[DottedName, RuleNode]> {
	return useApplicableFields(/DRI \. liasse \. .* \. .*$/)
}

function LiasseFiscale() {
	const fields = useLiasseFiscaleFields()

	return (
		<>
			{fields.map(([dottedName, rule]) => {
				const { section, affichage } = getMeta<Meta>(rule.rawNode, {})

				return section === 'oui' ? (
					<Grid item xs={12} key={dottedName}>
						<H3
							css={`
								margin-bottom: 0rem;
							`}
						>
							{rule.title}
						</H3>
					</Grid>
				) : (
					(!affichage || (affichage && affichage !== 'non')) && (
						<Grid
							item
							md={affichage ? 6 : 4}
							sm={affichage ? 8 : 6}
							xs={12}
							key={dottedName}
						>
							<FromTop>
								<SimpleField dottedName={dottedName} />
							</FromTop>
						</Grid>
					)
				)
			})}

			<Grid item xs={12}>
				<Body>
					* <Trans i18nKey="fieldRequired">Champ requis</Trans>
				</Body>
			</Grid>
		</>
	)
}
