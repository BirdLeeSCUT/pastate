import { XStore, XType } from '../../services/redux-xstore';
import { ChangeEvent } from 'react';

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

let initState = {
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
}

class Store extends XStore<State>{
    name = 'App'
    actions = {

        setup: () => {
            // this.update(this.state.age, a => a + 1)
            this.rstate.age += 2;
        },

        change: () => {
            // this.update(this.state.isMale, v => v == false)
            this.rstate.isMale = !this.rstate.isMale
        },

        addPet: () => {
            this.update(this.state.pets, p => [
                ...p,
                {
                    name: 'Kitty',
                    age: 2,
                    isDog: false
                }
            ])
        },

        addFirstAge: () => {
            this.update(this.state.pets[0].age, a => a + 1)
            // this.update(this.state.)
            // this.state.pets[0].age += 1
        },

        doFourActions: () => {
            this.actions.setup();
            this.actions.change();
            this.actions.addPet();
            this.actions.addFirstAge();
        },

        onTextChange: (v: ChangeEvent<any>) => {
            console.log(v)
        }
    }
}


let store = new Store(initState, {
    useSpanNumber: true
});
export { State, store }