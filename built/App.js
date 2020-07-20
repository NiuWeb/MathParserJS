"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MathParser_1 = require("./MathParser");
var Functions_1 = require("./Functions");
var parser = new MathParser_1.MathParser.Parser(Functions_1.functions)
    .then(function (result) {
    console.log("============\nResultado: ");
    console.log(result);
    console.log("============\n");
})
    .catch(function (error) {
    console.log("ERROR: " + error.message);
})
    .constant("x", x)
    .set("sin(x)");
var x = 0;
parser.repeat(100, function (r, i) {
    this.constant("x", 0.05 * i);
});
//# sourceMappingURL=App.js.map