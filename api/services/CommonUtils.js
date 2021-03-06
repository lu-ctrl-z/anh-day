module.exports = {};
/**
 * check null hoac rong
 */
module.exports.getParameterLong = function(req, name) {
    var value = req.param(name);
    var typeOf = typeof value;
    if (typeOf === "undefined") {
        return null;
    }
    if (typeOf === "string") {
        if(value.trim() === "") {
            return null;
        } else {
            value = parseInt(value);
        }
    } else if(typeOf === "number"){
        value = parseInt(value);
    } else {
        value = null;
    }
    return value;
}
module.exports.convertStringToDate = function(value) {
    var dateArray = value.split('/');
    var day = dateArray[0];
    var month = dateArray[1] - 1;
    var year = dateArray[2];
    var sourceDate = new Date(year, month, day);
    return sourceDate;
}
/**
 * check null hoac rong
 */
module.exports.isNullOrEmpty = function(checkValue) {
    var typeOf = typeof checkValue;
    if (typeOf === "undefined") {
        return true;
    }
    if (typeOf === "string") {
        return checkValue.trim() == "";
    }
    return false;
}
module.exports.isNull = function(checkValue) {
    var typeOf = typeof checkValue;
    if (typeOf === "undefined") {
        return true;
    }
    return false;
}
/**
 * NVL function
 */
module.exports.NVL = function(checkValue, nullValue) {
    if (typeof checkValue === "undefined") {
        return nullValue;
    } else if (typeof checkValue === "string" && checkValue.trim() == "") {
        return nullValue;
    } else if (typeof checkValue === "number" && checkValue < 0) {
        return nullValue;
    } else if(checkValue === null) {
        return nullValue;
    }
    return checkValue;
}
/**
 * NVL function
 */
module.exports.createMessage = function(messageKey, returnCode, res) {
    var result = {};
    result.message = sails.__(messageKey);
    result.returnCode = returnCode;
    return result;
}
/**
 * check quyền đối với id đơn vị
 */
module.exports.havePermissionWithOrg = async function(req, orgId, cb) {
    var orgId1 = req.session.user.organizationId;
    var org1 = await Organization.findOne({organizationId: orgId1});
    if(!org1) {
        cb(false);
        return false;
    }

    var org2 = await Organization.findOne({organizationId: orgId});
    if(!org2) {
        cb(false);
        return false;
    }

    var orgPath1 = org1.path;
    var orgPath2 = org2.path;
    if(orgPath2.indexOf(orgPath1) >= 0) {
        cb(true);
        return true;
    } else {
        console.warn(new Date(), req.session.user, "Đã thực hiện hack quyền.");
        cb(false);
        return false;
    }
};
module.exports.sprintf = function () {
    //  discuss at: http://locutus.io/php/sprintf/
    // original by: Ash Searle (http://hexmen.com/blog/)
    // improved by: Michael White (http://getsprink.com)
    // improved by: Jack
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Dj
    // improved by: Allidylls
    //    input by: Paulo Freitas
    //    input by: Brett Zamir (http://brett-zamir.me)
    //   example 1: sprintf("%01.2f", 123.1)
    //   returns 1: '123.10'
    //   example 2: sprintf("[%10s]", 'monkey')
    //   returns 2: '[    monkey]'
    //   example 3: sprintf("[%'#10s]", 'monkey')
    //   returns 3: '[####monkey]'
    //   example 4: sprintf("%d", 123456789012345)
    //   returns 4: '123456789012345'
    //   example 5: sprintf('%-03s', 'E')
    //   returns 5: 'E00'
    var regex = /%%|%(\d+\$)?([-+'#0 ]*)(\*\d+\$|\*|\d+)?(?:\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g
    var a = arguments
    var i = 0
    var format = a[i++]
    var _pad = function (str, len, chr, leftJustify) {
      if (!chr) {
        chr = ' '
      }
      var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr)
      return leftJustify ? str + padding : padding + str
    }
    var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
      var diff = minWidth - value.length
      if (diff > 0) {
        if (leftJustify || !zeroPad) {
          value = _pad(value, minWidth, customPadChar, leftJustify)
        } else {
          value = [
            value.slice(0, prefix.length),
            _pad('', diff, '0', true),
            value.slice(prefix.length)
          ].join('')
        }
      }
      return value
    }
    var _formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
      // Note: casts negative numbers to positive ones
      var number = value >>> 0
      prefix = (prefix && number && {
        '2': '0b',
        '8': '0',
        '16': '0x'
      }[base]) || ''
      value = prefix + _pad(number.toString(base), precision || 0, '0', false)
      return justify(value, prefix, leftJustify, minWidth, zeroPad)
    }
    // _formatString()
    var _formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
      if (precision !== null && precision !== undefined) {
        value = value.slice(0, precision)
      }
      return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar)
    }
    // doFormat()
    var doFormat = function (substring, valueIndex, flags, minWidth, precision, type) {
      var number, prefix, method, textTransform, value
      if (substring === '%%') {
        return '%'
      }
      // parse flags
      var leftJustify = false
      var positivePrefix = ''
      var zeroPad = false
      var prefixBaseX = false
      var customPadChar = ' '
      var flagsl = flags.length
      var j
      for (j = 0; j < flagsl; j++) {
        switch (flags.charAt(j)) {
          case ' ':
            positivePrefix = ' '
            break
          case '+':
            positivePrefix = '+'
            break
          case '-':
            leftJustify = true
            break
          case "'":
            customPadChar = flags.charAt(j + 1)
            break
          case '0':
            zeroPad = true
            customPadChar = '0'
            break
          case '#':
            prefixBaseX = true
            break
        }
      }
      // parameters may be null, undefined, empty-string or real valued
      // we want to ignore null, undefined and empty-string values
      if (!minWidth) {
        minWidth = 0
      } else if (minWidth === '*') {
        minWidth = +a[i++]
      } else if (minWidth.charAt(0) === '*') {
        minWidth = +a[minWidth.slice(1, -1)]
      } else {
        minWidth = +minWidth
      }
      // Note: undocumented perl feature:
      if (minWidth < 0) {
        minWidth = -minWidth
        leftJustify = true
      }
      if (!isFinite(minWidth)) {
        throw new Error('sprintf: (minimum-)width must be finite')
      }
      if (!precision) {
        precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined
      } else if (precision === '*') {
        precision = +a[i++]
      } else if (precision.charAt(0) === '*') {
        precision = +a[precision.slice(1, -1)]
      } else {
        precision = +precision
      }
      // grab value using valueIndex if required?
      value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++]
      switch (type) {
        case 's':
          return _formatString(value + '', leftJustify, minWidth, precision, zeroPad, customPadChar)
        case 'c':
          return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad)
        case 'b':
          return _formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
        case 'o':
          return _formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
        case 'x':
          return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
        case 'X':
          return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
          .toUpperCase()
        case 'u':
          return _formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
        case 'i':
        case 'd':
          number = +value || 0
          // Plain Math.round doesn't just truncate
          number = Math.round(number - number % 1)
          prefix = number < 0 ? '-' : positivePrefix
          value = prefix + _pad(String(Math.abs(number)), precision, '0', false)
          return justify(value, prefix, leftJustify, minWidth, zeroPad)
        case 'e':
        case 'E':
        case 'f': // @todo: Should handle locales (as per setlocale)
        case 'F':
        case 'g':
        case 'G':
          number = +value
          prefix = number < 0 ? '-' : positivePrefix
          method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())]
          textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2]
          value = prefix + Math.abs(number)[method](precision)
          return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]()
        default:
          return substring
      }
    }
    return format.replace(regex, doFormat)
}
