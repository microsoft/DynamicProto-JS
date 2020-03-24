import MagicString from 'magic-string';

export interface IDynamicProtoRollupOptions {
  tagname?: string,
  comment?:string,
  sourcemap?: boolean
};

function escape(str:string) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function isSourceMapEnabled(options:any) {
  if (options) {
    return options.sourceMap !== false && options.sourcemap !== false;
  }

  return false;
}

// Need to mock this rather than rely on JavaScript String.prototype.padEnd() as it doesn't always
// exists in the build / test infrastructure
function padEnd(input:string, len:number, fill:string) {
  let value = input||"";
  while (value.length < len) {
    value += fill;
  }

  if (value.length > len) {
    value = value.substring(0, len);
  }

  return value;
}

function isNullOrWhitespace(value:string) {
  if (value) {
    return value.replace(/\s/g, "").length < 1;
  }

  return true;
}

/**
 * Simple Rush plugin to remove code that is wrapped between specific comments, this is used to
 * remove the boilerplate code require by typescript to define methods as prototype level while
 * using @ms-dynamicProto project to support minification. This can also be used to remove "debug"
 * functions from the production code.
 */
export default function dynamicRemove(options:IDynamicProtoRollupOptions = {}) {
  var token = (options || {}).tagname || "@DynamicProtoStub";
  var replaceValue = (options || {}).comment || "// Removed Stub for %function%.";
  let tokenGroups:Array<number> = [4, 10, 13];
  let funcNameGroup:number = 6;

  // Because of the test infrastructure (PhamtonJS) the RegEx can't use the "s" flag (gis vs gi) or named groups
  const pattern = new RegExp("([\\t ]*\\/\\*\\*((?!\\*\\/)(.|\\r|\\n))*\\*\\/[\\s]*)*(\\/\\/[\\t ]*" + escape(token) + "[^\\r\\n]*(\\r\\n|\\n\\r|\\r|\\n))*[\\t ]*([\\w]*\\.prototype(\\.|\\[\\\"|\\[\\')[\\w]*(\\\"\\]|\\'\\])?)[\\t ]*=[\\t ]*function[\\t ]*\\([^\\{]*\\{[^\\/\\}\\{]*(\\{[^\\}]*\\}[^\\/\\}\\{]*)*(\\/[\\*\\/][\\t ]*" + escape(token) + "[^\\*\\r\\n]*(\\*\\/)?(\\r\\n|\\n\\r|\\r|\\n))*[^\\}]*\\};([\\t ]*\\/\\/[\\t ]*" + escape(token) + "[^\\r\\n]*)*", 'gi');

  function formatError(token:string, code:string, pos:number, id:string) {
    let lines = code.split(/(?:\r\n|\n\r|\r|\n)/);
    let lineNumber = 0;
    let count = pos;
    while (count > 0) {
      lineNumber ++;
      count = code.lastIndexOf("\n", count - 1);
    }
  
    let column = 0;
    let lineStart = code.lastIndexOf("\n", pos);
    if (lineStart != -1) {
      column = (pos - lineStart);
    } else {
      column = pos + 1;
    }
  
    var message = "Invalid (Unremoved) token [" + token + "] found on line [" + lineNumber + "], column [" + column + "], position [" + pos + "] - " + (id||"") + "\n";
  
    let marker = padEnd("", token.length, "^");
    let line = lineNumber - 6;
    if (line > 0) {
      message += " ...\n";
    }
  
    count = 0;
    while (count < 10 && line < lines.length-1) {
      count++;
      if (line >= 0) {
        let number = padEnd("" + (line + 1), 4, " ");
        message += number + ":" + lines[line] + "\n";
        if (line == lineNumber-1) {
          message += padEnd("", column + 4, " ") + marker + "\n";
        }
      }
  
      line++;
    }
  
    if (line < lines.length-1) {
      message += " ...\n";
    }
  
    let match;
    let matchCount = 0;
    while ((match = pattern.exec(code))) {
      let funcName = match[funcNameGroup];
      if (!isNullOrWhitespace(funcName)) {
        if (matchCount == 0) {
          message += "\nMatch checks\n";
        }

        matchCount++;
        if (match[0].length > 0) {
          message += "Match " + matchCount + " tag Groups for " + (funcName||"") + "\n";
          message += "--=( Complete Matched Content )=--\n";
          message += match[0];
          message += "\n--------------------------------\n";
          for(let lp = 1; lp < match.length; lp++) {
            if (match[lp]) {
              message += "" + lp + ": " + (match[lp] || "").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
              if ((match[lp]||"").indexOf(token) != -1) {
                message += " <- Contains tag";
              }
              message += "\n";
            }
          }
          message += "\n";
        }
      }
    }
  
    return message;
  }

  function replaceToken(code:string, theString:MagicString) {
    let result = false;
    let match;
    while ((match = pattern.exec(code))) {
      let funcName = match[funcNameGroup];
      if (!isNullOrWhitespace(funcName)) {
        // Only remove matches that contain a tag and function
        let hasToken = false;
        for(let lp = 0; lp < tokenGroups.length; lp++) {
          if ((match[tokenGroups[lp]]||"").indexOf(token) != -1) {
            hasToken = true;
            break;
          }
        }
  
        if (hasToken) {
          result = true;
          let start = match.index;
          let newValue = replaceValue.replace("%function%", funcName);
          theString.overwrite(start, start + match[0].length, newValue);
        }
      }
    }

    return result;
  }

  function checkResult(result:string, id:string) {
    if (result) {
      let pos = result.indexOf(token);
      if (pos != -1) {
        throw new Error(formatError(token, result, pos, id));
      }
    }
  }

  function doTransform(code:string, id:string) {
    let theString = new MagicString(code);
    if (!replaceToken(code, theString)) {
      return null;
    }

    let result:any = { code: theString.toString() };
    if (isSourceMapEnabled(options)) {
      result.map = theString.generateMap({hires: true});
    }

    return result;
  }

  function doTransformAndCheck(code:string, id:string) {
    let result = doTransform(code, id);
    if (result) {
      // Do a final check of the string
      checkResult(result.code, id);
    } else {
      // Check that the raw input doesn't include the tag
      checkResult(code, id);
    }

    return result;
  }

  return {
    name: 'dynamicRemove',
    renderChunk(code:string, chunk:any) {
      return doTransformAndCheck(code, chunk.filename);
    },
    transform: doTransformAndCheck
  }
}
  
  