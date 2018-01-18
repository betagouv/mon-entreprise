// Get the "couleur" parameter passed to this script
let script = document.getElementById('script-simulateur-embauche'),
	couleur = script.dataset['couleur'],
	src = script.getAttribute('src'),
	integratorUrl = encodeURIComponent(window.location.href.toString())

document.write(`
<iframe id="simulateurEmbauche" src="${
	src.split('dist')[0]
}?couleur=${couleur}&iframe&integratorUrl=${integratorUrl}" style="border: none; width: 100%; display: block; margin: 0 auto; height: 45em" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>
`)
