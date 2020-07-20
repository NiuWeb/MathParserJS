"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathParser = void 0;
var MathParser;
(function (MathParser) {
    var ErrorInfo = (function () {
        function ErrorInfo() {
        }
        ErrorInfo.syntax = function (msg) {
            return "Sintaxis desconocida (" + msg + ")";
        };
        ErrorInfo.refference = function (msg) {
            return "Funci\u00F3n o constante desconocida (" + msg + ")";
        };
        ErrorInfo.argument = function (func, num) {
            return "N\u00FAmero incorrecto de argumentos. " +
                ("La funci\u00F3n " + func + " espera exactamente " + num + " argumentos.");
        };
        return ErrorInfo;
    }());
    var Searchable = (function () {
        function Searchable() {
            this.list = new Array();
        }
        Searchable.prototype.test = function (prop) {
            this.caller = prop;
        };
        Searchable.prototype.search = function (value) {
            for (var i = 0; i < this.list.length; i++) {
                var item = this.list[i];
                var val = this.caller(item);
                if (val === value) {
                    return item;
                }
            }
        };
        return Searchable;
    }());
    var Func = (function () {
        function Func(name, func) {
            this.n = name;
            this.f = func;
        }
        Object.defineProperty(Func.prototype, "name", {
            get: function () {
                return this.n;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Func.prototype, "func", {
            get: function () {
                return this.f;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Func.prototype, "count", {
            get: function () {
                return this.f.length;
            },
            enumerable: false,
            configurable: true
        });
        return Func;
    }());
    var Const = (function () {
        function Const(name, value) {
            this.n = name;
            this.v = value;
        }
        Object.defineProperty(Const.prototype, "name", {
            get: function () {
                return this.n;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Const.prototype, "value", {
            get: function () {
                return this.v;
            },
            set: function (value) {
                this.v = value;
            },
            enumerable: false,
            configurable: true
        });
        return Const;
    }());
    var Parser = (function () {
        function Parser(list) {
            this.patterns = {
                empty: /^(\s*)$/,
                addition: /((?:\+|-)+)/ig,
                constant: /([a-zA-Z_][a-zA-Z0-9_]*)/ig,
                group: /([^a-zA-Z_]|^)([a-zA-Z_][a-zA-Z0-9_]*)?\(([^()]*)\)/i
            };
            this.numberPattern = "((?:\\+|-)?[0-9]+(?:\\.[0-9]+)?(?:E(?:\\+|-)?[0-9]+)?)";
            this.numberExp = new RegExp(this.numberPattern, 'ig');
            this.mathPatterns = [
                new RegExp(this.numberPattern + "(\\^)" + this.numberPattern),
                new RegExp(this.numberPattern + "(\\*|\\/|%)" + this.numberPattern),
                new RegExp(this.numberPattern + "(\\+|-)" + this.numberPattern)
            ];
            this.constants = new Searchable();
            this.functions = new Searchable();
            this.constants.test(function (item) {
                return item.name;
            });
            this.functions.test(function (item) {
                return item.name;
            });
            for (var item in list) {
                var type = typeof (list[item]);
                if (type === "number") {
                    this.constants.list.push(new Const(item, list[item]));
                }
                if (type === "function") {
                    this.functions.list.push(new Func(item, list[item]));
                }
            }
        }
        Parser.prototype.constant = function (name, val) {
            var c = this.constants.search(name);
            if (!c) {
                if (name !== null && val !== null) {
                    this.constants.list.push(new Const(name, val));
                }
            }
            else
                c.value = val;
            return this;
        };
        Parser.prototype.evalArithmetic = function (A, B, op) {
            var result;
            switch (op) {
                default:
                    result = NaN;
                    break;
                case '^':
                    result = Math.pow(A, B);
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
        };
        Parser.prototype.parseArithmetic = function (str) {
            var _this = this;
            if (str.match(this.patterns.empty)) {
                return 0;
            }
            str = str.replace(/\s+/g, '');
            str = str.replace(this.patterns.addition, function (signs) {
                var split = signs.split('');
                return split.reduce(function (prev, curr) {
                    if (prev == curr)
                        return '+';
                    return '-';
                });
                ;
            });
            var matches;
            this.mathPatterns.forEach(function (exp) {
                while (str.match(exp))
                    str = str.replace(exp, function (input) {
                        matches = exp.exec(input);
                        if (!matches)
                            return 'NaN';
                        var A = parseFloat(matches[1]);
                        var B = parseFloat(matches[3]);
                        var o = matches[2];
                        var result = _this.evalArithmetic(A, B, o);
                        var sign = result >= 0 ? '+' : '';
                        var output = sign + result.toString();
                        return output;
                    });
            });
            var check = str.replace(this.numberExp, '');
            if (!check.match(this.patterns.empty)) {
                throw new Error(ErrorInfo.syntax(check));
            }
            return parseFloat(str);
        };
        Parser.prototype.parseConstants = function (str) {
            var _this = this;
            str = str.replace(this.patterns.constant, function (match) {
                var c = _this.constants.search(match);
                if (!c) {
                    throw new Error(ErrorInfo.refference(match));
                }
                return c.value.toString();
            });
            return this.parseArithmetic(str);
        };
        Parser.prototype.parseGroup = function (str) {
            var _this = this;
            while (str.match(this.patterns.group))
                str = str.replace(this.patterns.group, function (match) {
                    var matches = _this.patterns.group.exec(match);
                    if (!matches)
                        return match;
                    var backwards = matches[1];
                    var funcName = matches[2];
                    var funcParams = matches[3].split(/\s*\,\s*/);
                    if (backwards.match(_this.numberExp)) {
                        throw new Error(ErrorInfo.syntax(backwards + funcName));
                    }
                    var params = new Array();
                    funcParams.forEach(function (it) {
                        if (!it.match(_this.patterns.empty)) {
                            params.push(_this.parseConstants(it));
                        }
                    });
                    var result;
                    if (funcName) {
                        var func = _this.functions.search(funcName);
                        if (!func) {
                            throw new Error(ErrorInfo.refference(funcName));
                        }
                        if (params.length != func.count) {
                            throw new Error(ErrorInfo.argument(funcName, func.count));
                        }
                        result = func.func.apply(_this, params);
                    }
                    else {
                        if (params.length >= 1) {
                            result = params[0];
                        }
                        else
                            result = 0;
                    }
                    return backwards + result.toString();
                });
            return this.parseConstants(str);
        };
        Parser.prototype.execute = function (str) {
            if (str === void 0) { str = this.input; }
            var result = 0;
            try {
                result = this.parseGroup(str);
                this.finally(result);
            }
            catch (error) {
                this.exception(error);
            }
            finally {
                return result;
            }
        };
        Parser.prototype.catch = function (err) {
            this.exception = err;
            return this;
        };
        Parser.prototype.then = function (fun) {
            this.finally = fun;
            return this;
        };
        Parser.prototype.set = function (str) {
            this.input = str;
            return this;
        };
        Parser.prototype.repeat = function (n, call) {
            if (call === void 0) { call = null; }
            for (var i = 0; i < n; i++) {
                var r = this.execute();
                if (call !== null) {
                    call.apply(this, [r, i]);
                }
            }
            return this;
        };
        return Parser;
    }());
    MathParser.Parser = Parser;
})(MathParser = exports.MathParser || (exports.MathParser = {}));
//# sourceMappingURL=MathParser.js.map