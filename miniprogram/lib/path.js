(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.denostd = global.denostd || {}, global.denostd.node = global.denostd.node || {}, global.denostd.node.path = {})));
}(this, (function (exports) { 'use strict';

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
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    // Copyright the Browserify authors. MIT License.
    // Ported from https://github.com/browserify/path-browserify/
    /** This module is browser compatible. */
    var _a, _b, _c;
    // Alphabet chars.
    var CHAR_UPPERCASE_A = 65; /* A */
    var CHAR_LOWERCASE_A = 97; /* a */
    var CHAR_UPPERCASE_Z = 90; /* Z */
    var CHAR_LOWERCASE_Z = 122; /* z */
    // Non-alphabetic chars.
    var CHAR_DOT = 46; /* . */
    var CHAR_FORWARD_SLASH = 47; /* / */
    var CHAR_BACKWARD_SLASH = 92; /* \ */
    var CHAR_COLON = 58; /* : */
    var CHAR_QUESTION_MARK = 63; /* ? */
    var NATIVE_OS = "linux";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var navigator = navigator;
    if ((_c = (_b = (_a = navigator === null || navigator === void 0 ? void 0 : navigator.appVersion) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, "Win")) !== null && _c !== void 0 ? _c : false) {
        NATIVE_OS = "windows";
    }
    else if ((typeof process !== "undefined" && process.browser === undefined)) {
        NATIVE_OS = (process.platform === "win32") ? "windows" : process.platform;
    }
    // TODO(nayeemrmn): Improve OS detection in browsers beyond Windows.
    var isWindows = NATIVE_OS == "windows";

    // Copyright the Browserify authors. MIT License.
    function assertPath(path) {
        if (typeof path !== "string") {
            throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
        }
    }
    function isPosixPathSeparator(code) {
        return code === CHAR_FORWARD_SLASH;
    }
    function isPathSeparator(code) {
        return isPosixPathSeparator(code) || code === CHAR_BACKWARD_SLASH;
    }
    function isWindowsDeviceRoot(code) {
        return ((code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z) ||
            (code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z));
    }
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
        var res = "";
        var lastSegmentLength = 0;
        var lastSlash = -1;
        var dots = 0;
        var code;
        for (var i = 0, len = path.length; i <= len; ++i) {
            if (i < len)
                code = path.charCodeAt(i);
            else if (isPathSeparator(code))
                break;
            else
                code = CHAR_FORWARD_SLASH;
            if (isPathSeparator(code)) {
                if (lastSlash === i - 1 || dots === 1) ;
                else if (lastSlash !== i - 1 && dots === 2) {
                    if (res.length < 2 ||
                        lastSegmentLength !== 2 ||
                        res.charCodeAt(res.length - 1) !== CHAR_DOT ||
                        res.charCodeAt(res.length - 2) !== CHAR_DOT) {
                        if (res.length > 2) {
                            var lastSlashIndex = res.lastIndexOf(separator);
                            if (lastSlashIndex === -1) {
                                res = "";
                                lastSegmentLength = 0;
                            }
                            else {
                                res = res.slice(0, lastSlashIndex);
                                lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                            }
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                        else if (res.length === 2 || res.length === 1) {
                            res = "";
                            lastSegmentLength = 0;
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    }
                    if (allowAboveRoot) {
                        if (res.length > 0)
                            res += separator + "..";
                        else
                            res = "..";
                        lastSegmentLength = 2;
                    }
                }
                else {
                    if (res.length > 0)
                        res += separator + path.slice(lastSlash + 1, i);
                    else
                        res = path.slice(lastSlash + 1, i);
                    lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
            }
            else if (code === CHAR_DOT && dots !== -1) {
                ++dots;
            }
            else {
                dots = -1;
            }
        }
        return res;
    }
    function _format(sep, pathObject) {
        var dir = pathObject.dir || pathObject.root;
        var base = pathObject.base ||
            (pathObject.name || "") + (pathObject.ext || "");
        if (!dir)
            return base;
        if (dir === pathObject.root)
            return dir + base;
        return dir + sep + base;
    }

    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    var DenoStdInternalError = /** @class */ (function (_super) {
        __extends(DenoStdInternalError, _super);
        function DenoStdInternalError(message) {
            var _this = _super.call(this, message) || this;
            _this.name = "DenoStdInternalError";
            return _this;
        }
        return DenoStdInternalError;
    }(Error));
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg) {
        if (msg === void 0) { msg = ""; }
        if (!expr) {
            throw new DenoStdInternalError(msg);
        }
    }

    // Copyright the Browserify authors. MIT License.
    var sep = "\\";
    var delimiter = ";";
    function resolve() {
        var pathSegments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pathSegments[_i] = arguments[_i];
        }
        var resolvedDevice = "";
        var resolvedTail = "";
        var resolvedAbsolute = false;
        for (var i = pathSegments.length - 1; i >= -1; i--) {
            var path = void 0;
            if (i >= 0) {
                path = pathSegments[i];
            }
            else if (!resolvedDevice) {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            else {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            assertPath(path);
            var len = path.length;
            // Skip empty entries
            if (len === 0)
                continue;
            var rootEnd = 0;
            var device = "";
            var isAbsolute_1 = false;
            var code = path.charCodeAt(0);
            // Try to match a root
            if (len > 1) {
                if (isPathSeparator(code)) {
                    // Possible UNC root
                    // If we started with a separator, we know we at least have an
                    // absolute path of some kind (UNC or otherwise)
                    isAbsolute_1 = true;
                    if (isPathSeparator(path.charCodeAt(1))) {
                        // Matched double path separator at beginning
                        var j = 2;
                        var last = j;
                        // Match 1 or more non-path separators
                        for (; j < len; ++j) {
                            if (isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            var firstPart = path.slice(last, j);
                            // Matched!
                            last = j;
                            // Match 1 or more path separators
                            for (; j < len; ++j) {
                                if (!isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j < len && j !== last) {
                                // Matched!
                                last = j;
                                // Match 1 or more non-path separators
                                for (; j < len; ++j) {
                                    if (isPathSeparator(path.charCodeAt(j)))
                                        break;
                                }
                                if (j === len) {
                                    // We matched a UNC root only
                                    device = "\\\\" + firstPart + "\\" + path.slice(last);
                                    rootEnd = j;
                                }
                                else if (j !== last) {
                                    // We matched a UNC root with leftovers
                                    device = "\\\\" + firstPart + "\\" + path.slice(last, j);
                                    rootEnd = j;
                                }
                            }
                        }
                    }
                    else {
                        rootEnd = 1;
                    }
                }
                else if (isWindowsDeviceRoot(code)) {
                    // Possible device root
                    if (path.charCodeAt(1) === CHAR_COLON) {
                        device = path.slice(0, 2);
                        rootEnd = 2;
                        if (len > 2) {
                            if (isPathSeparator(path.charCodeAt(2))) {
                                // Treat separator following drive name as an absolute path
                                // indicator
                                isAbsolute_1 = true;
                                rootEnd = 3;
                            }
                        }
                    }
                }
            }
            else if (isPathSeparator(code)) {
                // `path` contains just a path separator
                rootEnd = 1;
                isAbsolute_1 = true;
            }
            if (device.length > 0 &&
                resolvedDevice.length > 0 &&
                device.toLowerCase() !== resolvedDevice.toLowerCase()) {
                // This path points to another device so it is not applicable
                continue;
            }
            if (resolvedDevice.length === 0 && device.length > 0) {
                resolvedDevice = device;
            }
            if (!resolvedAbsolute) {
                resolvedTail = path.slice(rootEnd) + "\\" + resolvedTail;
                resolvedAbsolute = isAbsolute_1;
            }
            if (resolvedAbsolute && resolvedDevice.length > 0)
                break;
        }
        // At this point the path should be resolved to a full absolute path,
        // but handle relative paths to be safe (might happen when process.cwd()
        // fails)
        // Normalize the tail path
        resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
        return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
    }
    function normalize(path) {
        assertPath(path);
        var len = path.length;
        if (len === 0)
            return ".";
        var rootEnd = 0;
        var device;
        var isAbsolute = false;
        var code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (isPathSeparator(code)) {
                // Possible UNC root
                // If we started with a separator, we know we at least have an absolute
                // path of some kind (UNC or otherwise)
                isAbsolute = true;
                if (isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    var j = 2;
                    var last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        var firstPart = path.slice(last, j);
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                // Return the normalized version of the UNC root since there
                                // is nothing left to process
                                return "\\\\" + firstPart + "\\" + path.slice(last) + "\\";
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                device = "\\\\" + firstPart + "\\" + path.slice(last, j);
                                rootEnd = j;
                            }
                        }
                    }
                }
                else {
                    rootEnd = 1;
                }
            }
            else if (isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === CHAR_COLON) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator(path.charCodeAt(2))) {
                            // Treat separator following drive name as an absolute path
                            // indicator
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        }
        else if (isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid unnecessary
            // work
            return "\\";
        }
        var tail;
        if (rootEnd < len) {
            tail = normalizeString(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator);
        }
        else {
            tail = "";
        }
        if (tail.length === 0 && !isAbsolute)
            tail = ".";
        if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) {
            tail += "\\";
        }
        if (device === undefined) {
            if (isAbsolute) {
                if (tail.length > 0)
                    return "\\" + tail;
                else
                    return "\\";
            }
            else if (tail.length > 0) {
                return tail;
            }
            else {
                return "";
            }
        }
        else if (isAbsolute) {
            if (tail.length > 0)
                return device + "\\" + tail;
            else
                return device + "\\";
        }
        else if (tail.length > 0) {
            return device + tail;
        }
        else {
            return device;
        }
    }
    function isAbsolute(path) {
        assertPath(path);
        var len = path.length;
        if (len === 0)
            return false;
        var code = path.charCodeAt(0);
        if (isPathSeparator(code)) {
            return true;
        }
        else if (isWindowsDeviceRoot(code)) {
            // Possible device root
            if (len > 2 && path.charCodeAt(1) === CHAR_COLON) {
                if (isPathSeparator(path.charCodeAt(2)))
                    return true;
            }
        }
        return false;
    }
    function join() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var pathsCount = paths.length;
        if (pathsCount === 0)
            return ".";
        var joined;
        var firstPart = null;
        for (var i = 0; i < pathsCount; ++i) {
            var path = paths[i];
            assertPath(path);
            if (path.length > 0) {
                if (joined === undefined)
                    joined = firstPart = path;
                else
                    joined += "\\" + path;
            }
        }
        if (joined === undefined)
            return ".";
        // Make sure that the joined path doesn't start with two slashes, because
        // normalize() will mistake it for an UNC path then.
        //
        // This step is skipped when it is very clear that the user actually
        // intended to point at an UNC path. This is assumed when the first
        // non-empty string arguments starts with exactly two slashes followed by
        // at least one more non-slash character.
        //
        // Note that for normalize() to treat a path as an UNC path it needs to
        // have at least 2 components, so we don't filter for that here.
        // This means that the user can use join to construct UNC paths from
        // a server name and a share name; for example:
        //   path.join('//server', 'share') -> '\\\\server\\share\\')
        var needsReplace = true;
        var slashCount = 0;
        assert(firstPart != null);
        if (isPathSeparator(firstPart.charCodeAt(0))) {
            ++slashCount;
            var firstLen = firstPart.length;
            if (firstLen > 1) {
                if (isPathSeparator(firstPart.charCodeAt(1))) {
                    ++slashCount;
                    if (firstLen > 2) {
                        if (isPathSeparator(firstPart.charCodeAt(2)))
                            ++slashCount;
                        else {
                            // We matched a UNC path in the first part
                            needsReplace = false;
                        }
                    }
                }
            }
        }
        if (needsReplace) {
            // Find any more consecutive slashes we need to replace
            for (; slashCount < joined.length; ++slashCount) {
                if (!isPathSeparator(joined.charCodeAt(slashCount)))
                    break;
            }
            // Replace the slashes if needed
            if (slashCount >= 2)
                joined = "\\" + joined.slice(slashCount);
        }
        return normalize(joined);
    }
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    function relative(from, to) {
        assertPath(from);
        assertPath(to);
        if (from === to)
            return "";
        var fromOrig = resolve(from);
        var toOrig = resolve(to);
        if (fromOrig === toOrig)
            return "";
        from = fromOrig.toLowerCase();
        to = toOrig.toLowerCase();
        if (from === to)
            return "";
        // Trim any leading backslashes
        var fromStart = 0;
        var fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; fromEnd - 1 > fromStart; --fromEnd) {
            if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH)
                break;
        }
        var fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        var toStart = 0;
        var toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; toEnd - 1 > toStart; --toEnd) {
            if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH)
                break;
        }
        var toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
                        return toOrig.slice(toStart + i + 1);
                    }
                    else if (i === 2) {
                        // We get here if `from` is the device root.
                        // For example: from='C:\\'; to='C:\\foo'
                        return toOrig.slice(toStart + i);
                    }
                }
                if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo'
                        lastCommonSep = i;
                    }
                    else if (i === 2) {
                        // We get here if `to` is the device root.
                        // For example: from='C:\\foo\\bar'; to='C:\\'
                        lastCommonSep = 3;
                    }
                }
                break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === CHAR_BACKWARD_SLASH)
                lastCommonSep = i;
        }
        // We found a mismatch before the first common path separator was seen, so
        // return the original `to`.
        if (i !== length && lastCommonSep === -1) {
            return toOrig;
        }
        var out = "";
        if (lastCommonSep === -1)
            lastCommonSep = 0;
        // Generate the relative path based on the path difference between `to` and
        // `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "\\..";
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0) {
            return out + toOrig.slice(toStart + lastCommonSep, toEnd);
        }
        else {
            toStart += lastCommonSep;
            if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH)
                ++toStart;
            return toOrig.slice(toStart, toEnd);
        }
    }
    function toNamespacedPath(path) {
        // Note: this will *probably* throw somewhere.
        if (typeof path !== "string")
            return path;
        if (path.length === 0)
            return "";
        var resolvedPath = resolve(path);
        if (resolvedPath.length >= 3) {
            if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
                // Possible UNC root
                if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
                    var code = resolvedPath.charCodeAt(2);
                    if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
                        // Matched non-long UNC root, convert the path to a long UNC path
                        return "\\\\?\\UNC\\" + resolvedPath.slice(2);
                    }
                }
            }
            else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
                // Possible device root
                if (resolvedPath.charCodeAt(1) === CHAR_COLON &&
                    resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
                    // Matched device root, convert the path to a long UNC path
                    return "\\\\?\\" + resolvedPath;
                }
            }
        }
        return path;
    }
    function dirname(path) {
        assertPath(path);
        var len = path.length;
        if (len === 0)
            return ".";
        var rootEnd = -1;
        var end = -1;
        var matchedSlash = true;
        var offset = 0;
        var code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (isPathSeparator(code)) {
                // Possible UNC root
                rootEnd = offset = 1;
                if (isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    var j = 2;
                    var last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                return path;
                            }
                            if (j !== last) {
                                // We matched a UNC root with leftovers
                                // Offset by 1 to include the separator after the UNC root to
                                // treat it as a "normal root" on top of a (UNC) root
                                rootEnd = offset = j + 1;
                            }
                        }
                    }
                }
            }
            else if (isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === CHAR_COLON) {
                    rootEnd = offset = 2;
                    if (len > 2) {
                        if (isPathSeparator(path.charCodeAt(2)))
                            rootEnd = offset = 3;
                    }
                }
            }
        }
        else if (isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            return path;
        }
        for (var i = len - 1; i >= offset; --i) {
            if (isPathSeparator(path.charCodeAt(i))) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1) {
            if (rootEnd === -1)
                return ".";
            else
                end = rootEnd;
        }
        return path.slice(0, end);
    }
    function basename(path, ext) {
        if (ext === void 0) { ext = ""; }
        if (ext !== undefined && typeof ext !== "string") {
            throw new TypeError('"ext" argument must be a string');
        }
        assertPath(path);
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2) {
            var drive = path.charCodeAt(0);
            if (isWindowsDeviceRoot(drive)) {
                if (path.charCodeAt(1) === CHAR_COLON)
                    start = 2;
            }
        }
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= start; --i) {
                var code = path.charCodeAt(i);
                if (isPathSeparator(code)) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= start; --i) {
                if (isPathSeparator(path.charCodeAt(i))) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    function extname(path) {
        assertPath(path);
        var start = 0;
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2 &&
            path.charCodeAt(1) === CHAR_COLON &&
            isWindowsDeviceRoot(path.charCodeAt(0))) {
            start = startPart = 2;
        }
        for (var i = path.length - 1; i >= start; --i) {
            var code = path.charCodeAt(i);
            if (isPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    function format(pathObject) {
        /* eslint-disable max-len */
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError("The \"pathObject\" argument must be of type Object. Received type " + typeof pathObject);
        }
        return _format("\\", pathObject);
    }
    function parse(path) {
        assertPath(path);
        var ret = { root: "", dir: "", base: "", ext: "", name: "" };
        var len = path.length;
        if (len === 0)
            return ret;
        var rootEnd = 0;
        var code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (isPathSeparator(code)) {
                // Possible UNC root
                rootEnd = 1;
                if (isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    var j = 2;
                    var last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                rootEnd = j;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                rootEnd = j + 1;
                            }
                        }
                    }
                }
            }
            else if (isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === CHAR_COLON) {
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator(path.charCodeAt(2))) {
                            if (len === 3) {
                                // `path` contains just a drive root, exit early to avoid
                                // unnecessary work
                                ret.root = ret.dir = path;
                                return ret;
                            }
                            rootEnd = 3;
                        }
                    }
                    else {
                        // `path` contains just a drive root, exit early to avoid
                        // unnecessary work
                        ret.root = ret.dir = path;
                        return ret;
                    }
                }
            }
        }
        else if (isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            ret.root = ret.dir = path;
            return ret;
        }
        if (rootEnd > 0)
            ret.root = path.slice(0, rootEnd);
        var startDot = -1;
        var startPart = rootEnd;
        var end = -1;
        var matchedSlash = true;
        var i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        // Get non-dir info
        for (; i >= rootEnd; --i) {
            code = path.charCodeAt(i);
            if (isPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
        else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
            ret.ext = path.slice(startDot, end);
        }
        // If the directory is the root, use the entire root as the `dir` including
        // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
        // trailing slash (`C:\abc\def` -> `C:\abc`).
        if (startPart > 0 && startPart !== rootEnd) {
            ret.dir = path.slice(0, startPart - 1);
        }
        else
            ret.dir = ret.root;
        return ret;
    }
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///home/foo"); // "\\home\\foo"
     *      fromFileUrl("file:///C:/Users/foo"); // "C:\\Users\\foo"
     *      fromFileUrl("file://localhost/home/foo"); // "\\\\localhost\\home\\foo"
     */
    function fromFileUrl(url) {
        url = url instanceof URL ? url : new URL(url);
        if (url.protocol != "file:") {
            throw new TypeError("Must be a file URL.");
        }
        var path = decodeURIComponent(url.pathname
            .replace(/^\/*([A-Za-z]:)(\/|$)/, "$1/")
            .replace(/\//g, "\\")
            .replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
        if (url.hostname != "") {
            // Note: The `URL` implementation guarantees that the drive letter and
            // hostname are mutually exclusive. Otherwise it would not have been valid
            // to append the hostname and path like this.
            path = "\\\\" + url.hostname + path;
        }
        return path;
    }

    var _win32 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sep: sep,
        delimiter: delimiter,
        resolve: resolve,
        normalize: normalize,
        isAbsolute: isAbsolute,
        join: join,
        relative: relative,
        toNamespacedPath: toNamespacedPath,
        dirname: dirname,
        basename: basename,
        extname: extname,
        format: format,
        parse: parse,
        fromFileUrl: fromFileUrl
    });

    // Copyright the Browserify authors. MIT License.
    var sep$1 = "/";
    var delimiter$1 = ":";
    // path.resolve([from ...], to)
    function resolve$1() {
        var pathSegments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pathSegments[_i] = arguments[_i];
        }
        var resolvedPath = "";
        var resolvedAbsolute = false;
        for (var i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = void 0;
            if (i >= 0)
                path = pathSegments[i];
            else {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            assertPath(path);
            // Skip empty entries
            if (path.length === 0) {
                continue;
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        // Normalize the path
        resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
        if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
                return "/" + resolvedPath;
            else
                return "/";
        }
        else if (resolvedPath.length > 0)
            return resolvedPath;
        else
            return ".";
    }
    function normalize$1(path) {
        assertPath(path);
        if (path.length === 0)
            return ".";
        var isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        var trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
        // Normalize the path
        path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
        if (path.length === 0 && !isAbsolute)
            path = ".";
        if (path.length > 0 && trailingSeparator)
            path += "/";
        if (isAbsolute)
            return "/" + path;
        return path;
    }
    function isAbsolute$1(path) {
        assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    function join$1() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        if (paths.length === 0)
            return ".";
        var joined;
        for (var i = 0, len = paths.length; i < len; ++i) {
            var path = paths[i];
            assertPath(path);
            if (path.length > 0) {
                if (!joined)
                    joined = path;
                else
                    joined += "/" + path;
            }
        }
        if (!joined)
            return ".";
        return normalize$1(joined);
    }
    function relative$1(from, to) {
        assertPath(from);
        assertPath(to);
        if (from === to)
            return "";
        from = resolve$1(from);
        to = resolve$1(to);
        if (from === to)
            return "";
        // Trim any leading backslashes
        var fromStart = 1;
        var fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH)
                break;
        }
        var fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        var toStart = 1;
        var toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH)
                break;
        }
        var toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='/foo/bar'; to='/foo/bar/baz'
                        return to.slice(toStart + i + 1);
                    }
                    else if (i === 0) {
                        // We get here if `from` is the root
                        // For example: from='/'; to='/foo'
                        return to.slice(toStart + i);
                    }
                }
                else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='/foo/bar/baz'; to='/foo/bar'
                        lastCommonSep = i;
                    }
                    else if (i === 0) {
                        // We get here if `to` is the root.
                        // For example: from='/foo'; to='/'
                        lastCommonSep = 0;
                    }
                }
                break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === CHAR_FORWARD_SLASH)
                lastCommonSep = i;
        }
        var out = "";
        // Generate the relative path based on the path difference between `to`
        // and `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "/..";
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
        else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH)
                ++toStart;
            return to.slice(toStart);
        }
    }
    function toNamespacedPath$1(path) {
        // Non-op on posix systems
        return path;
    }
    function dirname$1(path) {
        assertPath(path);
        if (path.length === 0)
            return ".";
        var hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        var end = -1;
        var matchedSlash = true;
        for (var i = path.length - 1; i >= 1; --i) {
            if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1)
            return hasRoot ? "/" : ".";
        if (hasRoot && end === 1)
            return "//";
        return path.slice(0, end);
    }
    function basename$1(path, ext) {
        if (ext === void 0) { ext = ""; }
        if (ext !== undefined && typeof ext !== "string") {
            throw new TypeError('"ext" argument must be a string');
        }
        assertPath(path);
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i;
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
                var code = path.charCodeAt(i);
                if (code === CHAR_FORWARD_SLASH) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= 0; --i) {
                if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    function extname$1(path) {
        assertPath(path);
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        for (var i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    function format$1(pathObject) {
        /* eslint-disable max-len */
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError("The \"pathObject\" argument must be of type Object. Received type " + typeof pathObject);
        }
        return _format("/", pathObject);
    }
    function parse$1(path) {
        assertPath(path);
        var ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path.length === 0)
            return ret;
        var isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        var start;
        if (isAbsolute) {
            ret.root = "/";
            start = 1;
        }
        else {
            start = 0;
        }
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        // Get non-dir info
        for (; i >= start; --i) {
            var code = path.charCodeAt(i);
            if (code === CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                if (startPart === 0 && isAbsolute) {
                    ret.base = ret.name = path.slice(1, end);
                }
                else {
                    ret.base = ret.name = path.slice(startPart, end);
                }
            }
        }
        else {
            if (startPart === 0 && isAbsolute) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
            }
            else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0)
            ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute)
            ret.dir = "/";
        return ret;
    }
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///home/foo"); // "/home/foo"
     */
    function fromFileUrl$1(url) {
        url = url instanceof URL ? url : new URL(url);
        if (url.protocol != "file:") {
            throw new TypeError("Must be a file URL.");
        }
        return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
    }

    var _posix = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sep: sep$1,
        delimiter: delimiter$1,
        resolve: resolve$1,
        normalize: normalize$1,
        isAbsolute: isAbsolute$1,
        join: join$1,
        relative: relative$1,
        toNamespacedPath: toNamespacedPath$1,
        dirname: dirname$1,
        basename: basename$1,
        extname: extname$1,
        format: format$1,
        parse: parse$1,
        fromFileUrl: fromFileUrl$1
    });

    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    var SEP = isWindows ? "\\" : "/";
    var SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;

    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    /** Determines the common path from a set of paths, using an optional separator,
     * which defaults to the OS default separator.
     *
     *       import { common } from "https://deno.land/std/path/mod.js";
     *       const p = common([
     *         "./deno/std/path/mod.ts",
     *         "./deno/std/fs/mod.ts",
     *       ]);
     *       console.log(p); // "./deno/std/"
     *
     */
    function common(paths, sep) {
        var e_1, _a;
        if (sep === void 0) { sep = SEP; }
        var _b = __read(paths), _c = _b[0], first = _c === void 0 ? "" : _c, remaining = _b.slice(1);
        if (first === "" || remaining.length === 0) {
            return first.substring(0, first.lastIndexOf(sep) + 1);
        }
        var parts = first.split(sep);
        var endOfPrefix = parts.length;
        try {
            for (var remaining_1 = __values(remaining), remaining_1_1 = remaining_1.next(); !remaining_1_1.done; remaining_1_1 = remaining_1.next()) {
                var path = remaining_1_1.value;
                var compare = path.split(sep);
                for (var i = 0; i < endOfPrefix; i++) {
                    if (compare[i] !== parts[i]) {
                        endOfPrefix = i;
                    }
                }
                if (endOfPrefix === 0) {
                    return "";
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (remaining_1_1 && !remaining_1_1.done && (_a = remaining_1.return)) _a.call(remaining_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var prefix = parts.slice(0, endOfPrefix).join(sep);
        return prefix.endsWith(sep) ? prefix : "" + prefix + sep;
    }

    // globToRegExp() is originall ported from globrex@0.1.2.
    /** Convert a glob string to a regular expressions.
     *
     *      // Looking for all the `ts` files:
     *      walkSync(".", {
     *        match: [globToRegExp("*.ts")]
     *      });
     *
     *      Looking for all the `.json` files in any subfolder:
     *      walkSync(".", {
     *        match: [globToRegExp(join("a", "**", "*.json"), {
     *          extended: true,
     *          globstar: true
     *        })]
     *      }); */
    function globToRegExp(glob, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.extended, extended = _c === void 0 ? true : _c, _d = _b.globstar, globstarOption = _d === void 0 ? true : _d, _e = _b.os, os = _e === void 0 ? NATIVE_OS : _e;
        var sep = os == "windows" ? "(?:\\\\|\\/)+" : "\\/+";
        var sepMaybe = os == "windows" ? "(?:\\\\|\\/)*" : "\\/*";
        var seps = os == "windows" ? ["\\", "/"] : ["/"];
        var sepRaw = os == "windows" ? "\\" : "/";
        var globstar = os == "windows"
            ? "(?:[^\\\\/]*(?:\\\\|\\/|$)+)*"
            : "(?:[^/]*(?:\\/|$)+)*";
        var wildcard = os == "windows" ? "[^\\\\/]*" : "[^/]*";
        // Keep track of scope for extended syntaxes.
        var extStack = [];
        // If we are doing extended matching, this boolean is true when we are inside
        // a group (eg {*.html,*.js}), and false otherwise.
        var inGroup = false;
        var inRange = false;
        var regExpString = "";
        // Remove trailing separators.
        var newLength = glob.length;
        for (; newLength > 0 && seps.includes(glob[newLength - 1]); newLength--)
            ;
        glob = glob.slice(0, newLength);
        var c, n;
        for (var i = 0; i < glob.length; i++) {
            c = glob[i];
            n = glob[i + 1];
            if (seps.includes(c)) {
                regExpString += sep;
                while (seps.includes(glob[i + 1]))
                    i++;
                continue;
            }
            if (c == "[") {
                if (inRange && n == ":") {
                    i++; // skip [
                    var value = "";
                    while (glob[++i] !== ":")
                        value += glob[i];
                    if (value == "alnum")
                        regExpString += "\\w\\d";
                    else if (value == "space")
                        regExpString += "\\s";
                    else if (value == "digit")
                        regExpString += "\\d";
                    i++; // skip last ]
                    continue;
                }
                inRange = true;
                regExpString += c;
                continue;
            }
            if (c == "]") {
                inRange = false;
                regExpString += c;
                continue;
            }
            if (c == "!") {
                if (inRange) {
                    if (glob[i - 1] == "[") {
                        regExpString += "^";
                        continue;
                    }
                }
                else if (extended) {
                    if (n == "(") {
                        extStack.push(c);
                        regExpString += "(?!";
                        i++;
                        continue;
                    }
                    regExpString += "\\" + c;
                    continue;
                }
                else {
                    regExpString += "\\" + c;
                    continue;
                }
            }
            if (inRange) {
                if (c == "\\" || c == "^" && glob[i - 1] == "[")
                    regExpString += "\\" + c;
                else
                    regExpString += c;
                continue;
            }
            if (["\\", "$", "^", ".", "="].includes(c)) {
                regExpString += "\\" + c;
                continue;
            }
            if (c == "(") {
                if (extStack.length) {
                    regExpString += c + "?:";
                    continue;
                }
                regExpString += "\\" + c;
                continue;
            }
            if (c == ")") {
                if (extStack.length) {
                    regExpString += c;
                    var type = extStack.pop();
                    if (type == "@") {
                        regExpString += "{1}";
                    }
                    else if (type == "!") {
                        regExpString += wildcard;
                    }
                    else {
                        regExpString += type;
                    }
                    continue;
                }
                regExpString += "\\" + c;
                continue;
            }
            if (c == "|") {
                if (extStack.length) {
                    regExpString += c;
                    continue;
                }
                regExpString += "\\" + c;
                continue;
            }
            if (c == "+") {
                if (n == "(" && extended) {
                    extStack.push(c);
                    continue;
                }
                regExpString += "\\" + c;
                continue;
            }
            if (c == "@" && extended) {
                if (n == "(") {
                    extStack.push(c);
                    continue;
                }
            }
            if (c == "?") {
                if (extended) {
                    if (n == "(") {
                        extStack.push(c);
                    }
                    continue;
                }
                else {
                    regExpString += ".";
                    continue;
                }
            }
            if (c == "{") {
                inGroup = true;
                regExpString += "(?:";
                continue;
            }
            if (c == "}") {
                inGroup = false;
                regExpString += ")";
                continue;
            }
            if (c == ",") {
                if (inGroup) {
                    regExpString += "|";
                    continue;
                }
                regExpString += "\\" + c;
                continue;
            }
            if (c == "*") {
                if (n == "(" && extended) {
                    extStack.push(c);
                    continue;
                }
                // Move over all consecutive "*"'s.
                // Also store the previous and next characters
                var prevChar = glob[i - 1];
                var starCount = 1;
                while (glob[i + 1] == "*") {
                    starCount++;
                    i++;
                }
                var nextChar = glob[i + 1];
                var isGlobstar = globstarOption && starCount > 1 &&
                    // from the start of the segment
                    [sepRaw, "/", undefined].includes(prevChar) &&
                    // to the end of the segment
                    [sepRaw, "/", undefined].includes(nextChar);
                if (isGlobstar) {
                    // it's a globstar, so match zero or more path segments
                    regExpString += globstar;
                    while (seps.includes(glob[i + 1]))
                        i++;
                }
                else {
                    // it's not a globstar, so only match one path segment
                    regExpString += wildcard;
                }
                continue;
            }
            regExpString += c;
        }
        regExpString = "^" + regExpString + (regExpString != "" ? sepMaybe : "") + "$";
        return new RegExp(regExpString);
    }
    /** Test whether the given string is a glob */
    function isGlob(str) {
        var chars = { "{": "}", "(": ")", "[": "]" };
        /* eslint-disable-next-line max-len */
        var regex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
        if (str === "") {
            return false;
        }
        var match;
        while ((match = regex.exec(str))) {
            if (match[2])
                return true;
            var idx = match.index + match[0].length;
            // if an open bracket/brace/paren is escaped,
            // set the index to the next closing character
            var open_1 = match[1];
            var close_1 = open_1 ? chars[open_1] : null;
            if (open_1 && close_1) {
                var n = str.indexOf(close_1, idx);
                if (n !== -1) {
                    idx = n + 1;
                }
            }
            str = str.slice(idx);
        }
        return false;
    }

    // Copyright the Browserify authors. MIT License.
    var path = isWindows ? _win32 : _posix;
    var win32 = _win32;
    var posix = _posix;
    var basename$2 = path.basename, delimiter$2 = path.delimiter, dirname$2 = path.dirname, extname$2 = path.extname, format$2 = path.format, fromFileUrl$2 = path.fromFileUrl, isAbsolute$2 = path.isAbsolute, join$2 = path.join, normalize$2 = path.normalize, parse$2 = path.parse, relative$2 = path.relative, resolve$2 = path.resolve, sep$2 = path.sep, toNamespacedPath$2 = path.toNamespacedPath;
    /** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
    function normalizeGlob(glob, _a) {
        var _b = (_a === void 0 ? {} : _a).globstar, globstar = _b === void 0 ? false : _b;
        if (glob.match(/\0/g)) {
            throw new Error("Glob contains invalid characters: \"" + glob + "\"");
        }
        if (!globstar) {
            return normalize$2(glob);
        }
        var s = SEP_PATTERN.source;
        var badParentPattern = new RegExp("(?<=(" + s + "|^)\\*\\*" + s + ")\\.\\.(?=" + s + "|$)", "g");
        return normalize$2(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
    }
    /** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
    function joinGlobs(globs, _a) {
        var e_1, _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.extended, extended = _d === void 0 ? false : _d, _e = _c.globstar, globstar = _e === void 0 ? false : _e;
        if (!globstar || globs.length == 0) {
            return join$2.apply(void 0, __spread(globs));
        }
        if (globs.length === 0)
            return ".";
        var joined;
        try {
            for (var globs_1 = __values(globs), globs_1_1 = globs_1.next(); !globs_1_1.done; globs_1_1 = globs_1.next()) {
                var glob = globs_1_1.value;
                var path_1 = glob;
                if (path_1.length > 0) {
                    if (!joined)
                        joined = path_1;
                    else
                        joined += "" + SEP + path_1;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (globs_1_1 && !globs_1_1.done && (_b = globs_1.return)) _b.call(globs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!joined)
            return ".";
        return normalizeGlob(joined, { extended: extended, globstar: globstar });
    }

    exports.SEP = SEP;
    exports.SEP_PATTERN = SEP_PATTERN;
    exports.basename = basename$2;
    exports.common = common;
    exports.delimiter = delimiter$2;
    exports.dirname = dirname$2;
    exports.extname = extname$2;
    exports.format = format$2;
    exports.fromFileUrl = fromFileUrl$2;
    exports.globToRegExp = globToRegExp;
    exports.isAbsolute = isAbsolute$2;
    exports.isGlob = isGlob;
    exports.join = join$2;
    exports.joinGlobs = joinGlobs;
    exports.normalize = normalize$2;
    exports.normalizeGlob = normalizeGlob;
    exports.parse = parse$2;
    exports.posix = posix;
    exports.relative = relative$2;
    exports.resolve = resolve$2;
    exports.sep = sep$2;
    exports.toNamespacedPath = toNamespacedPath$2;
    exports.win32 = win32;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
