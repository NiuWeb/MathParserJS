# MathParserJS
 Un intérprete de comandos (operaciones aritméticas, funciones y constantes) escritos dentro de cadenas de texto.

# Instalación
Descargue y copie en su proyecto el archivo `/src/MathParser.ts` para TypeScript, o el archivo `/built/MathParser.js` para JavaScript Nativo.

# Importación
Si utiliza TypeScript, importe el módulo de la siguiente forma:
```ts
import {MathParser} from "./MathParser";
```
Si utiliza JavaScript nativo, importe el módulo de la siguiente forma:
```js
const MathParser = require("./MathParser").MathParser;
```

# Clase Parser
## Constructor `Parser(list)`
```ts
MathParser.Parser(list);
```

**Parámetros:**
- `list`: Un objeto con las constantes/funciones que debe evaluar el intérprete, y sus respectivos valores/métodos.

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
Establece la cadena que se el intérprete va a ejecutar.

**Parámetros:**
- `str`: La cadena de texto a establecer.

**Devuelve:** `MathParser` La instancia de `MathParser` que ejecutó el método.

**Ejemplo:**
```ts
var r = parser.set("4 * (2+ 3)").execute(); 
console.log(r); // Imprime 20.
```

## `execute([str: string])`
Interpreta los comandos de la cadena de texto dada y devuelve el valor final.
Si no se especifica el parámetro `str`, se ejecutará por defecto la cadena
establecida por el método `set()`.

**Parámetros:**
- `str`: La cadena de texto a interpretar.

**Devuelve:** `number` El resultado de la evaluación.

**Ejemplo:**
```ts
var r = parser.execute("cos(pi) - 6/2*(2+1)");
console.log(r); // Imprime -10
```