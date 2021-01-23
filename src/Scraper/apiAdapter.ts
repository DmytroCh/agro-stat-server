import axios from 'axios'

export function statApi(){
    return axios.create();
}