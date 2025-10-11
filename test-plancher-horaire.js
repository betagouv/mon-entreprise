import Engine from 'publicodes'
import rules from './modele-social/dist/index.js'

// Test pour vérifier que le plancher horaire a bien été mis à jour
console.log('Test du plancher horaire de l\'activité partielle')
console.log('======================================================')

const engine = new Engine(rules)

// Test avec la nouvelle date (décembre 2024)
engine.setSituation({
  'date': '12/2024'
})
const resultatDecembre2024 = engine.evaluate('salarié . activité partielle . indemnisation entreprise . plancher horaire')

console.log('Plancher horaire à partir de décembre 2024:', resultatDecembre2024.nodeValue, '€/heure')

// Test avec l'ancienne date (mai 2023)
engine.setSituation({
  'date': '05/2023'
})
const resultatMai2023 = engine.evaluate('salarié . activité partielle . indemnisation entreprise . plancher horaire')

console.log('Plancher horaire en mai 2023:', resultatMai2023.nodeValue, '€/heure')

// Vérification
if (resultatDecembre2024.nodeValue === 8.46) {
  console.log('✅ SUCCESS: Le taux de 8,46€ est bien en vigueur à partir de décembre 2024')
} else {
  console.log('❌ ERREUR: Le taux attendu était 8,46€, mais on obtient:', resultatDecembre2024.nodeValue)
}

if (resultatMai2023.nodeValue === 8.21) {
  console.log('✅ SUCCESS: L\'ancien taux de 8,21€ est encore en vigueur en mai 2023')
} else {
  console.log('❌ ERREUR: L\'ancien taux attendu était 8,21€, mais on obtient:', resultatMai2023.nodeValue)
}