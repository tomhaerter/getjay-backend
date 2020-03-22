import {User} from "../entity/user";
import {JobOffer} from "../entity/jobOffer";
import faker from 'faker';
import { EmployerInformation } from "../entity/employerInformation";

export async function devSeed() {
    if (process.env.NODE_ENV !== 'development') {
        throw Error("Trying to seed dev into non dev db!")
    }

    if ((await JobOffer.count()) === 0) {
        for (let i = 0; i < 10; i++) {
            const employerInformation = new EmployerInformation();
            await employerInformation.save();
            const employer = new User();
            Object.assign(employer, {
                id: 'a' + i.toString(),
                employerInformation: employerInformation,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                bookmarkedJobOffers: [],
            });
            await employer.save();
            const from = Math.floor(Math.min(24*60, Math.max(0, 60*24*(Math.random()-0.2))));
            const to = Math.floor(Math.min(24*60, Math.max(0, from + 60*24*Math.random() - 0.5)));
            const offer = JobOffer.create({
                title: faker.company.companyName(),
                payment: 1,
                employerId: employer.id,
                description: faker.lorem.words(50),
                geoHash: '',
                from: from,
                to: to,
                imageURI: `https://picsum.photos/id/${Math.floor(Math.random()*30+100)}/600/300`,
                categories: [1, 2],
                workdays: [0, 1, 4],
                requirements: []
            });
            await offer.save();
        }
    }
}
