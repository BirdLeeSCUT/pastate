import { XStore, XType } from './index';

interface PeopleState extends XType {
    name: string,
    age: number,
    isMale: boolean,
    workInfo: {
        company: string
        job: string,
        salary: number,
        address: {
            province: string,
            city: string
        },
    },
    pets: [
        {
            name: string,
            animal: string,
            age: number
        }
    ]
}

class PeopleStore extends XStore<PeopleState>{

    initState: PeopleState = {
        name: 'Peter',
        age: 24,
        isMale: true,
        workInfo: {
            company: 'Tencent',
            job: 'developer',
            salary: 15000,
            address: {
                province: 'Guangdong',
                city: 'Shenzhen'
            }
        },
        pets: [
            {
                name: 'Kitty',
                animal: 'cat',
                age: 2
            },
            {
                name: 'Puppy',
                animal: 'dog',
                age: 1
            }
        ]
    };

}

