/* 
 * etCookie v0.1
 * 
 * Copyright 2013 E-Spring Tran
 * Released under the MIT license
 */


if (!etCookie) {
    var etCookie = {};
}
etCookie.getCookieList = function() {
    var c = document.cookie;
    var cArr = c.split('; ');
    var v = new Object();
    for (var i = 0, cLength = cArr.length; i < cLength; i++) {
        v[cArr[i].split('=')[0]] = cArr[i].split('=')[1];
    }
    return v;
};
etCookie.getCookie = function(name) {
    var v = etCookie.getCookieList();
    return (v[name] === undefined || v[name] === null) ? "" : decodeURIComponent(v[name]);
};
etCookie.setCookie = function(name, value) {
    document.cookie = name + "=" + encodeURIComponent(value);
};
etCookie.removeCookie = function(name) {
    document.cookie = encodeURIComponent(name) + "=deleted; expires=" + new Date(0).toUTCString();
};

function initShortCutByAreaId(areaId) {
    $('#' + areaId + ' .cmd-shortcut-form').each(function() {
        var $this = $(this);
        shortcut.add($this.attr('data-form-shortcut-key'), function(event) {
            if($this.is(":visible")) {
                if($this.attr('onclick')) {
                    $this.trigger('click');
                } else if($this.attr('href')){
                    location.href = $this.attr('href');
                }
            }
            return false;
        } , {propagate: false} );
    });
}
function cTrim(s, mask) {
    while (~mask.indexOf(s[0])) {
        s = s.slice(1);
    }
    while (~mask.indexOf(s[s.length - 1])) {
        s = s.slice(0, -1);
    }
    return s;
}

/**
*
* @param number
* @return
*/
function readNumber(number) {
   var billion = parseInt(Math.floor(number / 1000000000));
   number -= billion * 1000000000;

   var million = parseInt(Math.floor(number / 1000000));
   number -= million * 1000000;

   var thousand = parseInt(Math.floor(number / 1000));
   var unit = number - thousand * 1000;

   var s = "";
   if (billion != 0) {
       s = s + readTriple(billion) + " tỷ, ";
   }
   if (million != 0) {
       s = s + readTriple(million) + " triệu, ";
   }
   if (thousand != 0) {
       s = s + readTriple(thousand) + " nghìn, ";
   }
   if (unit != 0) {
       s = s + readTriple(unit);
   }
   s = cTrim(s.trim(), ',');
   return s;
}

function readTriple(number) {
   var HUNDRED_DIGITS = ["", "một trăm", "hai trăm", "ba trăm", "bốn trăm", "năm trăm", "sáu trăm", "bảy trăm", "tám trăm", "chín trăm"];
   var TEN_DIGITS = [" ", " mười ", " hai mươi ", " ba mươi ", " bốn mươi ", " năm mươi ", " sáu mươi ", " bảy mươi ", " tám mươi ", " chín mươi "];
   var UNIT_DIGITS = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
   var UNIT_DIGITS_2 = ["", "mốt", "hai", "ba", "tư", "lăm", "sáu", "bảy", "tám", "chín"];

   var hundred = parseInt(Math.floor(number / 100));
   number -= hundred * 100;
   var ten = parseInt(Math.floor(number / 10));
   var unit = number - ten * 10;

   var s = HUNDRED_DIGITS[hundred] + TEN_DIGITS[ten] + (ten <= 1 ? UNIT_DIGITS[unit] : UNIT_DIGITS_2[unit]);
   return s.trim();
}

Number.prototype.numberFormat = function(decimals, dec_point, thousands_sep) {
    dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
    thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

    var parts = this.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

    return parts.join(dec_point);
}
var filterEyeLevel = [
  function() {
      return function(input, decimals, dec_point, thousands_sep) {
          dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
          thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';
          if(!input) {
              return "";
          }
          var parts = Number(input).toFixed(decimals).split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);
          var finalNum = parts.join(dec_point);
          if(Number(input) > 0) {
              return "+" + finalNum;
          } else {
              return finalNum;
          }
      }
 }
];
var filterNumber2Decimal = [
  function() { // should be altered to suit your needs
      return function(input) {
          return (input)? input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
  };
 }]
function selectDataPicker(id, ui) {
    
}