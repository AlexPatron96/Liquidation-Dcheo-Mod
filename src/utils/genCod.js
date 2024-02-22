
import date from "./date"; 

const genCod = (data) => {

    let mapa = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        codigo = data,
        i = 0;

    for (i; i < 3; i++) {
        codigo += mapa.charAt(Math.floor(Math.random() * mapa.length));
    }
    return codigo+'-'+date.Currendate();
}

export default genCod;