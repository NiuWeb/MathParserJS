"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MathParser_1 = require("./MathParser");
var Functions_1 = require("./Functions");
var parser = new MathParser_1.MathParser.Parser(Functions_1.functions)
    .then(function (result) {
    console.log("Resultado: " + result.toString());
})
    .catch(function (error) {
    console.log("Error: ", error);
});
parser.execute("log(log(2, 3), log(3, 4))");
parser.execute("(1 + 5^0.5)/2");
parser.execute("sin(pi/2)^2 + cos(pi/2)^2");
parser.execute("cos(pi) - 6/2*(2+1)");
parser.execute("1 + 1/2 + 1/4");
console.log("====TABLA DE VALORES====");
parser.constant("x", 0)
    .set("2*x^2 - 5*x + 3")
    .then()
    .repeat(10, function (r, i) {
    console.log("x = " + 0.5 * (i - 1) + ", f(x) = " + r);
    this.constant("x", 0.5 * i);
});
//# sourceMappingURL=test.js.map