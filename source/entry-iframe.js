// Get the "couleur" parameter passed to this script
let script = document.getElementById('script-simulateur-embauche'),
	couleur = script.dataset['couleur'].replace('#', ''),
	src = script.getAttribute('src')

document.write(`
<iframe id="simulateurEmbauche" src="${
	src.split('dist')[0]
}iframe.html?couleur=${couleur}" style="border: none; width: 100%" scrolling="no"></iframe>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.15/iframeResizer.min.js"></script>
<script type="text/javascript">iFrameResize(null, '#simulateurEmbauche')</script>
`)
