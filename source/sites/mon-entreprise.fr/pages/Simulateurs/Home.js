import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default function Simulateurs() {
    const sitePaths = useContext(SitePathsContext)
    return (
        <>


            <section className="ui__ full-width light-bg center-flex">
                <h1 css='min-width: 100%; text-align: center'>Simulateurs disponibles</h1>
                <Link
                    className="ui__ interactive card box"
                    to={{
                        state: { fromSimulateurs: true },
                        pathname: sitePaths.simulateurs['assimilé-salarié']
                    }}>
                    <div className="ui__ big box-icon">{emoji('☂️')}</div>
                    <h3>Assimilé salarié</h3>
                    <p className="ui__ notice" css="flex: 1">
                        Calculer le revenu d'un dirigeant de SAS, SASU ou SARL minoritaire
					</p>
                </Link>
                <Link
                    className="ui__ interactive card box"
                    to={{
                        state: { fromSimulateurs: true },
                        pathname: sitePaths.simulateurs.indépendant
                    }}>
                    <div className="ui__ big box-icon">{emoji('🃏')}</div>
                    <h3>Indépendant</h3>
                    <p className="ui__ notice" css="flex: 1">
                        Calculer le revenu d'un dirigeant de EURL, EI, ou SARL majoritaire
					</p>
                </Link>
                <Link
                    className="ui__ interactive card box"
                    to={{
                        state: { fromSimulateurs: true },
                        pathname: sitePaths.simulateurs['auto-entrepreneur']
                    }}>
                    <div className="ui__ big box-icon">{emoji('🧢')}</div>
                    <h3>Auto-entrepreneur</h3>
                    <p className="ui__ notice" css="flex: 1">
                        Calculer le revenu (ou le chiffre d'affaires) d'un auto-entrepreneur
					</p>
                </Link>
                <Link
                    className="ui__ interactive card box"
                    to={{
                        state: { fromSimulateurs: true },
                        pathname: sitePaths.simulateurs.salarié
                    }}>
                    <div className="ui__ big box-icon">{emoji('🤝')}</div>
                    <h3>Salarié</h3>
                    <p className="ui__ notice" css="flex: 1">
                        Calculer le salaire net, brut, ou total d'un salarié, stagiaire, ou
                        assimilé
					</p>
                </Link>
                <Link
                    className="ui__ interactive card box"
                    to={{
                        state: { fromSimulateurs: true },
                        pathname: sitePaths.simulateurs.comparaison
                    }}>
                    <div className="ui__ big box-icon">{emoji('📊')}</div>
                    <h3>Comparaison statuts</h3>
                    <p className="ui__ notice" css="flex: 1">
                        Simulez les différences entre les régimes (cotisations, retraite, maternité, maladie, etc.)
					</p>
                </Link>

            </section>
            <section>

                <p>
                    Tous les simulateurs sur ce site sont :
            </p>
                <ul>
                    <li><strong>Maintenus à jour</strong> avec les dernières legislation</li>
                    <li><strong>Améliorés en continu</strong> afin d'augmenter le nombre de dispositifs pris en compte (actuellement 320)</li>
                    <li>Développés en <strong>partenariat avec l'Urssaf</strong></li>
                </ul>
            </section>
        </>
    )
}
