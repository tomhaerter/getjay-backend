import {User} from "../entity/user";
import {JobOffer} from "../entity/jobOffer";
import faker from 'faker';
import {EmployerInformation} from "../entity/employerInformation";
import shortid from "shortid";

export async function prodSeed() {
    if (process.env.NODE_ENV !== 'production') {
        throw Error("Trying to seed prod into non prod db!")
    }

    if ((await JobOffer.count()) === 0) {
        await createOffer({
            title: "Bauernhof Dahlhoff",
            payment: 9,
            description: "Guten Tag zusammen,<br> durch die Ausbreitung des Corona-Virus und den damit verbunden Restriktion mangelt es uns in diesem Jahr an Erntehelfern. Daher sind wir auf der Suche nach einheimischen Personen, die sich vorstellen können Spargel zu stechen oder Erdbeeren zu pflücken. Je nach Witterungsverlauf startet die Saison Mitte April und endet Ende Juni.<br>Folgende Voraussetzungen sollten gegeben sein:<br>*Körperliche Fitness von Vorteil<br>*Frühes Aufstehen sollte kein Problem darstellen<br>*Flexibilität und Durchhaltevermögen (es gibt auch lange Tage)<br>Neben einer fairen Bezahlung erhalten Sie ein Mittagessen sowie in regelmäßigen Abständen ein Deputat in Form von Spargel und Erdbeeren. Weitere Informationen erhalten Sie auf Anfrage.",
            from: 60 * 6,
            to: 60 * 15,
            imageURI: "https://i.ebayimg.com/00/s/MTA2N1gxNjAw/z/UsIAAOSwl4xed1Qs/$_57.JPG"
        });

        await createOffer({
            title: "SalService",
            payment: 30,
            description: "Auch in Zeiten der Krise muss der wirtschaftliche Motor weiterlaufen. Wir möchten allen Personen die in einer wirtschaftlicher Form darunter leiden, so gut es geht helfen und dazu Beitragen, dass die Krise gut überstanden wird.<br>Das bieten wir:<br>*Potentiellen Ausweg aus der Krise mit einem neuen Job<br>*Übertarifliche Bezahlung nach Tariflohn der IGZ<br>*Zahlung von Weihnachts- und Urlaubsgeld<br>*Zuschläge für Sonn- und Feiertage<br>*Persönliche Ansprechpartner<br>*Und vieles mehr...<br>Weitere Informationen zu benötigten Qualifikationen erhalten Sie auf Anfrage",
            from: 60 * 8,
            to: 60 * 17,
            imageURI: "https://images.pexels.com/photos/3952224/pexels-photo-3952224.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        });

        await createOffer({
            title: "Alpenland Pflege- und Altenheim",
            payment: 20,
            description: "Das Alpenland Pflege- und Altenheim bietet alten Menschen qualifizierte Pflege und Begleitung in 28 Häusern an. Für die Umsetzung des neuen Pflegepersonalstärkungsgesetzes (PpSG) und unserer modernen, bewohnerorientierten Konzepte suchen wir für unser Caritas-Altenheim St. Anna Haus in Holzkirchen zum nächstmöglichen Termin<br>Sie sind im interdisziplinären Team verantwortlich für:<br>*Begleitung der Bewohner/innen in ihrer individuellen Lebens- und Alltagsgestaltung entsprechend den jeweiligen Wünschen und Bedarfen<br> *Unterstützung in der Gestaltung des privaten Umfeldes wie Wohnlichkeit, Aufräumarbeiten Pflege, Wäsche und Reinigung<br>*Service und Moderation bei den Mahlzeiten<br>*Ergänzendes Zubereiten von Mahlzeitenkomponenten gemeinsam mit den Bewohner/innen als tagesstrukturierende Angebote<br> *Durchführung von grundpflegerischen Maßnahmen<br>*kooperatives und kundenorientiertes Handeln",
            from: 60 * 13,
            to: 60 * 21,
            imageURI: "https://images.pexels.com/photos/45842/clasped-hands-comfort-hands-people-45842.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        });

        await createOffer({
            title: "Lidl",
            payment: 12.5,
            description: "Bei Lidl im Verkauf arbeiten heißt: jeden Tag für zufriedene Kunden sorgen. Dabei alles geben und immer besser werden. Weiterkommen als woanders. Weil bei uns jeder zählt und wir uns gegenseitig etwas zutrauen. Gemeinsam anpacken, zupacken und immer noch was draufpacken. Und dafür fair bezahlt werden.<br> Deine Aufgaben:<br> *Mit einem Lächeln im Gesicht packst du tatkräftig mit an und unterstützt dein Team bei der täglichen Warenverräumung<br> * Du unterstützt unsere Mitarbeiter stundenweise, hauptsächlich in den Morgen- oder Abendstunden, bei der Bereitstellung frischer Ware und sorgst so für ein gepflgtes Filialbild <br> * Damit leistest du einen entscheidenden Beitrag für ein rundum angenehmes Einkaufserlebnis unserer Kunden<br> *Wir bieten dir ein sicheres, festes Einkommen von mindestens 12,50 €/Stunde",
            from: 60 * 5,
            to: 60 * 8,
            imageURI: "https://images.pexels.com/photos/3687999/pexels-photo-3687999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        });

        await createOffer({
                title: "U.K.A. Facility Service GmbH",
                payment: 15.5,
                description: "Ich suche einen Mitarbeiter Gartenbau (m/w/d) zur Unterstützung für die Betreuung von Gartenarbeiten, Mithilfe von Umsetzen von Gartenbauprojekten für Wohngebäude und Bürogebäude. Handwerkliche Kenntnisse sind von Vorteil, aber keine Bedingung, kann angelernt werden.<br>Gärtnerische Tätigkeiten müssen in bestehenden Objekten übernommen werden (Heckenschnitt,Rasen mähen, Anpflanzungen etc.)<br>*Führerschein Klasse 3 oder B erwünscht.<br>*Gute Deutschkenntnisse sind wünschenswert<br>Weitere Informationen erhalten Sie auf Anfrage",
                from: 60 * 7 + 30,
                to: 60 * 15,
                imageURI: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            }
        )
    }
}

interface ITemplate {
    title: string,
    payment: number,
    description: string,
    from: number,
    to: number,
    imageURI: string
}

async function createOffer(template: ITemplate) {
    const employerInformation = new EmployerInformation();
    await employerInformation.save();
    const employer = new User();
    Object.assign(employer, {
        id: shortid(),
        employerInformation: employerInformation,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        bookmarkedJobOffers: [],
    });
    await employer.save();

    const offer = JobOffer.create({
        title: template.title,
        payment: template.payment,
        employerId: employer.id,
        description: template.description,
        geoHash: '',
        from: template.from,
        to: template.to,
        imageURI: template.imageURI,
        categories: [1, 2],
        workdays: [0, 1, 4],
        requirements: []
    });
    await offer.save();
}
