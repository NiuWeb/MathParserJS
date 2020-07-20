"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functions = void 0;
exports.functions = {
    pi: Math.PI,
    e: Math.E,
    abs: function (x) {
        return Math.abs(x);
    },
    sign: function (x) {
        if (x != 0) {
            return Math.abs(x) / x;
        }
        else
            return 0;
    },
    floor: function (x) {
        return Math.floor(x);
    },
    ceil: function (x) {
        return Math.ceil(x);
    },
    round: function (x) {
        return Math.round(x);
    },
    sin: function (x) {
        return Math.sin(x);
    },
    cos: function (x) {
        return Math.cos(x);
    },
    tan: function (x) {
        return Math.tan(x);
    },
    ln: function (x) {
        return Math.log(x);
    },
    log2: function (x) {
        return Math.log(x) / Math.log(2);
    },
    log10: function (x) {
        return Math.log(x) / Math.log(10);
    },
    log: function (x, a) {
        return Math.log(a) / Math.log(x);
    },
    rand: function (x) {
        return Math.random() * x;
    },
    randint: function (x) {
        return Math.floor(Math.random() * x);
    },
    choose: function (x, y) {
        if (Math.random() >= 0.5)
            return x;
        else
            return y;
    }
};
//# sourceMappingURL=Functions.js.map