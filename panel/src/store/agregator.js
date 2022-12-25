import { defineStore } from 'pinia';
import axios from 'axios';

export const useAgregatorStore = defineStore('agregators', {
    state: () => ({
        register: [],
        count: 0,
    }),
    actions:{
        addItem(item){
            if (this.register.at(-1).config != item){
                this.register.push({config: item, id: this.count++})
            }
        },
        async deleteItem(itemId) {
            let item = self.register[itemId].config

            let resp = await axios.post(`http://${item.ip}:${item.port}/stop`)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.warn(error)
            });
            // fetch(`http://${item.ip}:${item.port}/stop`, {method: 'POST', redirect: 'follow',})
            // .then(response => response.text())
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
            
            if (resp.status === 200){
                this.register = this.register.filter((object) => {
                    return object.id != itemId;
                });
            }
        }
    }
})
