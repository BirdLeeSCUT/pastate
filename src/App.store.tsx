import { XStore, XType, XString } from './services/redux-xstore';

interface State extends XType {
    name: string,
    age: number,
    isMale: boolean,
    pets: Array<{
        name: string,
        age: number,
        isDog: boolean
    }>,
    address: {
        province: string,
        city: string,
        homeInfo: {
            isRend: {
                value: boolean
            }
        }
    }
}

class MyStore extends XStore<State>{

    actions = {
        setup: () => {
            this.update(this.state.age, a => a + 2)
        },
        change: () => {
            this.update(this.state.isMale, v => v == false)
        }
    }
}



let store = new MyStore({
    name: 'Peter',
    age: 10,
    isMale: true,
    pets: [
        {
            name: 'Puppy',
            age: 1,
            isDog: true
        }
    ],
    address: {
        province: 'GD',
        city: 'GZ',
        homeInfo: {
            isRend: {
                value: true
            }
        }
    }
});

export { State, store}