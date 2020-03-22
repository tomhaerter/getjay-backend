import {User} from "../entity/user";
import {JobOffer} from "../entity/jobOffer";
import faker from 'faker';
import { EmployerInformation } from "../entity/employerInformation";

export async function prodSeed() {
    if (process.env.NODE_ENV !== 'production') {
        throw Error("Trying to seed prod into non prod db!")
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

            const offer = JobOffer.create({
                payment: 1,
                employerId: employer.id,
                description: faker.lorem.words(50),
                geoHash: '',
                from: 60*15,
                to: 60*17+30,
                imageURI: `https://picsum.photos/${Math.floor(Math.random()*30+100)}/1000/200`,
                categories: [1, 2],
                workdays: [0, 1, 4],
                requirements: []
            });
            await offer.save();
        }
    }
}
