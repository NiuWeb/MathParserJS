import {MathParser} from "./MathParser";
import  {functions} from "./Functions";

// PROGRAMA DE PRUEBA
var parser = new MathParser.Parser(functions)
.then(result => {
    console.log("============\nResultado: ");
    console.log(result);
    console.log("============\n");
})
.catch((error: Error) => {
    console.log("ERROR: " + error.message);
})
.constant("x", x)
.set("sin(x)");

var x = 0;
parser.repeat(100, function(r, i) {
    this.constant("x", 0.05*i);
});