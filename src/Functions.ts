// LISTA DE CONSTANTES/FUNCIONES DE PRUEBA
export const functions = {
    // Constantes matemáticas
    pi: Math.PI,
    e: Math.E,

    // Funciones por partes
    abs: x => {
        return Math.abs(x);
    },
    sign: x => {
        if(x != 0) {
            return Math.abs(x)/x;
        }
        else return 0;
    },

    // Aproximaciones
    floor: x => {
        return Math.floor(x);
    },
    ceil: x => {
        return Math.ceil(x);
    },
    round: x => {
        return Math.round(x);
    },

    // Trigonometría
    sin: x => {
        return Math.sin(x);
    },
    cos: x => {
        return Math.cos(x);
    },
    tan: x => {
        return Math.tan(x);
    },

    // Logaritmos
    ln: x => {
        return Math.log(x);
    },
    log2: x => {
        return Math.log(x)/Math.log(2);
    },
    log10: x => {
        return Math.log(x)/Math.log(10);
    },
    log: (x,a) => {
        return Math.log(a)/Math.log(x);
    },

    // Aleatoriedad
    rand: x => {
        return Math.random() * x;
    },
    randint: x => {
        return Math.floor(Math.random() * x);
    },
    choose: (x, y) => {
        if(Math.random() >= 0.5)
            return x;
        else
            return y;
    }
}