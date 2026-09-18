// Translations of the existing Amikon shipping service page, not legal-document translations.
// Keep the merchant-confirmed free-shipping conditions together: EUR 100 AND <= 10 kg.
import type { ShippingTranslation } from './shipping.types';

export const shippingTranslations: Record<string, ShippingTranslation> = {
  fr: {
    title: 'Livraison et retrait',
    freeShipping:
      'Livraison gratuite par colis UPS en Allemagne pour une commande de 100 € minimum ET un colis de 10 kg maximum. Hors marchandises encombrantes, transport de fret et livraison internationale.',
    sections: [
      {
        title: 'Emballage et transport',
        text: 'Nous emballons nos articles avec soin. Nos partenaires logistiques comprennent UPS, Häberle, Nosta et Schrudde. Vous pouvez également mandater votre propre transporteur ; veuillez convenir du retrait avec nous au préalable.',
      },
      {
        title: 'Colis et livraison express',
        text: 'Les colis sont expédiés par UPS Standard ou UPS Express Saver. Le service adapté dépend des dimensions, du poids et de la fragilité de l’article.',
      },
      {
        title: 'Fret et livraison internationale',
        text: 'Nous expédions dans le monde entier. Les frais de transport dépendent de l’envoi et de sa destination et font l’objet d’un devis individuel. Des droits et frais d’importation supplémentaires peuvent s’appliquer aux livraisons internationales.',
      },
      {
        title: 'Retrait à Borken',
        text: 'Le retrait est gratuit et nécessite un rendez-vous par téléphone ou par e-mail. Notre adresse : Einsteinstr. 8a, 46325 Borken, Allemagne.',
      },
    ],
    paymentTitle: 'Modes de paiement',
    payment:
      'Virement bancaire, PayPal et espèces au retrait. Le paiement sur facture est proposé aux entreprises établies en Allemagne, selon l’offre concernée.',
    question: 'Une question sur les frais de livraison ?',
    quote: 'Contactez-nous pour connaître les frais de livraison de votre article vers la destination souhaitée.',
    contact: 'Nous contacter',
    detailsTitle: 'Informations détaillées sur la livraison',
    details: [
      {
        title: 'Emballage et transporteur de votre choix',
        text: 'Nous emballons les articles avec soin. Vous pouvez mandater votre propre transporteur et utiliser votre compte de transport. Nous ne facturons ni matériaux ni manutention pour un retrait par votre transporteur. Prévenez-nous au préalable afin que nous puissions préparer l’envoi.',
      },
      {
        title: 'UPS Standard en Allemagne',
        text: 'Nous expédions les articles adaptés jusqu’à 50 kg et 120 × 60 × 60 cm par UPS Standard, sauf s’ils sont trop fragiles. Les petits articles sont normalement expédiés par UPS, sauf demande contraire. Les tarifs de colis et délais standard UPS en vigueur s’appliquent.',
      },
      {
        title: 'UPS Express Saver',
        text: 'Express Saver est proposé via notre compte UPS à un coût de livraison supérieur. Nos informations de livraison antérieures indiquent une livraison le jour ouvré suivant en Allemagne ; les délais internationaux peuvent varier. Confirmez avec nous les livraisons urgentes au préalable. Nous ne facturons pas de frais supplémentaires d’emballage ou de main-d’œuvre pour ce service et répercutons les remises disponibles.',
      },
      {
        title: 'Transport de fret',
        text: 'Nous travaillons notamment avec Häberle, Nosta et Schrudde. Nos informations de livraison antérieures donnent, à titre indicatif, un coût de 250 à 350 EUR pour une europalette en Allemagne et un délai habituel de deux à cinq jours. Il ne s’agit pas d’un devis ferme. Demandez le tarif réel pour votre envoi et sa destination. Nous facturons les frais du transporteur.',
      },
      {
        title: 'Livraison en Allemagne',
        text: 'Les frais de livraison dépendent du poids. Nos informations antérieures mentionnent un supplément de 2 EUR pour les îles allemandes. La livraison gratuite s’applique à partir de 100 € de commande ET pour un colis de 10 kg maximum. Les marchandises encombrantes, le fret et les envois internationaux sont exclus. Les articles de plus de 50 kg nécessitent un devis de transport individuel.',
      },
      {
        title: 'Livraison internationale',
        text: 'Nous livrons dans le monde entier. Les colis internationaux sont normalement expédiés par UPS Express Saver jusqu’à 50 kg ; les envois plus lourds nécessitent un autre transporteur. Demandez les prix et délais. Hors UE, des frais de virement, de change, des droits de douane et des taxes d’importation supplémentaires peuvent être à la charge du destinataire.',
      },
      {
        title: 'Retrait sur place',
        text: 'Le retrait est gratuit et nécessite un rendez-vous par téléphone ou par e-mail, si nécessaire avant l’achat. Veuillez tenir compte de nos horaires limités d’accueil du public.',
      },
    ],
    payments: [
      {
        title: 'Commandes nationales et internationales',
        text: 'Pour les livraisons en Allemagne, nous proposons le virement bancaire, le paiement sur facture, les espèces au retrait et PayPal, sauf indication contraire dans la description du produit. Le paiement sur facture est réservé aux entreprises établies en Allemagne. Pour les livraisons internationales : virement bancaire, espèces au retrait et PayPal.',
      },
      {
        title: 'Virement bancaire',
        text: 'Virez le montant de la facture en indiquant la référence de paiement demandée. Les coordonnées bancaires et la référence figurent sur la facture ou sont communiquées séparément par e-mail pendant le traitement de la commande.',
      },
      {
        title: 'Paiement sur facture',
        text: 'Après réception de la facture, virez le montant dans le délai de paiement qui y est indiqué.',
      },
      {
        title: 'Espèces au retrait',
        text: 'Nous vous informons par e-mail lorsque la marchandise est prête. Convenez d’un rendez-vous et payez sur place. Aucun frais de livraison ne s’applique. Adresse de retrait : Amikon GmbH, Einsteinstr. 8a, 46325 Borken, Allemagne.',
      },
      {
        title: 'PayPal',
        text: 'Payez via PayPal à l’aide des informations de paiement enregistrées dans votre compte PayPal.',
      },
    ],
    request: 'Demander les frais de livraison ou un rendez-vous de retrait',
  },
  nl: {
    title: 'Verzending en afhalen',
    freeShipping:
      'Gratis UPS-pakketverzending binnen Duitsland vanaf € 100 bestelwaarde EN tot 10 kg pakketgewicht. Uitgezonderd omvangrijke goederen, vrachtvervoer en internationale verzending.',
    sections: [
      {
        title: 'Verpakking en transport',
        text: 'Wij verpakken onze artikelen zorgvuldig. Onze logistieke partners zijn onder andere UPS, Häberle, Nosta en Schrudde. Je kunt ook een eigen vervoerder inschakelen; stem het afhalen vooraf met ons af.',
      },
      {
        title: 'Pakketten en expreslevering',
        text: 'Pakketten worden verzonden met UPS Standard of UPS Express Saver. De geschikte methode hangt af van de afmetingen, het gewicht en de kwetsbaarheid van het artikel.',
      },
      {
        title: 'Vracht en internationale verzending',
        text: 'Wij verzenden wereldwijd. Vrachtkosten hangen af van de zending en bestemming en worden individueel opgevraagd. Bij internationale leveringen kunnen extra invoerrechten en kosten ontstaan.',
      },
      {
        title: 'Afhalen in Borken',
        text: 'Afhalen is gratis en alleen mogelijk na een telefonische afspraak of afspraak per e-mail. Ons adres: Einsteinstr. 8a, 46325 Borken, Duitsland.',
      },
    ],
    paymentTitle: 'Betaalmethoden',
    payment:
      'Bankoverschrijving, PayPal en contant bij afhalen. Betaling op rekening is beschikbaar voor bedrijven gevestigd in Duitsland, volgens de betreffende aanbieding.',
    question: 'Vragen over verzendkosten?',
    quote: 'Neem contact met ons op voor de verzendkosten van je artikel naar de gewenste bestemming.',
    contact: 'Contact opnemen',
    detailsTitle: 'Uitgebreide verzendinformatie',
    details: [
      {
        title: 'Verpakking en eigen vervoerder',
        text: 'Wij verpakken artikelen zorgvuldig. Je kunt je eigen pakketdienst of vervoerder inschakelen en je eigen verzendaccount gebruiken. Bij afhalen door je vervoerder rekenen wij geen materiaal- of afhandelingskosten. Laat het ons vooraf weten, zodat wij de zending kunnen voorbereiden.',
      },
      {
        title: 'UPS Standard binnen Duitsland',
        text: 'Geschikte artikelen tot 50 kg en 120 × 60 × 60 cm verzenden wij met UPS Standard, tenzij ze te kwetsbaar zijn. Kleine artikelen worden normaal met UPS verzonden, tenzij anders gewenst. De actuele UPS-pakkettarieven en standaardlevertijden gelden.',
      },
      {
        title: 'UPS Express Saver',
        text: 'Express Saver is beschikbaar via ons UPS-account tegen hogere bezorgkosten. Onze eerdere verzendinformatie noemt levering op de volgende werkdag binnen Duitsland; internationale levertijden kunnen afwijken. Stem tijdkritische leveringen vooraf met ons af. Voor deze methode rekenen wij geen extra verpakkings- of arbeidskosten en geven wij beschikbare kortingen door.',
      },
      {
        title: 'Vrachtvervoer',
        text: 'Wij werken onder andere met Häberle, Nosta en Schrudde. Onze eerdere verzendinformatie noemt als indicatie 250 tot 350 EUR voor een europallet binnen Duitsland en doorgaans twee tot vijf dagen transporttijd. Dit is geen bindende offerte. Vraag de werkelijke kosten voor je zending en bestemming op. Wij berekenen de vrachtkosten van de vervoerder.',
      },
      {
        title: 'Verzending binnen Duitsland',
        text: 'De verzendkosten zijn afhankelijk van het gewicht. Onze eerdere informatie noemt een toeslag van 2 EUR voor Duitse eilanden. Gratis verzending geldt vanaf € 100 bestelwaarde EN tot 10 kg pakketgewicht. Omvangrijke goederen, vrachtvervoer en internationale verzending zijn uitgesloten. Voor artikelen boven 50 kg is een individuele vrachtofferte nodig.',
      },
      {
        title: 'Internationale verzending',
        text: 'Wij leveren wereldwijd. Internationale pakketten worden doorgaans met UPS Express Saver verzonden tot 50 kg; zwaardere zendingen hebben een andere vervoerder nodig. Vraag prijzen en levertijden op. Buiten de EU kunnen extra bank-, wisselkoers-, douane- en invoerkosten voor rekening van de ontvanger komen.',
      },
      {
        title: 'Zelf afhalen',
        text: 'Afhalen is gratis en alleen mogelijk na een afspraak per telefoon of e-mail, indien nodig al vóór de aankoop. Houd rekening met onze beperkte openingstijden voor bezoekers.',
      },
    ],
    payments: [
      {
        title: 'Binnenlandse en internationale bestellingen',
        text: 'Voor leveringen binnen Duitsland bieden wij bankoverschrijving, betaling op rekening, contant bij afhalen en PayPal aan, tenzij de productomschrijving anders vermeldt. Betaling op rekening is alleen beschikbaar voor bedrijven gevestigd in Duitsland. Voor internationale leveringen zijn bankoverschrijving, contant bij afhalen en PayPal beschikbaar.',
      },
      {
        title: 'Bankoverschrijving',
        text: 'Maak het factuurbedrag over met het aangegeven betalingskenmerk. De bankgegevens en het betalingskenmerk staan op de factuur of worden tijdens de bestelafhandeling afzonderlijk per e-mail verstrekt.',
      },
      {
        title: 'Betaling op rekening',
        text: 'Maak na ontvangst van de factuur het bedrag over binnen de daarop vermelde betalingstermijn.',
      },
      {
        title: 'Contant bij afhalen',
        text: 'Wij laten per e-mail weten wanneer de goederen klaarstaan. Maak een afhaalafspraak en betaal ter plaatse. Er zijn geen verzendkosten. Afhaaladres: Amikon GmbH, Einsteinstr. 8a, 46325 Borken, Duitsland.',
      },
      { title: 'PayPal', text: 'Betaal via PayPal met de betaalgegevens die in je PayPal-account zijn opgeslagen.' },
    ],
    request: 'Verzendkosten of een afhaalafspraak aanvragen',
  },
};
