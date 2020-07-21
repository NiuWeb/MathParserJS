export namespace MathParser {
    /**
     * Clase ErrorInfo: Mensajes de error.
     */
    class ErrorInfo {
        /**
         * Devuelve un mensaje de error de sintaxis
         * @param msg La parte de la cadena que contiene el error
         */
        static syntax(msg: string): string {
            return `Sintaxis desconocida (${msg})`;
        }
        /**
         * Devuelve un mensaje de error de referencia
         * @param msg La función o constante que es desconocida
         */       
        static refference(msg: string): string {
            return `Función o constante desconocida (${msg})`;
        }
        /**
         * Devuelve un mensaje de error de parámetros
         * @param func La función con el error.
         * @param num El número de parámetros esperado 
         */
        static argument(func: string, num: number): string {
            return `Número incorrecto de argumentos. ` + 
            `La función ${func} espera exactamente ${num} argumentos.`;
        }
    }
    /**
     * Representa un arreglo de objetos con búsqueda personalizada
     */
    class Searchable<T> {
        public list: Array<T>;
        private caller: Function;
        /**
         * Inicializa el arreglo
         */
        constructor() {
            this.list = new Array<T>();
        }
        /**
         * Define la función de búsqueda para los objetos.
         * @param prop Función de búsqueda: devuelve la propiedad del objeto
         * con la que se debe buscar.
         */
        public test(prop: Function) {
            this.caller = prop;
        }
        /**
         * Busca el objeto cuya propiedad corresponda con el valor dado.
         * @param value El valor a buscar
         */
        public search(value: any) {
            for(let i = 0; i < this.list.length; i++) {
                let item = this.list[i];
                let val  = this.caller(item);
                if(val === value) {
                    return item;
                }
            }
        }
    }
    /**
     * Representa las funciones del intérprete
     */
    class Func {
        private n: string;
        private f: Function;
        /**
         * Inicializa la función
         * @param name Nombre de la función
         * @param func Objeto función
         */
        constructor(name: string, func: Function) {
            this.n = name;
            this.f = func;
        }
        /**
         * Obtiene el nombre de la función
         */
        public get name(): string {
            return this.n;
        }
        /**
         * Obtiene el objeto función
         */
        public get func(): Function {
            return this.f;
        }
        public get count(): number {
            return this.f.length;
        }
    }   
    /**
     * Representa las constantes del intérprete
     */ 
    class Const {
        private n: string;
        private v: number;
        /**
         * 
         * @param name Nombre de la constante
         * @param value Valor de la constante
         */
        constructor(name: string, value: number) {
            this.n = name;
            this.v = value;
        }
        /**
         * Obtiene el nombre de la constante
         */
        public get name(): string {
            return this.n;
        }
        /**
         * Obtiene el valor de la constante
         */
        public get value(): number {
            return this.v;
        }

        /**
         * Establece el valor de la constante
         */
        public set value(value: number) {
            this.v = value;
        }
    }

    /**
     * Intérprete de expresiones matemáticas, con funciones y valores
     * constantes definidos 
     */
    export class Parser {
        // Lista de funciones que se pueden evaluar.
        private functions: Searchable<Func>;
        private constants: Searchable<Const>;

        // Callback de error
        private exception: Function;
        // Callback de éxito
        private finally: Function;

        // Cadena a analizar
        private input: string;

        // Expresiones regulares
        private patterns = {
            empty:    /^(\s*)$/,
            addition: /((?:\+|-)+)/ig,
            constant: /([^a-zA-Z0-9_]|^)([a-zA-Z_][a-zA-Z0-9_]*)/i,
            group:    /([^a-zA-Z0-9_]|^)([a-zA-Z_][a-zA-Z0-9_]*)?\(([^()]*)\)/i
        };
        // RegExp de un número real, como string y como objeto.
        private numberPattern: string = "((?:\\+|-)?[0-9]+(?:\\.[0-9]+)?(?:E(?:\\+|-)?[0-9]+)?)";
        private numberExp: RegExp = new RegExp(this.numberPattern, 'ig');

        // RegExp de las operaciones aritméticas, en orden jerárquico
        private mathPatterns: Array<RegExp> = [

            // Potencias
            new RegExp(this.numberPattern + "(\\^)" + this.numberPattern, 'i'),
            // Multiplicación, división y módulo
            new RegExp(this.numberPattern + "(\\*|\\/|%)" + this.numberPattern, 'i'),
            // Suma y resta
            new RegExp(this.numberPattern + "(\\+|-)" + this.numberPattern, 'i')

        ];

        /**
         * Inicializa las funciones y constantes del intérprete
         * @param list Objeto con las funciones y constantes del intérprete, 
         * de la forma 'nombre:elemento'. Las constantes son de tipo numérico,
         * mientras que las funciones son tal.
         */
        constructor(list: object) {

            this.constants = new Searchable<Const>();
            this.functions = new Searchable<Func>();

            // Buscar según el nombre
            this.constants.test((item: Const) => {
                return item.name
            });            
            this.functions.test((item: Func) => {
                return item.name
            });

            // Obtener mapa de funciones y constantes
            for(let item in list) { // Recorrer mapa
                let type: string = typeof(list[item]);
                if(type === "number") { // SI el elemento es un número
                    // Guardar como constante
                    this.constants.list.push(new Const(item, list[item]));
                }
                // Si es una función
                if(type === "function") {
                    // guardar como tal
                    this.functions.list.push(new Func(item, list[item]));
                }
            }
        }

        /**
         * Establece el nuevo valor de una constante. Si la constante no existe, se creará.
         * @param name El nombre de la constante
         * @param val El nuevo valor de la constante.
         */
        public constant(name: string, val: number): Parser {
            let c = this.constants.search(name);
            if(!c) {
                if(name !== null && val !== null) {
                    this.constants.list.push(new Const(name, val));
                }
            }
            else
                c.value = val;
            return this;
        }

        /**
         * Evalúa una operación aritmética binaria (A+B, A*B, etc.)
         * @param A El primer operando
         * @param B El segundo operando
         * @param op La operación
         */
        private evalArithmetic(A: number, B: number, op: string): number {
            let result: number;
            // Ejecutar la operación correspondiente
            switch(op) {
                // Si la operación no existe, devolver NaN
                default:
                    result = NaN;
                break;
                
                case '^':
                    result = A ** B;
                break;

                case '*':
                    result = A * B;
                break;

                case '/':
                    result = A / B;
                break;
			
                case "%":
                    result = A % B;
                break;
                    
                case "+":
                    result = A + B;
                break;
                    
                case "-":
                    result = A - B;
                break;

            }
            return result;
        }

        /**
         * Obtiene y evalúa las operaciones aritméticas de una cadena, o 
         * lanza un error si la cadena contiene caracteres no válidos
         * @param str La cadena a analizar
         */
        private parseArithmetic(str: string): number {
            // Devolver cero si no hay operación que evaluar
            if(str.match(this.patterns.empty)) {
                return 0;
            }

            // Eliminar espacios en blanco
            str = str.replace(/\s+/g, '');

            // Colapsar múltiples signos de adición/sustracción en uno solo
            str = str.replace(this.patterns.addition, (signs: string) => {
                let split = signs.split('');
                return split.reduce((prev: string, curr: string) => {
                    // Signos iguales: +
                    if(prev == curr)
                        return '+';
                    // Signos diferentes: -
                    return '-';
                });;
            });
            
            // Evaluar las operaciones aritméticas en el orden jerárquico correspondiente
            let matches: Array<string>;
            this.mathPatterns.forEach((exp: RegExp) => {
                // Buscar coincidencias de la forma AoB
                while(str.match(exp))
                // Reemplazar coincidencia por su valor evaluado
                str = str.replace(exp, (input: string) => {
                    // Input: coincidencia encontrada
                    
                    // Obtener partes de la operación (operandos+operador)
                    matches = exp.exec(input); 
                    if(!matches) // Si no se encontraron las partes
                        return 'NaN'; // Devolver Nan

                    // Partes de la operación AoB
                    let A: number = parseFloat(matches[1]);
                    let B: number = parseFloat(matches[3]);
                    let o: string = matches[2];

                    // Evaluar operación aritmética
                    let result: number = this.evalArithmetic(A, B, o);
                    // Signo del resultado
                    let sign: string = result >= 0 ? '+': '';
                    
                    // Valor de salida
                    let output: string = sign + result.toString();

                    return output;
                });
            });
            // Comprobar errores de sintaxis (elementos no numéricos)
            // Eliminar todos los elementos numéricos
            let check: string = str.replace(this.numberExp, '');
            // Si queda algo,
            if(!check.match(this.patterns.empty)) {
                // Tirar error
                throw new Error(ErrorInfo.syntax(check));
            }
            // Devolver resultado
            return parseFloat(str);
        }
        /**
         * Reemplaza los nombres de constantes por sus correspondientes errores,
         * o lanza un error si alguna constante no existe.
         * @param str La cadena a analizar
         */
        private parseConstants(str: string):number {
            // Buscar todos los nombres de constantes en la cadena
            while(str.match(this.patterns.constant))
            str = str.replace(this.patterns.constant, (match: string) => {
                // Obtener partes de la coincidencia
                let matches: Array<string> = this.patterns.constant.exec(match);
                if(!matches)
                    return match;
                
                // Caracter anterior al nombre de la constante
                let backwards = matches[1];
                // Nombre de la constante
                let constName = matches[2];

                // Si el caracter anterior es un número
                // (p.e: 2sqrt),
                if(backwards.match(this.numberExp)) {
                    // Lanzar error
                    throw new Error(ErrorInfo.syntax(backwards + constName));
                }

                // Buscar la constante que corresponda con el nombre actual
                let c: Const = this.constants.search(constName);
                if(!c) {
                    // Lanzar error si no se encontró
                    throw new Error(ErrorInfo.refference(constName));
                }
                // Devolver el valor de la constante
                return backwards + c.value.toString();
            });
            // Evaluar la expresión resultante
            return this.parseArithmetic(str);
        }
        /**
         * Encuentra los agrupadores y funciones dentro de una cadena de texto
         * y los evalúa. Lanza un error si una función no existe.
         * @param str La cadena a analizar
         */
        private parseGroup(str: string):number {
            // Buscar coincidencias, evaluarlas y seguir buscando
            while(str.match(this.patterns.group))
            str = str.replace(this.patterns.group, (match: string) => {
                // Obtener partes de la coincidencia
                let matches: Array<string> = this.patterns.group.exec(match);
                if(!matches) return match;

                // Caracter anterior al nombre de la función
                let backwards: string = matches[1];
                // Nombre de la función
                let funcName: string = matches[2];
                // Parámetros de la función
                let funcParams: Array<string> = matches[3].split(/\s*\,\s*/);

                // Si el caracter anterior es un número
                // (p.e: 2sqrt),
                if(backwards.match(this.numberExp)) {
                    // Lanzar error
                    throw new Error(ErrorInfo.syntax(backwards + funcName));
                }

                // Ejecutar los parámetros de la función para obtener
                // sus resultados como números reales.
                let params: Array<number> = new Array<number>();
                // Recorrer la lista de parámetros
                funcParams.forEach((it: string) => {
                    // Si el parámetro no está vacío
                    if(!it.match(this.patterns.empty)) {
                        // Ejecutar y añadir a la lista.
                        params.push(this.parseConstants(it));
                    }
                });
                // Resultado del grupo/función.
                let result: number;

                // Si el grupo es una función (p.e: 1 + sqrt(x) )
                if(funcName) {
                    // Buscar la función con ese nombre
                    let func: Func = this.functions.search(funcName);
                    
                    // Lanzar error en caso de que la función no exista.
                    if(!func) {
                        throw new Error(ErrorInfo.refference(funcName));
                    }
                    // Lanzar error si el número de parámetros dados es incorrecto.
                    if(params.length != func.count) {
                        throw new Error(ErrorInfo.argument(funcName, func.count));
                    }
                    // Ejecutar función y obtener resultado
                    result = func.func.apply(this, params);
                }
                // Si el grupo no es una función (p.e: 1*(2+3) )
                else {
                    // Devolver el primer parámetro si tiene
                    if(params.length >= 1) {
                        result = params[0];
                    }
                    // Si no tiene devolver cero.
                    else result = 0;
                }
                // Reemplazar coincidencia por su resultado, sin
                // perder el caracter anterior.
                return backwards + result.toString();
            });
            // Ejecutar resultado
            return this.parseConstants(str);
        }
        /**
         * Ejecuta una cadena de texto
         * @param str La cadena a analizar
         */
        public execute(str: string = this.input): number {
            let result = 0;
            try {
                result = this.parseGroup(str);
                if(typeof(this.finally) == "function")
                    this.finally.apply(this, [result]);
            }
            catch(error) {
                if(typeof(this.exception) == "function")
                    this.exception.apply(this, [error]);
            }
            finally {
                return result;
            }
        }
        /**
         * Establece la función que se llamará si el intérprete
         * encuentra algún error.
         * @param err El callback en caso de error
         */
        public catch(err: Function = null): Parser {
            this.exception = err;
            return this;
        }
        /**
         * Establece la función que se llamará cuando el intérprete
         * ejecute correctamente una cadena.
         * @param fun El callback en caso de éxito.
         */
        public then(fun: Function = null): Parser {
            this.finally = fun;
            return this;
        }
        /**
         * Establece la cadena que se va a ejecutar cuando se ejecuta el intérprete sin
         * un parámetro.
         * @param str La cadena a analizar
         */
        public set(str: string): Parser {
            this.input = str;
            return this;
        }
        /**
         * Repite la ejecución de la cadena de entrada un número determinado de veces.
         * @param n El número de repeticiones
         * @param call La función que se ejecutará después de cada ejecución.
         */
        public repeat(n: number, call: Function = null): Parser {
            for(let i = 0; i < n; i++) {
                let r = this.execute();
                if(call !== null) {
                    call.apply(this, [r, i + 1]);
                }
            }
            return this;
        }
    }
}