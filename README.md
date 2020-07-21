# MathParserJS
Un intérprete de comandos (operaciones aritméticas, funciones y constantes) 
escritos dentro de cadenas de texto.

Puede encontrar un programa de ejemplo en `/src/test.ts`.

# Expresiones
El intérprete soporta las siguientes expresiones:

- Números reales, con o sin signo, parte decimal y con notación exponencial.
    ```
    1
    1.003
    -45.23
    2e5
    10e-13
    ```
- Operaciones aritméticas (`+ - * / % ^`) entre números.
    ```
    1.65+0.0013
    1/2e5
    -5^2
    ```
- Agrupadores.
    ```
    (-5)^2
    6/2*(2+1)
    (1+(3*2-1)^0.5)/2
    ```
- Constantes (ver más abajo).
    ```
    x^2 - y
    e^2
    pi/4 + pi/8
    ```
- Funciones (ver más abajo).
    ```
    1-cos(pi)^2
    sqrt(25)/abs(-5)
    ```

# Instalación
Instale el programa a través de npm:
```
npm install @bygdle/mathparserjs
```

# Importación
Si utiliza TypeScript, importe el módulo de la siguiente forma:
```ts
import {MathParser} from "@bygdle/mathparserjs";
```
Si utiliza JavaScript nativo, importe el módulo de la siguiente forma:
```js
const MathParser = require("@bygdle/mathparserjs").MathParser;
```
Si utiliza el script del lado del cliente, importe el archivo 
`/front/MathParser.js`, como se muestra a continuación:
```html
<script type="text/javascript" src="MathParser.js"></script>
```
se creará automáticamente el objeto global `MathParser`. Puede encontrar 
un programa de ejemplo en `/front/test.html`. 

# Clase Parser
## Constructor `Parser(list)`
```ts
MathParser.Parser(list);
```

**Parámetros:**
- `list`: Un objeto con las constantes/funciones que debe evaluar el 
intérprete, y sus respectivos valores/callbacks.

**Ejemplo**
```ts
const parser = new MathParser.Parser({
    pi: 3.141592,
    sin: x => {
        return Math.sin(x);
    },
    cos: x => {
        return Math.cos(x);
    }
});
```

# Métodos
## `set(str: string)`
Establece la cadena que el intérprete va a evaluar.

**Parámetros:**
- `str`: La cadena de texto a establecer.

**Devuelve:** `Parser` 

La instancia de `Parser` que ejecutó el método.

**Ejemplo:**
```ts
parser.set("4 * (2+ 3)");
let r = parser.execute(); 
console.log(r); // Imprime 20.

//otra forma
let r  = parser.set("1 + 1/2 + 1/4").execute();
console.log(r); // Imprime 1.75
```

## `execute([str: string])`
Evalúa los comandos de la cadena de texto dada y devuelve el valor final.
Si no se especifica el parámetro `str`, se evluará por defecto la cadena
establecida por el método `set()`.

**Parámetros:**
- `str`: La cadena de texto a interpretar.

**Devuelve:** `number` 

El resultado de la evaluación.

**Ejemplo:**
```ts
let r = parser.execute("cos(pi) - 6/2*(2+1)");
console.log(r); // Imprime -10
```

## `repeat(n: number, callback: Function)`
Evalúa una cantidad determinada de veces la cadena de texto 
establecida por `set()`, y después de cada evaluación ejecuta 
el callback proporcionado.

**Parámetros:**
- `n`: el número de veces que se va a evaluar la cadena.
- `callback`: La función que se ejecutará después de cada iteración. 
La llamada tiene la siguiente forma:
    ```ts
    callback(r: number, i: number)
    ```
    Donde `r` es el resultado de la última evaluación realizada, 
    e `i` es el número de la evaluación actual, desde 1 hasta `n`.

**Devuelve:** `Parser`

La instancia de `Parser` que ejecutó el método.

**Ejemplo:**
```ts
let x = 0;
const parser = new MathParser.Parser({x: 0})
.set("x^2")
.repeat(5, function(r: number) {
    console.log(r);
    this.constant("x", ++x);
});
/*
Imprime:
0
1
4
9
16
*/
```

## `constant(name: string, value: number)`
Establece el nuevo valor de una constante del intérprete. 
Si la constante no existe, ésta se creará.

**Parámetros:**
- `name`: El nombre de la constante a editar/crear.
- `value`: El valor numérico de la constante a editar/crear.

**Devuelve:** `Parser`

La instancia de `Parser` que ejecutó el método.

**Ejemplo:**
```ts
const parser = new MathParser.Parser({x: 1, y: 2});
console.log(parser.execute("x + y")) // imprime 3.

parser
.constant("x", 2)
.constant("y", 3)
.constant("z", 4);

console.log(parser.execute("x + y + z")) // imprime 9.
```

## `then(callback: Function)`
Establece una función que se ejecutará después de cada evaluación 
exitosa producida por `execute()` o `repeat()`.

**Parámetros:**
- `callback`: La función que se ejecutará una vez evaluada una cadena. 
La llamada tiene la siguiente forma:
    ```ts
    callback(r: number)
    ```
    Donde `r` es el resultado de la evaluación.

    Si no se pasa nada como parámetro, no se ejecutará nada y 
    la única forma de obtener el resultado de una evaluación 
    será capturando el valor que devuelve directamente `execute()`.

**Devuelve:** `Parser`

La instancia de `Parser` que ejecutó el método.

**Ejemplo:**
```ts
const parser = new MathParser.Parser({x: 2, y: 5})
.then((r: number) => {
    console.log(`Resultado: r=${r}`);
})
.execute("y/x + 1");
/*
Resultado: r=3.5
*/
```

## `catch(callback: Function)`
Establece una función que se ejecutará cuando el intérprete 
encuentre algún error en la evaluación.

**Parámetros:**
- `callback`: La función que se ejecutará cuando suceda algún 
error. La llamada tiene la siguiente forma:
    ```ts
    callback(e: Error)
    ```
    Donde `e` es el error que se ha producido.

    Si no se pasa ninguna función como parámetro, no se ejecutará 
    nada cuando ocurra un error y por tanto no habrá forma de 
    capturar la información correspondiente.

**Devuelve:** `Parser`

La instancia de `Parser` que ejecutó el método.

**Ejemplo:**
```ts
const parser = new MathParser.Parser({x: 1, y: 2})
.catch((e: Error) => {
    console.log(`ERROR! ${e.message}`);
});

parser.execute("x + y"); // devuelve 3.
parser.execute("x + z"); // Imprime un mensaje de error.
```