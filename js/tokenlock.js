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
$jscomp.polyfill = function(a, b, d, f) {
    b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, d, f) : $jscomp.polyfillUnisolated(a, b, d, f))
};
$jscomp.polyfillUnisolated = function(a, b, d, f) {
    d = $jscomp.global;
    a = a.split(".");
    for (f = 0; f < a.length - 1; f++) {
        var e = a[f];
        if (!(e in d)) return;
        d = d[e]
    }
    a = a[a.length - 1];
    f = d[a];
    b = b(f);
    b != f && null != b && $jscomp.defineProperty(d, a, {
        configurable: !0,
        writable: !0,
        value: b
    })
};
$jscomp.polyfillIsolated = function(a, b, d, f) {
    var e = a.split(".");
    a = 1 === e.length;
    f = e[0];
    f = !a && f in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
    for (var h = 0; h < e.length - 1; h++) {
        var c = e[h];
        if (!(c in f)) return;
        f = f[c]
    }
    e = e[e.length - 1];
    d = $jscomp.IS_SYMBOL_NATIVE && "es6" === d ? f[e] : null;
    b = b(d);
    null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, e, {
        configurable: !0,
        writable: !0,
        value: b
    }) : b !== d && (void 0 === $jscomp.propertyToPolyfillSymbol[e] && (d = 1E9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[e] = $jscomp.IS_SYMBOL_NATIVE ?
        $jscomp.global.Symbol(e) : $jscomp.POLYFILL_PREFIX + d + "$" + e), $jscomp.defineProperty(f, $jscomp.propertyToPolyfillSymbol[e], {
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
        f = d.next();
    $jscomp.generator.ensureIteratorResultIsObject_(f);
    if (f.done) this.yieldResult = f.value, this.nextAddress = b;
    else return this.yieldAllIterator_ = d, this.yield(f.value, b)
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
        var f = a.call(this.context_.yieldAllIterator_, b);
        $jscomp.generator.ensureIteratorResultIsObject_(f);
        if (!f.done) return this.context_.stop_(), f;
        var e = f.value
    } catch (h) {
        return this.context_.yieldAllIterator_ = null, this.context_.throw_(h), this.nextStep_()
    }
    this.context_.yieldAllIterator_ = null;
    d.call(this.context_, e);
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
    function b(f) {
        return a.next(f)
    }

    function d(f) {
        return a["throw"](f)
    }
    return new Promise(function(f, e) {
        function h(c) {
            c.done ? f(c.value) : Promise.resolve(c.value).then(b, d).then(h, e)
        }
        h(a.next())
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
    var b = function(h, c) {
        this.$jscomp$symbol$id_ = h;
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
        f = 0,
        e = function(h) {
            if (this instanceof e) throw new TypeError("Symbol is not a constructor");
            return new b(d + (h || "") + "_" + f++, h)
        };
    return e
}, "es6", "es3");
$jscomp.polyfill("Symbol.iterator", function(a) {
        if (a) return a;
        a = Symbol("Symbol.iterator");
        for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), d = 0; d < b.length; d++) {
            var f = $jscomp.global[b[d]];
            "function" === typeof f && "function" != typeof f.prototype[a] && $jscomp.defineProperty(f.prototype, a, {
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
        return c instanceof e ? c : new e(function(g, k) {
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
    var f = $jscomp.global.setTimeout;
    b.prototype.asyncExecuteFunction = function(c) {
        f(c, 0)
    };
    b.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length;) {
            var c = this.batch_;
            this.batch_ = [];
            for (var g = 0; g < c.length; ++g) {
                var k = c[g];
                c[g] = null;
                try {
                    k()
                } catch (l) {
                    this.asyncThrow_(l)
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
    var e = function(c) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        this.isRejectionHandled_ = !1;
        var g = this.createResolveAndReject_();
        try {
            c(g.resolve, g.reject)
        } catch (k) {
            g.reject(k)
        }
    };
    e.prototype.createResolveAndReject_ = function() {
        function c(l) {
            return function(q) {
                k || (k = !0, l.call(g, q))
            }
        }
        var g = this,
            k = !1;
        return {
            resolve: c(this.resolveTo_),
            reject: c(this.reject_)
        }
    };
    e.prototype.resolveTo_ = function(c) {
        if (c === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (c instanceof e) this.settleSameAsPromise_(c);
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
    e.prototype.resolveToNonPromiseObj_ = function(c) {
        var g = void 0;
        try {
            g = c.then
        } catch (k) {
            this.reject_(k);
            return
        }
        "function" == typeof g ? this.settleSameAsThenable_(g, c) : this.fulfill_(c)
    };
    e.prototype.reject_ = function(c) {
        this.settle_(2, c)
    };
    e.prototype.fulfill_ = function(c) {
        this.settle_(1, c)
    };
    e.prototype.settle_ = function(c, g) {
        if (0 != this.state_) throw Error("Cannot settle(" + c + ", " + g + "): Promise already settled in state" + this.state_);
        this.state_ = c;
        this.result_ = g;
        2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
        this.executeOnSettledCallbacks_()
    };
    e.prototype.scheduleUnhandledRejectionCheck_ = function() {
        var c = this;
        f(function() {
            if (c.notifyUnhandledRejection_()) {
                var g = $jscomp.global.console;
                "undefined" !== typeof g && g.error(c.result_)
            }
        }, 1)
    };
    e.prototype.notifyUnhandledRejection_ = function() {
        if (this.isRejectionHandled_) return !1;
        var c = $jscomp.global.CustomEvent,
            g = $jscomp.global.Event,
            k = $jscomp.global.dispatchEvent;
        if ("undefined" === typeof k) return !0;
        "function" === typeof c ? c = new c("unhandledrejection", {
                cancelable: !0
            }) :
            "function" === typeof g ? c = new g("unhandledrejection", {
                cancelable: !0
            }) : (c = $jscomp.global.document.createEvent("CustomEvent"), c.initCustomEvent("unhandledrejection", !1, !0, c));
        c.promise = this;
        c.reason = this.result_;
        return k(c)
    };
    e.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
            for (var c = 0; c < this.onSettledCallbacks_.length; ++c) h.asyncExecute(this.onSettledCallbacks_[c]);
            this.onSettledCallbacks_ = null
        }
    };
    var h = new b;
    e.prototype.settleSameAsPromise_ = function(c) {
        var g = this.createResolveAndReject_();
        c.callWhenSettled_(g.resolve, g.reject)
    };
    e.prototype.settleSameAsThenable_ = function(c, g) {
        var k = this.createResolveAndReject_();
        try {
            c.call(g, k.resolve, k.reject)
        } catch (l) {
            k.reject(l)
        }
    };
    e.prototype.then = function(c, g) {
        function k(r, u) {
            return "function" == typeof r ? function(w) {
                try {
                    l(r(w))
                } catch (x) {
                    q(x)
                }
            } : u
        }
        var l, q, y = new e(function(r, u) {
            l = r;
            q = u
        });
        this.callWhenSettled_(k(c, l), k(g, q));
        return y
    };
    e.prototype["catch"] = function(c) {
        return this.then(void 0, c)
    };
    e.prototype.callWhenSettled_ = function(c, g) {
        function k() {
            switch (l.state_) {
                case 1:
                    c(l.result_);
                    break;
                case 2:
                    g(l.result_);
                    break;
                default:
                    throw Error("Unexpected state: " + l.state_);
            }
        }
        var l = this;
        null == this.onSettledCallbacks_ ? h.asyncExecute(k) : this.onSettledCallbacks_.push(k);
        this.isRejectionHandled_ = !0
    };
    e.resolve = d;
    e.reject = function(c) {
        return new e(function(g, k) {
            k(c)
        })
    };
    e.race = function(c) {
        return new e(function(g, k) {
            for (var l = $jscomp.makeIterator(c), q = l.next(); !q.done; q = l.next()) d(q.value).callWhenSettled_(g, k)
        })
    };
    e.all = function(c) {
        var g = $jscomp.makeIterator(c),
            k = g.next();
        return k.done ? d([]) : new e(function(l,
            q) {
            function y(w) {
                return function(x) {
                    r[w] = x;
                    u--;
                    0 == u && l(r)
                }
            }
            var r = [],
                u = 0;
            do r.push(void 0), u++, d(k.value).callWhenSettled_(y(r.length - 1), q), k = g.next(); while (!k.done)
        })
    };
    return e
}, "es6", "es3");
$(document).on("click", ".close", function(a) {
    a.preventDefault();
    $(".modal").hide()
});
window.onclick = function(a) {
    a.target.classList.contains("modal") && $(".modal").hide()
};
var net = {
        56: "Binance Smart Chain (BSC) Mainnet",
        97: "Binance Smart Chain (BSC) Testnet",
        108: "ThunderCore (TT) Mainnet",
        264: "ThunderCore (TT) Mainnet",
        18: "ThunderCore (TT) Testnet",
        137: "Polygon (MATIC) Mainnet",
        80001: "Polygon (MATIC) Mumbai Testnet"
    },
    currency = {
        56: "BNB",
        97: "BNB",
        108: "TT",
        264: "TT",
        18: "TT",
        137: "MATIC",
        80001: "MATIC"
    },
    type = {
        56: "BEP-20",
        97: "BEP-20",
        108: "ERC-20",
        264: "ERC-20",
        18: "ERC-20",
        137: "ERC-20",
        80001: "ERC-20"
    },
    tracker = {
        56: "https://bscscan.com/",
        97: "https://testnet.bscscan.com/",
        108: "https://viewblock.io/thundercore/",
        264: "https://viewblock.io/thundercore/",
        18: "https://scan-testnet.thundercore.com/",
        137: "https://explorer-mainnet.maticvigil.com/",
        80001: "https://explorer-mumbai.maticvigil.com/"
    },
    trackerToken = {
        56: "token/",
        97: "token/",
        108: "address/",
        264: "address/",
        18: "address/",
        137: "address/",
        80001: "address/"
    },
    trackerAddress = {
        56: "address/",
        97: "address/",
        108: "address/",
        264: "address/",
        18: "address/",
        137: "address/",
        80001: "address/"
    },
    addresses = {
        56: "0xB4172656E6C8AEFFC45Af7BC30eEaE017BC90201",
        97: "0x4806c4b5773F7B094a2AEfF2aC69a98633baa115",
        108: "0xEFc3b67b56e2BC255E9fC80e4E94937B44f37675",
        264: "0xEFc3b67b56e2BC255E9fC80e4E94937B44f37675",
        137: "0x6Bb2Fbaf55D3dCfe5774c3c3bd5Bef727f1bAE96",
        80001: "0xB189272bbC2590C1b6D4E8072D22F4A1764Df663"
    },
    wrongnet = '<span class="err">Unsupported network!</span>',
    contractAddress, contract, contractSign, network, curnet, myAddress, signer, provider, builderCost, thisAddress, abi = [{
        inputs: [{
            internalType: "uint256",
            name: "_cost",
            type: "uint256"
        }],
        stateMutability: "nonpayable",
        type: "constructor"
    }, {
        anonymous: !1,
        inputs: [{
            indexed: !1,
            internalType: "address",
            name: "contractCreator",
            type: "address"
        }, {
            indexed: !0,
            internalType: "address",
            name: "contractAddress",
            type: "address"
        }, {
            indexed: !0,
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256"
        }],
        name: "ContractCreated",
        type: "event"
    }, {
        inputs: [],
        name: "beneficiary",
        outputs: [{
            internalType: "address",
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "newBeneficiary",
            type: "address"
        }],
        name: "changeBeneficiary",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }, {
        inputs: [{
            internalType: "uint256",
            name: "_newcost",
            type: "uint256"
        }],
        name: "changeCost",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "newOwner",
            type: "address"
        }],
        name: "changeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "_TokenOwner",
            type: "address"
        }],
        name: "contractsOfOwner",
        outputs: [{
            internalType: "address[]",
            name: "",
            type: "address[]"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "_TokenAddress",
            type: "address"
        }],
        name: "contractsOfToken",
        outputs: [{
            internalType: "address[]",
            name: "",
            type: "address[]"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "cost",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "_TokenAddress",
            type: "address"
        }, {
            internalType: "uint256",
            name: "_UnlockTime",
            type: "uint256"
        }],
        name: "createTokenLocker",
        outputs: [{
            internalType: "address",
            name: "contractAddress",
            type: "address"
        }],
        stateMutability: "payable",
        type: "function"
    }, {
        inputs: [],
        name: "myContracts",
        outputs: [{
            internalType: "address[]",
            name: "",
            type: "address[]"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "owner",
        outputs: [{
            internalType: "address",
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "totalBuilt",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }],
    abiLocker = [{
            inputs: [{
                internalType: "address",
                name: "_TokenAddress",
                type: "address"
            }, {
                internalType: "address",
                name: "_AssetOwner",
                type: "address"
            }, {
                internalType: "uint256",
                name: "_UnlockTime",
                type: "uint256"
            }],
            stateMutability: "nonpayable",
            type: "constructor"
        }, {
            inputs: [],
            name: "AssetOwner",
            outputs: [{
                internalType: "address",
                name: "",
                type: "address"
            }],
            stateMutability: "view",
            type: "function"
        }, {
            inputs: [],
            name: "LockedTokens",
            outputs: [{
                internalType: "uint256",
                name: "",
                type: "uint256"
            }],
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [],
            name: "TokenAddress",
            outputs: [{
                internalType: "address",
                name: "",
                type: "address"
            }],
            stateMutability: "view",
            type: "function"
        }, {
            inputs: [],
            name: "UnlockTime",
            outputs: [{
                internalType: "uint256",
                name: "",
                type: "uint256"
            }],
            stateMutability: "view",
            type: "function"
        }, {
            inputs: [],
            name: "locked",
            outputs: [{
                internalType: "bool",
                name: "",
                type: "bool"
            }],
            stateMutability: "view",
            type: "function"
        }, {
            inputs: [],
            name: "withdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
        }
    ],
    abiToken = [{
        inputs: [{
                internalType: "string",
                name: "_name",
                type: "string"
            }, {
                internalType: "string",
                name: "_symbol",
                type: "string"
            }, {
                internalType: "uint256",
                name: "_dec",
                type: "uint256"
            }, {
                internalType: "uint256",
                name: "_supply",
                type: "uint256"
            }, {
                internalType: "uint256",
                name: "_tax1",
                type: "uint256"
            }, {
                internalType: "address",
                name: "_address1",
                type: "address"
            }, {
                internalType: "uint256",
                name: "_tax2",
                type: "uint256"
            }, {
                internalType: "address",
                name: "_address2",
                type: "address"
            }, {
                internalType: "uint256",
                name: "_deflation",
                type: "uint256"
            }, {
                internalType: "uint256",
                name: "_minSupply",
                type: "uint256"
            },
            {
                internalType: "address",
                name: "_owner",
                type: "address"
            }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
    }, {
        anonymous: !1,
        inputs: [{
            indexed: !0,
            internalType: "address",
            name: "owner",
            type: "address"
        }, {
            indexed: !0,
            internalType: "address",
            name: "spender",
            type: "address"
        }, {
            indexed: !1,
            internalType: "uint256",
            name: "value",
            type: "uint256"
        }],
        name: "Approval",
        type: "event"
    }, {
        anonymous: !1,
        inputs: [{
            indexed: !0,
            internalType: "address",
            name: "from",
            type: "address"
        }, {
            indexed: !0,
            internalType: "address",
            name: "to",
            type: "address"
        }, {
            indexed: !1,
            internalType: "uint256",
            name: "value",
            type: "uint256"
        }],
        name: "Transfer",
        type: "event"
    }, {
        inputs: [],
        name: "addressTax1",
        outputs: [{
            internalType: "address",
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "addressTax2",
        outputs: [{
            internalType: "address",
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "owner",
            type: "address"
        }, {
            internalType: "address",
            name: "spender",
            type: "address"
        }],
        name: "allowance",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "spender",
            type: "address"
        }, {
            internalType: "uint256",
            name: "value",
            type: "uint256"
        }],
        name: "approve",
        outputs: [{
            internalType: "bool",
            name: "",
            type: "bool"
        }],
        stateMutability: "nonpayable",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "owner",
            type: "address"
        }],
        name: "balanceOf",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "burnt",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "decimals",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "deflation",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "initialSupply",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "minSupply",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "name",
        outputs: [{
            internalType: "string",
            name: "",
            type: "string"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "symbol",
        outputs: [{
            internalType: "string",
            name: "",
            type: "string"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "tax1",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "tax2",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "totalSupply",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "totalTax1",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "totalTax2",
        outputs: [{
            internalType: "uint256",
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "to",
            type: "address"
        }, {
            internalType: "uint256",
            name: "value",
            type: "uint256"
        }],
        name: "transfer",
        outputs: [{
            internalType: "bool",
            name: "",
            type: "bool"
        }],
        stateMutability: "nonpayable",
        type: "function"
    }, {
        inputs: [{
            internalType: "address",
            name: "from",
            type: "address"
        }, {
            internalType: "address",
            name: "to",
            type: "address"
        }, {
            internalType: "uint256",
            name: "value",
            type: "uint256"
        }],
        name: "transferFrom",
        outputs: [{
            internalType: "bool",
            name: "",
            type: "bool"
        }],
        stateMutability: "nonpayable",
        type: "function"
    }];
$(function() {
    $("#buildbtn").prop("disabled", !0);
    connect()
});

function connect() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
        provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.on("network", function(b, d) {
            d && getNetwork()
        });
        ethereum.on("accountsChanged", function(b) {
            getNetwork()
        });
        ethereum.on("connect", function(b) {
            getNetwork()
        });
        getNetwork();
        a.jumpToEnd()
    })
}

function getNetwork() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
        if (1 == a.nextAddress) return $("#actions").hide(), $("#connection").hide(), $("#connect").hide(), $("#wrongnetwork").hide(), a.yield(provider.getNetwork(), 2);
        network = a.yieldResult;
        curnet = network.chainId;
        net[curnet] ? (getAddress(), init(), $("#curnet").html(net[curnet]), $(".eth").html(currency[curnet]), $(".erc").html(type[curnet]), $("#wrongnetwork").hide()) : ($(".myAddress").html(""), $(".data").html(""), $(".eth").html("BNB/MATIC/TT"),
            $(".erc").html("BEP-20/ERC-20"), $("#buildbtn").prop("disabled", !0), $("#curnet").html(wrongnet), $("#wrongnetwork").show(), $("#actions").hide());
        a.jumpToEnd()
    })
}

function getAddress() {
    var a;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(b) {
        switch (b.nextAddress) {
            case 1:
                return signer = provider.getSigner(), b.setCatchFinallyBlocks(2), b.yield(signer.getAddress(), 4);
            case 4:
                myAddress = b.yieldResult;
                b.leaveTryBlock(3);
                break;
            case 2:
                a = b.enterCatchBlock(), console.log(a), !myAddress && window.ethereum && ethereum.request({
                    method: "eth_requestAccounts"
                }).then(getNetwork);
            case 3:
                $(".myAddress").html(myAddress), myAddress ? ($("#buildbtn").prop("disabled", !1), $("#errors").html(""),
                    $("#connection").hide(), $("#connect").hide(), $("#actions").show()) : ($("#buildbtn").prop("disabled", !0), $("#errors").html("Please connect to your wallet!"), $("#actions").hide(), window.ethereum && ($("#connection").show(), $("#connect").show())), b.jumpToEnd()
        }
    })
}

function init() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
        if (1 == a.nextAddress) return contract = new ethers.Contract(addresses[curnet], abi, provider), contractSign = contract.connect(signer), a.yield(contract.cost(), 2);
        builderCost = a.yieldResult;
        $("#buildercost").html(ethers.utils.formatEther(builderCost));
        makeTable();
        a.jumpToEnd()
    })
}

function makeTable() {
    var a, b, d, f, e, h, c, g, k, l, q, y, r, u, w, x, m, v;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(n) {
        switch (n.nextAddress) {
            case 1:
                return a = "", n.yield(contract.myContracts({
                    from: myAddress
                }), 2);
            case 2:
                b = n.yieldResult;
                if (!(0 < b.length)) {
                    a = "Not found";
                    n.jumpTo(3);
                    break
                }
                d = b;
                f = 0;
            case 4:
                if (!(f < d.length)) {
                    n.jumpTo(3);
                    break
                }
                e = d[f];
                h = new ethers.Contract(e, abiLocker, provider);
                return n.yield(h.TokenAddress(), 7);
            case 7:
                return c = n.yieldResult, n.yield(h.LockedTokens(), 8);
            case 8:
                return g = n.yieldResult,
                    k = new ethers.Contract(c, abiToken, provider), n.yield(k.name(), 9);
            case 9:
                return n.yield(k.symbol(), 10);
            case 10:
                return l = n.yieldResult, n.yield(k.decimals(), 11);
            case 11:
                return q = n.yieldResult, y = ethers.utils.formatUnits(g, q), r = y + l, n.yield(h.locked(), 12);
            case 12:
                return u = n.yieldResult, n.yield(h.UnlockTime(), 13);
            case 13:
                w = n.yieldResult;
                x = new Date(1E3 * Number(w));
                m = u ? "Locked&#128274;" : "Unlocked&#128275;";
                v = Number(f + 1);
                a = a + '<div class="tablerow" title="Click to open information" onclick="admin(\'' + e + '\')"><div class="no">' +
                    v + '</div><div class="address">' + e + '</div><div class="balances">' + r + '</div><div class="date">' + x + '</div><div class="status">' + m + "</div>";
                a += "</div>";
                f++;
                n.jumpTo(4);
                break;
            case 3:
                $("#mycontr").html(a), n.jumpToEnd()
        }
    })
}
$("#connect").on("click", function() {
    var a;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(b) {
        if (1 == b.nextAddress) return b.yield(ethereum.request({
            method: "eth_requestAccounts"
        }), 2);
        a = b.yieldResult;
        myAddress = a[0];
        getNetwork();
        b.jumpToEnd()
    })
});
$("#connect1").on("click", function() {
    var a;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(b) {
        if (1 == b.nextAddress) return b.yield(ethereum.request({
            method: "eth_requestAccounts"
        }), 2);
        a = b.yieldResult;
        myAddress = a[0];
        getNetwork();
        b.jumpToEnd()
    })
});
$("#buildbtn").click(function() {
    var a, b, d, f;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(e) {
        switch (e.nextAddress) {
            case 1:
                a = $("#newlockerdate").val();
                b = Date.parse(a);
                if (!(a && b > Date.now())) {
                    a && b <= Date.now() ? $("#errors").html("Error: unlock time must be in the future!") : $("#errors").html("Error: fields are empty or incorrect!");
                    e.jumpTo(0);
                    break
                }
                return e.yield(checkToken(), 3);
            case 3:
                d = e.yieldResult;
                f = $("#newlockertkn").val();
                if (!d) {
                    $("#errors").html("Error: check token address!");
                    e.jumpTo(0);
                    break
                }
                $("#errors").html("");
                return e.yield(contractSign.createTokenLocker(String(f), String(b / 1E3), {
                    value: builderCost
                }), 5);
            case 5:
                return tx = e.yieldResult, e.yield(tx.wait(), 6);
            case 6:
                init(), e.jumpToEnd()
        }
    })
});
$("#newlockertkn").on("keyup input", checkToken);

function checkToken() {
    var a, b, d, f, e;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(h) {
        switch (h.nextAddress) {
            case 1:
                $("#tokendata").html("");
                a = $("#newlockertkn").val();
                if ("" == a || !ethers.utils.isAddress(a)) return "" == a ? $("#tokendata").html("") : $("#tokendata").html('<span class="err">Error: check token address!</span>'), h["return"](!1);
                $("#errors").html("");
                h.setCatchFinallyBlocks(3);
                b = new ethers.Contract(a, abiToken, provider);
                return h.yield(b.name(), 5);
            case 5:
                return d = h.yieldResult, h.yield(b.symbol(),
                    6);
            case 6:
                f = h.yieldResult;
                if (d && f) return $("#tokendata").html('<span style="color: green">' + d + " (" + f + ")</span>"), h["return"](!0);
                $("#tokendata").html('<span class="err">Error: check token address!</span>');
                return h["return"](!1);
            case 3:
                return e = h.enterCatchBlock(), console.log(e), $("#tokendata").html('<span class="err">Error: check token address!</span>'), h["return"](!1)
        }
    })
}
$("#findtokenaddr").on("keyup input", checkToken2);

function checkToken2() {
    var a, b, d, f;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(e) {
        switch (e.nextAddress) {
            case 1:
                $("#bytokenresult").html("");
                a = $("#findtokenaddr").val();
                if ("" == a || !ethers.utils.isAddress(a)) return "" == a ? $("#bytokenresult").html("") : $("#bytokenresult").html('<span class="err">Error: check token address!</span>'), e["return"](!1);
                e.setCatchFinallyBlocks(3);
                b = new ethers.Contract(a, abiToken, provider);
                return e.yield(b.name(), 5);
            case 5:
                return d = e.yieldResult, e.yield(b.symbol(),
                    6);
            case 6:
                f = e.yieldResult;
                if (d && f) return $("#bytokenresult").html('<span style="color: green">' + d + " (" + f + ")</span>"), e["return"](!0);
                $("#bytokenresult").html('<span class="err">Error: check token address!</span>');
                return e["return"](!1);
            case 3:
                return e.enterCatchBlock(), $("#bytokenresult").html('<span class="err">Error: check token address!</span>'), e["return"](!1)
        }
    })
}
$("#findbytoken").click(findByToken);

function findByToken() {
    var a, b, d, f, e, h, c, g, k, l, q, y, r, u, w, x, m, v, n;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(p) {
        switch (p.nextAddress) {
            case 1:
                return $("#foundbytoken").html(""), a = "", p.yield(checkToken2(), 2);
            case 2:
                b = p.yieldResult;
                console.log(b);
                if (!b) {
                    $("#bytokenresult").html('<span class="err">Error: check token address!</span>');
                    p.jumpTo(3);
                    break
                }
                d = $("#findtokenaddr").val();
                return p.yield(contract.contractsOfToken(d), 4);
            case 4:
                f = p.yieldResult;
                if (!(0 < f.length)) {
                    a = "Not found";
                    p.jumpTo(3);
                    break
                }
                e = f;
                h = 0;
            case 6:
                if (!(h < e.length)) {
                    p.jumpTo(3);
                    break
                }
                c = e[h];
                g = new ethers.Contract(c, abiLocker, provider);
                return p.yield(g.TokenAddress(), 9);
            case 9:
                return d = p.yieldResult, p.yield(g.LockedTokens(), 10);
            case 10:
                return k = p.yieldResult, l = new ethers.Contract(d, abiToken, provider), p.yield(l.name(), 11);
            case 11:
                return p.yield(l.symbol(), 12);
            case 12:
                return q = p.yieldResult, p.yield(l.decimals(), 13);
            case 13:
                return y = p.yieldResult, r = ethers.utils.formatUnits(k, y), u = r + q, p.yield(g.locked(), 14);
            case 14:
                return w = p.yieldResult,
                    p.yield(g.UnlockTime(), 15);
            case 15:
                x = p.yieldResult;
                m = new Date(1E3 * Number(x));
                v = w ? "Locked&#128274;" : "Unlocked&#128275;";
                n = Number(h + 1);
                a = a + '<div class="tablerow" title="Click to open information" onclick="admin(\'' + c + '\')"><div class="no">' + n + '</div><div class="address">' + c + '</div><div class="balances">' + u + '</div><div class="date">' + m + '</div><div class="status">' + v + "</div>";
                a += "</div>";
                h++;
                p.jumpTo(6);
                break;
            case 3:
                $("#foundbytoken").html(a), p.jumpToEnd()
        }
    })
}
$("#findowneraddr").on("keyup input", checkAddress);

function checkAddress() {
    $("#byownerresult").html("");
    var a = $("#findowneraddr").val();
    if ("" != a && ethers.utils.isAddress(a)) return $("#byownerresult").html(""), !0;
    "" == a ? $("#byownerresult").html("") : $("#byownerresult").html('<span class="err">Error: check address!</span>');
    return !1
}
$("#findbyowner").click(findByOwner);

function findByOwner() {
    var a, b, d, f, e, h, c, g, k, l, q, y, r, u, w, x, m, v, n, p;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(t) {
        switch (t.nextAddress) {
            case 1:
                $("#foundbyowner").html("");
                a = "";
                b = checkAddress();
                console.log(b);
                if (!b) {
                    $("#byownerresult").html('<span class="err">Error: check address!</span>');
                    t.jumpTo(2);
                    break
                }
                d = $("#findowneraddr").val();
                return t.yield(contract.contractsOfOwner(d), 3);
            case 3:
                f = t.yieldResult;
                if (!(0 < f.length)) {
                    a = "Not found";
                    t.jumpTo(2);
                    break
                }
                e = f;
                h = 0;
            case 5:
                if (!(h < e.length)) {
                    t.jumpTo(2);
                    break
                }
                c = e[h];
                g = new ethers.Contract(c, abiLocker, provider);
                return t.yield(g.TokenAddress(), 8);
            case 8:
                return k = t.yieldResult, t.yield(g.LockedTokens(), 9);
            case 9:
                return l = t.yieldResult, q = new ethers.Contract(k, abiToken, provider), t.yield(q.name(), 10);
            case 10:
                return t.yield(q.symbol(), 11);
            case 11:
                return y = t.yieldResult, t.yield(q.decimals(), 12);
            case 12:
                return r = t.yieldResult, u = ethers.utils.formatUnits(l, r), w = u + y, t.yield(g.locked(), 13);
            case 13:
                return x = t.yieldResult, t.yield(g.UnlockTime(), 14);
            case 14:
                m = t.yieldResult;
                v = new Date(1E3 * Number(m));
                n = x ? "Locked&#128274;" : "Unlocked&#128275;";
                p = Number(h + 1);
                a = a + '<div class="tablerow" title="Click to open information" onclick="admin(\'' + c + '\')"><div class="no">' + p + '</div><div class="address">' + c + '</div><div class="balances">' + w + '</div><div class="date">' + v + '</div><div class="status">' + n + "</div>";
                a += "</div>";
                h++;
                t.jumpTo(5);
                break;
            case 2:
                $("#foundbyowner").html(a), t.jumpToEnd()
        }
    })
}

function admin(a) {
    var b, d, f, e, h, c, g, k, l, q, y, r, u, w, x;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(m) {
        switch (m.nextAddress) {
            case 1:
                return thisAddress = a, $("#admin").show(), $(".thisAddr").html(a), $("#viewThis").html('<a title="View on explorer" target="_blank" href="' + tracker[curnet] + trackerAddress[curnet] + a + '">' + a + "</a>"), $("#thisLockerHref").html(tracker[curnet] + trackerAddress[curnet] + a), b = new ethers.Contract(a, abiLocker, provider), d = b.connect(signer), m.yield(b.TokenAddress(), 2);
            case 2:
                return f =
                    m.yieldResult, m.yield(b.LockedTokens(), 3);
            case 3:
                return e = m.yieldResult, h = new ethers.Contract(f, abiToken, provider), m.yield(h.name(), 4);
            case 4:
                return c = m.yieldResult, m.yield(h.symbol(), 5);
            case 5:
                return g = m.yieldResult, m.yield(h.decimals(), 6);
            case 6:
                return k = m.yieldResult, l = ethers.utils.formatUnits(e, k), q = l + g, $(".thisTokenAddress").html(f), $("#viewThisToken").html('<a title="View on explorer" target="_blank" href="' + tracker[curnet] + trackerToken[curnet] + f + '">' + f + "</a>"), $("#thisTokenHref").html(tracker[curnet] +
                    trackerToken[curnet] + f), $(".thisName").html(c), $(".thisSymbol").html(g), $("#thisLocked").html(q), m.yield(b.locked(), 7);
            case 7:
                return y = m.yieldResult, m.yield(b.UnlockTime(), 8);
            case 8:
                return r = m.yieldResult, u = new Date(1E3 * Number(r)), y ? (w = "Locked&#128274;", $("#thisWithdraw").prop("disabled", !0), $("#adminLock").show()) : (w = "Unlocked&#128275;", $("#thisWithdraw").prop("disabled", !1), $("#adminLock").hide()), $("#thisStatus").html(w), $(".thisDate").html(u), m.yield(b.AssetOwner(), 9);
            case 9:
                x = m.yieldResult, $("#thisOwner").html(x),
                    x == myAddress ? ($("#isowner").html('<span style="color: green"> (you)</span>'), $(".onlyowner").show()) : ($("#isowner").html(""), $(".onlyowner").hide()), $("#netid").html(curnet), $("#addToken").click(function() {
                        return $jscomp.asyncExecutePromiseGeneratorProgram(function(v) {
                            watchToken(f, g, k);
                            v.jumpToEnd()
                        })
                    }), $("#thisWithdraw").click(function() {
                        return $jscomp.asyncExecutePromiseGeneratorProgram(function(v) {
                            if (1 == v.nextAddress) return 0 < Number(e) ? v.yield(d.withdraw({
                                gasLimit: 2E5
                            }), 3) : ($("#nothing").fadeIn(1E3).fadeOut(1E3),
                                v.jumpTo(0));
                            if (4 != v.nextAddress) return tx = v.yieldResult, v.yield(tx.wait(), 4);
                            admin(thisAddress);
                            v.jumpToEnd()
                        })
                    }), getQRAdmin(a), $("#uiAddr").attr("href", "https://tokenlock.org/locker?id=" + a + "&net=" + curnet), $("#uiAddr").html("https://tokenlock.org/locker?id=" + a + "&net=" + curnet), m.jumpToEnd()
        }
    })
}

function watchToken(a, b, d) {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function(f) {
        ethereum.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: String(a),
                    symbol: String(b),
                    decimals: String(d)
                }
            }
        });
        f.jumpToEnd()
    })
}
$("#copyAddressAdmin").on("click", function() {
    var a = $("<textarea>");
    $("body").append(a);
    a.val($("#thisAddr").html()).select();
    document.execCommand("copy");
    a.remove()
});
$("#copyUIlink").on("click", function() {
    var a = $("<textarea>");
    $("body").append(a);
    a.val($("#uiAddr").text()).select();
    document.execCommand("copy");
    a.remove()
});

function copyToClipboard(a) {
    var b = $("<textarea>");
    $("body").append(b);
    b.val($(a).text()).select();
    document.execCommand("copy");
    b.remove()
}

function copyToClipboardTxt(a) {
    var b = $("<textarea>");
    $("body").append(b);
    b.val($(a).txt()).select();
    document.execCommand("copy");
    b.remove()
}

function download(a, b) {
    var d = document.getElementById(b).textContent,
        f = document.createElement("a");
    f.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(d));
    f.setAttribute("download", a);
    f.style.display = "none";
    document.body.appendChild(f);
    f.click();
    document.body.removeChild(f)
}

function getQRAdmin(a) {
    a = encodeURIComponent(a);
    $("#adminqr").html('<img style="max-width: 80%" src="https://dappbuilder.org/php/qr.php?data=' + a + '">');
    $("#admind").attr("href", "https://dappbuilder.org/php/qr.php?data=" + a)
};