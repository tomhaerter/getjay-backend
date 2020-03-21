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
                name: faker.name.firstName(),
                email: faker.internet.email(),
                bookmarkedJobOffers: [],
            });
            await employer.save();

            const offer = JobOffer.create({
                payment: 1,
                employerId: employer.id,
                description: faker.lorem.words(50),
                geoHash: '',
                from: 60*15,
                to: 60*17+30,
                imageURI: faker.image.technics(),
                categories: [1, 2],
                workdays: [0, 1, 4],
                requirements: []
            });
            await offer.save();
        }
    }

    if (await EmployerInformation.count() === 0) {

    }

}