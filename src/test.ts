import {MathParser} from "./MathParser";
import  {functions} from "./Functions";

// PROGRAMA DE PRUEBA
var parser = new MathParser.Parser(functions)
// Mensaje de respuesta
.then((result: number) => {
    console.log("Resultado: " + result.toString());
})
// Mensaje de error
.catch((error: Error) => {
    console.log("Error: ", error);
});

// Calcular el número áureo.
parser.execute("(1 + 5^0.5)/2");
// Identidad trigonométrica
parser.execute("sin(pi/2)^2 + cos(pi/2)^2");
// otros cálculos
parser.execute("cos(pi) - 6/2*(2+1)");
parser.execute("1 + 1/2 + 1/4");

// CREANDO UNA TABLA DE VALORES.
console.log("====TABLA DE VALORES====")
// Definir el valor inicial de x en cero.
parser.constant("x", 0)

// Ecuación cuadrática
.set("2*x^2 - 5*x + 3")
// Quitar el mensaje de respuesta
.then()
// Evaluar diez posiciones, desde 0 hasta 5 con paso de 0.5.
.repeat(10, function(r, i) { 
    // Use function(){} y no ()=>{} si quiere que this haga referencia
    // al objeto parser.

    //Mostrar resultado
    console.log(`x = ${0.5*(i-1)}, f(x) = ${r}`);

    // Incrementar valor
    this.constant("x", 0.5*i);
});