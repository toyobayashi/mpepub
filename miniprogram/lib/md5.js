(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.denostd = global.denostd || {}, global.denostd.hash = global.denostd.hash || {}, global.denostd.hash.md5 = {})));
}(this, (function (exports) { 'use strict';
    var text = require('./text.js')
    var TextEncoder = text.TextEncoder
    var TextDecoder = text.TextDecoder

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    // Ported from Go
    // https://github.com/golang/go/blob/go1.12.5/src/encoding/hex/hex.go
    // Copyright 2009 The Go Authors. All rights reserved.
    // Use of this source code is governed by a BSD-style
    // license that can be found in the LICENSE file.
    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    var hextable = new TextEncoder().encode("0123456789abcdef");
    /**
     * EncodedLen returns the length of an encoding of n source bytes. Specifically,
     * it returns n * 2.
     * @param n
     */
    function encodedLen(n) {
        return n * 2;
    }
    /**
     * Encode encodes `src` into `encodedLen(src.length)` bytes.
     * @param src
     */
    function encode(src) {
        var dst = new Uint8Array(encodedLen(src.length));
        for (var i = 0; i < dst.length; i++) {
            var v = src[i];
            dst[i * 2] = hextable[v >> 4];
            dst[i * 2 + 1] = hextable[v & 0x0f];
        }
        return dst;
    }
    /**
     * EncodeToString returns the hexadecimal encoding of `src`.
     * @param src
     */
    function encodeToString(src) {
        return new TextDecoder().decode(encode(src));
    }

    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    var _a, _b, _c, _d, _block, _pos, _n0, _n1;
    var TYPE_ERROR_MSG = "md5: `data` is invalid type";
    var BLOCK_SIZE = 64;
    /** Md5 hash */
    var Md5 = /** @class */ (function () {
        function Md5() {
            _a.set(this, void 0);
            _b.set(this, void 0);
            _c.set(this, void 0);
            _d.set(this, void 0);
            _block.set(this, void 0);
            _pos.set(this, void 0);
            _n0.set(this, void 0);
            _n1.set(this, void 0);
            __classPrivateFieldSet(this, _a, 0x67452301);
            __classPrivateFieldSet(this, _b, 0xefcdab89);
            __classPrivateFieldSet(this, _c, 0x98badcfe);
            __classPrivateFieldSet(this, _d, 0x10325476);
            __classPrivateFieldSet(this, _block, new Uint8Array(BLOCK_SIZE));
            __classPrivateFieldSet(this, _pos, 0);
            __classPrivateFieldSet(this, _n0, 0);
            __classPrivateFieldSet(this, _n1, 0);
        }
        Md5.prototype.addLength = function (len) {
            var n0 = __classPrivateFieldGet(this, _n0);
            n0 += len;
            if (n0 > 0xffffffff)
                __classPrivateFieldSet(this, _n1, __classPrivateFieldGet(this, _n1) + 1);
            __classPrivateFieldSet(this, _n0, n0 >>> 0);
        };
        Md5.prototype.hash = function (block) {
            var a = __classPrivateFieldGet(this, _a);
            var b = __classPrivateFieldGet(this, _b);
            var c = __classPrivateFieldGet(this, _c);
            var d = __classPrivateFieldGet(this, _d);
            var blk = function (i) {
                return block[i] |
                    (block[i + 1] << 8) |
                    (block[i + 2] << 16) |
                    (block[i + 3] << 24);
            };
            var rol32 = function (x, n) { return (x << n) | (x >>> (32 - n)); };
            var x0 = blk(0);
            var x1 = blk(4);
            var x2 = blk(8);
            var x3 = blk(12);
            var x4 = blk(16);
            var x5 = blk(20);
            var x6 = blk(24);
            var x7 = blk(28);
            var x8 = blk(32);
            var x9 = blk(36);
            var xa = blk(40);
            var xb = blk(44);
            var xc = blk(48);
            var xd = blk(52);
            var xe = blk(56);
            var xf = blk(60);
            // round 1
            a = b + rol32((((c ^ d) & b) ^ d) + a + x0 + 0xd76aa478, 7);
            d = a + rol32((((b ^ c) & a) ^ c) + d + x1 + 0xe8c7b756, 12);
            c = d + rol32((((a ^ b) & d) ^ b) + c + x2 + 0x242070db, 17);
            b = c + rol32((((d ^ a) & c) ^ a) + b + x3 + 0xc1bdceee, 22);
            a = b + rol32((((c ^ d) & b) ^ d) + a + x4 + 0xf57c0faf, 7);
            d = a + rol32((((b ^ c) & a) ^ c) + d + x5 + 0x4787c62a, 12);
            c = d + rol32((((a ^ b) & d) ^ b) + c + x6 + 0xa8304613, 17);
            b = c + rol32((((d ^ a) & c) ^ a) + b + x7 + 0xfd469501, 22);
            a = b + rol32((((c ^ d) & b) ^ d) + a + x8 + 0x698098d8, 7);
            d = a + rol32((((b ^ c) & a) ^ c) + d + x9 + 0x8b44f7af, 12);
            c = d + rol32((((a ^ b) & d) ^ b) + c + xa + 0xffff5bb1, 17);
            b = c + rol32((((d ^ a) & c) ^ a) + b + xb + 0x895cd7be, 22);
            a = b + rol32((((c ^ d) & b) ^ d) + a + xc + 0x6b901122, 7);
            d = a + rol32((((b ^ c) & a) ^ c) + d + xd + 0xfd987193, 12);
            c = d + rol32((((a ^ b) & d) ^ b) + c + xe + 0xa679438e, 17);
            b = c + rol32((((d ^ a) & c) ^ a) + b + xf + 0x49b40821, 22);
            // round 2
            a = b + rol32((((b ^ c) & d) ^ c) + a + x1 + 0xf61e2562, 5);
            d = a + rol32((((a ^ b) & c) ^ b) + d + x6 + 0xc040b340, 9);
            c = d + rol32((((d ^ a) & b) ^ a) + c + xb + 0x265e5a51, 14);
            b = c + rol32((((c ^ d) & a) ^ d) + b + x0 + 0xe9b6c7aa, 20);
            a = b + rol32((((b ^ c) & d) ^ c) + a + x5 + 0xd62f105d, 5);
            d = a + rol32((((a ^ b) & c) ^ b) + d + xa + 0x02441453, 9);
            c = d + rol32((((d ^ a) & b) ^ a) + c + xf + 0xd8a1e681, 14);
            b = c + rol32((((c ^ d) & a) ^ d) + b + x4 + 0xe7d3fbc8, 20);
            a = b + rol32((((b ^ c) & d) ^ c) + a + x9 + 0x21e1cde6, 5);
            d = a + rol32((((a ^ b) & c) ^ b) + d + xe + 0xc33707d6, 9);
            c = d + rol32((((d ^ a) & b) ^ a) + c + x3 + 0xf4d50d87, 14);
            b = c + rol32((((c ^ d) & a) ^ d) + b + x8 + 0x455a14ed, 20);
            a = b + rol32((((b ^ c) & d) ^ c) + a + xd + 0xa9e3e905, 5);
            d = a + rol32((((a ^ b) & c) ^ b) + d + x2 + 0xfcefa3f8, 9);
            c = d + rol32((((d ^ a) & b) ^ a) + c + x7 + 0x676f02d9, 14);
            b = c + rol32((((c ^ d) & a) ^ d) + b + xc + 0x8d2a4c8a, 20);
            // round 3
            a = b + rol32((b ^ c ^ d) + a + x5 + 0xfffa3942, 4);
            d = a + rol32((a ^ b ^ c) + d + x8 + 0x8771f681, 11);
            c = d + rol32((d ^ a ^ b) + c + xb + 0x6d9d6122, 16);
            b = c + rol32((c ^ d ^ a) + b + xe + 0xfde5380c, 23);
            a = b + rol32((b ^ c ^ d) + a + x1 + 0xa4beea44, 4);
            d = a + rol32((a ^ b ^ c) + d + x4 + 0x4bdecfa9, 11);
            c = d + rol32((d ^ a ^ b) + c + x7 + 0xf6bb4b60, 16);
            b = c + rol32((c ^ d ^ a) + b + xa + 0xbebfbc70, 23);
            a = b + rol32((b ^ c ^ d) + a + xd + 0x289b7ec6, 4);
            d = a + rol32((a ^ b ^ c) + d + x0 + 0xeaa127fa, 11);
            c = d + rol32((d ^ a ^ b) + c + x3 + 0xd4ef3085, 16);
            b = c + rol32((c ^ d ^ a) + b + x6 + 0x04881d05, 23);
            a = b + rol32((b ^ c ^ d) + a + x9 + 0xd9d4d039, 4);
            d = a + rol32((a ^ b ^ c) + d + xc + 0xe6db99e5, 11);
            c = d + rol32((d ^ a ^ b) + c + xf + 0x1fa27cf8, 16);
            b = c + rol32((c ^ d ^ a) + b + x2 + 0xc4ac5665, 23);
            // round 4
            a = b + rol32((c ^ (b | ~d)) + a + x0 + 0xf4292244, 6);
            d = a + rol32((b ^ (a | ~c)) + d + x7 + 0x432aff97, 10);
            c = d + rol32((a ^ (d | ~b)) + c + xe + 0xab9423a7, 15);
            b = c + rol32((d ^ (c | ~a)) + b + x5 + 0xfc93a039, 21);
            a = b + rol32((c ^ (b | ~d)) + a + xc + 0x655b59c3, 6);
            d = a + rol32((b ^ (a | ~c)) + d + x3 + 0x8f0ccc92, 10);
            c = d + rol32((a ^ (d | ~b)) + c + xa + 0xffeff47d, 15);
            b = c + rol32((d ^ (c | ~a)) + b + x1 + 0x85845dd1, 21);
            a = b + rol32((c ^ (b | ~d)) + a + x8 + 0x6fa87e4f, 6);
            d = a + rol32((b ^ (a | ~c)) + d + xf + 0xfe2ce6e0, 10);
            c = d + rol32((a ^ (d | ~b)) + c + x6 + 0xa3014314, 15);
            b = c + rol32((d ^ (c | ~a)) + b + xd + 0x4e0811a1, 21);
            a = b + rol32((c ^ (b | ~d)) + a + x4 + 0xf7537e82, 6);
            d = a + rol32((b ^ (a | ~c)) + d + xb + 0xbd3af235, 10);
            c = d + rol32((a ^ (d | ~b)) + c + x2 + 0x2ad7d2bb, 15);
            b = c + rol32((d ^ (c | ~a)) + b + x9 + 0xeb86d391, 21);
            __classPrivateFieldSet(this, _a, (__classPrivateFieldGet(this, _a) + a) >>> 0);
            __classPrivateFieldSet(this, _b, (__classPrivateFieldGet(this, _b) + b) >>> 0);
            __classPrivateFieldSet(this, _c, (__classPrivateFieldGet(this, _c) + c) >>> 0);
            __classPrivateFieldSet(this, _d, (__classPrivateFieldGet(this, _d) + d) >>> 0);
        };
        /**
         * Update internal state
         * @param data data to update, data cannot exceed 2^32 bytes
         */
        Md5.prototype.update = function (data) {
            var msg;
            if (typeof data === "string") {
                msg = new TextEncoder().encode(data);
            }
            else if (typeof data === "object") {
                if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
                    msg = new Uint8Array(data);
                }
                else {
                    throw new Error(TYPE_ERROR_MSG);
                }
            }
            else {
                throw new Error(TYPE_ERROR_MSG);
            }
            var pos = __classPrivateFieldGet(this, _pos);
            var free = BLOCK_SIZE - pos;
            if (msg.length < free) {
                __classPrivateFieldGet(this, _block).set(msg, pos);
                pos += msg.length;
            }
            else {
                // hash first block
                __classPrivateFieldGet(this, _block).set(msg.slice(0, free), pos);
                this.hash(__classPrivateFieldGet(this, _block));
                // hash as many blocks as possible
                var i = free;
                while (i + BLOCK_SIZE <= msg.length) {
                    this.hash(msg.slice(i, i + BLOCK_SIZE));
                    i += BLOCK_SIZE;
                }
                // store leftover
                __classPrivateFieldGet(this, _block).fill(0).set(msg.slice(i), 0);
                pos = msg.length - i;
            }
            __classPrivateFieldSet(this, _pos, pos);
            this.addLength(msg.length);
            return this;
        };
        /** Returns final hash */
        Md5.prototype.digest = function () {
            var padLen = BLOCK_SIZE - __classPrivateFieldGet(this, _pos);
            if (padLen < 9)
                padLen += BLOCK_SIZE;
            var pad = new Uint8Array(padLen);
            pad[0] = 0x80;
            var n0 = __classPrivateFieldGet(this, _n0) << 3;
            var n1 = (__classPrivateFieldGet(this, _n1) << 3) | (__classPrivateFieldGet(this, _n0) >>> 29);
            pad[pad.length - 8] = n0 & 0xff;
            pad[pad.length - 7] = (n0 >>> 8) & 0xff;
            pad[pad.length - 6] = (n0 >>> 16) & 0xff;
            pad[pad.length - 5] = (n0 >>> 24) & 0xff;
            pad[pad.length - 4] = n1 & 0xff;
            pad[pad.length - 3] = (n1 >>> 8) & 0xff;
            pad[pad.length - 2] = (n1 >>> 16) & 0xff;
            pad[pad.length - 1] = (n1 >>> 24) & 0xff;
            this.update(pad.buffer);
            var hash = new ArrayBuffer(16);
            var hashView = new DataView(hash);
            hashView.setUint32(0, __classPrivateFieldGet(this, _a), true);
            hashView.setUint32(4, __classPrivateFieldGet(this, _b), true);
            hashView.setUint32(8, __classPrivateFieldGet(this, _c), true);
            hashView.setUint32(12, __classPrivateFieldGet(this, _d), true);
            return hash;
        };
        /**
         * Returns hash as a string of given format
         * @param format format of output string (hex or base64). Default is hex
         */
        Md5.prototype.toString = function (format) {
            if (format === void 0) { format = "hex"; }
            var hash = this.digest();
            switch (format) {
                case "hex":
                    return encodeToString(new Uint8Array(hash));
                case "base64": {
                    var data = new Uint8Array(hash);
                    var dataString = "";
                    for (var i = 0; i < data.length; ++i) {
                        dataString += String.fromCharCode(data[i]);
                    }
                    return btoa(dataString);
                }
                default:
                    throw new Error("md5: invalid format");
            }
        };
        return Md5;
    }());
    _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap(), _block = new WeakMap(), _pos = new WeakMap(), _n0 = new WeakMap(), _n1 = new WeakMap();

    exports.Md5 = Md5;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
