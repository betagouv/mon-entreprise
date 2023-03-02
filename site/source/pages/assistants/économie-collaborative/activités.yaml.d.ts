declare const _default: readonly [{
    readonly titre: "Location meublée";
    readonly icônes: "🏠 🛋";
    readonly explication: "Vous avez loué un logement meublé pour de courtes durées à une clientèle de passage qui n'y élit pas domicile.";
    readonly plateformes: readonly ["Airbnb", "Abritel", "chambre d'hôte", "tourisme classé"];
    readonly activités: readonly [{
        readonly titre: "Location meublée de courte durée";
        readonly icônes: "🏠 🛋";
        readonly explication: "Vous avez loué un logement meublé pour de courtes durées à une clientèle de passage qui n'y élit pas domicile (hors chambre d’hôte ou meublé de tourisme)";
        readonly plateformes: readonly ["Airbnb", "Abritel", "Booking"];
        readonly "seuil pro": 23000;
        readonly "seuil r\u00E9gime g\u00E9n\u00E9ral": 72600;
        readonly "exon\u00E9r\u00E9e si": readonly [{
            readonly titre: "Je loue une pièce de ma résidence principale et gagne moins de 760€ par an\n";
            readonly explication: "Les locations saisonnières d’une ou plusieurs pièces de sa résidence\nprincipale qui n’excèdent pas 760 € par an sont exonérées et ne sont\npas à déclarer à l’impôt sur le revenu. Au-delà de ce montant, les\nrevenus doivent être déclarés à l’impôt sur le revenu.\n";
        }, {
            readonly titre: "Je loue une pièce de ma résidence principale à une personne dont\nc'est la résidence principale ou temporaire avec un loyer raisonnable\n";
            readonly explication: "Vous louez une ou plusieurs pièces de votre habitation\nprincipale : vous êtes exonéré d'impôt sous réserve que la ou les\npièces louée(s) constituent la résidence principale du locataire ou\nsa résidence temporaire. Pour bénéficier de cette dernière\ncondition, le locataire doit pouvoir justifier d'un contrat de\ntravail saisonnier ou d'un CDD d'usage. Pour les baux conclus en\n2020, le loyer annuel ne doit pas dépasser 190 € par mètre\ncarré en Île-de-France et 140 € par mètre carré dans les\nautres régions.\n> Vous louez à Marseille, dans votre résidence principale, une chambre\nde 18 m² à un étudiant. Pour être exonéré d'impôt, le loyer mensuel\nhors charges ne doit pas dépasser en 2019 (190 x 18) / 12 = 210 €.\n";
        }];
    }, {
        readonly titre: "Location meublée de longue durée";
        readonly icônes: "🏠 📆";
        readonly explication: "Vous avez loué un logement meublé sur une longue durée";
        readonly plateformes: readonly ["Leboncoin", "pap.fr", "agences immobilières"];
        readonly "seuil pro": 23000;
        readonly "exon\u00E9r\u00E9e si": readonly [{
            readonly titre: "Je loue une pièce de ma résidence principale à une personne dont\nc'est la résidence principale ou temporaire avec un loyer raisonnable\n";
            readonly explication: "Vous louez une ou plusieurs pièces de votre habitation\nprincipale : vous êtes exonéré d'impôt sous réserve que la ou les\npièces louée(s) constituent la résidence principale du locataire ou\nsa résidence temporaire. Pour bénéficier de cette dernière\ncondition, le locataire doit pouvoir justifier d'un contrat de\ntravail saisonnier ou d'un CDD d'usage. Pour les baux conclus en\n2020, le loyer annuel ne doit pas dépasser 190 € par mètre\ncarré en Île-de-France et 140 € par mètre carré dans les\nautres régions.\n> Vous louez à Marseille, dans votre résidence principale, une chambre\nde 18 m² à un étudiant. Pour être exonéré d'impôt, le loyer mensuel\nhors charges ne doit pas dépasser en 2019 (190 x 18) / 12 = 210 €.\n";
        }];
    }, {
        readonly titre: "Location meublée de tourisme classé";
        readonly explication: "Le bien doit avoir préalablement fait l’objet d’une déclaration auprès de la commune où il est situé. A l’issue de cette procédure, un numéro de déclaration (13 caractères) est délivré. Tout changement fait l'objet d'une nouvelle déclaration.";
        readonly icônes: "🏠 ⭐";
        readonly plateformes: readonly ["Airbnb", "Abritel", "Booking"];
        readonly "seuil pro": 23000;
        readonly "seuil r\u00E9gime g\u00E9n\u00E9ral": 72600;
    }, {
        readonly titre: "Location de chambre d'hôtes";
        readonly explication: "Vous êtes loueur de chambres d’hôtes et remplissez les conditions prévues par le code du tourisme";
        readonly plateformes: readonly ["Gîtes de France"];
        readonly icônes: "🏠 🧑";
        readonly "seuil pro": 5348;
        readonly "seuil d\u00E9claration": 760;
    }];
}, {
    readonly titre: "Location de biens";
    readonly icônes: "🔑 🚗 🔧 🌱";
    readonly explication: "Vous mettez en location certains de vos biens, tels que voiture, matériel de jardinage, outils de bricolage, accessoires de luxe, vêtements...";
    readonly "seuil pro": 8227;
    readonly "seuil r\u00E9gime g\u00E9n\u00E9ral": 72600;
    readonly plateformes: readonly ["Drivy", "outils de jardinage, bricolage..."];
}, {
    readonly titre: "Services";
    readonly icônes: "🚴 👩‍🔧 👨‍💻 💇";
    readonly plateformes: readonly ["Deliveroo", "Uber", "Malt", "plateformes de jobbing (Youpijob, Frizbiz)"];
    readonly "seuil pro": 0;
    readonly explication: "Vous proposez contre rémunération un service pour une entreprise ou un particulier (exemple : livraison à vélo, création de site, petits travaux, garde d'enfants, cours à domicile, ménage, coaching, jardinage, garde d'animaux, coiffure, déménagement, massages)\n";
}, {
    readonly titre: "Vente de biens";
    readonly explication: "Vous vendez des biens matériels, d'occasion ou neuf, fabriqués ou récupérés.";
    readonly icônes: "📦 🧶 🕹 🧳";
    readonly plateformes: readonly ["Leboncoin", "eBay", "Etsy..."];
    readonly activités: readonly [{
        readonly titre: "Vente de biens occasionnelle";
        readonly icônes: "🧳 🕹 🧸 📺";
        readonly plateformes: readonly ["Leboncoin", "eBay"];
        readonly explication: "Vous vendez de façon occasionnelle des biens que vous ne souhaitez plus conserver, dans le cadre de la gestion de votre patrimoine privé.";
        readonly "seuil d\u00E9claration": 0;
        readonly "exon\u00E9r\u00E9e sauf si": readonly [{
            readonly titre: "Vous vendez des métaux précieux (pièces en or, argent, lingots)";
            readonly explication: "Pour la cession de métaux précieux, vous êtes soumis à la taxe forfaitaire sur les métaux précieux dont vous devez vous acquitter dans le mois de la cession.";
        }];
    }, {
        readonly titre: "Vente de biens professionnelle";
        readonly icônes: "📦 🧶 🛍️ 🧴";
        readonly "seuil pro": 0;
        readonly explication: "Lorsque vous vendez des biens que vous avez achetés ou que vous avez fabriqués **en vue de les revendre** (exemple: vous réalisez des bijoux, des objets de décoration…).\n";
        readonly plateformes: readonly ["Etsy", "Amazon"];
    }];
}, {
    readonly titre: "Co-consommation";
    readonly icônes: "👥 🚗";
    readonly "seuil pro": 0;
    readonly explication: "La co-consommation, c'est par exemple partager les frais de trajet (co-voiturage), de repas, ou encore de sorties.\n";
    readonly plateformes: readonly ["Blablacar"];
    readonly "exon\u00E9r\u00E9e sauf si": readonly [{
        readonly titre: "Les revenus perçus sont supérieurs aux frais (vous gagnez de l'argent)";
        readonly explication: "Les revenus perçus ne doivent pas excéder le montant des coûts directs engagés à l’occasion de la prestation. Ils ne doivent couvrir que les frais supportés à l’occasion du service rendu (hors frais liés à l’acquisition, l’entretien ou l’utilisation personnelle du bien partagé).\n";
    }, {
        readonly titre: "Vous n'incluez pas votre part pour établir le partage des frais";
        readonly explication: "Les revenus que vous réalisez au titre du partage des frais sont perçus dans le cadre d’une « co-consommation », ce qui signifie que vous devez bénéficier également de la prestation de service proposée et que vous devez supporter votre quote-part, au même titre que les personnes avec lesquelles les frais sont partagés.\n\nPar exemple, si un déplacement en voiture coûte 40€ en essence et péage, et que vous avez 3 passagers co-voitureur, vous devez répartir équitablement le partage des frais, 10€ remboursé par chaque passager, et 10€ payé de votre poche.\n";
    }, {
        readonly titre: "Vous dépassez la limite du barème kilométrique (pour les co-voiturages)";
        readonly explication: "Lorsqu’il s’agit de co-voiturage, il existe une troisième condition : le tarif complet ne doit pas excéder le barème kilométrique en vigueur et doit être divisé par le nombre de personnes transportées, le propriétaire de la voiture inclus.\n";
    }];
}];
export default _default;
