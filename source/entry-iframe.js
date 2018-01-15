// Get the "couleur" parameter passed to this script
let script = document.getElementById('script-simulateur-embauche'),
	couleur = script.dataset['couleur'].replace('#', ''),
	src = script.getAttribute('src')

document.write(`
<iframe id="simulateurEmbauche" src="${
	src.split('dist')[0]
}iframe.html?couleur=${couleur}" style="border: none; width: 60em; display: block; margin: 0 auto; height: 45em" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>
`)
