import {User} from "../entity/user";
import {JobOffer} from "../entity/jobOffer";
import faker from 'faker';

export async function devSeed() {
    if (process.env.NODE_ENV !== 'development') {
        throw Error("Trying to seed dev into non dev db!")
    }

    if ((await JobOffer.count()) === 0) {
        for (let i = 0; i < 10; i++) {
            const offer = JobOffer.create({
                payment: 1,
                description: faker.lorem.words(50),
                geoHash: '',
                from: 60*15,
                to: 60*17+30,
                image: faker.image.technics(),
                categories: [1, 2],
                workdays: [0, 1, 4],
                requirements: []
            });
            await offer.save();
        }
    }

}
