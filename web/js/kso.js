;
!(function (window) {
  'use strict';

  // 回调参数在 params 中的接口集
  var innerParamsCallbackMap = {
    'httpPost': true,
    'httpGet': true
  }

  var _jsAsynCall = window.external && window.external.jsAsynCall;
  var _cefQuery = window.cefQuery;
  var jsAsynCallCallbackCount = 0;

  /**
   * webJs 与 KsoApi 通信一级接口
   * @param  {String}   methodName    KsoApi方法名
   * @param  {[JSON]}   [args]        KsoApi方法约定数据格式JSON
   * @param  {[Function]} [callback]  KsoApi执行回调
   * @return {[type]}                 undefined
   */
  var jsAsynCall = function (methodName, args, callback) {
    var callbackName = methodName + '_async_callback_' + ++jsAsynCallCallbackCount;

    var paramsCallbackName = ''

    var invokeParams = {
      method: methodName,
      params: args,
      callback: callbackName
    };

    if (innerParamsCallbackMap.hasOwnProperty(methodName)) {
      args || (args = {})

      paramsCallbackName = methodName + '_async_params_callback_' + ++jsAsynCallCallbackCount;
      args.callback = paramsCallbackName;

      window[callbackName] = function () {
        delete window[callbackName];
      }

      window[paramsCallbackName] = function (res) {
        delete window[paramsCallbackName];
        var result = window.Base64.decode(res)
        if (res) {
          try {
            result = JSON.parse(window.Base64.decode(res))
          } catch (e) {}
        }
        callback instanceof Function && callback(result);
      }

    } else {
      window[callbackName] = function (res) {
        delete window[callbackName];
        callback instanceof Function && callback(JSON.parse(window.Base64.decode(res)));
      };
    }

    var jsonIn = window.Base64.encode(JSON.stringify(invokeParams));
    if (_cefQuery) {
      _cefQuery({
        request: 'jsAsynCall("' + jsonIn + '")',
        persistent: false
      });
    } else {
      _jsAsynCall(jsonIn);
    }
  }

  window.ksoJsAsynCall = jsAsynCall;

}(window));