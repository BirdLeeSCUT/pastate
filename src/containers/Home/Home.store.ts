import { XStore, XType, XString } from '../../services/redux-xstore';

interface State extends XType {
    name: string
}

let initState = {
    name: 'Peter'
}

class Store extends XStore<State>{

    actions = {
        action: () => {
            // TODO
        }
    }
}

let store = new Store(initState);
export { State, store }