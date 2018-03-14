import { XStore, XType } from '../../pastate/pastore';
import { ChangeEvent } from 'react';
import { syncActions, dispalyActionNamesInReduxTool } from '../../pastate'

interface State extends XType {
    basicInfo: {
        name: string,
        age: number,
        isMale: boolean
    },
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
    basicInfo: {
        name: 'Peter',
        age: 10,
        isMale: true,
    },
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
    actionMiddlewares = [dispalyActionNamesInReduxTool(false)]
    actions = {

        setup: () => {
            // this.update(this.state.age, a => a + 1)
            this.state.basicInfo.age += 1;
        },

        change: () => {
            // this.update(this.state.isMale, v => v == false)
            this.state.basicInfo.isMale = !this.state.basicInfo.isMale
        },

        addPet: () => {
            this.state.pets.push({
                name: 'Kitty',
                age: 2,
                isDog: false
            })
        },

        addPetBefore: () => {
            this.state.pets.unshift({
                name: 'Kitty',
                age: 2,
                isDog: false
            })
        },

        popPet: () => {
            this.state.pets.pop()
        },

        addFirstAge: () => {
            this.state.pets[0].age += 1
        },

        doFourActions: () => {
            this.state.pets.push({
                name: 'Kitty',
                age: 2,
                isDog: false
            })
            this.state.basicInfo.age += 1;
            this.state.basicInfo.isMale = !this.state.basicInfo.isMale
        },

        onTextChange: (v: ChangeEvent<any>) => {
            console.log(v)
        },

        mutations: {
            longName: () => {
                this.state.basicInfo.name += "!"
            }
        }
    }
}


let store = new Store(initState, {
    useSpanNumber: true
});

export { State, store }