/* 
 * Morpheuz Sleep Monitor
 *
 * Copyright (c) 2013-2015 James Fowler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*global window, nvl, mLang, mConst, buildUrl, makePostAjaxCall */
/*exported pushoverConfigured, pushoverTransmit */

/*
 * Is Pushover configured?
 */
function pushoverConfigured() {
  var pouser = nvl(window.localStorage.getItem("pouser"), "");
  var potoken = nvl(window.localStorage.getItem("potoken"), "");
  return (pouser !== "" && potoken !== "");
}

/**
 * Send a pushover message
 */
function pushoverTransmit() {
  try {
    var pouser = nvl(window.localStorage.getItem("pouser"), "");
    var potoken = nvl(window.localStorage.getItem("potoken"), "");
    if (pouser === "" || potoken === "") {
      window.localStorage.setItem("postat", mLang().disabled);
      console.log("pushoverTransmit: potoken and/or pouser not set");
      return;
    }
    window.localStorage.setItem("postat", mLang().sending);
    var base = window.localStorage.getItem("base");
    var resetDate = new Date(parseInt(base, 10)).format(mConst().displayDateFmt);
    var urlToAttach = buildUrl("Y");
    var url = mConst().pushoverAPI;
    var msg = "token=" + potoken + "&user=" + pouser + "&message=" + encodeURIComponent(resetDate) + "&url=" + encodeURIComponent(urlToAttach) + "&url_title=Report" + "&priority=-2" + "&sound=none";
    console.log("pushoverTransmit: msg=" + msg);
    makePostAjaxCall(url, msg, function(resp) {
      console.log("pushoverTransmit: " + JSON.stringify(resp));
      if (resp.status !== 1) {
        window.localStorage.setItem("postat", JSON.stringify(resp.errors));
      } else {
        window.localStorage.setItem("postat", mLang().ok);
      }
    });
  } catch (err) {
    window.localStorage.setItem("postat", err.message);
  }
}
