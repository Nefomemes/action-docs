module.exports = (function (e, t) {
  "use strict";
  var i = {};
  function __webpack_require__(t) {
    if (i[t]) {
      return i[t].exports;
    }
    var r = (i[t] = { i: t, l: false, exports: {} });
    e[t].call(r.exports, r, r.exports, __webpack_require__);
    r.l = true;
    return r.exports;
  }
  __webpack_require__.ab = __dirname + "/";
  function startup() {
    return __webpack_require__(131);
  }
  t(__webpack_require__);
  return startup();
})(
  {
    1: function (e, t, i) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, i, r) {
          return new (i || (i = Promise))(function (s, n) {
            function fulfilled(e) {
              try {
                step(r.next(e));
              } catch (e) {
                n(e);
              }
            }
            function rejected(e) {
              try {
                step(r["throw"](e));
              } catch (e) {
                n(e);
              }
            }
            function step(e) {
              e.done
                ? s(e.value)
                : new i(function (t) {
                    t(e.value);
                  }).then(fulfilled, rejected);
            }
            step((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: true });
      const s = i(129);
      const n = i(622);
      const o = i(669);
      const c = i(672);
      const u = o.promisify(s.exec);
      function cp(e, t, i = {}) {
        return r(this, void 0, void 0, function* () {
          const { force: r, recursive: s } = readCopyOptions(i);
          const o = (yield c.exists(t)) ? yield c.stat(t) : null;
          if (o && o.isFile() && !r) {
            return;
          }
          const u = o && o.isDirectory() ? n.join(t, n.basename(e)) : t;
          if (!(yield c.exists(e))) {
            throw new Error(`no such file or directory: ${e}`);
          }
          const l = yield c.stat(e);
          if (l.isDirectory()) {
            if (!s) {
              throw new Error(
                `Failed to copy. ${e} is a directory, but tried to copy without recursive flag.`
              );
            } else {
              yield cpDirRecursive(e, u, 0, r);
            }
          } else {
            if (n.relative(e, u) === "") {
              throw new Error(`'${u}' and '${e}' are the same file`);
            }
            yield copyFile(e, u, r);
          }
        });
      }
      t.cp = cp;
      function mv(e, t, i = {}) {
        return r(this, void 0, void 0, function* () {
          if (yield c.exists(t)) {
            let r = true;
            if (yield c.isDirectory(t)) {
              t = n.join(t, n.basename(e));
              r = yield c.exists(t);
            }
            if (r) {
              if (i.force == null || i.force) {
                yield rmRF(t);
              } else {
                throw new Error("Destination already exists");
              }
            }
          }
          yield mkdirP(n.dirname(t));
          yield c.rename(e, t);
        });
      }
      t.mv = mv;
      function rmRF(e) {
        return r(this, void 0, void 0, function* () {
          if (c.IS_WINDOWS) {
            try {
              if (yield c.isDirectory(e, true)) {
                yield u(`rd /s /q "${e}"`);
              } else {
                yield u(`del /f /a "${e}"`);
              }
            } catch (e) {
              if (e.code !== "ENOENT") throw e;
            }
            try {
              yield c.unlink(e);
            } catch (e) {
              if (e.code !== "ENOENT") throw e;
            }
          } else {
            let t = false;
            try {
              t = yield c.isDirectory(e);
            } catch (e) {
              if (e.code !== "ENOENT") throw e;
              return;
            }
            if (t) {
              yield u(`rm -rf "${e}"`);
            } else {
              yield c.unlink(e);
            }
          }
        });
      }
      t.rmRF = rmRF;
      function mkdirP(e) {
        return r(this, void 0, void 0, function* () {
          yield c.mkdirP(e);
        });
      }
      t.mkdirP = mkdirP;
      function which(e, t) {
        return r(this, void 0, void 0, function* () {
          if (!e) {
            throw new Error("parameter 'tool' is required");
          }
          if (t) {
            const t = yield which(e, false);
            if (!t) {
              if (c.IS_WINDOWS) {
                throw new Error(
                  `Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`
                );
              } else {
                throw new Error(
                  `Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`
                );
              }
            }
          }
          try {
            const t = [];
            if (c.IS_WINDOWS && process.env.PATHEXT) {
              for (const e of process.env.PATHEXT.split(n.delimiter)) {
                if (e) {
                  t.push(e);
                }
              }
            }
            if (c.isRooted(e)) {
              const i = yield c.tryGetExecutablePath(e, t);
              if (i) {
                return i;
              }
              return "";
            }
            if (e.includes("/") || (c.IS_WINDOWS && e.includes("\\"))) {
              return "";
            }
            const i = [];
            if (process.env.PATH) {
              for (const e of process.env.PATH.split(n.delimiter)) {
                if (e) {
                  i.push(e);
                }
              }
            }
            for (const r of i) {
              const i = yield c.tryGetExecutablePath(r + n.sep + e, t);
              if (i) {
                return i;
              }
            }
            return "";
          } catch (e) {
            throw new Error(`which failed with message ${e.message}`);
          }
        });
      }
      t.which = which;
      function readCopyOptions(e) {
        const t = e.force == null ? true : e.force;
        const i = Boolean(e.recursive);
        return { force: t, recursive: i };
      }
      function cpDirRecursive(e, t, i, s) {
        return r(this, void 0, void 0, function* () {
          if (i >= 255) return;
          i++;
          yield mkdirP(t);
          const r = yield c.readdir(e);
          for (const n of r) {
            const r = `${e}/${n}`;
            const o = `${t}/${n}`;
            const u = yield c.lstat(r);
            if (u.isDirectory()) {
              yield cpDirRecursive(r, o, i, s);
            } else {
              yield copyFile(r, o, s);
            }
          }
          yield c.chmod(t, (yield c.stat(e)).mode);
        });
      }
      function copyFile(e, t, i) {
        return r(this, void 0, void 0, function* () {
          if ((yield c.lstat(e)).isSymbolicLink()) {
            try {
              yield c.lstat(t);
              yield c.unlink(t);
            } catch (e) {
              if (e.code === "EPERM") {
                yield c.chmod(t, "0666");
                yield c.unlink(t);
              }
            }
            const i = yield c.readlink(e);
            yield c.symlink(i, t, c.IS_WINDOWS ? "junction" : null);
          } else if (!(yield c.exists(t)) || i) {
            yield c.copyFile(e, t);
          }
        });
      }
    },
    9: function (e, t, i) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, i, r) {
          return new (i || (i = Promise))(function (s, n) {
            function fulfilled(e) {
              try {
                step(r.next(e));
              } catch (e) {
                n(e);
              }
            }
            function rejected(e) {
              try {
                step(r["throw"](e));
              } catch (e) {
                n(e);
              }
            }
            function step(e) {
              e.done
                ? s(e.value)
                : new i(function (t) {
                    t(e.value);
                  }).then(fulfilled, rejected);
            }
            step((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: true });
      const s = i(87);
      const n = i(614);
      const o = i(129);
      const c = process.platform === "win32";
      class ToolRunner extends n.EventEmitter {
        constructor(e, t, i) {
          super();
          if (!e) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
          }
          this.toolPath = e;
          this.args = t || [];
          this.options = i || {};
        }
        _debug(e) {
          if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(e);
          }
        }
        _getCommandString(e, t) {
          const i = this._getSpawnFileName();
          const r = this._getSpawnArgs(e);
          let s = t ? "" : "[command]";
          if (c) {
            if (this._isCmdFile()) {
              s += i;
              for (const e of r) {
                s += ` ${e}`;
              }
            } else if (e.windowsVerbatimArguments) {
              s += `"${i}"`;
              for (const e of r) {
                s += ` ${e}`;
              }
            } else {
              s += this._windowsQuoteCmdArg(i);
              for (const e of r) {
                s += ` ${this._windowsQuoteCmdArg(e)}`;
              }
            }
          } else {
            s += i;
            for (const e of r) {
              s += ` ${e}`;
            }
          }
          return s;
        }
        _processLineBuffer(e, t, i) {
          try {
            let r = t + e.toString();
            let n = r.indexOf(s.EOL);
            while (n > -1) {
              const e = r.substring(0, n);
              i(e);
              r = r.substring(n + s.EOL.length);
              n = r.indexOf(s.EOL);
            }
            t = r;
          } catch (e) {
            this._debug(`error processing line. Failed with error ${e}`);
          }
        }
        _getSpawnFileName() {
          if (c) {
            if (this._isCmdFile()) {
              return process.env["COMSPEC"] || "cmd.exe";
            }
          }
          return this.toolPath;
        }
        _getSpawnArgs(e) {
          if (c) {
            if (this._isCmdFile()) {
              let t = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
              for (const i of this.args) {
                t += " ";
                t += e.windowsVerbatimArguments
                  ? i
                  : this._windowsQuoteCmdArg(i);
              }
              t += '"';
              return [t];
            }
          }
          return this.args;
        }
        _endsWith(e, t) {
          return e.endsWith(t);
        }
        _isCmdFile() {
          const e = this.toolPath.toUpperCase();
          return this._endsWith(e, ".CMD") || this._endsWith(e, ".BAT");
        }
        _windowsQuoteCmdArg(e) {
          if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(e);
          }
          if (!e) {
            return '""';
          }
          const t = [
            " ",
            "\t",
            "&",
            "(",
            ")",
            "[",
            "]",
            "{",
            "}",
            "^",
            "=",
            ";",
            "!",
            "'",
            "+",
            ",",
            "`",
            "~",
            "|",
            "<",
            ">",
            '"',
          ];
          let i = false;
          for (const r of e) {
            if (t.some((e) => e === r)) {
              i = true;
              break;
            }
          }
          if (!i) {
            return e;
          }
          let r = '"';
          let s = true;
          for (let t = e.length; t > 0; t--) {
            r += e[t - 1];
            if (s && e[t - 1] === "\\") {
              r += "\\";
            } else if (e[t - 1] === '"') {
              s = true;
              r += '"';
            } else {
              s = false;
            }
          }
          r += '"';
          return r.split("").reverse().join("");
        }
        _uvQuoteCmdArg(e) {
          if (!e) {
            return '""';
          }
          if (!e.includes(" ") && !e.includes("\t") && !e.includes('"')) {
            return e;
          }
          if (!e.includes('"') && !e.includes("\\")) {
            return `"${e}"`;
          }
          let t = '"';
          let i = true;
          for (let r = e.length; r > 0; r--) {
            t += e[r - 1];
            if (i && e[r - 1] === "\\") {
              t += "\\";
            } else if (e[r - 1] === '"') {
              i = true;
              t += "\\";
            } else {
              i = false;
            }
          }
          t += '"';
          return t.split("").reverse().join("");
        }
        _cloneExecOptions(e) {
          e = e || {};
          const t = {
            cwd: e.cwd || process.cwd(),
            env: e.env || process.env,
            silent: e.silent || false,
            windowsVerbatimArguments: e.windowsVerbatimArguments || false,
            failOnStdErr: e.failOnStdErr || false,
            ignoreReturnCode: e.ignoreReturnCode || false,
            delay: e.delay || 1e4,
          };
          t.outStream = e.outStream || process.stdout;
          t.errStream = e.errStream || process.stderr;
          return t;
        }
        _getSpawnOptions(e, t) {
          e = e || {};
          const i = {};
          i.cwd = e.cwd;
          i.env = e.env;
          i["windowsVerbatimArguments"] =
            e.windowsVerbatimArguments || this._isCmdFile();
          if (e.windowsVerbatimArguments) {
            i.argv0 = `"${t}"`;
          }
          return i;
        }
        exec() {
          return r(this, void 0, void 0, function* () {
            return new Promise((e, t) => {
              this._debug(`exec tool: ${this.toolPath}`);
              this._debug("arguments:");
              for (const e of this.args) {
                this._debug(`   ${e}`);
              }
              const i = this._cloneExecOptions(this.options);
              if (!i.silent && i.outStream) {
                i.outStream.write(this._getCommandString(i) + s.EOL);
              }
              const r = new ExecState(i, this.toolPath);
              r.on("debug", (e) => {
                this._debug(e);
              });
              const n = this._getSpawnFileName();
              const c = o.spawn(
                n,
                this._getSpawnArgs(i),
                this._getSpawnOptions(this.options, n)
              );
              const u = "";
              if (c.stdout) {
                c.stdout.on("data", (e) => {
                  if (this.options.listeners && this.options.listeners.stdout) {
                    this.options.listeners.stdout(e);
                  }
                  if (!i.silent && i.outStream) {
                    i.outStream.write(e);
                  }
                  this._processLineBuffer(e, u, (e) => {
                    if (
                      this.options.listeners &&
                      this.options.listeners.stdline
                    ) {
                      this.options.listeners.stdline(e);
                    }
                  });
                });
              }
              const l = "";
              if (c.stderr) {
                c.stderr.on("data", (e) => {
                  r.processStderr = true;
                  if (this.options.listeners && this.options.listeners.stderr) {
                    this.options.listeners.stderr(e);
                  }
                  if (!i.silent && i.errStream && i.outStream) {
                    const t = i.failOnStdErr ? i.errStream : i.outStream;
                    t.write(e);
                  }
                  this._processLineBuffer(e, l, (e) => {
                    if (
                      this.options.listeners &&
                      this.options.listeners.errline
                    ) {
                      this.options.listeners.errline(e);
                    }
                  });
                });
              }
              c.on("error", (e) => {
                r.processError = e.message;
                r.processExited = true;
                r.processClosed = true;
                r.CheckComplete();
              });
              c.on("exit", (e) => {
                r.processExitCode = e;
                r.processExited = true;
                this._debug(
                  `Exit code ${e} received from tool '${this.toolPath}'`
                );
                r.CheckComplete();
              });
              c.on("close", (e) => {
                r.processExitCode = e;
                r.processExited = true;
                r.processClosed = true;
                this._debug(
                  `STDIO streams have closed for tool '${this.toolPath}'`
                );
                r.CheckComplete();
              });
              r.on("done", (i, r) => {
                if (u.length > 0) {
                  this.emit("stdline", u);
                }
                if (l.length > 0) {
                  this.emit("errline", l);
                }
                c.removeAllListeners();
                if (i) {
                  t(i);
                } else {
                  e(r);
                }
              });
            });
          });
        }
      }
      t.ToolRunner = ToolRunner;
      function argStringToArray(e) {
        const t = [];
        let i = false;
        let r = false;
        let s = "";
        function append(e) {
          if (r && e !== '"') {
            s += "\\";
          }
          s += e;
          r = false;
        }
        for (let n = 0; n < e.length; n++) {
          const o = e.charAt(n);
          if (o === '"') {
            if (!r) {
              i = !i;
            } else {
              append(o);
            }
            continue;
          }
          if (o === "\\" && r) {
            append(o);
            continue;
          }
          if (o === "\\" && i) {
            r = true;
            continue;
          }
          if (o === " " && !i) {
            if (s.length > 0) {
              t.push(s);
              s = "";
            }
            continue;
          }
          append(o);
        }
        if (s.length > 0) {
          t.push(s.trim());
        }
        return t;
      }
      t.argStringToArray = argStringToArray;
      class ExecState extends n.EventEmitter {
        constructor(e, t) {
          super();
          this.processClosed = false;
          this.processError = "";
          this.processExitCode = 0;
          this.processExited = false;
          this.processStderr = false;
          this.delay = 1e4;
          this.done = false;
          this.timeout = null;
          if (!t) {
            throw new Error("toolPath must not be empty");
          }
          this.options = e;
          this.toolPath = t;
          if (e.delay) {
            this.delay = e.delay;
          }
        }
        CheckComplete() {
          if (this.done) {
            return;
          }
          if (this.processClosed) {
            this._setResult();
          } else if (this.processExited) {
            this.timeout = setTimeout(
              ExecState.HandleTimeout,
              this.delay,
              this
            );
          }
        }
        _debug(e) {
          this.emit("debug", e);
        }
        _setResult() {
          let e;
          if (this.processExited) {
            if (this.processError) {
              e = new Error(
                `There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`
              );
            } else if (
              this.processExitCode !== 0 &&
              !this.options.ignoreReturnCode
            ) {
              e = new Error(
                `The process '${this.toolPath}' failed with exit code ${this.processExitCode}`
              );
            } else if (this.processStderr && this.options.failOnStdErr) {
              e = new Error(
                `The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`
              );
            }
          }
          if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
          }
          this.done = true;
          this.emit("done", e, this.processExitCode);
        }
        static HandleTimeout(e) {
          if (e.done) {
            return;
          }
          if (!e.processClosed && e.processExited) {
            const t = `The STDIO streams did not close within ${
              e.delay / 1e3
            } seconds of the exit event from process '${
              e.toolPath
            }'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            e._debug(t);
          }
          e._setResult();
        }
      }
    },
    87: function (e) {
      e.exports = require("os");
    },
    129: function (e) {
      e.exports = require("child_process");
    },
    131: function (e, t, i) {
      "use strict";
      i.r(t);
      var r = i(622);
      var s = i.n(r);
      var n = i(986);
      var o = i.n(n);
      var c = i(1);
      var u = i.n(c);
      var l = i(470);
      var d = i.n(l);
      async function run() {
        try {
          await Object(n.exec)(
            await Object(c.which)("bash", true),
            ["src/deploy.sh"],
            { cwd: Object(r.resolve)(__dirname, "..") }
          );
        } catch (e) {
          Object(l.setFailed)(e.message);
        }
      }
      run();
    },
    357: function (e) {
      e.exports = require("assert");
    },
    431: function (e, t, i) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      const r = i(87);
      function issueCommand(e, t, i) {
        const s = new Command(e, t, i);
        process.stdout.write(s.toString() + r.EOL);
      }
      t.issueCommand = issueCommand;
      function issue(e, t) {
        issueCommand(e, {}, t);
      }
      t.issue = issue;
      const s = "##[";
      class Command {
        constructor(e, t, i) {
          if (!e) {
            e = "missing.command";
          }
          this.command = e;
          this.properties = t;
          this.message = i;
        }
        toString() {
          let e = s + this.command;
          if (this.properties && Object.keys(this.properties).length > 0) {
            e += " ";
            for (const t in this.properties) {
              if (this.properties.hasOwnProperty(t)) {
                const i = this.properties[t];
                if (i) {
                  e += `${t}=${escape(`${i || ""}`)};`;
                }
              }
            }
          }
          e += "]";
          const t = `${this.message || ""}`;
          e += escapeData(t);
          return e;
        }
      }
      function escapeData(e) {
        return e.replace(/\r/g, "%0D").replace(/\n/g, "%0A");
      }
      function escape(e) {
        return e
          .replace(/\r/g, "%0D")
          .replace(/\n/g, "%0A")
          .replace(/]/g, "%5D")
          .replace(/;/g, "%3B");
      }
    },
    470: function (e, t, i) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      const r = i(431);
      const s = i(622);
      var n;
      (function (e) {
        e[(e["Success"] = 0)] = "Success";
        e[(e["Failure"] = 1)] = "Failure";
      })((n = t.ExitCode || (t.ExitCode = {})));
      function exportVariable(e, t) {
        process.env[e] = t;
        r.issueCommand("set-env", { name: e }, t);
      }
      t.exportVariable = exportVariable;
      function exportSecret(e, t) {
        exportVariable(e, t);
        r.issueCommand("set-secret", {}, t);
      }
      t.exportSecret = exportSecret;
      function addPath(e) {
        r.issueCommand("add-path", {}, e);
        process.env["PATH"] = `${e}${s.delimiter}${process.env["PATH"]}`;
      }
      t.addPath = addPath;
      function getInput(e, t) {
        const i =
          process.env[`INPUT_${e.replace(" ", "_").toUpperCase()}`] || "";
        if (t && t.required && !i) {
          throw new Error(`Input required and not supplied: ${e}`);
        }
        return i.trim();
      }
      t.getInput = getInput;
      function setOutput(e, t) {
        r.issueCommand("set-output", { name: e }, t);
      }
      t.setOutput = setOutput;
      function setFailed(e) {
        process.exitCode = n.Failure;
        error(e);
      }
      t.setFailed = setFailed;
      function debug(e) {
        r.issueCommand("debug", {}, e);
      }
      t.debug = debug;
      function error(e) {
        r.issue("error", e);
      }
      t.error = error;
      function warning(e) {
        r.issue("warning", e);
      }
      t.warning = warning;
    },
    614: function (e) {
      e.exports = require("events");
    },
    622: function (e) {
      e.exports = require("path");
    },
    669: function (e) {
      e.exports = require("util");
    },
    672: function (e, t, i) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, i, r) {
          return new (i || (i = Promise))(function (s, n) {
            function fulfilled(e) {
              try {
                step(r.next(e));
              } catch (e) {
                n(e);
              }
            }
            function rejected(e) {
              try {
                step(r["throw"](e));
              } catch (e) {
                n(e);
              }
            }
            function step(e) {
              e.done
                ? s(e.value)
                : new i(function (t) {
                    t(e.value);
                  }).then(fulfilled, rejected);
            }
            step((r = r.apply(e, t || [])).next());
          });
        };
      var s;
      Object.defineProperty(t, "__esModule", { value: true });
      const n = i(357);
      const o = i(747);
      const c = i(622);
      (s = o.promises),
        (t.chmod = s.chmod),
        (t.copyFile = s.copyFile),
        (t.lstat = s.lstat),
        (t.mkdir = s.mkdir),
        (t.readdir = s.readdir),
        (t.readlink = s.readlink),
        (t.rename = s.rename),
        (t.rmdir = s.rmdir),
        (t.stat = s.stat),
        (t.symlink = s.symlink),
        (t.unlink = s.unlink);
      t.IS_WINDOWS = process.platform === "win32";
      function exists(e) {
        return r(this, void 0, void 0, function* () {
          try {
            yield t.stat(e);
          } catch (e) {
            if (e.code === "ENOENT") {
              return false;
            }
            throw e;
          }
          return true;
        });
      }
      t.exists = exists;
      function isDirectory(e, i = false) {
        return r(this, void 0, void 0, function* () {
          const r = i ? yield t.stat(e) : yield t.lstat(e);
          return r.isDirectory();
        });
      }
      t.isDirectory = isDirectory;
      function isRooted(e) {
        e = normalizeSeparators(e);
        if (!e) {
          throw new Error('isRooted() parameter "p" cannot be empty');
        }
        if (t.IS_WINDOWS) {
          return e.startsWith("\\") || /^[A-Z]:/i.test(e);
        }
        return e.startsWith("/");
      }
      t.isRooted = isRooted;
      function mkdirP(e, i = 1e3, s = 1) {
        return r(this, void 0, void 0, function* () {
          n.ok(e, "a path argument must be provided");
          e = c.resolve(e);
          if (s >= i) return t.mkdir(e);
          try {
            yield t.mkdir(e);
            return;
          } catch (r) {
            switch (r.code) {
              case "ENOENT": {
                yield mkdirP(c.dirname(e), i, s + 1);
                yield t.mkdir(e);
                return;
              }
              default: {
                let i;
                try {
                  i = yield t.stat(e);
                } catch (e) {
                  throw r;
                }
                if (!i.isDirectory()) throw r;
              }
            }
          }
        });
      }
      t.mkdirP = mkdirP;
      function tryGetExecutablePath(e, i) {
        return r(this, void 0, void 0, function* () {
          let r = undefined;
          try {
            r = yield t.stat(e);
          } catch (t) {
            if (t.code !== "ENOENT") {
              console.log(
                `Unexpected error attempting to determine if executable file exists '${e}': ${t}`
              );
            }
          }
          if (r && r.isFile()) {
            if (t.IS_WINDOWS) {
              const t = c.extname(e).toUpperCase();
              if (i.some((e) => e.toUpperCase() === t)) {
                return e;
              }
            } else {
              if (isUnixExecutable(r)) {
                return e;
              }
            }
          }
          const s = e;
          for (const n of i) {
            e = s + n;
            r = undefined;
            try {
              r = yield t.stat(e);
            } catch (t) {
              if (t.code !== "ENOENT") {
                console.log(
                  `Unexpected error attempting to determine if executable file exists '${e}': ${t}`
                );
              }
            }
            if (r && r.isFile()) {
              if (t.IS_WINDOWS) {
                try {
                  const i = c.dirname(e);
                  const r = c.basename(e).toUpperCase();
                  for (const s of yield t.readdir(i)) {
                    if (r === s.toUpperCase()) {
                      e = c.join(i, s);
                      break;
                    }
                  }
                } catch (t) {
                  console.log(
                    `Unexpected error attempting to determine the actual case of the file '${e}': ${t}`
                  );
                }
                return e;
              } else {
                if (isUnixExecutable(r)) {
                  return e;
                }
              }
            }
          }
          return "";
        });
      }
      t.tryGetExecutablePath = tryGetExecutablePath;
      function normalizeSeparators(e) {
        e = e || "";
        if (t.IS_WINDOWS) {
          e = e.replace(/\//g, "\\");
          return e.replace(/\\\\+/g, "\\");
        }
        return e.replace(/\/\/+/g, "/");
      }
      function isUnixExecutable(e) {
        return (
          (e.mode & 1) > 0 ||
          ((e.mode & 8) > 0 && e.gid === process.getgid()) ||
          ((e.mode & 64) > 0 && e.uid === process.getuid())
        );
      }
    },
    747: function (e) {
      e.exports = require("fs");
    },
    986: function (e, t, i) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, i, r) {
          return new (i || (i = Promise))(function (s, n) {
            function fulfilled(e) {
              try {
                step(r.next(e));
              } catch (e) {
                n(e);
              }
            }
            function rejected(e) {
              try {
                step(r["throw"](e));
              } catch (e) {
                n(e);
              }
            }
            function step(e) {
              e.done
                ? s(e.value)
                : new i(function (t) {
                    t(e.value);
                  }).then(fulfilled, rejected);
            }
            step((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: true });
      const s = i(9);
      function exec(e, t, i) {
        return r(this, void 0, void 0, function* () {
          const r = s.argStringToArray(e);
          if (r.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
          }
          const n = r[0];
          t = r.slice(1).concat(t || []);
          const o = new s.ToolRunner(n, t, i);
          return o.exec();
        });
      }
      t.exec = exec;
    },
  },
  function (e) {
    "use strict";
    !(function () {
      e.r = function (e) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
        }
        Object.defineProperty(e, "__esModule", { value: true });
      };
    })();
    !(function () {
      e.n = function (t) {
        var i =
          t && t.__esModule
            ? function getDefault() {
                return t["default"];
              }
            : function getModuleExports() {
                return t;
              };
        e.d(i, "a", i);
        return i;
      };
    })();
    !(function () {
      var t = Object.prototype.hasOwnProperty;
      e.d = function (e, i, r) {
        if (!t.call(e, i)) {
          Object.defineProperty(e, i, { enumerable: true, get: r });
        }
      };
    })();
  }
);
