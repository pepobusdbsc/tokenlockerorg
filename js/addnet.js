var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, d) {
    if (a == Array.prototype || a == Object.prototype) return a;
    a[b] = d.value;
    return a
};
$jscomp.getGlobal = function(a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var b = 0; b < a.length; ++b) {
        var d = a[b];
        if (d && d.Math == Math) return d
    }
    throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(a, b) {
    var d = $jscomp.propertyToPolyfillSymbol[b];
    if (null == d) return a[b];
    d = a[d];
    return void 0 !== d ? d : a[b]
};
$jscomp.polyfill = function(a, b, d, e) {
    b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, d, e) : $jscomp.polyfillUnisolated(a, b, d, e))
};
$jscomp.polyfillUnisolated = function(a, b, d, e) {
    d = $jscomp.global;
    a = a.split(".");
    for (e = 0; e < a.length - 1; e++) {
        var f = a[e];
        if (!(f in d)) return;
        d = d[f]
    }
    a = a[a.length - 1];
    e = d[a];
    b = b(e);
    b != e && null != b && $jscomp.defineProperty(d, a, {
        configurable: !0,
        writable: !0,
        value: b
    })
};
$jscomp.polyfillIsolated = function(a, b, d, e) {
    var f = a.split(".");
    a = 1 === f.length;
    e = f[0];
    e = !a && e in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
    for (var l = 0; l < f.length - 1; l++) {
        var c = f[l];
        if (!(c in e)) return;
        e = e[c]
    }
    f = f[f.length - 1];
    d = $jscomp.IS_SYMBOL_NATIVE && "es6" === d ? e[f] : null;
    b = b(d);
    null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, f, {
        configurable: !0,
        writable: !0,
        value: b
    }) : b !== d && (void 0 === $jscomp.propertyToPolyfillSymbol[f] && (d = 1E9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[f] = $jscomp.IS_SYMBOL_NATIVE ?
        $jscomp.global.Symbol(f) : $jscomp.POLYFILL_PREFIX + d + "$" + f), $jscomp.defineProperty(e, $jscomp.propertyToPolyfillSymbol[f], {
        configurable: !0,
        writable: !0,
        value: b
    })))
};
$jscomp.underscoreProtoCanBeSet = function() {
    var a = {
            a: !0
        },
        b = {};
    try {
        return b.__proto__ = a, b.a
    } catch (d) {}
    return !1
};
$jscomp.setPrototypeOf = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
    return a
} : null;
$jscomp.arrayIteratorImpl = function(a) {
    var b = 0;
    return function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    }
};
$jscomp.arrayIterator = function(a) {
    return {
        next: $jscomp.arrayIteratorImpl(a)
    }
};
$jscomp.makeIterator = function(a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a)
};
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function(a) {
    if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function() {
    this.isRunning_ = !1;
    this.yieldAllIterator_ = null;
    this.yieldResult = void 0;
    this.nextAddress = 1;
    this.finallyAddress_ = this.catchAddress_ = 0;
    this.finallyContexts_ = this.abruptCompletion_ = null
};
$jscomp.generator.Context.prototype.start_ = function() {
    if (this.isRunning_) throw new TypeError("Generator is already running");
    this.isRunning_ = !0
};
$jscomp.generator.Context.prototype.stop_ = function() {
    this.isRunning_ = !1
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
    this.nextAddress = this.catchAddress_ || this.finallyAddress_
};
$jscomp.generator.Context.prototype.next_ = function(a) {
    this.yieldResult = a
};
$jscomp.generator.Context.prototype.throw_ = function(a) {
    this.abruptCompletion_ = {
        exception: a,
        isException: !0
    };
    this.jumpToErrorHandler_()
};
$jscomp.generator.Context.prototype["return"] = function(a) {
    this.abruptCompletion_ = {
        "return": a
    };
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(a) {
    this.abruptCompletion_ = {
        jumpTo: a
    };
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.yield = function(a, b) {
    this.nextAddress = b;
    return {
        value: a
    }
};
$jscomp.generator.Context.prototype.yieldAll = function(a, b) {
    var d = $jscomp.makeIterator(a),
        e = d.next();
    $jscomp.generator.ensureIteratorResultIsObject_(e);
    if (e.done) this.yieldResult = e.value, this.nextAddress = b;
    else return this.yieldAllIterator_ = d, this.yield(e.value, b)
};
$jscomp.generator.Context.prototype.jumpTo = function(a) {
    this.nextAddress = a
};
$jscomp.generator.Context.prototype.jumpToEnd = function() {
    this.nextAddress = 0
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(a, b) {
    this.catchAddress_ = a;
    void 0 != b && (this.finallyAddress_ = b)
};
$jscomp.generator.Context.prototype.setFinallyBlock = function(a) {
    this.catchAddress_ = 0;
    this.finallyAddress_ = a || 0
};
$jscomp.generator.Context.prototype.leaveTryBlock = function(a, b) {
    this.nextAddress = a;
    this.catchAddress_ = b || 0
};
$jscomp.generator.Context.prototype.enterCatchBlock = function(a) {
    this.catchAddress_ = a || 0;
    a = this.abruptCompletion_.exception;
    this.abruptCompletion_ = null;
    return a
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function(a, b, d) {
    d ? this.finallyContexts_[d] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
    this.catchAddress_ = a || 0;
    this.finallyAddress_ = b || 0
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function(a, b) {
    var d = this.finallyContexts_.splice(b || 0)[0];
    if (d = this.abruptCompletion_ = this.abruptCompletion_ || d) {
        if (d.isException) return this.jumpToErrorHandler_();
        void 0 != d.jumpTo && this.finallyAddress_ < d.jumpTo ? (this.nextAddress = d.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
    } else this.nextAddress = a
};
$jscomp.generator.Context.prototype.forIn = function(a) {
    return new $jscomp.generator.Context.PropertyIterator(a)
};
$jscomp.generator.Context.PropertyIterator = function(a) {
    this.object_ = a;
    this.properties_ = [];
    for (var b in a) this.properties_.push(b);
    this.properties_.reverse()
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
    for (; 0 < this.properties_.length;) {
        var a = this.properties_.pop();
        if (a in this.object_) return a
    }
    return null
};
$jscomp.generator.Engine_ = function(a) {
    this.context_ = new $jscomp.generator.Context;
    this.program_ = a
};
$jscomp.generator.Engine_.prototype.next_ = function(a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
    this.context_.next_(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.return_ = function(a) {
    this.context_.start_();
    var b = this.context_.yieldAllIterator_;
    if (b) return this.yieldAllStep_("return" in b ? b["return"] : function(d) {
        return {
            value: d,
            done: !0
        }
    }, a, this.context_["return"]);
    this.context_["return"](a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.throw_ = function(a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
    this.context_.throw_(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(a, b, d) {
    try {
        var e = a.call(this.context_.yieldAllIterator_, b);
        $jscomp.generator.ensureIteratorResultIsObject_(e);
        if (!e.done) return this.context_.stop_(), e;
        var f = e.value
    } catch (l) {
        return this.context_.yieldAllIterator_ = null, this.context_.throw_(l), this.nextStep_()
    }
    this.context_.yieldAllIterator_ = null;
    d.call(this.context_, f);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.nextStep_ = function() {
    for (; this.context_.nextAddress;) try {
        var a = this.program_(this.context_);
        if (a) return this.context_.stop_(), {
            value: a.value,
            done: !1
        }
    } catch (b) {
        this.context_.yieldResult = void 0, this.context_.throw_(b)
    }
    this.context_.stop_();
    if (this.context_.abruptCompletion_) {
        a = this.context_.abruptCompletion_;
        this.context_.abruptCompletion_ = null;
        if (a.isException) throw a.exception;
        return {
            value: a["return"],
            done: !0
        }
    }
    return {
        value: void 0,
        done: !0
    }
};
$jscomp.generator.Generator_ = function(a) {
    this.next = function(b) {
        return a.next_(b)
    };
    this["throw"] = function(b) {
        return a.throw_(b)
    };
    this["return"] = function(b) {
        return a.return_(b)
    };
    this[Symbol.iterator] = function() {
        return this
    }
};
$jscomp.generator.createGenerator = function(a, b) {
    var d = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
    $jscomp.setPrototypeOf && a.prototype && $jscomp.setPrototypeOf(d, a.prototype);
    return d
};
$jscomp.asyncExecutePromiseGenerator = function(a) {
    function b(e) {
        return a.next(e)
    }

    function d(e) {
        return a["throw"](e)
    }
    return new Promise(function(e, f) {
        function l(c) {
            c.done ? e(c.value) : Promise.resolve(c.value).then(b, d).then(l, f)
        }
        l(a.next())
    })
};
$jscomp.asyncExecutePromiseGeneratorFunction = function(a) {
    return $jscomp.asyncExecutePromiseGenerator(a())
};
$jscomp.asyncExecutePromiseGeneratorProgram = function(a) {
    return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))
};
$jscomp.initSymbol = function() {};
$jscomp.polyfill("Symbol", function(a) {
    if (a) return a;
    var b = function(l, c) {
        this.$jscomp$symbol$id_ = l;
        $jscomp.defineProperty(this, "description", {
            configurable: !0,
            writable: !0,
            value: c
        })
    };
    b.prototype.toString = function() {
        return this.$jscomp$symbol$id_
    };
    var d = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_",
        e = 0,
        f = function(l) {
            if (this instanceof f) throw new TypeError("Symbol is not a constructor");
            return new b(d + (l || "") + "_" + e++, l)
        };
    return f
}, "es6", "es3");
$jscomp.polyfill("Symbol.iterator", function(a) {
        if (a) return a;
        a = Symbol("Symbol.iterator");
        for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), d = 0; d < b.length; d++) {
            var e = $jscomp.global[b[d]];
            "function" === typeof e && "function" != typeof e.prototype[a] && $jscomp.defineProperty(e.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
                }
            })
        }
        return a
    }, "es6",
    "es3");
$jscomp.iteratorPrototype = function(a) {
    a = {
        next: a
    };
    a[Symbol.iterator] = function() {
        return this
    };
    return a
};
$jscomp.polyfill("Promise", function(a) {
    function b() {
        this.batch_ = null
    }

    function d(c) {
        return c instanceof f ? c : new f(function(g, h) {
            g(c)
        })
    }
    if (a && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return a;
    b.prototype.asyncExecute = function(c) {
        if (null == this.batch_) {
            this.batch_ = [];
            var g = this;
            this.asyncExecuteFunction(function() {
                g.executeBatch_()
            })
        }
        this.batch_.push(c)
    };
    var e = $jscomp.global.setTimeout;
    b.prototype.asyncExecuteFunction = function(c) {
        e(c, 0)
    };
    b.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length;) {
            var c = this.batch_;
            this.batch_ = [];
            for (var g = 0; g < c.length; ++g) {
                var h = c[g];
                c[g] = null;
                try {
                    h()
                } catch (k) {
                    this.asyncThrow_(k)
                }
            }
        }
        this.batch_ = null
    };
    b.prototype.asyncThrow_ = function(c) {
        this.asyncExecuteFunction(function() {
            throw c;
        })
    };
    var f = function(c) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        this.isRejectionHandled_ = !1;
        var g = this.createResolveAndReject_();
        try {
            c(g.resolve, g.reject)
        } catch (h) {
            g.reject(h)
        }
    };
    f.prototype.createResolveAndReject_ = function() {
        function c(k) {
            return function(m) {
                h || (h = !0, k.call(g, m))
            }
        }
        var g = this,
            h = !1;
        return {
            resolve: c(this.resolveTo_),
            reject: c(this.reject_)
        }
    };
    f.prototype.resolveTo_ = function(c) {
        if (c === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (c instanceof f) this.settleSameAsPromise_(c);
        else {
            a: switch (typeof c) {
                case "object":
                    var g = null != c;
                    break a;
                case "function":
                    g = !0;
                    break a;
                default:
                    g = !1
            }
            g ? this.resolveToNonPromiseObj_(c) : this.fulfill_(c)
        }
    };
    f.prototype.resolveToNonPromiseObj_ = function(c) {
        var g = void 0;
        try {
            g = c.then
        } catch (h) {
            this.reject_(h);
            return
        }
        "function" == typeof g ? this.settleSameAsThenable_(g, c) : this.fulfill_(c)
    };
    f.prototype.reject_ = function(c) {
        this.settle_(2, c)
    };
    f.prototype.fulfill_ = function(c) {
        this.settle_(1, c)
    };
    f.prototype.settle_ = function(c, g) {
        if (0 != this.state_) throw Error("Cannot settle(" + c + ", " + g + "): Promise already settled in state" + this.state_);
        this.state_ = c;
        this.result_ = g;
        2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
        this.executeOnSettledCallbacks_()
    };
    f.prototype.scheduleUnhandledRejectionCheck_ = function() {
        var c = this;
        e(function() {
            if (c.notifyUnhandledRejection_()) {
                var g = $jscomp.global.console;
                "undefined" !== typeof g && g.error(c.result_)
            }
        }, 1)
    };
    f.prototype.notifyUnhandledRejection_ = function() {
        if (this.isRejectionHandled_) return !1;
        var c = $jscomp.global.CustomEvent,
            g = $jscomp.global.Event,
            h = $jscomp.global.dispatchEvent;
        if ("undefined" === typeof h) return !0;
        "function" === typeof c ? c = new c("unhandledrejection", {
                cancelable: !0
            }) :
            "function" === typeof g ? c = new g("unhandledrejection", {
                cancelable: !0
            }) : (c = $jscomp.global.document.createEvent("CustomEvent"), c.initCustomEvent("unhandledrejection", !1, !0, c));
        c.promise = this;
        c.reason = this.result_;
        return h(c)
    };
    f.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
            for (var c = 0; c < this.onSettledCallbacks_.length; ++c) l.asyncExecute(this.onSettledCallbacks_[c]);
            this.onSettledCallbacks_ = null
        }
    };
    var l = new b;
    f.prototype.settleSameAsPromise_ = function(c) {
        var g = this.createResolveAndReject_();
        c.callWhenSettled_(g.resolve, g.reject)
    };
    f.prototype.settleSameAsThenable_ = function(c, g) {
        var h = this.createResolveAndReject_();
        try {
            c.call(g, h.resolve, h.reject)
        } catch (k) {
            h.reject(k)
        }
    };
    f.prototype.then = function(c, g) {
        function h(n, p) {
            return "function" == typeof n ? function(q) {
                try {
                    k(n(q))
                } catch (r) {
                    m(r)
                }
            } : p
        }
        var k, m, t = new f(function(n, p) {
            k = n;
            m = p
        });
        this.callWhenSettled_(h(c, k), h(g, m));
        return t
    };
    f.prototype["catch"] = function(c) {
        return this.then(void 0, c)
    };
    f.prototype.callWhenSettled_ = function(c, g) {
        function h() {
            switch (k.state_) {
                case 1:
                    c(k.result_);
                    break;
                case 2:
                    g(k.result_);
                    break;
                default:
                    throw Error("Unexpected state: " + k.state_);
            }
        }
        var k = this;
        null == this.onSettledCallbacks_ ? l.asyncExecute(h) : this.onSettledCallbacks_.push(h);
        this.isRejectionHandled_ = !0
    };
    f.resolve = d;
    f.reject = function(c) {
        return new f(function(g, h) {
            h(c)
        })
    };
    f.race = function(c) {
        return new f(function(g, h) {
            for (var k = $jscomp.makeIterator(c), m = k.next(); !m.done; m = k.next()) d(m.value).callWhenSettled_(g, h)
        })
    };
    f.all = function(c) {
        var g = $jscomp.makeIterator(c),
            h = g.next();
        return h.done ? d([]) : new f(function(k,
            m) {
            function t(q) {
                return function(r) {
                    n[q] = r;
                    p--;
                    0 == p && k(n)
                }
            }
            var n = [],
                p = 0;
            do n.push(void 0), p++, d(h.value).callWhenSettled_(t(n.length - 1), m), h = g.next(); while (!h.done)
        })
    };
    return f
}, "es6", "es3");
var mainBSC = {
    chainId: "0x38",
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
        name: "Binance Coin",
        symbol: "BNB",
        decimals: 18
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com"]
};
$("#addMainBSC").click(function() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
        window.ethereum ? ethereum.request({
            method: "wallet_addEthereumChain",
            params: [mainBSC]
        })["catch"](function(b) {
            return console.log(b.message)
        }) : $("#nometamask").fadeIn(1E3).fadeOut(1E3);
        a.jumpToEnd()
    })
});
var testBSC = {
    chainId: "0x61",
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: {
        name: "Binance Coin",
        symbol: "BNB",
        decimals: 18
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com"]
};
$("#addTestBSC").click(function() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
        window.ethereum ? ethereum.request({
            method: "wallet_addEthereumChain",
            params: [testBSC]
        })["catch"](function(b) {
            return console.log(b.message)
        }) : $("#nometamask").fadeIn(1E3).fadeOut(1E3);
        a.jumpToEnd()
    })
});
var mainMATIC = {
    chainId: "0x89",
    chainName: "Polygon (MATIC) Mainnet",
    nativeCurrency: {
        name: "Polygon",
        symbol: "MATIC",
        decimals: 18
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://explorer.matic.network"]
};
$("#addMainMATIC").click(function() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
        window.ethereum ? ethereum.request({
            method: "wallet_addEthereumChain",
            params: [mainMATIC]
        })["catch"](function(b) {
            return console.log(b.message)
        }) : $("#nometamask").fadeIn(1E3).fadeOut(1E3);
        a.jumpToEnd()
    })
});
var testMATIC = {
    chainId: "0x13881",
    chainName: "Polygon (MATIC) Mumbai Testnet",
    nativeCurrency: {
        name: "Polygon",
        symbol: "MATIC",
        decimals: 18
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai-explorer.matic.today"]
};
$("#addTestMATIC").click(function() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
        window.ethereum ? ethereum.request({
            method: "wallet_addEthereumChain",
            params: [testMATIC]
        })["catch"](function(b) {
            return console.log(b.message)
        }) : $("#nometamask").fadeIn(1E3).fadeOut(1E3);
        a.jumpToEnd()
    })
});
var mainThunderCore = {
    chainId: "0x6c",
    chainName: "ThunderCore Mainnet",
    nativeCurrency: {
        name: "Thunder Token",
        symbol: "TT",
        decimals: 18
    },
    rpcUrls: ["https://mainnet-rpc.thundercore.com"],
    blockExplorerUrls: ["https://scan.thundercore.com"]
};
$("#addMainThunderCore").click(function() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
        window.ethereum ? ethereum.request({
            method: "wallet_addEthereumChain",
            params: [mainThunderCore]
        })["catch"](function(b) {
            return console.log(b.message)
        }) : $("#nometamask").fadeIn(1E3).fadeOut(1E3);
        a.jumpToEnd()
    })
});
var testThunderCore = {
    chainId: "0x12",
    chainName: "Polygon (ThunderCore) Mumbai Testnet",
    nativeCurrency: {
        name: "Thunder Token",
        symbol: "TT",
        decimals: 18
    },
    rpcUrls: ["https://testnet-rpc.thundercore.com"],
    blockExplorerUrls: ["https://scan-testnet.thundercore.com"]
};
$("#addTestThunderCore").click(function() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
        window.ethereum ? ethereum.request({
            method: "wallet_addEthereumChain",
            params: [testThunderCore]
        })["catch"](function(b) {
            return console.log(b.message)
        }) : $("#nometamask").fadeIn(1E3).fadeOut(1E3);
        a.jumpToEnd()
    })
});
$("#connect").on("click", function() {
    var a, b, d;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(e) {
        if (1 == e.nextAddress) {
            if (!window.ethereum) return $("#nometamask").fadeIn(1E3).fadeOut(1E3), e.jumpTo(0);
            e.setCatchFinallyBlocks(3);
            return e.yield(ethereum.request({
                method: "eth_requestAccounts"
            }), 5)
        }
        if (3 != e.nextAddress) {
            a = e.yieldResult;
            if (b = a[0]) $("#connected").html(b), $("#connected").fadeIn(1E3).fadeOut(1E3);
            return e.leaveTryBlock(0)
        }
        d = e.enterCatchBlock();
        console.error(d);
        e.jumpToEnd()
    })
});