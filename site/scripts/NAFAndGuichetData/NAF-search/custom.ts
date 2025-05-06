/**
 * Liste des quelques cas qui ont plus d'un "cf." dans la même phrase.
 * Cela permet de réécrire les phrases qui seront ajouter pour chaque code APE.
 */
export const multipleCf = {
	'le conditionnement de viandes de volailles, pour compte propre (cf. 46.32A) ou pour compte de tiers (cf. 82.92Z)':
		{
			'46.32A': {
				contenuCentral: [
					'le conditionnement de viandes de volailles pour compte propre',
				],
			},
			'82.92Z': {
				contenuCentral: [
					'le conditionnement de viandes de volailles pour compte de tiers',
				],
			},
		},

	'le conditionnement de viandes, pour compte propre (cf. 46.32A) ou pour compte de tiers (cf. 82.92Z)':
		{
			'46.32A': {
				contenuCentral: ['le conditionnement de viandes pour compte propre'],
			},
			'82.92Z': {
				contenuCentral: ['le conditionnement de viandes pour compte de tiers'],
			},
		},

	'la fabrication de pâtes à tartiner laitières (cf. 10.51B) ou à base de cacao (cf. 10.82Z)':
		{
			'10.51B': {
				contenuCentral: ['la fabrication de pâtes à tartiner laitières'],
			},
			'10.82Z': {
				contenuCentral: ['la fabrication de pâtes à tartiner à base de cacao'],
			},
		},

	'la fabrication de quiches, tartes salées, tourtes et pizzas surgelées (cf. 10.85Z), de pizzas fraîches (cf. 10.89Z)':
		{
			'10.85Z': {
				contenuCentral: [
					'la fabrication de quiches, tartes salées, tourtes et pizzas surgelées',
				],
			},
			'10.89Z': { contenuCentral: ['la fabrication de pizzas fraîches'] },
		},

	'la fabrication de glucose, de sirop de glucose, de maltose (cf. 10.62Z) et de lactose (cf. 10.51D)':
		{
			'10.62Z': {
				contenuCentral: [
					'la fabrication de glucose, de sirop de glucose, de maltose',
				],
			},
			'10.51D': { contenuCentral: ['la fabrication de lactose'] },
		},

	"la production de farines de viandes (cf. 10.13A) ou de poissons destinées à l'alimentation des animaux (cf. 10.20Z)":
		{
			'10.13A': { contenuCentral: ['la production de farines de viandes'] },
			'10.20Z': {
				contenuCentral: [
					"la production de farines de poissons destinées à l'alimentation des animaux",
				],
			},
		},

	'les activités produisant des sous-produits pouvant être utilisés comme aliments pour animaux sans subir de traitement particulier, comme les oléagineux (cf. 10.41), les résidus de la minoterie (cf. 10.61)':
		{
			'10.41': {
				contenuCentral: [
					'les activités produisant des sous-produits pouvant être utilisés comme aliments pour animaux sans subir de traitement particulier comme les oléagineux',
				],
			},
			'10.61': {
				contenuCentral: [
					'les activités produisant des sous-produits pouvant être utilisés comme aliments pour animaux sans subir de traitement particulier comme les résidus de la minoterie',
				],
			},
		},

	"la fabrication d'apéritifs à base de vins (cf. 11.02B) et de vermouths (cf. 11.04Z)":
		{
			'11.02B': {
				contenuCentral: ["la fabrication d'apéritifs à base de vins"],
			},
			'11.04Z': {
				contenuCentral: ["la fabrication d'apéritifs à base de vermouths"],
			},
		},

	"l'embouteillage et l'étiquetage simples dans le cadre du commerce de gros (cf. 46.34Z) et pour compte de tiers (cf. 82.92Z)":
		{
			'46.34Z': {
				contenuCentral: [
					"l'embouteillage et l'étiquetage simples dans le cadre du commerce de gros",
				],
			},
			'82.92Z': {
				contenuCentral: [
					"l'embouteillage et l'étiquetage simples pour compte de tiers",
				],
			},
		},

	"la fabrication d'apéritifs à base de vins (cf. 11.02B) et de vins aromatisés (cf. 11.04Z)":
		{
			'11.02B': {
				contenuCentral: ["la fabrication d'apéritifs à base de vins"],
			},
			'11.04Z': {
				contenuCentral: [
					"la fabrication d'apéritifs à base de vins aromatisés",
				],
			},
		},

	'la fabrication de levures (cf. 10.89Z) ou de malt (cf. 11.06Z)': {
		'10.89Z': { contenuCentral: ['la fabrication de levures'] },
		'11.06Z': { contenuCentral: ['la fabrication de malt'] },
	},

	'la fabrication de vêtements en cuir (cf. 14.11Z), de gants en cuir (cf. 14.19Z) ou de chaussures en cuir (cf. 15.20Z)':
		{
			'14.11Z': { contenuCentral: ['la fabrication de vêtements en cuir'] },
			'14.19Z': { contenuCentral: ['la fabrication de gants en cuir'] },
			'15.20Z': { contenuCentral: ['la fabrication de chaussures en cuir'] },
		},

	'la fabrication de bracelets de montre en métaux précieux (cf. 32.12Z) ou ordinaires (cf. 32.13Z)':
		{
			'32.12Z': {
				contenuCentral: [
					'la fabrication de bracelets de montre en métaux précieux',
				],
			},
			'32.13Z': {
				contenuCentral: [
					'la fabrication de bracelets de montre en métaux ordinaires',
				],
			},
		},

	'la fabrication de parties de chaussures en bois (cf. 16.29Z), en caoutchouc (cf. 22.19Z) ou en plastique (cf. 22.29B)':
		{
			'16.29Z': {
				contenuCentral: ['la fabrication de parties de chaussures en bois'],
			},
			'22.19Z': {
				contenuCentral: [
					'la fabrication de parties de chaussures en caoutchouc',
				],
			},
			'22.29B': {
				contenuCentral: [
					'la fabrication de parties de chaussures en plastique',
				],
			},
		},

	"la fabrication d'isolateurs et pièces isolantes en verre (cf. 23.19Z) ou en autres matières (cf. 27.90Z)":
		{
			'23.19Z': {
				contenuCentral: [
					"la fabrication d'isolateurs et pièces isolantes en verre",
				],
			},
			'27.90Z': {
				contenuCentral: [
					"la fabrication d'isolateurs et pièces isolantes en matières autres que le verre",
				],
			},
		},

	'la fabrication de chauffe-eau électriques (cf. 27.51Z) ou à gaz (cf. 27.52Z)':
		{
			'27.51Z': {
				contenuCentral: ['la fabrication de chauffe-eau électriques'],
			},
			'27.52Z': { contenuCentral: ['la fabrication de chauffe-eau à gaz'] },
		},

	"l'implantation des armements sur bâtiments de guerre (cf. 30.11Z) et avions de combat (cf. 30.30Z)":
		{
			'30.11Z': {
				contenuCentral: [
					"l'implantation des armements sur bâtiments de guerre",
				],
			},
			'30.30Z': {
				contenuCentral: ["l'implantation des armements sur avions de combat"],
			},
		},

	"la fabrication de voiles (cf. 13.92Z) la fabrication d'ancres en fonte ou en acier (cf. 25.99B) la fabrication de moteurs pour navires et bateaux (cf. 28.11Z) la fabrication de planches à voile et de planches de surf (cf. 32.30Z)":
		{
			'13.92Z': { contenuCentral: ['la fabrication de voiles'] },
			'25.99B': {
				contenuCentral: ["la fabrication d'ancres en fonte ou en acier"],
			},
			'28.11Z': {
				contenuCentral: ['la fabrication de moteurs pour navires et bateaux'],
			},
			'32.30Z': {
				contenuCentral: [
					'la fabrication de planches à voile et de planches de surf',
				],
			},
		},

	"la promotion immobilière de logements collectifs (cf. 41.10A), de bureaux (cf. 41.10B) et d'autres bâtiments (cf. 41.10C)":
		{
			'41.10A': {
				contenuCentral: ['la promotion immobilière de logements collectifs'],
			},
			'41.10B': { contenuCentral: ['la promotion immobilière de bureaux'] },
			'41.10C': {
				contenuCentral: [
					'la promotion immobilière de bâtiments autres que logements collectifs ou bureaux',
				],
			},
		},

	'la transformation du sang (cf. 21.10Z) et la fabrication de sérums thérapeutiques et autres constituants du sang (cf. 21.20Z)':
		{
			'21.10Z': { contenuCentral: ['la transformation du sang'] },
			'21.20Z': {
				contenuCentral: [
					'la fabrication de sérums thérapeutiques et autres constituants du sang',
				],
			},
		},

	"l'accueil de jour de jeunes enfants par des crèches et garderies d'enfants (cf. 88.91A) ou des centres de jour pour enfants et jeunes handicapés (cf. 88.91B)":
		{
			'88.91A': {
				contenuCentral: [
					"l'accueil de jour de jeunes enfants par des crèches et garderies d'enfants",
				],
			},
			'88.91B': {
				contenuCentral: [
					"l'accueil par des centres de jour pour enfants et jeunes handicapés",
				],
			},
		},
}
