(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["elastic-apm-opentracing"] = factory();
	else
		root["elastic-apm-opentracing"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../rum-core/dist/es/bootstrap.js":
/*!****************************************!*\
  !*** ../rum-core/dist/es/bootstrap.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootstrap": function() { return /* binding */ bootstrap; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/patching */ "../rum-core/dist/es/common/patching/index.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "../rum-core/dist/es/state.js");



var enabled = false;
function bootstrap() {
  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.isPlatformSupported)()) {
    (0,_common_patching__WEBPACK_IMPORTED_MODULE_1__.patchAll)();
    _state__WEBPACK_IMPORTED_MODULE_2__.state.bootstrapTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)();
    enabled = true;
  } else if (_common_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser) {
    console.log('[Elastic APM] platform is not supported!');
  }

  return enabled;
}

/***/ }),

/***/ "../rum-core/dist/es/common/after-frame.js":
/*!*************************************************!*\
  !*** ../rum-core/dist/es/common/after-frame.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ afterFrame; }
/* harmony export */ });
var RAF_TIMEOUT = 100;
function afterFrame(callback) {
  var handler = function handler() {
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    setTimeout(callback);
  };

  var timeout = setTimeout(handler, RAF_TIMEOUT);
  var raf = requestAnimationFrame(handler);
}

/***/ }),

/***/ "../rum-core/dist/es/common/apm-server.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/common/apm-server.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./queue */ "../rum-core/dist/es/common/queue.js");
/* harmony import */ var _throttle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./throttle */ "../rum-core/dist/es/common/throttle.js");
/* harmony import */ var _ndjson__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ndjson */ "../rum-core/dist/es/common/ndjson.js");
/* harmony import */ var _truncate__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./truncate */ "../rum-core/dist/es/common/truncate.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _compress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./compress */ "../rum-core/dist/es/common/compress.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _http_fetch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./http/fetch */ "../rum-core/dist/es/common/http/fetch.js");
/* harmony import */ var _http_xhr__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./http/xhr */ "../rum-core/dist/es/common/http/xhr.js");











var THROTTLE_INTERVAL = 60000;

var ApmServer = function () {
  function ApmServer(configService, loggingService) {
    this._configService = configService;
    this._loggingService = loggingService;
    this.queue = undefined;
    this.throttleEvents = _utils__WEBPACK_IMPORTED_MODULE_0__.noop;
  }

  var _proto = ApmServer.prototype;

  _proto.init = function init() {
    var _this = this;

    var queueLimit = this._configService.get('queueLimit');

    var flushInterval = this._configService.get('flushInterval');

    var limit = this._configService.get('eventsLimit');

    var onFlush = function onFlush(events) {
      var promise = _this.sendEvents(events);

      if (promise) {
        promise.catch(function (reason) {
          _this._loggingService.warn('Failed sending events!', _this._constructError(reason));
        });
      }
    };

    this.queue = new _queue__WEBPACK_IMPORTED_MODULE_1__.default(onFlush, {
      queueLimit: queueLimit,
      flushInterval: flushInterval
    });
    this.throttleEvents = (0,_throttle__WEBPACK_IMPORTED_MODULE_2__.default)(this.queue.add.bind(this.queue), function () {
      return _this._loggingService.warn('Dropped events due to throttling!');
    }, {
      limit: limit,
      interval: THROTTLE_INTERVAL
    });

    this._configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_3__.QUEUE_FLUSH, function () {
      _this.queue.flush();
    });
  };

  _proto._postJson = function _postJson(endPoint, payload) {
    var _this2 = this;

    var headers = {
      'Content-Type': 'application/x-ndjson'
    };

    var apmRequest = this._configService.get('apmRequest');

    var params = {
      payload: payload,
      headers: headers,
      beforeSend: apmRequest
    };
    return (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressPayload)(params).catch(function (error) {
      if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
        _this2._loggingService.debug('Compressing the payload using CompressionStream API failed', error.message);
      }

      return params;
    }).then(function (result) {
      return _this2._makeHttpRequest('POST', endPoint, result);
    }).then(function (_ref) {
      var responseText = _ref.responseText;
      return responseText;
    });
  };

  _proto._constructError = function _constructError(reason) {
    var url = reason.url,
        status = reason.status,
        responseText = reason.responseText;

    if (typeof status == 'undefined') {
      return reason;
    }

    var message = url + ' HTTP status: ' + status;

    if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__ && responseText) {
      try {
        var serverErrors = [];
        var response = JSON.parse(responseText);

        if (response.errors && response.errors.length > 0) {
          response.errors.forEach(function (err) {
            return serverErrors.push(err.message);
          });
          message += ' ' + serverErrors.join(',');
        }
      } catch (e) {
        this._loggingService.debug('Error parsing response from APM server', e);
      }
    }

    return new Error(message);
  };

  _proto._makeHttpRequest = function _makeHttpRequest(method, url, _temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
        _ref2$timeout = _ref2.timeout,
        timeout = _ref2$timeout === void 0 ? _constants__WEBPACK_IMPORTED_MODULE_3__.HTTP_REQUEST_TIMEOUT : _ref2$timeout,
        payload = _ref2.payload,
        headers = _ref2.headers,
        beforeSend = _ref2.beforeSend;

    var sendCredentials = this._configService.get('sendCredentials');

    if (!beforeSend && (0,_http_fetch__WEBPACK_IMPORTED_MODULE_6__.shouldUseFetchWithKeepAlive)(method, payload)) {
      return (0,_http_fetch__WEBPACK_IMPORTED_MODULE_6__.sendFetchRequest)(method, url, {
        keepalive: true,
        timeout: timeout,
        payload: payload,
        headers: headers,
        sendCredentials: sendCredentials
      }).catch(function (reason) {
        if (reason instanceof TypeError) {
          return (0,_http_xhr__WEBPACK_IMPORTED_MODULE_7__.sendXHR)(method, url, {
            timeout: timeout,
            payload: payload,
            headers: headers,
            beforeSend: beforeSend,
            sendCredentials: sendCredentials
          });
        }

        throw reason;
      });
    }

    return (0,_http_xhr__WEBPACK_IMPORTED_MODULE_7__.sendXHR)(method, url, {
      timeout: timeout,
      payload: payload,
      headers: headers,
      beforeSend: beforeSend,
      sendCredentials: sendCredentials
    });
  };

  _proto.fetchConfig = function fetchConfig(serviceName, environment) {
    var _this3 = this;

    var _this$getEndpoints = this.getEndpoints(),
        configEndpoint = _this$getEndpoints.configEndpoint;

    if (!serviceName) {
      return _polyfills__WEBPACK_IMPORTED_MODULE_8__.Promise.reject('serviceName is required for fetching central config.');
    }

    configEndpoint += "?service.name=" + serviceName;

    if (environment) {
      configEndpoint += "&service.environment=" + environment;
    }

    var localConfig = this._configService.getLocalConfig();

    if (localConfig) {
      configEndpoint += "&ifnonematch=" + localConfig.etag;
    }

    var apmRequest = this._configService.get('apmRequest');

    return this._makeHttpRequest('GET', configEndpoint, {
      timeout: 5000,
      beforeSend: apmRequest
    }).then(function (xhr) {
      var status = xhr.status,
          responseText = xhr.responseText;

      if (status === 304) {
        return localConfig;
      } else {
        var remoteConfig = JSON.parse(responseText);
        var etag = xhr.getResponseHeader('etag');

        if (etag) {
          remoteConfig.etag = etag.replace(/["]/g, '');

          _this3._configService.setLocalConfig(remoteConfig, true);
        }

        return remoteConfig;
      }
    }).catch(function (reason) {
      var error = _this3._constructError(reason);

      return _polyfills__WEBPACK_IMPORTED_MODULE_8__.Promise.reject(error);
    });
  };

  _proto.createMetaData = function createMetaData() {
    var cfg = this._configService;
    var metadata = {
      service: {
        name: cfg.get('serviceName'),
        version: cfg.get('serviceVersion'),
        agent: {
          name: 'rum-js',
          version: cfg.version
        },
        language: {
          name: 'javascript'
        },
        environment: cfg.get('environment')
      },
      labels: cfg.get('context.tags')
    };
    return (0,_truncate__WEBPACK_IMPORTED_MODULE_9__.truncateModel)(_truncate__WEBPACK_IMPORTED_MODULE_9__.METADATA_MODEL, metadata);
  };

  _proto.addError = function addError(error) {
    var _this$throttleEvents;

    this.throttleEvents((_this$throttleEvents = {}, _this$throttleEvents[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS] = error, _this$throttleEvents));
  };

  _proto.addTransaction = function addTransaction(transaction) {
    var _this$throttleEvents2;

    this.throttleEvents((_this$throttleEvents2 = {}, _this$throttleEvents2[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS] = transaction, _this$throttleEvents2));
  };

  _proto.ndjsonErrors = function ndjsonErrors(errors, compress) {
    var key = compress ? 'e' : 'error';
    return errors.map(function (error) {
      var _NDJSON$stringify;

      return _ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify((_NDJSON$stringify = {}, _NDJSON$stringify[key] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressError)(error) : error, _NDJSON$stringify));
    });
  };

  _proto.ndjsonMetricsets = function ndjsonMetricsets(metricsets) {
    return metricsets.map(function (metricset) {
      return _ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify({
        metricset: metricset
      });
    }).join('');
  };

  _proto.ndjsonTransactions = function ndjsonTransactions(transactions, compress) {
    var _this4 = this;

    var key = compress ? 'x' : 'transaction';
    return transactions.map(function (tr) {
      var _NDJSON$stringify2;

      var spans = '',
          breakdowns = '';

      if (!compress) {
        if (tr.spans) {
          spans = tr.spans.map(function (span) {
            return _ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify({
              span: span
            });
          }).join('');
          delete tr.spans;
        }

        if (tr.breakdown) {
          breakdowns = _this4.ndjsonMetricsets(tr.breakdown);
          delete tr.breakdown;
        }
      }

      return _ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify((_NDJSON$stringify2 = {}, _NDJSON$stringify2[key] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressTransaction)(tr) : tr, _NDJSON$stringify2)) + spans + breakdowns;
    });
  };

  _proto.sendEvents = function sendEvents(events) {
    var _payload, _NDJSON$stringify3;

    if (events.length === 0) {
      return;
    }

    var transactions = [];
    var errors = [];

    for (var i = 0; i < events.length; i++) {
      var event = events[i];

      if (event[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS]) {
        transactions.push(event[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS]);
      }

      if (event[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS]) {
        errors.push(event[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS]);
      }
    }

    if (transactions.length === 0 && errors.length === 0) {
      return;
    }

    var cfg = this._configService;
    var payload = (_payload = {}, _payload[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS] = transactions, _payload[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS] = errors, _payload);
    var filteredPayload = cfg.applyFilters(payload);

    if (!filteredPayload) {
      this._loggingService.warn('Dropped payload due to filtering!');

      return;
    }

    var apiVersion = cfg.get('apiVersion');
    var compress = apiVersion > 2;
    var ndjson = [];
    var metadata = this.createMetaData();
    var metadataKey = compress ? 'm' : 'metadata';
    ndjson.push(_ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify((_NDJSON$stringify3 = {}, _NDJSON$stringify3[metadataKey] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressMetadata)(metadata) : metadata, _NDJSON$stringify3)));
    ndjson = ndjson.concat(this.ndjsonErrors(filteredPayload[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS], compress), this.ndjsonTransactions(filteredPayload[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS], compress));
    var ndjsonPayload = ndjson.join('');

    var _this$getEndpoints2 = this.getEndpoints(),
        intakeEndpoint = _this$getEndpoints2.intakeEndpoint;

    return this._postJson(intakeEndpoint, ndjsonPayload);
  };

  _proto.getEndpoints = function getEndpoints() {
    var serverUrl = this._configService.get('serverUrl');

    var apiVersion = this._configService.get('apiVersion');

    var serverUrlPrefix = this._configService.get('serverUrlPrefix') || "/intake/v" + apiVersion + "/rum/events";
    var intakeEndpoint = serverUrl + serverUrlPrefix;
    var configEndpoint = serverUrl + "/config/v1/rum/agents";
    return {
      intakeEndpoint: intakeEndpoint,
      configEndpoint: configEndpoint
    };
  };

  return ApmServer;
}();

/* harmony default export */ __webpack_exports__["default"] = (ApmServer);

/***/ }),

/***/ "../rum-core/dist/es/common/compress.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/compress.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compressMetadata": function() { return /* binding */ compressMetadata; },
/* harmony export */   "compressTransaction": function() { return /* binding */ compressTransaction; },
/* harmony export */   "compressError": function() { return /* binding */ compressError; },
/* harmony export */   "compressMetricsets": function() { return /* binding */ compressMetricsets; },
/* harmony export */   "compressPayload": function() { return /* binding */ compressPayload; }
/* harmony export */ });
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../performance-monitoring/navigation/marks */ "../rum-core/dist/es/performance-monitoring/navigation/marks.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");




function compressStackFrames(frames) {
  return frames.map(function (frame) {
    return {
      ap: frame.abs_path,
      f: frame.filename,
      fn: frame.function,
      li: frame.lineno,
      co: frame.colno
    };
  });
}

function compressResponse(response) {
  return {
    ts: response.transfer_size,
    ebs: response.encoded_body_size,
    dbs: response.decoded_body_size
  };
}

function compressHTTP(http) {
  var compressed = {};
  var method = http.method,
      status_code = http.status_code,
      url = http.url,
      response = http.response;
  compressed.url = url;

  if (method) {
    compressed.mt = method;
  }

  if (status_code) {
    compressed.sc = status_code;
  }

  if (response) {
    compressed.r = compressResponse(response);
  }

  return compressed;
}

function compressContext(context) {
  if (!context) {
    return null;
  }

  var compressed = {};
  var page = context.page,
      http = context.http,
      response = context.response,
      destination = context.destination,
      user = context.user,
      custom = context.custom;

  if (page) {
    compressed.p = {
      rf: page.referer,
      url: page.url
    };
  }

  if (http) {
    compressed.h = compressHTTP(http);
  }

  if (response) {
    compressed.r = compressResponse(response);
  }

  if (destination) {
    var service = destination.service;
    compressed.dt = {
      se: {
        n: service.name,
        t: service.type,
        rc: service.resource
      },
      ad: destination.address,
      po: destination.port
    };
  }

  if (user) {
    compressed.u = {
      id: user.id,
      un: user.username,
      em: user.email
    };
  }

  if (custom) {
    compressed.cu = custom;
  }

  return compressed;
}

function compressMarks(marks) {
  if (!marks) {
    return null;
  }

  var compressedNtMarks = compressNavigationTimingMarks(marks.navigationTiming);
  var compressed = {
    nt: compressedNtMarks,
    a: compressAgentMarks(compressedNtMarks, marks.agent)
  };
  return compressed;
}

function compressNavigationTimingMarks(ntMarks) {
  if (!ntMarks) {
    return null;
  }

  var compressed = {};
  _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__.COMPRESSED_NAV_TIMING_MARKS.forEach(function (mark, index) {
    var mapping = _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__.NAVIGATION_TIMING_MARKS[index];
    compressed[mark] = ntMarks[mapping];
  });
  return compressed;
}

function compressAgentMarks(compressedNtMarks, agentMarks) {
  var compressed = {};

  if (compressedNtMarks) {
    compressed = {
      fb: compressedNtMarks.rs,
      di: compressedNtMarks.di,
      dc: compressedNtMarks.dc
    };
  }

  if (agentMarks) {
    var fp = agentMarks.firstContentfulPaint;
    var lp = agentMarks.largestContentfulPaint;

    if (fp) {
      compressed.fp = fp;
    }

    if (lp) {
      compressed.lp = lp;
    }
  }

  if (Object.keys(compressed).length === 0) {
    return null;
  }

  return compressed;
}

function compressMetadata(metadata) {
  var service = metadata.service,
      labels = metadata.labels;
  var agent = service.agent,
      language = service.language;
  return {
    se: {
      n: service.name,
      ve: service.version,
      a: {
        n: agent.name,
        ve: agent.version
      },
      la: {
        n: language.name
      },
      en: service.environment
    },
    l: labels
  };
}
function compressTransaction(transaction) {
  var spans = transaction.spans.map(function (span) {
    var spanData = {
      id: span.id,
      n: span.name,
      t: span.type,
      s: span.start,
      d: span.duration,
      c: compressContext(span.context),
      o: span.outcome,
      sr: span.sample_rate
    };

    if (span.parent_id !== transaction.id) {
      spanData.pid = span.parent_id;
    }

    if (span.sync === true) {
      spanData.sy = true;
    }

    if (span.subtype) {
      spanData.su = span.subtype;
    }

    if (span.action) {
      spanData.ac = span.action;
    }

    return spanData;
  });
  var tr = {
    id: transaction.id,
    tid: transaction.trace_id,
    n: transaction.name,
    t: transaction.type,
    d: transaction.duration,
    c: compressContext(transaction.context),
    k: compressMarks(transaction.marks),
    me: compressMetricsets(transaction.breakdown),
    y: spans,
    yc: {
      sd: spans.length
    },
    sm: transaction.sampled,
    sr: transaction.sample_rate,
    o: transaction.outcome
  };

  if (transaction.experience) {
    var _transaction$experien = transaction.experience,
        cls = _transaction$experien.cls,
        fid = _transaction$experien.fid,
        tbt = _transaction$experien.tbt,
        longtask = _transaction$experien.longtask;
    tr.exp = {
      cls: cls,
      fid: fid,
      tbt: tbt,
      lt: longtask
    };
  }

  if (transaction.session) {
    var _transaction$session = transaction.session,
        id = _transaction$session.id,
        sequence = _transaction$session.sequence;
    tr.ses = {
      id: id,
      seq: sequence
    };
  }

  return tr;
}
function compressError(error) {
  var exception = error.exception;
  var compressed = {
    id: error.id,
    cl: error.culprit,
    ex: {
      mg: exception.message,
      st: compressStackFrames(exception.stacktrace),
      t: error.type
    },
    c: compressContext(error.context)
  };
  var transaction = error.transaction;

  if (transaction) {
    compressed.tid = error.trace_id;
    compressed.pid = error.parent_id;
    compressed.xid = error.transaction_id;
    compressed.x = {
      t: transaction.type,
      sm: transaction.sampled
    };
  }

  return compressed;
}
function compressMetricsets(breakdowns) {
  return breakdowns.map(function (_ref) {
    var span = _ref.span,
        samples = _ref.samples;
    return {
      y: {
        t: span.type
      },
      sa: {
        ysc: {
          v: samples['span.self_time.count'].value
        },
        yss: {
          v: samples['span.self_time.sum.us'].value
        }
      }
    };
  });
}
function compressPayload(params, type) {
  if (type === void 0) {
    type = 'gzip';
  }

  var isCompressionStreamSupported = typeof CompressionStream === 'function';
  return new _polyfills__WEBPACK_IMPORTED_MODULE_1__.Promise(function (resolve) {
    if (!isCompressionStreamSupported) {
      return resolve(params);
    }

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.isBeaconInspectionEnabled)()) {
      return resolve(params);
    }

    var payload = params.payload,
        headers = params.headers,
        beforeSend = params.beforeSend;
    var payloadStream = new Blob([payload]).stream();
    var compressedStream = payloadStream.pipeThrough(new CompressionStream(type));
    return new Response(compressedStream).blob().then(function (payload) {
      headers['Content-Encoding'] = type;
      return resolve({
        payload: payload,
        headers: headers,
        beforeSend: beforeSend
      });
    });
  });
}

/***/ }),

/***/ "../rum-core/dist/es/common/config-service.js":
/*!****************************************************!*\
  !*** ../rum-core/dist/es/common/config-service.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-handler */ "../rum-core/dist/es/common/event-handler.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}





function getConfigFromScript() {
  var script = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentScript)();
  var config = getDataAttributesFromNode(script);
  return config;
}

function getDataAttributesFromNode(node) {
  if (!node) {
    return {};
  }

  var dataAttrs = {};
  var dataRegex = /^data-([\w-]+)$/;
  var attrs = node.attributes;

  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];

    if (dataRegex.test(attr.nodeName)) {
      var key = attr.nodeName.match(dataRegex)[1];
      var camelCasedkey = key.split('-').map(function (value, index) {
        return index > 0 ? value.charAt(0).toUpperCase() + value.substring(1) : value;
      }).join('');
      dataAttrs[camelCasedkey] = attr.value || attr.nodeValue;
    }
  }

  return dataAttrs;
}

var Config = function () {
  function Config() {
    this.config = {
      serviceName: '',
      serviceVersion: '',
      environment: '',
      serverUrl: 'http://localhost:8200',
      serverUrlPrefix: '',
      active: true,
      instrument: true,
      disableInstrumentations: [],
      logLevel: 'warn',
      breakdownMetrics: false,
      ignoreTransactions: [],
      eventsLimit: 80,
      queueLimit: -1,
      flushInterval: 500,
      distributedTracing: true,
      distributedTracingOrigins: [],
      distributedTracingHeaderName: 'traceparent',
      pageLoadTraceId: '',
      pageLoadSpanId: '',
      pageLoadSampled: false,
      pageLoadTransactionName: '',
      propagateTracestate: false,
      transactionSampleRate: 1.0,
      centralConfig: false,
      monitorLongtasks: true,
      apiVersion: 2,
      context: {},
      session: false,
      apmRequest: null,
      sendCredentials: false
    };
    this.events = new _event_handler__WEBPACK_IMPORTED_MODULE_1__.default();
    this.filters = [];
    this.version = '';
  }

  var _proto = Config.prototype;

  _proto.init = function init() {
    var scriptData = getConfigFromScript();
    this.setConfig(scriptData);
  };

  _proto.setVersion = function setVersion(version) {
    this.version = version;
  };

  _proto.addFilter = function addFilter(cb) {
    if (typeof cb !== 'function') {
      throw new Error('Argument to must be function');
    }

    this.filters.push(cb);
  };

  _proto.applyFilters = function applyFilters(data) {
    for (var i = 0; i < this.filters.length; i++) {
      data = this.filters[i](data);

      if (!data) {
        return;
      }
    }

    return data;
  };

  _proto.get = function get(key) {
    return key.split('.').reduce(function (obj, objKey) {
      return obj && obj[objKey];
    }, this.config);
  };

  _proto.setUserContext = function setUserContext(userContext) {
    if (userContext === void 0) {
      userContext = {};
    }

    var context = {};
    var _userContext = userContext,
        id = _userContext.id,
        username = _userContext.username,
        email = _userContext.email;

    if (typeof id === 'number' || typeof id === 'string') {
      context.id = id;
    }

    if (typeof username === 'string') {
      context.username = username;
    }

    if (typeof email === 'string') {
      context.email = email;
    }

    this.config.context.user = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.config.context.user || {}, context);
  };

  _proto.setCustomContext = function setCustomContext(customContext) {
    if (customContext === void 0) {
      customContext = {};
    }

    this.config.context.custom = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.config.context.custom || {}, customContext);
  };

  _proto.addLabels = function addLabels(tags) {
    var _this = this;

    if (!this.config.context.tags) {
      this.config.context.tags = {};
    }

    var keys = Object.keys(tags);
    keys.forEach(function (k) {
      return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setLabel)(k, tags[k], _this.config.context.tags);
    });
  };

  _proto.setConfig = function setConfig(properties) {
    if (properties === void 0) {
      properties = {};
    }

    var _properties = properties,
        transactionSampleRate = _properties.transactionSampleRate,
        serverUrl = _properties.serverUrl;

    if (serverUrl) {
      properties.serverUrl = serverUrl.replace(/\/+$/, '');
    }

    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(transactionSampleRate)) {
      if (transactionSampleRate < 0.0001 && transactionSampleRate > 0) {
        transactionSampleRate = 0.0001;
      }

      properties.transactionSampleRate = Math.round(transactionSampleRate * 10000) / 10000;
    }

    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.merge)(this.config, properties);
    this.events.send(_constants__WEBPACK_IMPORTED_MODULE_2__.CONFIG_CHANGE, [this.config]);
  };

  _proto.validate = function validate(properties) {
    if (properties === void 0) {
      properties = {};
    }

    var requiredKeys = ['serviceName', 'serverUrl'];
    var allKeys = Object.keys(this.config);
    var errors = {
      missing: [],
      invalid: [],
      unknown: []
    };
    Object.keys(properties).forEach(function (key) {
      if (requiredKeys.indexOf(key) !== -1 && !properties[key]) {
        errors.missing.push(key);
      }

      if (allKeys.indexOf(key) === -1) {
        errors.unknown.push(key);
      }
    });

    if (properties.serviceName && !/^[a-zA-Z0-9 _-]+$/.test(properties.serviceName)) {
      errors.invalid.push({
        key: 'serviceName',
        value: properties.serviceName,
        allowed: 'a-z, A-Z, 0-9, _, -, <space>'
      });
    }

    var sampleRate = properties.transactionSampleRate;

    if (typeof sampleRate !== 'undefined' && (typeof sampleRate !== 'number' || isNaN(sampleRate) || sampleRate < 0 || sampleRate > 1)) {
      errors.invalid.push({
        key: 'transactionSampleRate',
        value: sampleRate,
        allowed: 'Number between 0 and 1'
      });
    }

    return errors;
  };

  _proto.getLocalConfig = function getLocalConfig() {
    var storage = sessionStorage;

    if (this.config.session) {
      storage = localStorage;
    }

    var config = storage.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.LOCAL_CONFIG_KEY);

    if (config) {
      return JSON.parse(config);
    }
  };

  _proto.setLocalConfig = function setLocalConfig(config, merge) {
    if (config) {
      if (merge) {
        var prevConfig = this.getLocalConfig();
        config = _extends({}, prevConfig, config);
      }

      var storage = sessionStorage;

      if (this.config.session) {
        storage = localStorage;
      }

      storage.setItem(_constants__WEBPACK_IMPORTED_MODULE_2__.LOCAL_CONFIG_KEY, JSON.stringify(config));
    }
  };

  _proto.dispatchEvent = function dispatchEvent(name, args) {
    this.events.send(name, args);
  };

  _proto.observeEvent = function observeEvent(name, fn) {
    return this.events.observe(name, fn);
  };

  return Config;
}();

/* harmony default export */ __webpack_exports__["default"] = (Config);

/***/ }),

/***/ "../rum-core/dist/es/common/constants.js":
/*!***********************************************!*\
  !*** ../rum-core/dist/es/common/constants.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SCHEDULE": function() { return /* binding */ SCHEDULE; },
/* harmony export */   "INVOKE": function() { return /* binding */ INVOKE; },
/* harmony export */   "ADD_EVENT_LISTENER_STR": function() { return /* binding */ ADD_EVENT_LISTENER_STR; },
/* harmony export */   "REMOVE_EVENT_LISTENER_STR": function() { return /* binding */ REMOVE_EVENT_LISTENER_STR; },
/* harmony export */   "RESOURCE_INITIATOR_TYPES": function() { return /* binding */ RESOURCE_INITIATOR_TYPES; },
/* harmony export */   "REUSABILITY_THRESHOLD": function() { return /* binding */ REUSABILITY_THRESHOLD; },
/* harmony export */   "MAX_SPAN_DURATION": function() { return /* binding */ MAX_SPAN_DURATION; },
/* harmony export */   "PAGE_LOAD_DELAY": function() { return /* binding */ PAGE_LOAD_DELAY; },
/* harmony export */   "PAGE_LOAD": function() { return /* binding */ PAGE_LOAD; },
/* harmony export */   "ROUTE_CHANGE": function() { return /* binding */ ROUTE_CHANGE; },
/* harmony export */   "NAME_UNKNOWN": function() { return /* binding */ NAME_UNKNOWN; },
/* harmony export */   "TYPE_CUSTOM": function() { return /* binding */ TYPE_CUSTOM; },
/* harmony export */   "USER_TIMING_THRESHOLD": function() { return /* binding */ USER_TIMING_THRESHOLD; },
/* harmony export */   "TRANSACTION_START": function() { return /* binding */ TRANSACTION_START; },
/* harmony export */   "TRANSACTION_END": function() { return /* binding */ TRANSACTION_END; },
/* harmony export */   "CONFIG_CHANGE": function() { return /* binding */ CONFIG_CHANGE; },
/* harmony export */   "QUEUE_FLUSH": function() { return /* binding */ QUEUE_FLUSH; },
/* harmony export */   "QUEUE_ADD_TRANSACTION": function() { return /* binding */ QUEUE_ADD_TRANSACTION; },
/* harmony export */   "XMLHTTPREQUEST": function() { return /* binding */ XMLHTTPREQUEST; },
/* harmony export */   "FETCH": function() { return /* binding */ FETCH; },
/* harmony export */   "HISTORY": function() { return /* binding */ HISTORY; },
/* harmony export */   "EVENT_TARGET": function() { return /* binding */ EVENT_TARGET; },
/* harmony export */   "CLICK": function() { return /* binding */ CLICK; },
/* harmony export */   "ERROR": function() { return /* binding */ ERROR; },
/* harmony export */   "BEFORE_EVENT": function() { return /* binding */ BEFORE_EVENT; },
/* harmony export */   "AFTER_EVENT": function() { return /* binding */ AFTER_EVENT; },
/* harmony export */   "LOCAL_CONFIG_KEY": function() { return /* binding */ LOCAL_CONFIG_KEY; },
/* harmony export */   "HTTP_REQUEST_TYPE": function() { return /* binding */ HTTP_REQUEST_TYPE; },
/* harmony export */   "LONG_TASK": function() { return /* binding */ LONG_TASK; },
/* harmony export */   "PAINT": function() { return /* binding */ PAINT; },
/* harmony export */   "MEASURE": function() { return /* binding */ MEASURE; },
/* harmony export */   "NAVIGATION": function() { return /* binding */ NAVIGATION; },
/* harmony export */   "RESOURCE": function() { return /* binding */ RESOURCE; },
/* harmony export */   "FIRST_CONTENTFUL_PAINT": function() { return /* binding */ FIRST_CONTENTFUL_PAINT; },
/* harmony export */   "LARGEST_CONTENTFUL_PAINT": function() { return /* binding */ LARGEST_CONTENTFUL_PAINT; },
/* harmony export */   "KEYWORD_LIMIT": function() { return /* binding */ KEYWORD_LIMIT; },
/* harmony export */   "TEMPORARY_TYPE": function() { return /* binding */ TEMPORARY_TYPE; },
/* harmony export */   "USER_INTERACTION": function() { return /* binding */ USER_INTERACTION; },
/* harmony export */   "TRANSACTION_TYPE_ORDER": function() { return /* binding */ TRANSACTION_TYPE_ORDER; },
/* harmony export */   "ERRORS": function() { return /* binding */ ERRORS; },
/* harmony export */   "TRANSACTIONS": function() { return /* binding */ TRANSACTIONS; },
/* harmony export */   "CONFIG_SERVICE": function() { return /* binding */ CONFIG_SERVICE; },
/* harmony export */   "LOGGING_SERVICE": function() { return /* binding */ LOGGING_SERVICE; },
/* harmony export */   "TRANSACTION_SERVICE": function() { return /* binding */ TRANSACTION_SERVICE; },
/* harmony export */   "APM_SERVER": function() { return /* binding */ APM_SERVER; },
/* harmony export */   "PERFORMANCE_MONITORING": function() { return /* binding */ PERFORMANCE_MONITORING; },
/* harmony export */   "ERROR_LOGGING": function() { return /* binding */ ERROR_LOGGING; },
/* harmony export */   "TRUNCATED_TYPE": function() { return /* binding */ TRUNCATED_TYPE; },
/* harmony export */   "FIRST_INPUT": function() { return /* binding */ FIRST_INPUT; },
/* harmony export */   "LAYOUT_SHIFT": function() { return /* binding */ LAYOUT_SHIFT; },
/* harmony export */   "OUTCOME_SUCCESS": function() { return /* binding */ OUTCOME_SUCCESS; },
/* harmony export */   "OUTCOME_FAILURE": function() { return /* binding */ OUTCOME_FAILURE; },
/* harmony export */   "OUTCOME_UNKNOWN": function() { return /* binding */ OUTCOME_UNKNOWN; },
/* harmony export */   "SESSION_TIMEOUT": function() { return /* binding */ SESSION_TIMEOUT; },
/* harmony export */   "HTTP_REQUEST_TIMEOUT": function() { return /* binding */ HTTP_REQUEST_TIMEOUT; }
/* harmony export */ });
var SCHEDULE = 'schedule';
var INVOKE = 'invoke';
var ADD_EVENT_LISTENER_STR = 'addEventListener';
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
var RESOURCE_INITIATOR_TYPES = ['link', 'css', 'script', 'img', 'xmlhttprequest', 'fetch', 'beacon', 'iframe'];
var REUSABILITY_THRESHOLD = 5000;
var MAX_SPAN_DURATION = 5 * 60 * 1000;
var PAGE_LOAD_DELAY = 1000;
var PAGE_LOAD = 'page-load';
var ROUTE_CHANGE = 'route-change';
var TYPE_CUSTOM = 'custom';
var USER_INTERACTION = 'user-interaction';
var HTTP_REQUEST_TYPE = 'http-request';
var TEMPORARY_TYPE = 'temporary';
var NAME_UNKNOWN = 'Unknown';
var TRANSACTION_TYPE_ORDER = [PAGE_LOAD, ROUTE_CHANGE, USER_INTERACTION, HTTP_REQUEST_TYPE, TYPE_CUSTOM, TEMPORARY_TYPE];
var OUTCOME_SUCCESS = 'success';
var OUTCOME_FAILURE = 'failure';
var OUTCOME_UNKNOWN = 'unknown';
var USER_TIMING_THRESHOLD = 60;
var TRANSACTION_START = 'transaction:start';
var TRANSACTION_END = 'transaction:end';
var CONFIG_CHANGE = 'config:change';
var QUEUE_FLUSH = 'queue:flush';
var QUEUE_ADD_TRANSACTION = 'queue:add_transaction';
var XMLHTTPREQUEST = 'xmlhttprequest';
var FETCH = 'fetch';
var HISTORY = 'history';
var EVENT_TARGET = 'eventtarget';
var CLICK = 'click';
var ERROR = 'error';
var BEFORE_EVENT = ':before';
var AFTER_EVENT = ':after';
var LOCAL_CONFIG_KEY = 'elastic_apm_config';
var LONG_TASK = 'longtask';
var PAINT = 'paint';
var MEASURE = 'measure';
var NAVIGATION = 'navigation';
var RESOURCE = 'resource';
var FIRST_CONTENTFUL_PAINT = 'first-contentful-paint';
var LARGEST_CONTENTFUL_PAINT = 'largest-contentful-paint';
var FIRST_INPUT = 'first-input';
var LAYOUT_SHIFT = 'layout-shift';
var ERRORS = 'errors';
var TRANSACTIONS = 'transactions';
var CONFIG_SERVICE = 'ConfigService';
var LOGGING_SERVICE = 'LoggingService';
var TRANSACTION_SERVICE = 'TransactionService';
var APM_SERVER = 'ApmServer';
var PERFORMANCE_MONITORING = 'PerformanceMonitoring';
var ERROR_LOGGING = 'ErrorLogging';
var TRUNCATED_TYPE = '.truncated';
var KEYWORD_LIMIT = 1024;
var SESSION_TIMEOUT = 30 * 60000;
var HTTP_REQUEST_TIMEOUT = 10000;


/***/ }),

/***/ "../rum-core/dist/es/common/context.js":
/*!*********************************************!*\
  !*** ../rum-core/dist/es/common/context.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getPageContext": function() { return /* binding */ getPageContext; },
/* harmony export */   "addSpanContext": function() { return /* binding */ addSpanContext; },
/* harmony export */   "addTransactionContext": function() { return /* binding */ addTransactionContext; }
/* harmony export */ });
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./url */ "../rum-core/dist/es/common/url.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
var _excluded = ["tags"];

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}




var LEFT_SQUARE_BRACKET = 91;
var RIGHT_SQUARE_BRACKET = 93;
var EXTERNAL = 'external';
var RESOURCE = 'resource';
var HARD_NAVIGATION = 'hard-navigation';

function getPortNumber(port, protocol) {
  if (port === '') {
    port = protocol === 'http:' ? '80' : protocol === 'https:' ? '443' : '';
  }

  return port;
}

function getResponseContext(perfTimingEntry) {
  var transferSize = perfTimingEntry.transferSize,
      encodedBodySize = perfTimingEntry.encodedBodySize,
      decodedBodySize = perfTimingEntry.decodedBodySize,
      serverTiming = perfTimingEntry.serverTiming;
  var respContext = {
    transfer_size: transferSize,
    encoded_body_size: encodedBodySize,
    decoded_body_size: decodedBodySize
  };
  var serverTimingStr = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getServerTimingInfo)(serverTiming);

  if (serverTimingStr) {
    respContext.headers = {
      'server-timing': serverTimingStr
    };
  }

  return respContext;
}

function getDestination(parsedUrl) {
  var port = parsedUrl.port,
      protocol = parsedUrl.protocol,
      hostname = parsedUrl.hostname;
  var portNumber = getPortNumber(port, protocol);
  var ipv6Hostname = hostname.charCodeAt(0) === LEFT_SQUARE_BRACKET && hostname.charCodeAt(hostname.length - 1) === RIGHT_SQUARE_BRACKET;
  var address = hostname;

  if (ipv6Hostname) {
    address = hostname.slice(1, -1);
  }

  return {
    service: {
      resource: hostname + ':' + portNumber,
      name: '',
      type: ''
    },
    address: address,
    port: Number(portNumber)
  };
}

function getResourceContext(data) {
  var entry = data.entry,
      url = data.url;
  var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
  var destination = getDestination(parsedUrl);
  return {
    http: {
      url: url,
      response: getResponseContext(entry)
    },
    destination: destination
  };
}

function getExternalContext(data) {
  var url = data.url,
      method = data.method,
      target = data.target,
      response = data.response;
  var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
  var destination = getDestination(parsedUrl);
  var context = {
    http: {
      method: method,
      url: parsedUrl.href
    },
    destination: destination
  };
  var statusCode;

  if (target && typeof target.status !== 'undefined') {
    statusCode = target.status;
  } else if (response) {
    statusCode = response.status;
  }

  context.http.status_code = statusCode;
  return context;
}

function getNavigationContext(data) {
  var url = data.url;
  var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
  var destination = getDestination(parsedUrl);
  return {
    destination: destination
  };
}

function getPageContext() {
  return {
    page: {
      referer: document.referrer,
      url: location.href
    }
  };
}
function addSpanContext(span, data) {
  if (!data) {
    return;
  }

  var type = span.type;
  var context;

  switch (type) {
    case EXTERNAL:
      context = getExternalContext(data);
      break;

    case RESOURCE:
      context = getResourceContext(data);
      break;

    case HARD_NAVIGATION:
      context = getNavigationContext(data);
      break;
  }

  span.addContext(context);
}
function addTransactionContext(transaction, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      tags = _ref.tags,
      configContext = _objectWithoutPropertiesLoose(_ref, _excluded);

  var pageContext = getPageContext();
  var responseContext = {};

  if (transaction.type === _constants__WEBPACK_IMPORTED_MODULE_2__.PAGE_LOAD && (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isPerfTimelineSupported)()) {
    var entries = _utils__WEBPACK_IMPORTED_MODULE_0__.PERF.getEntriesByType(_constants__WEBPACK_IMPORTED_MODULE_2__.NAVIGATION);

    if (entries && entries.length > 0) {
      responseContext = {
        response: getResponseContext(entries[0])
      };
    }
  }

  transaction.addContext(pageContext, responseContext, configContext);
}

/***/ }),

/***/ "../rum-core/dist/es/common/event-handler.js":
/*!***************************************************!*\
  !*** ../rum-core/dist/es/common/event-handler.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");


var EventHandler = function () {
  function EventHandler() {
    this.observers = {};
  }

  var _proto = EventHandler.prototype;

  _proto.observe = function observe(name, fn) {
    var _this = this;

    if (typeof fn === 'function') {
      if (!this.observers[name]) {
        this.observers[name] = [];
      }

      this.observers[name].push(fn);
      return function () {
        var index = _this.observers[name].indexOf(fn);

        if (index > -1) {
          _this.observers[name].splice(index, 1);
        }
      };
    }
  };

  _proto.sendOnly = function sendOnly(name, args) {
    var obs = this.observers[name];

    if (obs) {
      obs.forEach(function (fn) {
        try {
          fn.apply(undefined, args);
        } catch (error) {
          console.log(error, error.stack);
        }
      });
    }
  };

  _proto.send = function send(name, args) {
    this.sendOnly(name + _constants__WEBPACK_IMPORTED_MODULE_0__.BEFORE_EVENT, args);
    this.sendOnly(name, args);
    this.sendOnly(name + _constants__WEBPACK_IMPORTED_MODULE_0__.AFTER_EVENT, args);
  };

  return EventHandler;
}();

/* harmony default export */ __webpack_exports__["default"] = (EventHandler);

/***/ }),

/***/ "../rum-core/dist/es/common/http/fetch.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/common/http/fetch.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BYTE_LIMIT": function() { return /* binding */ BYTE_LIMIT; },
/* harmony export */   "shouldUseFetchWithKeepAlive": function() { return /* binding */ shouldUseFetchWithKeepAlive; },
/* harmony export */   "sendFetchRequest": function() { return /* binding */ sendFetchRequest; },
/* harmony export */   "isFetchSupported": function() { return /* binding */ isFetchSupported; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _response_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./response-status */ "../rum-core/dist/es/common/http/response-status.js");
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}



var BYTE_LIMIT = 60 * 1000;
function shouldUseFetchWithKeepAlive(method, payload) {
  if (!isFetchSupported()) {
    return false;
  }

  var isKeepAliveSupported = ('keepalive' in new Request(''));

  if (!isKeepAliveSupported) {
    return false;
  }

  var size = calculateSize(payload);
  return method === 'POST' && size < BYTE_LIMIT;
}
function sendFetchRequest(method, url, _ref) {
  var _ref$keepalive = _ref.keepalive,
      keepalive = _ref$keepalive === void 0 ? false : _ref$keepalive,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? _constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TIMEOUT : _ref$timeout,
      payload = _ref.payload,
      headers = _ref.headers,
      sendCredentials = _ref.sendCredentials;
  var timeoutConfig = {};

  if (typeof AbortController === 'function') {
    var controller = new AbortController();
    timeoutConfig.signal = controller.signal;
    setTimeout(function () {
      return controller.abort();
    }, timeout);
  }

  var fetchResponse;
  return window.fetch(url, _extends({
    body: payload,
    headers: headers,
    method: method,
    keepalive: keepalive,
    credentials: sendCredentials ? 'include' : 'omit'
  }, timeoutConfig)).then(function (response) {
    fetchResponse = response;
    return fetchResponse.text();
  }).then(function (responseText) {
    var bodyResponse = {
      url: url,
      status: fetchResponse.status,
      responseText: responseText
    };

    if (!(0,_response_status__WEBPACK_IMPORTED_MODULE_1__.isResponseSuccessful)(fetchResponse.status)) {
      throw bodyResponse;
    }

    return bodyResponse;
  });
}
function isFetchSupported() {
  return typeof window.fetch === 'function' && typeof window.Request === 'function';
}

function calculateSize(payload) {
  if (!payload) {
    return 0;
  }

  if (payload instanceof Blob) {
    return payload.size;
  }

  return new Blob([payload]).size;
}

/***/ }),

/***/ "../rum-core/dist/es/common/http/response-status.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/http/response-status.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isResponseSuccessful": function() { return /* binding */ isResponseSuccessful; }
/* harmony export */ });
function isResponseSuccessful(status) {
  if (status === 0 || status > 399 && status < 600) {
    return false;
  }

  return true;
}

/***/ }),

/***/ "../rum-core/dist/es/common/http/xhr.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/http/xhr.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sendXHR": function() { return /* binding */ sendXHR; }
/* harmony export */ });
/* harmony import */ var _patching_patch_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../patching/patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _response_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./response-status */ "../rum-core/dist/es/common/http/response-status.js");
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills */ "../rum-core/dist/es/common/polyfills.js");



function sendXHR(method, url, _ref) {
  var _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? HTTP_REQUEST_TIMEOUT : _ref$timeout,
      payload = _ref.payload,
      headers = _ref.headers,
      beforeSend = _ref.beforeSend,
      sendCredentials = _ref.sendCredentials;
  return new _polyfills__WEBPACK_IMPORTED_MODULE_0__.Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest();
    xhr[_patching_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE] = true;
    xhr.open(method, url, true);
    xhr.timeout = timeout;
    xhr.withCredentials = sendCredentials;

    if (headers) {
      for (var header in headers) {
        if (headers.hasOwnProperty(header)) {
          xhr.setRequestHeader(header, headers[header]);
        }
      }
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var status = xhr.status,
            responseText = xhr.responseText;

        if ((0,_response_status__WEBPACK_IMPORTED_MODULE_2__.isResponseSuccessful)(status)) {
          resolve(xhr);
        } else {
          reject({
            url: url,
            status: status,
            responseText: responseText
          });
        }
      }
    };

    xhr.onerror = function () {
      var status = xhr.status,
          responseText = xhr.responseText;
      reject({
        url: url,
        status: status,
        responseText: responseText
      });
    };

    var canSend = true;

    if (typeof beforeSend === 'function') {
      canSend = beforeSend({
        url: url,
        method: method,
        headers: headers,
        payload: payload,
        xhr: xhr
      });
    }

    if (canSend) {
      xhr.send(payload);
    } else {
      reject({
        url: url,
        status: 0,
        responseText: 'Request rejected by user configuration.'
      });
    }
  });
}

/***/ }),

/***/ "../rum-core/dist/es/common/instrument.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/common/instrument.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getInstrumentationFlags": function() { return /* binding */ getInstrumentationFlags; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");

function getInstrumentationFlags(instrument, disabledInstrumentations) {
  var _flags;

  var flags = (_flags = {}, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.ERROR] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TARGET] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.CLICK] = false, _flags);

  if (!instrument) {
    return flags;
  }

  Object.keys(flags).forEach(function (key) {
    if (disabledInstrumentations.indexOf(key) === -1) {
      flags[key] = true;
    }
  });
  return flags;
}

/***/ }),

/***/ "../rum-core/dist/es/common/logging-service.js":
/*!*****************************************************!*\
  !*** ../rum-core/dist/es/common/logging-service.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


var LoggingService = function () {
  function LoggingService(spec) {
    if (spec === void 0) {
      spec = {};
    }

    this.levels = ['trace', 'debug', 'info', 'warn', 'error'];
    this.level = spec.level || 'warn';
    this.prefix = spec.prefix || '';
    this.resetLogMethods();
  }

  var _proto = LoggingService.prototype;

  _proto.shouldLog = function shouldLog(level) {
    return this.levels.indexOf(level) >= this.levels.indexOf(this.level);
  };

  _proto.setLevel = function setLevel(level) {
    if (level === this.level) {
      return;
    }

    this.level = level;
    this.resetLogMethods();
  };

  _proto.resetLogMethods = function resetLogMethods() {
    var _this = this;

    this.levels.forEach(function (level) {
      _this[level] = _this.shouldLog(level) ? log : _utils__WEBPACK_IMPORTED_MODULE_0__.noop;

      function log() {
        var normalizedLevel = level;

        if (level === 'trace' || level === 'debug') {
          normalizedLevel = 'info';
        }

        var args = arguments;
        args[0] = this.prefix + args[0];

        if (console) {
          var realMethod = console[normalizedLevel] || console.log;

          if (typeof realMethod === 'function') {
            realMethod.apply(console, args);
          }
        }
      }
    });
  };

  return LoggingService;
}();

/* harmony default export */ __webpack_exports__["default"] = (LoggingService);

/***/ }),

/***/ "../rum-core/dist/es/common/ndjson.js":
/*!********************************************!*\
  !*** ../rum-core/dist/es/common/ndjson.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var NDJSON = function () {
  function NDJSON() {}

  NDJSON.stringify = function stringify(object) {
    return JSON.stringify(object) + '\n';
  };

  return NDJSON;
}();

/* harmony default export */ __webpack_exports__["default"] = (NDJSON);

/***/ }),

/***/ "../rum-core/dist/es/common/observers/page-clicks.js":
/*!***********************************************************!*\
  !*** ../rum-core/dist/es/common/observers/page-clicks.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "observePageClicks": function() { return /* binding */ observePageClicks; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");

var INTERACTIVE_SELECTOR = 'a[data-transaction-name], button[data-transaction-name]';
function observePageClicks(transactionService) {
  var clickHandler = function clickHandler(event) {
    if (event.target instanceof Element) {
      createUserInteractionTransaction(transactionService, event.target);
    }
  };

  var eventName = 'click';
  var useCapture = true;
  window.addEventListener(eventName, clickHandler, useCapture);
  return function () {
    window.removeEventListener(eventName, clickHandler, useCapture);
  };
}

function createUserInteractionTransaction(transactionService, target) {
  var _getTransactionMetada = getTransactionMetadata(target),
      transactionName = _getTransactionMetada.transactionName,
      context = _getTransactionMetada.context;

  var tr = transactionService.startTransaction("Click - " + transactionName, _constants__WEBPACK_IMPORTED_MODULE_0__.USER_INTERACTION, {
    managed: true,
    canReuse: true,
    reuseThreshold: 300
  });

  if (tr && context) {
    tr.addContext(context);
  }
}

function getTransactionMetadata(target) {
  var metadata = {
    transactionName: null,
    context: null
  };
  metadata.transactionName = buildTransactionName(target);
  var classes = target.getAttribute('class');

  if (classes) {
    metadata.context = {
      custom: {
        classes: classes
      }
    };
  }

  return metadata;
}

function buildTransactionName(target) {
  var dtName = findCustomTransactionName(target);

  if (dtName) {
    return dtName;
  }

  var tagName = target.tagName.toLowerCase();
  var name = target.getAttribute('name');

  if (!!name) {
    return tagName + "[\"" + name + "\"]";
  }

  return tagName;
}

function findCustomTransactionName(target) {
  if (target.closest) {
    var element = target.closest(INTERACTIVE_SELECTOR);
    return element ? element.dataset.transactionName : null;
  }

  return target.dataset.transactionName;
}

/***/ }),

/***/ "../rum-core/dist/es/common/observers/page-visibility.js":
/*!***************************************************************!*\
  !*** ../rum-core/dist/es/common/observers/page-visibility.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "observePageVisibility": function() { return /* binding */ observePageVisibility; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "../rum-core/dist/es/common/utils.js");



function observePageVisibility(configService, transactionService) {
  if (document.visibilityState === 'hidden') {
    _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = 0;
  }

  var visibilityChangeHandler = function visibilityChangeHandler() {
    if (document.visibilityState === 'hidden') {
      onPageHidden(configService, transactionService);
    }
  };

  var pageHideHandler = function pageHideHandler() {
    return onPageHidden(configService, transactionService);
  };

  var useCapture = true;
  window.addEventListener('visibilitychange', visibilityChangeHandler, useCapture);
  window.addEventListener('pagehide', pageHideHandler, useCapture);
  return function () {
    window.removeEventListener('visibilitychange', visibilityChangeHandler, useCapture);
    window.removeEventListener('pagehide', pageHideHandler, useCapture);
  };
}

function onPageHidden(configService, transactionService) {
  var tr = transactionService.getCurrentTransaction();

  if (tr) {
    var unobserve = configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.QUEUE_ADD_TRANSACTION, function () {
      configService.dispatchEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.QUEUE_FLUSH);
      _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();
      unobserve();
    });
    tr.end();
  } else {
    configService.dispatchEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.QUEUE_FLUSH);
    _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();
  }
}

/***/ }),

/***/ "../rum-core/dist/es/common/patching/fetch-patch.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/fetch-patch.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "patchFetch": function() { return /* binding */ patchFetch; }
/* harmony export */ });
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _patch_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _http_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../http/fetch */ "../rum-core/dist/es/common/http/fetch.js");





function patchFetch(callback) {
  if (!(0,_http_fetch__WEBPACK_IMPORTED_MODULE_0__.isFetchSupported)()) {
    return;
  }

  function scheduleTask(task) {
    task.state = _constants__WEBPACK_IMPORTED_MODULE_1__.SCHEDULE;
    callback(_constants__WEBPACK_IMPORTED_MODULE_1__.SCHEDULE, task);
  }

  function invokeTask(task) {
    task.state = _constants__WEBPACK_IMPORTED_MODULE_1__.INVOKE;
    callback(_constants__WEBPACK_IMPORTED_MODULE_1__.INVOKE, task);
  }

  function handleResponseError(task, error) {
    task.data.aborted = isAbortError(error);
    task.data.error = error;
    invokeTask(task);
  }

  function readStream(stream, task) {
    var reader = stream.getReader();

    var read = function read() {
      reader.read().then(function (_ref) {
        var done = _ref.done;

        if (done) {
          invokeTask(task);
        } else {
          read();
        }
      }, function (error) {
        handleResponseError(task, error);
      });
    };

    read();
  }

  var nativeFetch = window.fetch;

  window.fetch = function (input, init) {
    var fetchSelf = this;
    var args = arguments;
    var request, url;
    var isURL = input instanceof URL;

    if (typeof input === 'string' || isURL) {
      request = new Request(input, init);

      if (isURL) {
        url = request.url;
      } else {
        url = input;
      }
    } else if (input) {
      request = input;
      url = request.url;
    } else {
      return nativeFetch.apply(fetchSelf, args);
    }

    var task = {
      source: _constants__WEBPACK_IMPORTED_MODULE_1__.FETCH,
      state: '',
      type: 'macroTask',
      data: {
        target: request,
        method: request.method,
        url: url,
        aborted: false
      }
    };
    return new _polyfills__WEBPACK_IMPORTED_MODULE_2__.Promise(function (resolve, reject) {
      _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = true;
      scheduleTask(task);
      var promise;

      try {
        promise = nativeFetch.apply(fetchSelf, [request]);
      } catch (error) {
        reject(error);
        task.data.error = error;
        invokeTask(task);
        _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = false;
        return;
      }

      promise.then(function (response) {
        var clonedResponse = response.clone ? response.clone() : {};
        resolve(response);
        (0,_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask)(function () {
          task.data.response = response;
          var body = clonedResponse.body;

          if (body) {
            readStream(body, task);
          } else {
            invokeTask(task);
          }
        });
      }, function (error) {
        reject(error);
        (0,_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask)(function () {
          handleResponseError(task, error);
        });
      });
      _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = false;
    });
  };
}

function isAbortError(error) {
  return error && error.name === 'AbortError';
}

/***/ }),

/***/ "../rum-core/dist/es/common/patching/history-patch.js":
/*!************************************************************!*\
  !*** ../rum-core/dist/es/common/patching/history-patch.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "patchHistory": function() { return /* binding */ patchHistory; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");

function patchHistory(callback) {
  if (!window.history) {
    return;
  }

  var nativePushState = history.pushState;

  if (typeof nativePushState === 'function') {
    history.pushState = function (state, title, url) {
      var task = {
        source: _constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY,
        data: {
          state: state,
          title: title,
          url: url
        }
      };
      callback(_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE, task);
      nativePushState.apply(this, arguments);
    };
  }
}

/***/ }),

/***/ "../rum-core/dist/es/common/patching/index.js":
/*!****************************************************!*\
  !*** ../rum-core/dist/es/common/patching/index.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "patchAll": function() { return /* binding */ patchAll; },
/* harmony export */   "patchEventHandler": function() { return /* binding */ patchEventHandler; }
/* harmony export */ });
/* harmony import */ var _xhr_patch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr-patch */ "../rum-core/dist/es/common/patching/xhr-patch.js");
/* harmony import */ var _fetch_patch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fetch-patch */ "../rum-core/dist/es/common/patching/fetch-patch.js");
/* harmony import */ var _history_patch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./history-patch */ "../rum-core/dist/es/common/patching/history-patch.js");
/* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../event-handler */ "../rum-core/dist/es/common/event-handler.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");





var patchEventHandler = new _event_handler__WEBPACK_IMPORTED_MODULE_0__.default();
var alreadyPatched = false;

function patchAll() {
  if (!alreadyPatched) {
    alreadyPatched = true;
    (0,_xhr_patch__WEBPACK_IMPORTED_MODULE_1__.patchXMLHttpRequest)(function (event, task) {
      patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.XMLHTTPREQUEST, [event, task]);
    });
    (0,_fetch_patch__WEBPACK_IMPORTED_MODULE_3__.patchFetch)(function (event, task) {
      patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.FETCH, [event, task]);
    });
    (0,_history_patch__WEBPACK_IMPORTED_MODULE_4__.patchHistory)(function (event, task) {
      patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.HISTORY, [event, task]);
    });
  }

  return patchEventHandler;
}



/***/ }),

/***/ "../rum-core/dist/es/common/patching/patch-utils.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/patch-utils.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "globalState": function() { return /* binding */ globalState; },
/* harmony export */   "apmSymbol": function() { return /* binding */ apmSymbol; },
/* harmony export */   "patchMethod": function() { return /* binding */ patchMethod; },
/* harmony export */   "XHR_IGNORE": function() { return /* binding */ XHR_IGNORE; },
/* harmony export */   "XHR_SYNC": function() { return /* binding */ XHR_SYNC; },
/* harmony export */   "XHR_URL": function() { return /* binding */ XHR_URL; },
/* harmony export */   "XHR_METHOD": function() { return /* binding */ XHR_METHOD; }
/* harmony export */ });
var globalState = {
  fetchInProgress: false
};
function apmSymbol(name) {
  return '__apm_symbol__' + name;
}

function isPropertyWritable(propertyDesc) {
  if (!propertyDesc) {
    return true;
  }

  if (propertyDesc.writable === false) {
    return false;
  }

  return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}

function attachOriginToPatched(patched, original) {
  patched[apmSymbol('OriginalDelegate')] = original;
}

function patchMethod(target, name, patchFn) {
  var proto = target;

  while (proto && !proto.hasOwnProperty(name)) {
    proto = Object.getPrototypeOf(proto);
  }

  if (!proto && target[name]) {
    proto = target;
  }

  var delegateName = apmSymbol(name);
  var delegate;

  if (proto && !(delegate = proto[delegateName])) {
    delegate = proto[delegateName] = proto[name];
    var desc = proto && Object.getOwnPropertyDescriptor(proto, name);

    if (isPropertyWritable(desc)) {
      var patchDelegate = patchFn(delegate, delegateName, name);

      proto[name] = function () {
        return patchDelegate(this, arguments);
      };

      attachOriginToPatched(proto[name], delegate);
    }
  }

  return delegate;
}
var XHR_IGNORE = apmSymbol('xhrIgnore');
var XHR_SYNC = apmSymbol('xhrSync');
var XHR_URL = apmSymbol('xhrURL');
var XHR_METHOD = apmSymbol('xhrMethod');

/***/ }),

/***/ "../rum-core/dist/es/common/patching/xhr-patch.js":
/*!********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/xhr-patch.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "patchXMLHttpRequest": function() { return /* binding */ patchXMLHttpRequest; }
/* harmony export */ });
/* harmony import */ var _patch_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");


function patchXMLHttpRequest(callback) {
  var XMLHttpRequestPrototype = XMLHttpRequest.prototype;

  if (!XMLHttpRequestPrototype || !XMLHttpRequestPrototype[_constants__WEBPACK_IMPORTED_MODULE_0__.ADD_EVENT_LISTENER_STR]) {
    return;
  }

  var READY_STATE_CHANGE = 'readystatechange';
  var LOAD = 'load';
  var ERROR = 'error';
  var TIMEOUT = 'timeout';
  var ABORT = 'abort';

  function invokeTask(task, status) {
    if (task.state !== _constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
      task.state = _constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE;
      task.data.status = status;
      callback(_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE, task);
    }
  }

  function scheduleTask(task) {
    if (task.state === _constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE) {
      return;
    }

    task.state = _constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE;
    callback(_constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE, task);
    var target = task.data.target;

    function addListener(name) {
      target[_constants__WEBPACK_IMPORTED_MODULE_0__.ADD_EVENT_LISTENER_STR](name, function (_ref) {
        var type = _ref.type;

        if (type === READY_STATE_CHANGE) {
          if (target.readyState === 4 && target.status !== 0) {
            invokeTask(task, 'success');
          }
        } else {
          var status = type === LOAD ? 'success' : type;
          invokeTask(task, status);
        }
      });
    }

    addListener(READY_STATE_CHANGE);
    addListener(LOAD);
    addListener(TIMEOUT);
    addListener(ERROR);
    addListener(ABORT);
  }

  var openNative = (0,_patch_utils__WEBPACK_IMPORTED_MODULE_1__.patchMethod)(XMLHttpRequestPrototype, 'open', function () {
    return function (self, args) {
      if (!self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE]) {
        self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_METHOD] = args[0];
        self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_URL] = args[1];
        self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_SYNC] = args[2] === false;
      }

      return openNative.apply(self, args);
    };
  });
  var sendNative = (0,_patch_utils__WEBPACK_IMPORTED_MODULE_1__.patchMethod)(XMLHttpRequestPrototype, 'send', function () {
    return function (self, args) {
      if (self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE]) {
        return sendNative.apply(self, args);
      }

      var task = {
        source: _constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST,
        state: '',
        type: 'macroTask',
        data: {
          target: self,
          method: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_METHOD],
          sync: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_SYNC],
          url: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_URL],
          status: ''
        }
      };

      try {
        scheduleTask(task);
        return sendNative.apply(self, args);
      } catch (e) {
        invokeTask(task, ERROR);
        throw e;
      }
    };
  });
}

/***/ }),

/***/ "../rum-core/dist/es/common/polyfills.js":
/*!***********************************************!*\
  !*** ../rum-core/dist/es/common/polyfills.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Promise": function() { return /* binding */ Promise; }
/* harmony export */ });
/* harmony import */ var promise_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! promise-polyfill */ "../../node_modules/promise-polyfill/src/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


var local = {};

if (_utils__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
  local = window;
} else if (typeof self !== 'undefined') {
  local = self;
}

var Promise = 'Promise' in local ? local.Promise : promise_polyfill__WEBPACK_IMPORTED_MODULE_0__.default;


/***/ }),

/***/ "../rum-core/dist/es/common/queue.js":
/*!*******************************************!*\
  !*** ../rum-core/dist/es/common/queue.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Queue = function () {
  function Queue(onFlush, opts) {
    if (opts === void 0) {
      opts = {};
    }

    this.onFlush = onFlush;
    this.items = [];
    this.queueLimit = opts.queueLimit || -1;
    this.flushInterval = opts.flushInterval || 0;
    this.timeoutId = undefined;
  }

  var _proto = Queue.prototype;

  _proto._setTimer = function _setTimer() {
    var _this = this;

    this.timeoutId = setTimeout(function () {
      return _this.flush();
    }, this.flushInterval);
  };

  _proto._clear = function _clear() {
    if (typeof this.timeoutId !== 'undefined') {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.items = [];
  };

  _proto.flush = function flush() {
    this.onFlush(this.items);

    this._clear();
  };

  _proto.add = function add(item) {
    this.items.push(item);

    if (this.queueLimit !== -1 && this.items.length >= this.queueLimit) {
      this.flush();
    } else {
      if (typeof this.timeoutId === 'undefined') {
        this._setTimer();
      }
    }
  };

  return Queue;
}();

/* harmony default export */ __webpack_exports__["default"] = (Queue);

/***/ }),

/***/ "../rum-core/dist/es/common/service-factory.js":
/*!*****************************************************!*\
  !*** ../rum-core/dist/es/common/service-factory.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "serviceCreators": function() { return /* binding */ serviceCreators; },
/* harmony export */   "ServiceFactory": function() { return /* binding */ ServiceFactory; }
/* harmony export */ });
/* harmony import */ var _apm_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./apm-server */ "../rum-core/dist/es/common/apm-server.js");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config-service */ "../rum-core/dist/es/common/config-service.js");
/* harmony import */ var _logging_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logging-service */ "../rum-core/dist/es/common/logging-service.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
var _serviceCreators;






var serviceCreators = (_serviceCreators = {}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE] = function () {
  return new _config_service__WEBPACK_IMPORTED_MODULE_1__.default();
}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE] = function () {
  return new _logging_service__WEBPACK_IMPORTED_MODULE_2__.default({
    prefix: '[Elastic APM] '
  });
}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER] = function (factory) {
  var _factory$getService = factory.getService([_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE]),
      configService = _factory$getService[0],
      loggingService = _factory$getService[1];

  return new _apm_server__WEBPACK_IMPORTED_MODULE_3__.default(configService, loggingService);
}, _serviceCreators);

var ServiceFactory = function () {
  function ServiceFactory() {
    this.instances = {};
    this.initialized = false;
  }

  var _proto = ServiceFactory.prototype;

  _proto.init = function init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    var configService = this.getService(_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.init();

    var _this$getService = this.getService([_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _constants__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER]),
        loggingService = _this$getService[0],
        apmServer = _this$getService[1];

    configService.events.observe(_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_CHANGE, function () {
      var logLevel = configService.get('logLevel');
      loggingService.setLevel(logLevel);
    });
    apmServer.init();
  };

  _proto.getService = function getService(name) {
    var _this = this;

    if (typeof name === 'string') {
      if (!this.instances[name]) {
        if (typeof serviceCreators[name] === 'function') {
          this.instances[name] = serviceCreators[name](this);
        } else if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
          console.log('Cannot get service, No creator for: ' + name);
        }
      }

      return this.instances[name];
    } else if (Array.isArray(name)) {
      return name.map(function (n) {
        return _this.getService(n);
      });
    }
  };

  return ServiceFactory;
}();



/***/ }),

/***/ "../rum-core/dist/es/common/throttle.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/throttle.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ throttle; }
/* harmony export */ });
function throttle(fn, onThrottle, opts) {
  var context = this;
  var limit = opts.limit;
  var interval = opts.interval;
  var counter = 0;
  var timeoutId;
  return function () {
    counter++;

    if (typeof timeoutId === 'undefined') {
      timeoutId = setTimeout(function () {
        counter = 0;
        timeoutId = undefined;
      }, interval);
    }

    if (counter > limit && typeof onThrottle === 'function') {
      return onThrottle.apply(context, arguments);
    } else {
      return fn.apply(context, arguments);
    }
  };
}

/***/ }),

/***/ "../rum-core/dist/es/common/truncate.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/truncate.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "truncate": function() { return /* binding */ truncate; },
/* harmony export */   "truncateModel": function() { return /* binding */ truncateModel; },
/* harmony export */   "SPAN_MODEL": function() { return /* binding */ SPAN_MODEL; },
/* harmony export */   "TRANSACTION_MODEL": function() { return /* binding */ TRANSACTION_MODEL; },
/* harmony export */   "ERROR_MODEL": function() { return /* binding */ ERROR_MODEL; },
/* harmony export */   "METADATA_MODEL": function() { return /* binding */ METADATA_MODEL; },
/* harmony export */   "RESPONSE_MODEL": function() { return /* binding */ RESPONSE_MODEL; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");

var METADATA_MODEL = {
  service: {
    name: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
    version: true,
    agent: {
      version: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
    },
    environment: true
  },
  labels: {
    '*': true
  }
};
var RESPONSE_MODEL = {
  '*': true,
  headers: {
    '*': true
  }
};
var DESTINATION_MODEL = {
  address: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT],
  service: {
    '*': [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
  }
};
var CONTEXT_MODEL = {
  user: {
    id: true,
    email: true,
    username: true
  },
  tags: {
    '*': true
  },
  http: {
    response: RESPONSE_MODEL
  },
  destination: DESTINATION_MODEL,
  response: RESPONSE_MODEL
};
var SPAN_MODEL = {
  name: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  type: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  trace_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  parent_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  transaction_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  subtype: true,
  action: true,
  context: CONTEXT_MODEL
};
var TRANSACTION_MODEL = {
  name: true,
  parent_id: true,
  type: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  trace_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  span_count: {
    started: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
  },
  context: CONTEXT_MODEL
};
var ERROR_MODEL = {
  id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  trace_id: true,
  transaction_id: true,
  parent_id: true,
  culprit: true,
  exception: {
    type: true
  },
  transaction: {
    type: true
  },
  context: CONTEXT_MODEL
};

function truncate(value, limit, required, placeholder) {
  if (limit === void 0) {
    limit = _constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT;
  }

  if (required === void 0) {
    required = false;
  }

  if (placeholder === void 0) {
    placeholder = 'N/A';
  }

  if (required && isEmpty(value)) {
    value = placeholder;
  }

  if (typeof value === 'string') {
    return value.substring(0, limit);
  }

  return value;
}

function isEmpty(value) {
  return value == null || value === '' || typeof value === 'undefined';
}

function replaceValue(target, key, currModel) {
  var value = truncate(target[key], currModel[0], currModel[1]);

  if (isEmpty(value)) {
    delete target[key];
    return;
  }

  target[key] = value;
}

function truncateModel(model, target, childTarget) {
  if (model === void 0) {
    model = {};
  }

  if (childTarget === void 0) {
    childTarget = target;
  }

  var keys = Object.keys(model);
  var emptyArr = [];

  var _loop = function _loop(i) {
    var currKey = keys[i];
    var currModel = model[currKey] === true ? emptyArr : model[currKey];

    if (!Array.isArray(currModel)) {
      truncateModel(currModel, target, childTarget[currKey]);
    } else {
      if (currKey === '*') {
        Object.keys(childTarget).forEach(function (key) {
          return replaceValue(childTarget, key, currModel);
        });
      } else {
        replaceValue(childTarget, currKey, currModel);
      }
    }
  };

  for (var i = 0; i < keys.length; i++) {
    _loop(i);
  }

  return target;
}



/***/ }),

/***/ "../rum-core/dist/es/common/url.js":
/*!*****************************************!*\
  !*** ../rum-core/dist/es/common/url.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Url": function() { return /* binding */ Url; },
/* harmony export */   "slugifyUrl": function() { return /* binding */ slugifyUrl; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


function isDefaultPort(port, protocol) {
  switch (protocol) {
    case 'http:':
      return port === '80';

    case 'https:':
      return port === '443';
  }

  return true;
}

var RULES = [['#', 'hash'], ['?', 'query'], ['/', 'path'], ['@', 'auth', 1], [NaN, 'host', undefined, 1]];
var PROTOCOL_REGEX = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;
var Url = function () {
  function Url(url) {
    var _this$extractProtocol = this.extractProtocol(url || ''),
        protocol = _this$extractProtocol.protocol,
        address = _this$extractProtocol.address,
        slashes = _this$extractProtocol.slashes;

    var relative = !protocol && !slashes;
    var location = this.getLocation();
    var instructions = RULES.slice();
    address = address.replace('\\', '/');

    if (!slashes) {
      instructions[2] = [NaN, 'path'];
    }

    var index;

    for (var i = 0; i < instructions.length; i++) {
      var instruction = instructions[i];
      var parse = instruction[0];
      var key = instruction[1];

      if (typeof parse === 'string') {
        index = address.indexOf(parse);

        if (~index) {
          var instLength = instruction[2];

          if (instLength) {
            var newIndex = address.lastIndexOf(parse);
            index = Math.max(index, newIndex);
            this[key] = address.slice(0, index);
            address = address.slice(index + instLength);
          } else {
            this[key] = address.slice(index);
            address = address.slice(0, index);
          }
        }
      } else {
        this[key] = address;
        address = '';
      }

      this[key] = this[key] || (relative && instruction[3] ? location[key] || '' : '');
      if (instruction[3]) this[key] = this[key].toLowerCase();
    }

    if (relative && this.path.charAt(0) !== '/') {
      this.path = '/' + this.path;
    }

    this.relative = relative;
    this.protocol = protocol || location.protocol;
    this.hostname = this.host;
    this.port = '';

    if (/:\d+$/.test(this.host)) {
      var value = this.host.split(':');
      var port = value.pop();
      var hostname = value.join(':');

      if (isDefaultPort(port, this.protocol)) {
        this.host = hostname;
      } else {
        this.port = port;
      }

      this.hostname = hostname;
    }

    this.origin = this.protocol && this.host && this.protocol !== 'file:' ? this.protocol + '//' + this.host : 'null';
    this.href = this.toString();
  }

  var _proto = Url.prototype;

  _proto.toString = function toString() {
    var result = this.protocol;
    result += '//';

    if (this.auth) {
      var REDACTED = '[REDACTED]';
      var userpass = this.auth.split(':');
      var username = userpass[0] ? REDACTED : '';
      var password = userpass[1] ? ':' + REDACTED : '';
      result += username + password + '@';
    }

    result += this.host;
    result += this.path;
    result += this.query;
    result += this.hash;
    return result;
  };

  _proto.getLocation = function getLocation() {
    var globalVar = {};

    if (_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser) {
      globalVar = window;
    }

    return globalVar.location;
  };

  _proto.extractProtocol = function extractProtocol(url) {
    var match = PROTOCOL_REGEX.exec(url);
    return {
      protocol: match[1] ? match[1].toLowerCase() : '',
      slashes: !!match[2],
      address: match[3]
    };
  };

  return Url;
}();
function slugifyUrl(urlStr, depth) {
  if (depth === void 0) {
    depth = 2;
  }

  var parsedUrl = new Url(urlStr);
  var query = parsedUrl.query,
      path = parsedUrl.path;
  var pathParts = path.substring(1).split('/');
  var redactString = ':id';
  var wildcard = '*';
  var specialCharsRegex = /\W|_/g;
  var digitsRegex = /[0-9]/g;
  var lowerCaseRegex = /[a-z]/g;
  var upperCaseRegex = /[A-Z]/g;
  var redactedParts = [];
  var redactedBefore = false;

  for (var index = 0; index < pathParts.length; index++) {
    var part = pathParts[index];

    if (redactedBefore || index > depth - 1) {
      if (part) {
        redactedParts.push(wildcard);
      }

      break;
    }

    var numberOfSpecialChars = (part.match(specialCharsRegex) || []).length;

    if (numberOfSpecialChars >= 2) {
      redactedParts.push(redactString);
      redactedBefore = true;
      continue;
    }

    var numberOfDigits = (part.match(digitsRegex) || []).length;

    if (numberOfDigits > 3 || part.length > 3 && numberOfDigits / part.length >= 0.3) {
      redactedParts.push(redactString);
      redactedBefore = true;
      continue;
    }

    var numberofUpperCase = (part.match(upperCaseRegex) || []).length;
    var numberofLowerCase = (part.match(lowerCaseRegex) || []).length;
    var lowerCaseRate = numberofLowerCase / part.length;
    var upperCaseRate = numberofUpperCase / part.length;

    if (part.length > 5 && (upperCaseRate > 0.3 && upperCaseRate < 0.6 || lowerCaseRate > 0.3 && lowerCaseRate < 0.6)) {
      redactedParts.push(redactString);
      redactedBefore = true;
      continue;
    }

    part && redactedParts.push(part);
  }

  var redacted = '/' + (redactedParts.length >= 2 ? redactedParts.join('/') : redactedParts.join('')) + (query ? '?{query}' : '');
  return redacted;
}

/***/ }),

/***/ "../rum-core/dist/es/common/utils.js":
/*!*******************************************!*\
  !*** ../rum-core/dist/es/common/utils.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extend": function() { return /* binding */ extend; },
/* harmony export */   "merge": function() { return /* binding */ merge; },
/* harmony export */   "isUndefined": function() { return /* binding */ isUndefined; },
/* harmony export */   "noop": function() { return /* binding */ noop; },
/* harmony export */   "baseExtend": function() { return /* binding */ baseExtend; },
/* harmony export */   "bytesToHex": function() { return /* binding */ bytesToHex; },
/* harmony export */   "isCORSSupported": function() { return /* binding */ isCORSSupported; },
/* harmony export */   "isObject": function() { return /* binding */ isObject; },
/* harmony export */   "isFunction": function() { return /* binding */ isFunction; },
/* harmony export */   "isPlatformSupported": function() { return /* binding */ isPlatformSupported; },
/* harmony export */   "isDtHeaderValid": function() { return /* binding */ isDtHeaderValid; },
/* harmony export */   "parseDtHeaderValue": function() { return /* binding */ parseDtHeaderValue; },
/* harmony export */   "getServerTimingInfo": function() { return /* binding */ getServerTimingInfo; },
/* harmony export */   "getDtHeaderValue": function() { return /* binding */ getDtHeaderValue; },
/* harmony export */   "getTSHeaderValue": function() { return /* binding */ getTSHeaderValue; },
/* harmony export */   "getCurrentScript": function() { return /* binding */ getCurrentScript; },
/* harmony export */   "getElasticScript": function() { return /* binding */ getElasticScript; },
/* harmony export */   "getTimeOrigin": function() { return /* binding */ getTimeOrigin; },
/* harmony export */   "generateRandomId": function() { return /* binding */ generateRandomId; },
/* harmony export */   "getEarliestSpan": function() { return /* binding */ getEarliestSpan; },
/* harmony export */   "getLatestNonXHRSpan": function() { return /* binding */ getLatestNonXHRSpan; },
/* harmony export */   "getLatestXHRSpan": function() { return /* binding */ getLatestXHRSpan; },
/* harmony export */   "getDuration": function() { return /* binding */ getDuration; },
/* harmony export */   "getTime": function() { return /* binding */ getTime; },
/* harmony export */   "now": function() { return /* binding */ now; },
/* harmony export */   "rng": function() { return /* binding */ rng; },
/* harmony export */   "checkSameOrigin": function() { return /* binding */ checkSameOrigin; },
/* harmony export */   "scheduleMacroTask": function() { return /* binding */ scheduleMacroTask; },
/* harmony export */   "scheduleMicroTask": function() { return /* binding */ scheduleMicroTask; },
/* harmony export */   "setLabel": function() { return /* binding */ setLabel; },
/* harmony export */   "setRequestHeader": function() { return /* binding */ setRequestHeader; },
/* harmony export */   "stripQueryStringFromUrl": function() { return /* binding */ stripQueryStringFromUrl; },
/* harmony export */   "find": function() { return /* binding */ find; },
/* harmony export */   "removeInvalidChars": function() { return /* binding */ removeInvalidChars; },
/* harmony export */   "PERF": function() { return /* binding */ PERF; },
/* harmony export */   "isPerfTimelineSupported": function() { return /* binding */ isPerfTimelineSupported; },
/* harmony export */   "isBrowser": function() { return /* binding */ isBrowser; },
/* harmony export */   "isPerfTypeSupported": function() { return /* binding */ isPerfTypeSupported; },
/* harmony export */   "isBeaconInspectionEnabled": function() { return /* binding */ isBeaconInspectionEnabled; },
/* harmony export */   "isRedirectInfoAvailable": function() { return /* binding */ isRedirectInfoAvailable; }
/* harmony export */ });
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");

var slice = [].slice;
var isBrowser = typeof window !== 'undefined';
var PERF = isBrowser && typeof performance !== 'undefined' ? performance : {};

function isCORSSupported() {
  var xhr = new window.XMLHttpRequest();
  return 'withCredentials' in xhr;
}

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToHex(buffer) {
  var hexOctets = [];

  for (var _i = 0; _i < buffer.length; _i++) {
    hexOctets.push(byteToHex[buffer[_i]]);
  }

  return hexOctets.join('');
}

var destination = new Uint8Array(16);

function rng() {
  if (typeof crypto != 'undefined' && typeof crypto.getRandomValues == 'function') {
    return crypto.getRandomValues(destination);
  } else if (typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function') {
    return msCrypto.getRandomValues(destination);
  }

  return destination;
}

function generateRandomId(length) {
  var id = bytesToHex(rng());
  return id.substr(0, length);
}

function getDtHeaderValue(span) {
  var dtVersion = '00';
  var dtUnSampledFlags = '00';
  var dtSampledFlags = '01';

  if (span && span.traceId && span.id && span.parentId) {
    var flags = span.sampled ? dtSampledFlags : dtUnSampledFlags;
    var id = span.sampled ? span.id : span.parentId;
    return dtVersion + '-' + span.traceId + '-' + id + '-' + flags;
  }
}

function parseDtHeaderValue(value) {
  var parsed = /^([\da-f]{2})-([\da-f]{32})-([\da-f]{16})-([\da-f]{2})$/.exec(value);

  if (parsed) {
    var flags = parsed[4];
    var sampled = flags !== '00';
    return {
      traceId: parsed[2],
      id: parsed[3],
      sampled: sampled
    };
  }
}

function isDtHeaderValid(header) {
  return /^[\da-f]{2}-[\da-f]{32}-[\da-f]{16}-[\da-f]{2}$/.test(header) && header.slice(3, 35) !== '00000000000000000000000000000000' && header.slice(36, 52) !== '0000000000000000';
}

function getTSHeaderValue(_ref) {
  var sampleRate = _ref.sampleRate;

  if (typeof sampleRate !== 'number' || String(sampleRate).length > 256) {
    return;
  }

  var NAMESPACE = 'es';
  var SEPARATOR = '=';
  return "" + NAMESPACE + SEPARATOR + "s:" + sampleRate;
}

function setRequestHeader(target, name, value) {
  if (typeof target.setRequestHeader === 'function') {
    target.setRequestHeader(name, value);
  } else if (target.headers && typeof target.headers.append === 'function') {
    target.headers.append(name, value);
  } else {
    target[name] = value;
  }
}

function checkSameOrigin(source, target) {
  var isSame = false;

  if (typeof target === 'string') {
    isSame = source === target;
  } else if (target && typeof target.test === 'function') {
    isSame = target.test(source);
  } else if (Array.isArray(target)) {
    target.forEach(function (t) {
      if (!isSame) {
        isSame = checkSameOrigin(source, t);
      }
    });
  }

  return isSame;
}

function isPlatformSupported() {
  return isBrowser && typeof Set === 'function' && typeof JSON.stringify === 'function' && PERF && typeof PERF.now === 'function' && isCORSSupported();
}

function setLabel(key, value, obj) {
  if (!obj || !key) return;
  var skey = removeInvalidChars(key);
  var valueType = typeof value;

  if (value != undefined && valueType !== 'boolean' && valueType !== 'number') {
    value = String(value);
  }

  obj[skey] = value;
  return obj;
}

function getServerTimingInfo(serverTimingEntries) {
  if (serverTimingEntries === void 0) {
    serverTimingEntries = [];
  }

  var serverTimingInfo = [];
  var entrySeparator = ', ';
  var valueSeparator = ';';

  for (var _i2 = 0; _i2 < serverTimingEntries.length; _i2++) {
    var _serverTimingEntries$ = serverTimingEntries[_i2],
        name = _serverTimingEntries$.name,
        duration = _serverTimingEntries$.duration,
        description = _serverTimingEntries$.description;
    var timingValue = name;

    if (description) {
      timingValue += valueSeparator + 'desc=' + description;
    }

    if (duration) {
      timingValue += valueSeparator + 'dur=' + duration;
    }

    serverTimingInfo.push(timingValue);
  }

  return serverTimingInfo.join(entrySeparator);
}

function getTimeOrigin() {
  return PERF.timing.fetchStart;
}

function stripQueryStringFromUrl(url) {
  return url && url.split('?')[0];
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function isFunction(value) {
  return typeof value === 'function';
}

function baseExtend(dst, objs, deep) {
  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];
    if (!isObject(obj) && !isFunction(obj)) continue;
    var keys = Object.keys(obj);

    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && isObject(src)) {
        if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
        baseExtend(dst[key], [src], false);
      } else {
        dst[key] = src;
      }
    }
  }

  return dst;
}

function getElasticScript() {
  if (typeof document !== 'undefined') {
    var scripts = document.getElementsByTagName('script');

    for (var i = 0, l = scripts.length; i < l; i++) {
      var sc = scripts[i];

      if (sc.src.indexOf('elastic') > 0) {
        return sc;
      }
    }
  }
}

function getCurrentScript() {
  if (typeof document !== 'undefined') {
    var currentScript = document.currentScript;

    if (!currentScript) {
      return getElasticScript();
    }

    return currentScript;
  }
}

function extend(dst) {
  return baseExtend(dst, slice.call(arguments, 1), false);
}

function merge(dst) {
  return baseExtend(dst, slice.call(arguments, 1), true);
}

function isUndefined(obj) {
  return typeof obj === 'undefined';
}

function noop() {}

function find(array, predicate, thisArg) {
  if (array == null) {
    throw new TypeError('array is null or not defined');
  }

  var o = Object(array);
  var len = o.length >>> 0;

  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function');
  }

  var k = 0;

  while (k < len) {
    var kValue = o[k];

    if (predicate.call(thisArg, kValue, k, o)) {
      return kValue;
    }

    k++;
  }

  return undefined;
}

function removeInvalidChars(key) {
  return key.replace(/[.*"]/g, '_');
}

function getLatestSpan(spans, typeFilter) {
  var latestSpan = null;

  for (var _i3 = 0; _i3 < spans.length; _i3++) {
    var span = spans[_i3];

    if (typeFilter && typeFilter(span.type) && (!latestSpan || latestSpan._end < span._end)) {
      latestSpan = span;
    }
  }

  return latestSpan;
}

function getLatestNonXHRSpan(spans) {
  return getLatestSpan(spans, function (type) {
    return String(type).indexOf('external') === -1;
  });
}

function getLatestXHRSpan(spans) {
  return getLatestSpan(spans, function (type) {
    return String(type).indexOf('external') !== -1;
  });
}

function getEarliestSpan(spans) {
  var earliestSpan = spans[0];

  for (var _i4 = 1; _i4 < spans.length; _i4++) {
    var span = spans[_i4];

    if (earliestSpan._start > span._start) {
      earliestSpan = span;
    }
  }

  return earliestSpan;
}

function now() {
  return PERF.now();
}

function getTime(time) {
  return typeof time === 'number' && time >= 0 ? time : now();
}

function getDuration(start, end) {
  if (isUndefined(end) || isUndefined(start)) {
    return null;
  }

  return parseInt(end - start);
}

function scheduleMacroTask(callback) {
  setTimeout(callback, 0);
}

function scheduleMicroTask(callback) {
  _polyfills__WEBPACK_IMPORTED_MODULE_0__.Promise.resolve().then(callback);
}

function isPerfTimelineSupported() {
  return typeof PERF.getEntriesByType === 'function';
}

function isPerfTypeSupported(type) {
  return typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.indexOf(type) >= 0;
}

function isBeaconInspectionEnabled() {
  var flagName = '_elastic_inspect_beacon_';

  if (sessionStorage.getItem(flagName) != null) {
    return true;
  }

  if (!window.URL || !window.URLSearchParams) {
    return false;
  }

  try {
    var parsedUrl = new URL(window.location.href);
    var isFlagSet = parsedUrl.searchParams.has(flagName);

    if (isFlagSet) {
      sessionStorage.setItem(flagName, true);
    }

    return isFlagSet;
  } catch (e) {}

  return false;
}

function isRedirectInfoAvailable(timing) {
  return timing.redirectStart > 0;
}



/***/ }),

/***/ "../rum-core/dist/es/error-logging/error-logging.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/error-logging/error-logging.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _stack_trace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stack-trace */ "../rum-core/dist/es/error-logging/stack-trace.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
/* harmony import */ var _common_truncate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/truncate */ "../rum-core/dist/es/common/truncate.js");
/* harmony import */ var error_stack_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! error-stack-parser */ "../../node_modules/error-stack-parser/error-stack-parser.js");
/* harmony import */ var error_stack_parser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(error_stack_parser__WEBPACK_IMPORTED_MODULE_0__);
var _excluded = ["tags"];

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}






var IGNORE_KEYS = ['stack', 'message'];

function getErrorProperties(error) {
  var propertyFound = false;
  var properties = {};
  Object.keys(error).forEach(function (key) {
    if (IGNORE_KEYS.indexOf(key) >= 0) {
      return;
    }

    var val = error[key];

    if (val == null || typeof val === 'function') {
      return;
    }

    if (typeof val === 'object') {
      if (typeof val.toISOString !== 'function') return;
      val = val.toISOString();
    }

    properties[key] = val;
    propertyFound = true;
  });

  if (propertyFound) {
    return properties;
  }
}

var ErrorLogging = function () {
  function ErrorLogging(apmServer, configService, transactionService) {
    this._apmServer = apmServer;
    this._configService = configService;
    this._transactionService = transactionService;
  }

  var _proto = ErrorLogging.prototype;

  _proto.createErrorDataModel = function createErrorDataModel(errorEvent) {
    var frames = (0,_stack_trace__WEBPACK_IMPORTED_MODULE_1__.createStackTraces)((error_stack_parser__WEBPACK_IMPORTED_MODULE_0___default()), errorEvent);
    var filteredFrames = (0,_stack_trace__WEBPACK_IMPORTED_MODULE_1__.filterInvalidFrames)(frames);
    var culprit = '(inline script)';
    var lastFrame = filteredFrames[filteredFrames.length - 1];

    if (lastFrame && lastFrame.filename) {
      culprit = lastFrame.filename;
    }

    var message = errorEvent.message,
        error = errorEvent.error;
    var errorMessage = message;
    var errorType = '';
    var errorContext = {};

    if (error && typeof error === 'object') {
      errorMessage = errorMessage || error.message;
      errorType = error.name;
      var customProperties = getErrorProperties(error);

      if (customProperties) {
        errorContext.custom = customProperties;
      }
    }

    if (!errorType) {
      if (errorMessage && errorMessage.indexOf(':') > -1) {
        errorType = errorMessage.split(':')[0];
      }
    }

    var currentTransaction = this._transactionService.getCurrentTransaction();

    var transactionContext = currentTransaction ? currentTransaction.context : {};

    var _this$_configService$ = this._configService.get('context'),
        tags = _this$_configService$.tags,
        configContext = _objectWithoutPropertiesLoose(_this$_configService$, _excluded);

    var pageContext = (0,_common_context__WEBPACK_IMPORTED_MODULE_2__.getPageContext)();
    var context = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.merge)({}, pageContext, transactionContext, configContext, errorContext);
    var errorObject = {
      id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(),
      culprit: culprit,
      exception: {
        message: errorMessage,
        stacktrace: filteredFrames,
        type: errorType
      },
      context: context
    };

    if (currentTransaction) {
      errorObject = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)(errorObject, {
        trace_id: currentTransaction.traceId,
        parent_id: currentTransaction.id,
        transaction_id: currentTransaction.id,
        transaction: {
          type: currentTransaction.type,
          sampled: currentTransaction.sampled
        }
      });
    }

    return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_4__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_4__.ERROR_MODEL, errorObject);
  };

  _proto.logErrorEvent = function logErrorEvent(errorEvent) {
    if (typeof errorEvent === 'undefined') {
      return;
    }

    var errorObject = this.createErrorDataModel(errorEvent);

    if (typeof errorObject.exception.message === 'undefined') {
      return;
    }

    this._apmServer.addError(errorObject);
  };

  _proto.registerListeners = function registerListeners() {
    var _this = this;

    window.addEventListener('error', function (errorEvent) {
      return _this.logErrorEvent(errorEvent);
    });
    window.addEventListener('unhandledrejection', function (promiseRejectionEvent) {
      return _this.logPromiseEvent(promiseRejectionEvent);
    });
  };

  _proto.logPromiseEvent = function logPromiseEvent(promiseRejectionEvent) {
    var prefix = 'Unhandled promise rejection: ';
    var reason = promiseRejectionEvent.reason;

    if (reason == null) {
      reason = '<no reason specified>';
    }

    var errorEvent;

    if (typeof reason.message === 'string') {
      var name = reason.name ? reason.name + ': ' : '';
      errorEvent = {
        error: reason,
        message: prefix + name + reason.message
      };
    } else {
      reason = typeof reason === 'object' ? '<object>' : typeof reason === 'function' ? '<function>' : reason;
      errorEvent = {
        message: prefix + reason
      };
    }

    this.logErrorEvent(errorEvent);
  };

  _proto.logError = function logError(messageOrError) {
    var errorEvent = {};

    if (typeof messageOrError === 'string') {
      errorEvent.message = messageOrError;
    } else {
      errorEvent.error = messageOrError;
    }

    return this.logErrorEvent(errorEvent);
  };

  return ErrorLogging;
}();

/* harmony default export */ __webpack_exports__["default"] = (ErrorLogging);

/***/ }),

/***/ "../rum-core/dist/es/error-logging/index.js":
/*!**************************************************!*\
  !*** ../rum-core/dist/es/error-logging/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerServices": function() { return /* binding */ registerServices; }
/* harmony export */ });
/* harmony import */ var _error_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error-logging */ "../rum-core/dist/es/error-logging/error-logging.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/service-factory */ "../rum-core/dist/es/common/service-factory.js");




function registerServices() {
  _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.ERROR_LOGGING] = function (serviceFactory) {
    var _serviceFactory$getSe = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.APM_SERVER, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE]),
        apmServer = _serviceFactory$getSe[0],
        configService = _serviceFactory$getSe[1],
        transactionService = _serviceFactory$getSe[2];

    return new _error_logging__WEBPACK_IMPORTED_MODULE_2__.default(apmServer, configService, transactionService);
  };
}



/***/ }),

/***/ "../rum-core/dist/es/error-logging/stack-trace.js":
/*!********************************************************!*\
  !*** ../rum-core/dist/es/error-logging/stack-trace.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createStackTraces": function() { return /* binding */ createStackTraces; },
/* harmony export */   "filterInvalidFrames": function() { return /* binding */ filterInvalidFrames; }
/* harmony export */ });
function filePathToFileName(fileUrl) {
  var origin = window.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

  if (fileUrl.indexOf(origin) > -1) {
    fileUrl = fileUrl.replace(origin + '/', '');
  }

  return fileUrl;
}

function cleanFilePath(filePath) {
  if (filePath === void 0) {
    filePath = '';
  }

  if (filePath === '<anonymous>') {
    filePath = '';
  }

  return filePath;
}

function isFileInline(fileUrl) {
  if (fileUrl) {
    return window.location.href.indexOf(fileUrl) === 0;
  }

  return false;
}

function normalizeStackFrames(stackFrames) {
  return stackFrames.map(function (frame) {
    if (frame.functionName) {
      frame.functionName = normalizeFunctionName(frame.functionName);
    }

    return frame;
  });
}

function normalizeFunctionName(fnName) {
  var parts = fnName.split('/');

  if (parts.length > 1) {
    fnName = ['Object', parts[parts.length - 1]].join('.');
  } else {
    fnName = parts[0];
  }

  fnName = fnName.replace(/.<$/gi, '.<anonymous>');
  fnName = fnName.replace(/^Anonymous function$/, '<anonymous>');
  parts = fnName.split('.');

  if (parts.length > 1) {
    fnName = parts[parts.length - 1];
  } else {
    fnName = parts[0];
  }

  return fnName;
}

function isValidStackTrace(stackTraces) {
  if (stackTraces.length === 0) {
    return false;
  }

  if (stackTraces.length === 1) {
    var stackTrace = stackTraces[0];
    return 'lineNumber' in stackTrace;
  }

  return true;
}

function createStackTraces(stackParser, errorEvent) {
  var error = errorEvent.error,
      filename = errorEvent.filename,
      lineno = errorEvent.lineno,
      colno = errorEvent.colno;
  var stackTraces = [];

  if (error) {
    try {
      stackTraces = stackParser.parse(error);
    } catch (e) {}
  }

  if (!isValidStackTrace(stackTraces)) {
    stackTraces = [{
      fileName: filename,
      lineNumber: lineno,
      columnNumber: colno
    }];
  }

  var normalizedStackTraces = normalizeStackFrames(stackTraces);
  return normalizedStackTraces.map(function (stack) {
    var fileName = stack.fileName,
        lineNumber = stack.lineNumber,
        columnNumber = stack.columnNumber,
        _stack$functionName = stack.functionName,
        functionName = _stack$functionName === void 0 ? '<anonymous>' : _stack$functionName;

    if (!fileName && !lineNumber) {
      return {};
    }

    if (!columnNumber && !lineNumber) {
      return {};
    }

    var filePath = cleanFilePath(fileName);
    var cleanedFileName = filePathToFileName(filePath);

    if (isFileInline(filePath)) {
      cleanedFileName = '(inline script)';
    }

    return {
      abs_path: fileName,
      filename: cleanedFileName,
      function: functionName,
      lineno: lineNumber,
      colno: columnNumber
    };
  });
}
function filterInvalidFrames(frames) {
  return frames.filter(function (_ref) {
    var filename = _ref.filename,
        lineno = _ref.lineno;
    return typeof filename !== 'undefined' && typeof lineno !== 'undefined';
  });
}

/***/ }),

/***/ "../rum-core/dist/es/index.js":
/*!************************************!*\
  !*** ../rum-core/dist/es/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createServiceFactory": function() { return /* binding */ createServiceFactory; },
/* harmony export */   "ServiceFactory": function() { return /* reexport safe */ _common_service_factory__WEBPACK_IMPORTED_MODULE_2__.ServiceFactory; },
/* harmony export */   "patchAll": function() { return /* reexport safe */ _common_patching__WEBPACK_IMPORTED_MODULE_3__.patchAll; },
/* harmony export */   "patchEventHandler": function() { return /* reexport safe */ _common_patching__WEBPACK_IMPORTED_MODULE_3__.patchEventHandler; },
/* harmony export */   "isPlatformSupported": function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.isPlatformSupported; },
/* harmony export */   "isBrowser": function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.isBrowser; },
/* harmony export */   "getInstrumentationFlags": function() { return /* reexport safe */ _common_instrument__WEBPACK_IMPORTED_MODULE_5__.getInstrumentationFlags; },
/* harmony export */   "createTracer": function() { return /* reexport safe */ _opentracing__WEBPACK_IMPORTED_MODULE_6__.createTracer; },
/* harmony export */   "scheduleMicroTask": function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask; },
/* harmony export */   "scheduleMacroTask": function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMacroTask; },
/* harmony export */   "afterFrame": function() { return /* reexport safe */ _common_after_frame__WEBPACK_IMPORTED_MODULE_7__.default; },
/* harmony export */   "ERROR": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.ERROR; },
/* harmony export */   "PAGE_LOAD_DELAY": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PAGE_LOAD_DELAY; },
/* harmony export */   "PAGE_LOAD": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PAGE_LOAD; },
/* harmony export */   "CONFIG_SERVICE": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.CONFIG_SERVICE; },
/* harmony export */   "LOGGING_SERVICE": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.LOGGING_SERVICE; },
/* harmony export */   "TRANSACTION_SERVICE": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.TRANSACTION_SERVICE; },
/* harmony export */   "APM_SERVER": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.APM_SERVER; },
/* harmony export */   "PERFORMANCE_MONITORING": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PERFORMANCE_MONITORING; },
/* harmony export */   "ERROR_LOGGING": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.ERROR_LOGGING; },
/* harmony export */   "EVENT_TARGET": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.EVENT_TARGET; },
/* harmony export */   "CLICK": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.CLICK; },
/* harmony export */   "bootstrap": function() { return /* reexport safe */ _bootstrap__WEBPACK_IMPORTED_MODULE_9__.bootstrap; },
/* harmony export */   "observePageVisibility": function() { return /* reexport safe */ _common_observers__WEBPACK_IMPORTED_MODULE_10__.observePageVisibility; },
/* harmony export */   "observePageClicks": function() { return /* reexport safe */ _common_observers__WEBPACK_IMPORTED_MODULE_11__.observePageClicks; }
/* harmony export */ });
/* harmony import */ var _error_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error-logging */ "../rum-core/dist/es/error-logging/index.js");
/* harmony import */ var _performance_monitoring__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./performance-monitoring */ "../rum-core/dist/es/performance-monitoring/index.js");
/* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/service-factory */ "../rum-core/dist/es/common/service-factory.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/patching */ "../rum-core/dist/es/common/patching/index.js");
/* harmony import */ var _common_observers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./common/observers */ "../rum-core/dist/es/common/observers/page-visibility.js");
/* harmony import */ var _common_observers__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./common/observers */ "../rum-core/dist/es/common/observers/page-clicks.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_instrument__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/instrument */ "../rum-core/dist/es/common/instrument.js");
/* harmony import */ var _common_after_frame__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common/after-frame */ "../rum-core/dist/es/common/after-frame.js");
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./bootstrap */ "../rum-core/dist/es/bootstrap.js");
/* harmony import */ var _opentracing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./opentracing */ "../rum-core/dist/es/opentracing/index.js");












function createServiceFactory() {
  (0,_performance_monitoring__WEBPACK_IMPORTED_MODULE_0__.registerServices)();
  (0,_error_logging__WEBPACK_IMPORTED_MODULE_1__.registerServices)();
  var serviceFactory = new _common_service_factory__WEBPACK_IMPORTED_MODULE_2__.ServiceFactory();
  return serviceFactory;
}



/***/ }),

/***/ "../rum-core/dist/es/opentracing/index.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/opentracing/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Span": function() { return /* reexport safe */ _span__WEBPACK_IMPORTED_MODULE_2__.default; },
/* harmony export */   "Tracer": function() { return /* reexport safe */ _tracer__WEBPACK_IMPORTED_MODULE_1__.default; },
/* harmony export */   "createTracer": function() { return /* binding */ createTracer; }
/* harmony export */ });
/* harmony import */ var _tracer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracer */ "../rum-core/dist/es/opentracing/tracer.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/opentracing/span.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");




function createTracer(serviceFactory) {
  var performanceMonitoring = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.PERFORMANCE_MONITORING);
  var transactionService = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
  var errorLogging = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
  var loggingService = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE);
  return new _tracer__WEBPACK_IMPORTED_MODULE_1__.default(performanceMonitoring, transactionService, loggingService, errorLogging);
}



/***/ }),

/***/ "../rum-core/dist/es/opentracing/span.js":
/*!***********************************************!*\
  !*** ../rum-core/dist/es/opentracing/span.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var opentracing_lib_span__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opentracing/lib/span */ "../../node_modules/opentracing/lib/span.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _performance_monitoring_transaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../performance-monitoring/transaction */ "../rum-core/dist/es/performance-monitoring/transaction.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}





var Span = function (_otSpan) {
  _inheritsLoose(Span, _otSpan);

  function Span(tracer, span) {
    var _this;

    _this = _otSpan.call(this) || this;
    _this.__tracer = tracer;
    _this.span = span;
    _this.isTransaction = span instanceof _performance_monitoring_transaction__WEBPACK_IMPORTED_MODULE_1__.default;
    _this.spanContext = {
      id: span.id,
      traceId: span.traceId,
      sampled: span.sampled
    };
    return _this;
  }

  var _proto = Span.prototype;

  _proto._context = function _context() {
    return this.spanContext;
  };

  _proto._tracer = function _tracer() {
    return this.__tracer;
  };

  _proto._setOperationName = function _setOperationName(name) {
    this.span.name = name;
  };

  _proto._addTags = function _addTags(keyValuePairs) {
    var tags = (0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.extend)({}, keyValuePairs);

    if (tags.type) {
      this.span.type = tags.type;
      delete tags.type;
    }

    if (this.isTransaction) {
      var userId = tags['user.id'];
      var username = tags['user.username'];
      var email = tags['user.email'];

      if (userId || username || email) {
        this.span.addContext({
          user: {
            id: userId,
            username: username,
            email: email
          }
        });
        delete tags['user.id'];
        delete tags['user.username'];
        delete tags['user.email'];
      }
    }

    this.span.addLabels(tags);
  };

  _proto._log = function _log(log, timestamp) {
    if (log.event === 'error') {
      if (log['error.object']) {
        this.__tracer.errorLogging.logError(log['error.object']);
      } else if (log.message) {
        this.__tracer.errorLogging.logError(log.message);
      }
    }
  };

  _proto._finish = function _finish(finishTime) {
    this.span.end();

    if (finishTime) {
      this.span._end = finishTime - (0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.getTimeOrigin)();
    }
  };

  return Span;
}(opentracing_lib_span__WEBPACK_IMPORTED_MODULE_0__.Span);

/* harmony default export */ __webpack_exports__["default"] = (Span);

/***/ }),

/***/ "../rum-core/dist/es/opentracing/tracer.js":
/*!*************************************************!*\
  !*** ../rum-core/dist/es/opentracing/tracer.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opentracing/lib/tracer */ "../../node_modules/opentracing/lib/tracer.js");
/* harmony import */ var opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! opentracing/lib/constants */ "../../node_modules/opentracing/lib/constants.js");
/* harmony import */ var opentracing_lib_span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! opentracing/lib/span */ "../../node_modules/opentracing/lib/span.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/opentracing/span.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}








var Tracer = function (_otTracer) {
  _inheritsLoose(Tracer, _otTracer);

  function Tracer(performanceMonitoring, transactionService, loggingService, errorLogging) {
    var _this;

    _this = _otTracer.call(this) || this;
    _this.performanceMonitoring = performanceMonitoring;
    _this.transactionService = transactionService;
    _this.loggingService = loggingService;
    _this.errorLogging = errorLogging;
    return _this;
  }

  var _proto = Tracer.prototype;

  _proto._startSpan = function _startSpan(name, options) {
    var spanOptions = {
      managed: true
    };

    if (options) {
      spanOptions.timestamp = options.startTime;

      if (options.childOf) {
        spanOptions.parentId = options.childOf.id;
      } else if (options.references && options.references.length > 0) {
        if (options.references.length > 1) {
          if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
            this.loggingService.debug('Elastic APM OpenTracing: Unsupported number of references, only the first childOf reference will be recorded.');
          }
        }

        var childRef = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.find)(options.references, function (ref) {
          return ref.type() === opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.REFERENCE_CHILD_OF;
        });

        if (childRef) {
          spanOptions.parentId = childRef.referencedContext().id;
        }
      }
    }

    var span;
    var currentTransaction = this.transactionService.getCurrentTransaction();

    if (currentTransaction) {
      span = this.transactionService.startSpan(name, undefined, spanOptions);
    } else {
      span = this.transactionService.startTransaction(name, undefined, spanOptions);
    }

    if (!span) {
      return new opentracing_lib_span__WEBPACK_IMPORTED_MODULE_2__.Span();
    }

    if (spanOptions.timestamp) {
      span._start = spanOptions.timestamp - (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getTimeOrigin)();
    }

    var otSpan = new _span__WEBPACK_IMPORTED_MODULE_5__.default(this, span);

    if (options && options.tags) {
      otSpan.addTags(options.tags);
    }

    return otSpan;
  };

  _proto._inject = function _inject(spanContext, format, carrier) {
    switch (format) {
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_TEXT_MAP:
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_HTTP_HEADERS:
        this.performanceMonitoring.injectDtHeader(spanContext, carrier);
        break;

      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_BINARY:
        if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
          this.loggingService.debug('Elastic APM OpenTracing: binary carrier format is not supported.');
        }

        break;
    }
  };

  _proto._extract = function _extract(format, carrier) {
    var ctx;

    switch (format) {
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_TEXT_MAP:
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_HTTP_HEADERS:
        ctx = this.performanceMonitoring.extractDtHeader(carrier);
        break;

      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_BINARY:
        if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
          this.loggingService.debug('Elastic APM OpenTracing: binary carrier format is not supported.');
        }

        break;
    }

    if (!ctx) {
      ctx = null;
    }

    return ctx;
  };

  return Tracer;
}(opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_0__.Tracer);

/* harmony default export */ __webpack_exports__["default"] = (Tracer);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/breakdown.js":
/*!***************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/breakdown.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "captureBreakdown": function() { return /* binding */ captureBreakdown; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");


var pageLoadBreakdowns = [['domainLookupStart', 'domainLookupEnd', 'DNS'], ['connectStart', 'connectEnd', 'TCP'], ['requestStart', 'responseStart', 'Request'], ['responseStart', 'responseEnd', 'Response'], ['domLoading', 'domComplete', 'Processing'], ['loadEventStart', 'loadEventEnd', 'Load']];

function getValue(value) {
  return {
    value: value
  };
}

function calculateSelfTime(transaction) {
  var spans = transaction.spans,
      _start = transaction._start,
      _end = transaction._end;

  if (spans.length === 0) {
    return transaction.duration();
  }

  spans.sort(function (span1, span2) {
    return span1._start - span2._start;
  });
  var span = spans[0];
  var spanEnd = span._end;
  var spanStart = span._start;
  var lastContinuousEnd = spanEnd;
  var selfTime = spanStart - _start;

  for (var i = 1; i < spans.length; i++) {
    span = spans[i];
    spanStart = span._start;
    spanEnd = span._end;

    if (spanStart > lastContinuousEnd) {
      selfTime += spanStart - lastContinuousEnd;
      lastContinuousEnd = spanEnd;
    } else if (spanEnd > lastContinuousEnd) {
      lastContinuousEnd = spanEnd;
    }
  }

  if (lastContinuousEnd < _end) {
    selfTime += _end - lastContinuousEnd;
  }

  return selfTime;
}

function groupSpans(transaction) {
  var spanMap = {};
  var transactionSelfTime = calculateSelfTime(transaction);
  spanMap['app'] = {
    count: 1,
    duration: transactionSelfTime
  };
  var spans = transaction.spans;

  for (var i = 0; i < spans.length; i++) {
    var span = spans[i];
    var duration = span.duration();

    if (duration === 0 || duration == null) {
      continue;
    }

    var type = span.type,
        subtype = span.subtype;
    var key = type.replace(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRUNCATED_TYPE, '');

    if (subtype) {
      key += '.' + subtype;
    }

    if (!spanMap[key]) {
      spanMap[key] = {
        duration: 0,
        count: 0
      };
    }

    spanMap[key].count++;
    spanMap[key].duration += duration;
  }

  return spanMap;
}

function getSpanBreakdown(transactionDetails, _ref) {
  var details = _ref.details,
      _ref$count = _ref.count,
      count = _ref$count === void 0 ? 1 : _ref$count,
      duration = _ref.duration;
  return {
    transaction: transactionDetails,
    span: details,
    samples: {
      'span.self_time.count': getValue(count),
      'span.self_time.sum.us': getValue(duration * 1000)
    }
  };
}

function captureBreakdown(transaction, timings) {
  if (timings === void 0) {
    timings = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.timing;
  }

  var breakdowns = [];
  var name = transaction.name,
      type = transaction.type,
      sampled = transaction.sampled;
  var transactionDetails = {
    name: name,
    type: type
  };

  if (!sampled) {
    return breakdowns;
  }

  if (type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD && timings) {
    for (var i = 0; i < pageLoadBreakdowns.length; i++) {
      var current = pageLoadBreakdowns[i];
      var start = timings[current[0]];
      var end = timings[current[1]];
      var duration = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getDuration)(start, end);

      if (duration === 0 || duration == null) {
        continue;
      }

      breakdowns.push(getSpanBreakdown(transactionDetails, {
        details: {
          type: current[2]
        },
        duration: duration
      }));
    }
  } else {
    var spanMap = groupSpans(transaction);
    Object.keys(spanMap).forEach(function (key) {
      var _key$split = key.split('.'),
          type = _key$split[0],
          subtype = _key$split[1];

      var _spanMap$key = spanMap[key],
          duration = _spanMap$key.duration,
          count = _spanMap$key.count;
      breakdowns.push(getSpanBreakdown(transactionDetails, {
        details: {
          type: type,
          subtype: subtype
        },
        duration: duration,
        count: count
      }));
    });
  }

  return breakdowns;
}

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/index.js":
/*!***********************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerServices": function() { return /* binding */ registerServices; }
/* harmony export */ });
/* harmony import */ var _performance_monitoring__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./performance-monitoring */ "../rum-core/dist/es/performance-monitoring/performance-monitoring.js");
/* harmony import */ var _transaction_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transaction-service */ "../rum-core/dist/es/performance-monitoring/transaction-service.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/service-factory */ "../rum-core/dist/es/common/service-factory.js");





function registerServices() {
  _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE] = function (serviceFactory) {
    var _serviceFactory$getSe = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.LOGGING_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE]),
        loggingService = _serviceFactory$getSe[0],
        configService = _serviceFactory$getSe[1];

    return new _transaction_service__WEBPACK_IMPORTED_MODULE_2__.default(loggingService, configService);
  };

  _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.PERFORMANCE_MONITORING] = function (serviceFactory) {
    var _serviceFactory$getSe2 = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.APM_SERVER, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.LOGGING_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE]),
        apmServer = _serviceFactory$getSe2[0],
        configService = _serviceFactory$getSe2[1],
        loggingService = _serviceFactory$getSe2[2],
        transactionService = _serviceFactory$getSe2[3];

    return new _performance_monitoring__WEBPACK_IMPORTED_MODULE_3__.default(apmServer, configService, loggingService, transactionService);
  };
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/metrics.js":
/*!*************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/metrics.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "metrics": function() { return /* binding */ metrics; },
/* harmony export */   "createLongTaskSpans": function() { return /* binding */ createLongTaskSpans; },
/* harmony export */   "createFirstInputDelaySpan": function() { return /* binding */ createFirstInputDelaySpan; },
/* harmony export */   "createTotalBlockingTimeSpan": function() { return /* binding */ createTotalBlockingTimeSpan; },
/* harmony export */   "calculateTotalBlockingTime": function() { return /* binding */ calculateTotalBlockingTime; },
/* harmony export */   "calculateCumulativeLayoutShift": function() { return /* binding */ calculateCumulativeLayoutShift; },
/* harmony export */   "captureObserverEntries": function() { return /* binding */ captureObserverEntries; },
/* harmony export */   "PerfEntryRecorder": function() { return /* binding */ PerfEntryRecorder; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/performance-monitoring/span.js");



var metrics = {
  fid: 0,
  fcp: 0,
  tbt: {
    start: Infinity,
    duration: 0
  },
  cls: {
    score: 0,
    firstEntryTime: Number.NEGATIVE_INFINITY,
    prevEntryTime: Number.NEGATIVE_INFINITY,
    currentSessionScore: 0
  },
  longtask: {
    count: 0,
    duration: 0,
    max: 0
  }
};
var LONG_TASK_THRESHOLD = 50;
function createLongTaskSpans(longtasks, agg) {
  var spans = [];

  for (var i = 0; i < longtasks.length; i++) {
    var _longtasks$i = longtasks[i],
        name = _longtasks$i.name,
        startTime = _longtasks$i.startTime,
        duration = _longtasks$i.duration,
        attribution = _longtasks$i.attribution;
    var end = startTime + duration;
    var span = new _span__WEBPACK_IMPORTED_MODULE_0__.default("Longtask(" + name + ")", _common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK, {
      startTime: startTime
    });
    agg.count++;
    agg.duration += duration;
    agg.max = Math.max(duration, agg.max);

    if (attribution.length > 0) {
      var _attribution$ = attribution[0],
          _name = _attribution$.name,
          containerType = _attribution$.containerType,
          containerName = _attribution$.containerName,
          containerId = _attribution$.containerId;
      var customContext = {
        attribution: _name,
        type: containerType
      };

      if (containerName) {
        customContext.name = containerName;
      }

      if (containerId) {
        customContext.id = containerId;
      }

      span.addContext({
        custom: customContext
      });
    }

    span.end(end);
    spans.push(span);
  }

  return spans;
}
function createFirstInputDelaySpan(fidEntries) {
  var firstInput = fidEntries[0];

  if (firstInput) {
    var startTime = firstInput.startTime,
        processingStart = firstInput.processingStart;
    var span = new _span__WEBPACK_IMPORTED_MODULE_0__.default('First Input Delay', _common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT, {
      startTime: startTime
    });
    span.end(processingStart);
    return span;
  }
}
function createTotalBlockingTimeSpan(tbtObject) {
  var start = tbtObject.start,
      duration = tbtObject.duration;
  var tbtSpan = new _span__WEBPACK_IMPORTED_MODULE_0__.default('Total Blocking Time', _common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK, {
    startTime: start
  });
  tbtSpan.end(start + duration);
  return tbtSpan;
}
function calculateTotalBlockingTime(longtaskEntries) {
  longtaskEntries.forEach(function (entry) {
    var name = entry.name,
        startTime = entry.startTime,
        duration = entry.duration;

    if (startTime < metrics.fcp) {
      return;
    }

    if (name !== 'self' && name.indexOf('same-origin') === -1) {
      return;
    }

    metrics.tbt.start = Math.min(metrics.tbt.start, startTime);
    var blockingTime = duration - LONG_TASK_THRESHOLD;

    if (blockingTime > 0) {
      metrics.tbt.duration += blockingTime;
    }
  });
}
function calculateCumulativeLayoutShift(clsEntries) {
  clsEntries.forEach(function (entry) {
    if (!entry.hadRecentInput && entry.value) {
      var shouldCreateNewSession = entry.startTime - metrics.cls.firstEntryTime > 5000 || entry.startTime - metrics.cls.prevEntryTime > 1000;

      if (shouldCreateNewSession) {
        metrics.cls.firstEntryTime = entry.startTime;
        metrics.cls.currentSessionScore = 0;
      }

      metrics.cls.prevEntryTime = entry.startTime;
      metrics.cls.currentSessionScore += entry.value;
      metrics.cls.score = Math.max(metrics.cls.score, metrics.cls.currentSessionScore);
    }
  });
}
function captureObserverEntries(list, _ref) {
  var isHardNavigation = _ref.isHardNavigation,
      trStart = _ref.trStart;
  var longtaskEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK).filter(function (entry) {
    return entry.startTime >= trStart;
  });
  var longTaskSpans = createLongTaskSpans(longtaskEntries, metrics.longtask);
  var result = {
    spans: longTaskSpans,
    marks: {}
  };

  if (!isHardNavigation) {
    return result;
  }

  var lcpEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LARGEST_CONTENTFUL_PAINT);
  var lastLcpEntry = lcpEntries[lcpEntries.length - 1];

  if (lastLcpEntry) {
    var lcp = parseInt(lastLcpEntry.startTime);
    metrics.lcp = lcp;
    result.marks.largestContentfulPaint = lcp;
  }

  var timing = _common_utils__WEBPACK_IMPORTED_MODULE_2__.PERF.timing;
  var unloadDiff = timing.fetchStart - timing.navigationStart;

  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.isRedirectInfoAvailable)(timing)) {
    unloadDiff = 0;
  }

  var fcpEntry = list.getEntriesByName(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_CONTENTFUL_PAINT)[0];

  if (fcpEntry) {
    var fcp = parseInt(unloadDiff >= 0 ? fcpEntry.startTime - unloadDiff : fcpEntry.startTime);
    metrics.fcp = fcp;
    result.marks.firstContentfulPaint = fcp;
  }

  var fidEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT);
  var fidSpan = createFirstInputDelaySpan(fidEntries);

  if (fidSpan) {
    metrics.fid = fidSpan.duration();
    result.spans.push(fidSpan);
  }

  calculateTotalBlockingTime(longtaskEntries);
  var clsEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT);
  calculateCumulativeLayoutShift(clsEntries);
  return result;
}
var PerfEntryRecorder = function () {
  function PerfEntryRecorder(callback) {
    this.po = {
      observe: _common_utils__WEBPACK_IMPORTED_MODULE_2__.noop,
      disconnect: _common_utils__WEBPACK_IMPORTED_MODULE_2__.noop
    };

    if (window.PerformanceObserver) {
      this.po = new PerformanceObserver(callback);
    }
  }

  var _proto = PerfEntryRecorder.prototype;

  _proto.start = function start(type) {
    try {
      if (!(0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.isPerfTypeSupported)(type)) {
        return;
      }

      this.po.observe({
        type: type,
        buffered: true
      });
    } catch (_) {}
  };

  _proto.stop = function stop() {
    this.po.disconnect();
  };

  return PerfEntryRecorder;
}();

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js":
/*!***********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "captureNavigation": function() { return /* binding */ captureNavigation; },
/* harmony export */   "createNavigationTimingSpans": function() { return /* reexport safe */ _navigation_timing__WEBPACK_IMPORTED_MODULE_2__.createNavigationTimingSpans; },
/* harmony export */   "createResourceTimingSpans": function() { return /* reexport safe */ _resource_timing__WEBPACK_IMPORTED_MODULE_4__.createResourceTimingSpans; },
/* harmony export */   "createUserTimingSpans": function() { return /* reexport safe */ _user_timing__WEBPACK_IMPORTED_MODULE_6__.createUserTimingSpans; },
/* harmony export */   "getPageLoadMarks": function() { return /* reexport safe */ _marks__WEBPACK_IMPORTED_MODULE_3__.getPageLoadMarks; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _navigation_timing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navigation-timing */ "../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js");
/* harmony import */ var _user_timing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./user-timing */ "../rum-core/dist/es/performance-monitoring/navigation/user-timing.js");
/* harmony import */ var _resource_timing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./resource-timing */ "../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js");
/* harmony import */ var _marks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./marks */ "../rum-core/dist/es/performance-monitoring/navigation/marks.js");








function captureNavigation(transaction) {
  if (!transaction.captureTimings) {
    return;
  }

  var trEnd = transaction._end;

  if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD) {
    if (transaction.marks && transaction.marks.custom) {
      var customMarks = transaction.marks.custom;
      Object.keys(customMarks).forEach(function (key) {
        customMarks[key] += transaction._start;
      });
    }

    var trStart = 0;
    transaction._start = trStart;
    var timings = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.timing;
    var baseTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isRedirectInfoAvailable)(timings) ? timings.redirectStart : timings.fetchStart;
    (0,_navigation_timing__WEBPACK_IMPORTED_MODULE_2__.createNavigationTimingSpans)(timings, baseTime, trStart, trEnd).forEach(function (span) {
      span.traceId = transaction.traceId;
      span.sampled = transaction.sampled;

      if (span.pageResponse && transaction.options.pageLoadSpanId) {
        span.id = transaction.options.pageLoadSpanId;
      }

      transaction.spans.push(span);
    });
    transaction.addMarks((0,_marks__WEBPACK_IMPORTED_MODULE_3__.getPageLoadMarks)(timings));
  }

  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isPerfTimelineSupported)()) {
    var _trStart = transaction._start;
    var resourceEntries = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_0__.RESOURCE);
    (0,_resource_timing__WEBPACK_IMPORTED_MODULE_4__.createResourceTimingSpans)(resourceEntries, _state__WEBPACK_IMPORTED_MODULE_5__.state.bootstrapTime, _trStart, trEnd).forEach(function (span) {
      return transaction.spans.push(span);
    });
    var userEntries = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_0__.MEASURE);
    (0,_user_timing__WEBPACK_IMPORTED_MODULE_6__.createUserTimingSpans)(userEntries, _trStart, trEnd).forEach(function (span) {
      return transaction.spans.push(span);
    });
  }
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/marks.js":
/*!**********************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/marks.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getPageLoadMarks": function() { return /* binding */ getPageLoadMarks; },
/* harmony export */   "NAVIGATION_TIMING_MARKS": function() { return /* binding */ NAVIGATION_TIMING_MARKS; },
/* harmony export */   "COMPRESSED_NAV_TIMING_MARKS": function() { return /* binding */ COMPRESSED_NAV_TIMING_MARKS; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");

var NAVIGATION_TIMING_MARKS = ['fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'];
var COMPRESSED_NAV_TIMING_MARKS = ['fs', 'ls', 'le', 'cs', 'ce', 'qs', 'rs', 're', 'dl', 'di', 'ds', 'de', 'dc', 'es', 'ee'];

function getPageLoadMarks(timing) {
  var marks = getNavigationTimingMarks(timing);

  if (marks == null) {
    return null;
  }

  return {
    navigationTiming: marks,
    agent: {
      timeToFirstByte: marks.responseStart,
      domInteractive: marks.domInteractive,
      domComplete: marks.domComplete
    }
  };
}

function getNavigationTimingMarks(timing) {
  var redirectStart = timing.redirectStart,
      fetchStart = timing.fetchStart,
      navigationStart = timing.navigationStart,
      responseStart = timing.responseStart,
      responseEnd = timing.responseEnd;

  if (fetchStart >= navigationStart && responseStart >= fetchStart && responseEnd >= responseStart) {
    var marks = {};
    NAVIGATION_TIMING_MARKS.forEach(function (timingKey) {
      var m = timing[timingKey];

      if (m && m >= fetchStart) {
        if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.isRedirectInfoAvailable)(timing)) {
          marks[timingKey] = parseInt(m - redirectStart);
        } else {
          marks[timingKey] = parseInt(m - fetchStart);
        }
      }
    });
    return marks;
  }

  return null;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js":
/*!**********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createNavigationTimingSpans": function() { return /* binding */ createNavigationTimingSpans; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");


var eventPairs = [['redirectStart', 'redirectEnd', 'Redirect'], ['domainLookupStart', 'domainLookupEnd', 'Domain lookup'], ['connectStart', 'connectEnd', 'Making a connection to the server'], ['requestStart', 'responseEnd', 'Requesting and receiving the document'], ['domLoading', 'domInteractive', 'Parsing the document, executing sync. scripts'], ['domContentLoadedEventStart', 'domContentLoadedEventEnd', 'Fire "DOMContentLoaded" event'], ['loadEventStart', 'loadEventEnd', 'Fire "load" event']];

function createNavigationTimingSpans(timings, baseTime, trStart, trEnd) {
  var spans = [];

  for (var i = 0; i < eventPairs.length; i++) {
    var start = timings[eventPairs[i][0]];
    var end = timings[eventPairs[i][1]];

    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.shouldCreateSpan)(start, end, trStart, trEnd, baseTime)) {
      continue;
    }

    var span = new _span__WEBPACK_IMPORTED_MODULE_1__.default(eventPairs[i][2], 'hard-navigation.browser-timing');
    var data = null;

    if (eventPairs[i][0] === 'requestStart') {
      span.pageResponse = true;
      data = {
        url: location.origin
      };
    }

    span._start = start - baseTime;
    span.end(end - baseTime, data);
    spans.push(span);
  }

  return spans;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js":
/*!********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createResourceTimingSpans": function() { return /* binding */ createResourceTimingSpans; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");





function createResourceTimingSpan(resourceTimingEntry) {
  var name = resourceTimingEntry.name,
      initiatorType = resourceTimingEntry.initiatorType,
      startTime = resourceTimingEntry.startTime,
      responseEnd = resourceTimingEntry.responseEnd;
  var kind = 'resource';

  if (initiatorType) {
    kind += '.' + initiatorType;
  }

  var spanName = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.stripQueryStringFromUrl)(name);
  var span = new _span__WEBPACK_IMPORTED_MODULE_1__.default(spanName, kind);
  span._start = startTime;
  span.end(responseEnd, {
    url: name,
    entry: resourceTimingEntry
  });
  return span;
}

function isCapturedByPatching(resourceStartTime, requestPatchTime) {
  return requestPatchTime != null && resourceStartTime > requestPatchTime;
}

function isIntakeAPIEndpoint(url) {
  return /intake\/v\d+\/rum\/events/.test(url);
}

function createResourceTimingSpans(entries, requestPatchTime, trStart, trEnd) {
  var spans = [];

  for (var i = 0; i < entries.length; i++) {
    var _entries$i = entries[i],
        initiatorType = _entries$i.initiatorType,
        name = _entries$i.name,
        startTime = _entries$i.startTime,
        responseEnd = _entries$i.responseEnd;

    if (_common_constants__WEBPACK_IMPORTED_MODULE_2__.RESOURCE_INITIATOR_TYPES.indexOf(initiatorType) === -1 || name == null) {
      continue;
    }

    if ((initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') && (isIntakeAPIEndpoint(name) || isCapturedByPatching(startTime, requestPatchTime))) {
      continue;
    }

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_3__.shouldCreateSpan)(startTime, responseEnd, trStart, trEnd)) {
      spans.push(createResourceTimingSpan(entries[i]));
    }
  }

  return spans;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/user-timing.js":
/*!****************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/user-timing.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createUserTimingSpans": function() { return /* binding */ createUserTimingSpans; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");




function createUserTimingSpans(entries, trStart, trEnd) {
  var userTimingSpans = [];

  for (var i = 0; i < entries.length; i++) {
    var _entries$i = entries[i],
        name = _entries$i.name,
        startTime = _entries$i.startTime,
        duration = _entries$i.duration;
    var end = startTime + duration;

    if (duration <= _common_constants__WEBPACK_IMPORTED_MODULE_0__.USER_TIMING_THRESHOLD || !(0,_utils__WEBPACK_IMPORTED_MODULE_1__.shouldCreateSpan)(startTime, end, trStart, trEnd)) {
      continue;
    }

    var kind = 'app';
    var span = new _span__WEBPACK_IMPORTED_MODULE_2__.default(name, kind);
    span._start = startTime;
    span.end(end);
    userTimingSpans.push(span);
  }

  return userTimingSpans;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/utils.js":
/*!**********************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/utils.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shouldCreateSpan": function() { return /* binding */ shouldCreateSpan; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");


function shouldCreateSpan(start, end, trStart, trEnd, baseTime) {
  if (baseTime === void 0) {
    baseTime = 0;
  }

  return typeof start === 'number' && typeof end === 'number' && start >= baseTime && end > start && start - baseTime >= trStart && end - baseTime <= trEnd && end - start < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION && start - baseTime < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION && end - baseTime < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/performance-monitoring.js":
/*!****************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/performance-monitoring.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "groupSmallContinuouslySimilarSpans": function() { return /* binding */ groupSmallContinuouslySimilarSpans; },
/* harmony export */   "adjustTransaction": function() { return /* binding */ adjustTransaction; },
/* harmony export */   "default": function() { return /* binding */ PerformanceMonitoring; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/url */ "../rum-core/dist/es/common/url.js");
/* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/patching */ "../rum-core/dist/es/common/patching/index.js");
/* harmony import */ var _common_patching_patch_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/patching/patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_truncate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/truncate */ "../rum-core/dist/es/common/truncate.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");







var SIMILAR_SPAN_TO_TRANSACTION_RATIO = 0.05;
var TRANSACTION_DURATION_THRESHOLD = 60000;
function groupSmallContinuouslySimilarSpans(originalSpans, transDuration, threshold) {
  originalSpans.sort(function (spanA, spanB) {
    return spanA._start - spanB._start;
  });
  var spans = [];
  var lastCount = 1;
  originalSpans.forEach(function (span, index) {
    if (spans.length === 0) {
      spans.push(span);
    } else {
      var lastSpan = spans[spans.length - 1];
      var isContinuouslySimilar = lastSpan.type === span.type && lastSpan.subtype === span.subtype && lastSpan.action === span.action && lastSpan.name === span.name && span.duration() / transDuration < threshold && (span._start - lastSpan._end) / transDuration < threshold;
      var isLastSpan = originalSpans.length === index + 1;

      if (isContinuouslySimilar) {
        lastCount++;
        lastSpan._end = span._end;
      }

      if (lastCount > 1 && (!isContinuouslySimilar || isLastSpan)) {
        lastSpan.name = lastCount + 'x ' + lastSpan.name;
        lastCount = 1;
      }

      if (!isContinuouslySimilar) {
        spans.push(span);
      }
    }
  });
  return spans;
}
function adjustTransaction(transaction) {
  if (transaction.sampled) {
    var filterdSpans = transaction.spans.filter(function (span) {
      return span.duration() > 0 && span._start >= transaction._start && span._end <= transaction._end;
    });

    if (transaction.isManaged()) {
      var duration = transaction.duration();
      var similarSpans = groupSmallContinuouslySimilarSpans(filterdSpans, duration, SIMILAR_SPAN_TO_TRANSACTION_RATIO);
      transaction.spans = similarSpans;
    } else {
      transaction.spans = filterdSpans;
    }
  } else {
    transaction.resetFields();
  }

  return transaction;
}

var PerformanceMonitoring = function () {
  function PerformanceMonitoring(apmServer, configService, loggingService, transactionService) {
    this._apmServer = apmServer;
    this._configService = configService;
    this._logginService = loggingService;
    this._transactionService = transactionService;
  }

  var _proto = PerformanceMonitoring.prototype;

  _proto.init = function init(flags) {
    var _this = this;

    if (flags === void 0) {
      flags = {};
    }

    this._configService.events.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_END + _common_constants__WEBPACK_IMPORTED_MODULE_0__.AFTER_EVENT, function (tr) {
      var payload = _this.createTransactionPayload(tr);

      if (payload) {
        _this._apmServer.addTransaction(payload);

        _this._configService.dispatchEvent(_common_constants__WEBPACK_IMPORTED_MODULE_0__.QUEUE_ADD_TRANSACTION);
      }
    });

    if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY]) {
      _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY, this.getHistorySub());
    }

    if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST]) {
      _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST, this.getXHRSub());
    }

    if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH]) {
      _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH, this.getFetchSub());
    }
  };

  _proto.getHistorySub = function getHistorySub() {
    var transactionService = this._transactionService;
    return function (event, task) {
      if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY && event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
        transactionService.startTransaction(task.data.title, 'route-change', {
          managed: true,
          canReuse: true
        });
      }
    };
  };

  _proto.getXHRSub = function getXHRSub() {
    var _this2 = this;

    return function (event, task) {
      if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST && !_common_patching_patch_utils__WEBPACK_IMPORTED_MODULE_2__.globalState.fetchInProgress) {
        _this2.processAPICalls(event, task);
      }
    };
  };

  _proto.getFetchSub = function getFetchSub() {
    var _this3 = this;

    return function (event, task) {
      if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH) {
        _this3.processAPICalls(event, task);
      }
    };
  };

  _proto.processAPICalls = function processAPICalls(event, task) {
    var configService = this._configService;
    var transactionService = this._transactionService;

    if (task.data && task.data.url) {
      var endpoints = this._apmServer.getEndpoints();

      var isOwnEndpoint = Object.keys(endpoints).some(function (endpoint) {
        return task.data.url.indexOf(endpoints[endpoint]) !== -1;
      });

      if (isOwnEndpoint) {
        return;
      }
    }

    if (event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE && task.data) {
      var data = task.data;
      var requestUrl = new _common_url__WEBPACK_IMPORTED_MODULE_3__.Url(data.url);
      var spanName = data.method + ' ' + (requestUrl.relative ? requestUrl.path : (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.stripQueryStringFromUrl)(requestUrl.href));

      if (!transactionService.getCurrentTransaction()) {
        transactionService.startTransaction(spanName, _common_constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TYPE, {
          managed: true
        });
      }

      var span = transactionService.startSpan(spanName, 'external.http', {
        blocking: true
      });

      if (!span) {
        return;
      }

      var isDtEnabled = configService.get('distributedTracing');
      var dtOrigins = configService.get('distributedTracingOrigins');
      var currentUrl = new _common_url__WEBPACK_IMPORTED_MODULE_3__.Url(window.location.href);
      var isSameOrigin = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.checkSameOrigin)(requestUrl.origin, currentUrl.origin) || (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.checkSameOrigin)(requestUrl.origin, dtOrigins);
      var target = data.target;

      if (isDtEnabled && isSameOrigin && target) {
        this.injectDtHeader(span, target);
        var propagateTracestate = configService.get('propagateTracestate');

        if (propagateTracestate) {
          this.injectTSHeader(span, target);
        }
      } else if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
        this._logginService.debug("Could not inject distributed tracing header to the request origin ('" + requestUrl.origin + "') from the current origin ('" + currentUrl.origin + "')");
      }

      if (data.sync) {
        span.sync = data.sync;
      }

      data.span = span;
    } else if (event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
      var _data = task.data;

      if (_data && _data.span) {
        var _span = _data.span,
            response = _data.response,
            _target = _data.target;
        var status;

        if (response) {
          status = response.status;
        } else {
          status = _target.status;
        }

        var outcome;

        if (_data.status != 'abort' && !_data.aborted) {
          if (status >= 400 || status == 0) {
            outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_FAILURE;
          } else {
            outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_SUCCESS;
          }
        } else {
          outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_UNKNOWN;
        }

        _span.outcome = outcome;
        var tr = transactionService.getCurrentTransaction();

        if (tr && tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TYPE) {
          tr.outcome = outcome;
        }

        transactionService.endSpan(_span, _data);
      }
    }
  };

  _proto.injectDtHeader = function injectDtHeader(span, target) {
    var headerName = this._configService.get('distributedTracingHeaderName');

    var headerValue = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getDtHeaderValue)(span);
    var isHeaderValid = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.isDtHeaderValid)(headerValue);

    if (isHeaderValid && headerValue && headerName) {
      (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.setRequestHeader)(target, headerName, headerValue);
    }
  };

  _proto.injectTSHeader = function injectTSHeader(span, target) {
    var headerValue = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getTSHeaderValue)(span);

    if (headerValue) {
      (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.setRequestHeader)(target, 'tracestate', headerValue);
    }
  };

  _proto.extractDtHeader = function extractDtHeader(target) {
    var configService = this._configService;
    var headerName = configService.get('distributedTracingHeaderName');

    if (target) {
      return (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.parseDtHeaderValue)(target[headerName]);
    }
  };

  _proto.filterTransaction = function filterTransaction(tr) {
    var duration = tr.duration();

    if (!duration) {
      if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
        var message = "transaction(" + tr.id + ", " + tr.name + ") was discarded! ";

        if (duration === 0) {
          message += "Transaction duration is 0";
        } else {
          message += "Transaction wasn't ended";
        }

        this._logginService.debug(message);
      }

      return false;
    }

    if (tr.isManaged()) {
      if (duration > TRANSACTION_DURATION_THRESHOLD) {
        if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
          this._logginService.debug("transaction(" + tr.id + ", " + tr.name + ") was discarded! Transaction duration (" + duration + ") is greater than managed transaction threshold (" + TRANSACTION_DURATION_THRESHOLD + ")");
        }

        return false;
      }

      if (tr.sampled && tr.spans.length === 0) {
        if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
          this._logginService.debug("transaction(" + tr.id + ", " + tr.name + ") was discarded! Transaction does not have any spans");
        }

        return false;
      }
    }

    return true;
  };

  _proto.createTransactionDataModel = function createTransactionDataModel(transaction) {
    var transactionStart = transaction._start;
    var spans = transaction.spans.map(function (span) {
      var spanData = {
        id: span.id,
        transaction_id: transaction.id,
        parent_id: span.parentId || transaction.id,
        trace_id: transaction.traceId,
        name: span.name,
        type: span.type,
        subtype: span.subtype,
        action: span.action,
        sync: span.sync,
        start: parseInt(span._start - transactionStart),
        duration: span.duration(),
        context: span.context,
        outcome: span.outcome,
        sample_rate: span.sampleRate
      };
      return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_6__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_6__.SPAN_MODEL, spanData);
    });
    var transactionData = {
      id: transaction.id,
      trace_id: transaction.traceId,
      session: transaction.session,
      name: transaction.name,
      type: transaction.type,
      duration: transaction.duration(),
      spans: spans,
      context: transaction.context,
      marks: transaction.marks,
      breakdown: transaction.breakdownTimings,
      span_count: {
        started: spans.length
      },
      sampled: transaction.sampled,
      sample_rate: transaction.sampleRate,
      experience: transaction.experience,
      outcome: transaction.outcome
    };
    return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_6__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_6__.TRANSACTION_MODEL, transactionData);
  };

  _proto.createTransactionPayload = function createTransactionPayload(transaction) {
    var adjustedTransaction = adjustTransaction(transaction);
    var filtered = this.filterTransaction(adjustedTransaction);

    if (filtered) {
      return this.createTransactionDataModel(transaction);
    }
  };

  return PerformanceMonitoring;
}();



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/span-base.js":
/*!***************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/span-base.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");



var SpanBase = function () {
  function SpanBase(name, type, options) {
    if (options === void 0) {
      options = {};
    }

    if (!name) {
      name = _common_constants__WEBPACK_IMPORTED_MODULE_0__.NAME_UNKNOWN;
    }

    if (!type) {
      type = _common_constants__WEBPACK_IMPORTED_MODULE_0__.TYPE_CUSTOM;
    }

    this.name = name;
    this.type = type;
    this.options = options;
    this.id = options.id || (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.generateRandomId)(16);
    this.traceId = options.traceId;
    this.sampled = options.sampled;
    this.sampleRate = options.sampleRate;
    this.timestamp = options.timestamp;
    this._start = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(options.startTime);
    this._end = undefined;
    this.ended = false;
    this.outcome = undefined;
    this.onEnd = options.onEnd;
  }

  var _proto = SpanBase.prototype;

  _proto.ensureContext = function ensureContext() {
    if (!this.context) {
      this.context = {};
    }
  };

  _proto.addLabels = function addLabels(tags) {
    this.ensureContext();
    var ctx = this.context;

    if (!ctx.tags) {
      ctx.tags = {};
    }

    var keys = Object.keys(tags);
    keys.forEach(function (k) {
      return (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.setLabel)(k, tags[k], ctx.tags);
    });
  };

  _proto.addContext = function addContext() {
    for (var _len = arguments.length, context = new Array(_len), _key = 0; _key < _len; _key++) {
      context[_key] = arguments[_key];
    }

    if (context.length === 0) return;
    this.ensureContext();
    _common_utils__WEBPACK_IMPORTED_MODULE_1__.merge.apply(void 0, [this.context].concat(context));
  };

  _proto.end = function end(endTime) {
    if (this.ended) {
      return;
    }

    this.ended = true;
    this._end = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(endTime);
    this.callOnEnd();
  };

  _proto.callOnEnd = function callOnEnd() {
    if (typeof this.onEnd === 'function') {
      this.onEnd(this);
    }
  };

  _proto.duration = function duration() {
    return (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getDuration)(this._start, this._end);
  };

  return SpanBase;
}();

/* harmony default export */ __webpack_exports__["default"] = (SpanBase);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/span.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/span.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _span_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./span-base */ "../rum-core/dist/es/performance-monitoring/span-base.js");
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}




var Span = function (_SpanBase) {
  _inheritsLoose(Span, _SpanBase);

  function Span(name, type, options) {
    var _this;

    _this = _SpanBase.call(this, name, type, options) || this;
    _this.parentId = _this.options.parentId;
    _this.subtype = undefined;
    _this.action = undefined;

    if (_this.type.indexOf('.') !== -1) {
      var fields = _this.type.split('.', 3);

      _this.type = fields[0];
      _this.subtype = fields[1];
      _this.action = fields[2];
    }

    _this.sync = _this.options.sync;
    return _this;
  }

  var _proto = Span.prototype;

  _proto.end = function end(endTime, data) {
    _SpanBase.prototype.end.call(this, endTime);

    (0,_common_context__WEBPACK_IMPORTED_MODULE_0__.addSpanContext)(this, data);
  };

  return Span;
}(_span_base__WEBPACK_IMPORTED_MODULE_1__.default);

/* harmony default export */ __webpack_exports__["default"] = (Span);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/transaction-service.js":
/*!*************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/transaction-service.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_polyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _transaction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transaction */ "../rum-core/dist/es/performance-monitoring/transaction.js");
/* harmony import */ var _metrics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./metrics */ "../rum-core/dist/es/performance-monitoring/metrics.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _navigation_capture_navigation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./navigation/capture-navigation */ "../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/url */ "../rum-core/dist/es/common/url.js");










var TransactionService = function () {
  function TransactionService(logger, config) {
    var _this = this;

    this._config = config;
    this._logger = logger;
    this.currentTransaction = undefined;
    this.respIntervalId = undefined;
    this.recorder = new _metrics__WEBPACK_IMPORTED_MODULE_0__.PerfEntryRecorder(function (list) {
      var tr = _this.getCurrentTransaction();

      if (tr && tr.captureTimings) {
        var _tr$spans;

        var isHardNavigation = tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD;

        var _captureObserverEntri = (0,_metrics__WEBPACK_IMPORTED_MODULE_0__.captureObserverEntries)(list, {
          isHardNavigation: isHardNavigation,
          trStart: isHardNavigation ? 0 : tr._start
        }),
            spans = _captureObserverEntri.spans,
            marks = _captureObserverEntri.marks;

        (_tr$spans = tr.spans).push.apply(_tr$spans, spans);

        tr.addMarks({
          agent: marks
        });
      }
    });
  }

  var _proto = TransactionService.prototype;

  _proto.createCurrentTransaction = function createCurrentTransaction(name, type, options) {
    var tr = new _transaction__WEBPACK_IMPORTED_MODULE_2__.default(name, type, options);
    this.currentTransaction = tr;
    return tr;
  };

  _proto.getCurrentTransaction = function getCurrentTransaction() {
    if (this.currentTransaction && !this.currentTransaction.ended) {
      return this.currentTransaction;
    }
  };

  _proto.createOptions = function createOptions(options) {
    var config = this._config.config;
    var presetOptions = {
      transactionSampleRate: config.transactionSampleRate
    };
    var perfOptions = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)(presetOptions, options);

    if (perfOptions.managed) {
      perfOptions = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)({
        pageLoadTraceId: config.pageLoadTraceId,
        pageLoadSampled: config.pageLoadSampled,
        pageLoadSpanId: config.pageLoadSpanId,
        pageLoadTransactionName: config.pageLoadTransactionName
      }, perfOptions);
    }

    return perfOptions;
  };

  _proto.startManagedTransaction = function startManagedTransaction(name, type, perfOptions) {
    var tr = this.getCurrentTransaction();
    var isRedefined = false;

    if (!tr) {
      tr = this.createCurrentTransaction(name, type, perfOptions);
    } else if (tr.canReuse() && perfOptions.canReuse) {
      var redefineType = tr.type;
      var currentTypeOrder = _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_TYPE_ORDER.indexOf(tr.type);
      var redefineTypeOrder = _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_TYPE_ORDER.indexOf(type);

      if (currentTypeOrder >= 0 && redefineTypeOrder < currentTypeOrder) {
        redefineType = type;
      }

      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        this._logger.debug("redefining transaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")", 'to', "(" + (name || tr.name) + ", " + redefineType + ")", tr);
      }

      tr.redefine(name, redefineType, perfOptions);
      isRedefined = true;
    } else {
      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        this._logger.debug("ending previous transaction(" + tr.id + ", " + tr.name + ")", tr);
      }

      tr.end();
      tr = this.createCurrentTransaction(name, type, perfOptions);
    }

    if (tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
      if (!isRedefined) {
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LARGEST_CONTENTFUL_PAINT);
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.PAINT);
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT);
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT);
      }

      if (perfOptions.pageLoadTraceId) {
        tr.traceId = perfOptions.pageLoadTraceId;
      }

      if (perfOptions.pageLoadSampled) {
        tr.sampled = perfOptions.pageLoadSampled;
      }

      if (tr.name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN && perfOptions.pageLoadTransactionName) {
        tr.name = perfOptions.pageLoadTransactionName;
      }
    }

    if (!isRedefined && this._config.get('monitorLongtasks')) {
      this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK);
    }

    if (tr.sampled) {
      tr.captureTimings = true;
    }

    return tr;
  };

  _proto.startTransaction = function startTransaction(name, type, options) {
    var _this2 = this;

    var perfOptions = this.createOptions(options);
    var tr;
    var fireOnstartHook = true;

    if (perfOptions.managed) {
      var current = this.currentTransaction;
      tr = this.startManagedTransaction(name, type, perfOptions);

      if (current === tr) {
        fireOnstartHook = false;
      }
    } else {
      tr = new _transaction__WEBPACK_IMPORTED_MODULE_2__.default(name, type, perfOptions);
    }

    tr.onEnd = function () {
      return _this2.handleTransactionEnd(tr);
    };

    if (fireOnstartHook) {
      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        this._logger.debug("startTransaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")");
      }

      this._config.events.send(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_START, [tr]);
    }

    return tr;
  };

  _proto.handleTransactionEnd = function handleTransactionEnd(tr) {
    var _this3 = this;

    this.recorder.stop();
    var currentUrl = window.location.href;
    return _common_polyfills__WEBPACK_IMPORTED_MODULE_5__.Promise.resolve().then(function () {
      var name = tr.name,
          type = tr.type;
      var lastHiddenStart = _state__WEBPACK_IMPORTED_MODULE_4__.state.lastHiddenStart;

      if (lastHiddenStart >= tr._start) {
        if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
          _this3._logger.debug("transaction(" + tr.id + ", " + name + ", " + type + ") was discarded! The page was hidden during the transaction!");
        }

        return;
      }

      if (_this3.shouldIgnoreTransaction(name) || type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPORARY_TYPE) {
        if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
          _this3._logger.debug("transaction(" + tr.id + ", " + name + ", " + type + ") is ignored");
        }

        return;
      }

      if (type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
        var pageLoadTransactionName = _this3._config.get('pageLoadTransactionName');

        if (name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN && pageLoadTransactionName) {
          tr.name = pageLoadTransactionName;
        }

        if (tr.captureTimings) {
          var cls = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.cls,
              fid = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.fid,
              tbt = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.tbt,
              longtask = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.longtask;

          if (tbt.duration > 0) {
            tr.spans.push((0,_metrics__WEBPACK_IMPORTED_MODULE_0__.createTotalBlockingTimeSpan)(tbt));
          }

          tr.experience = {};

          if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.isPerfTypeSupported)(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK)) {
            tr.experience.tbt = tbt.duration;
          }

          if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.isPerfTypeSupported)(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT)) {
            tr.experience.cls = cls.score;
          }

          if (fid > 0) {
            tr.experience.fid = fid;
          }

          if (longtask.count > 0) {
            tr.experience.longtask = {
              count: longtask.count,
              sum: longtask.duration,
              max: longtask.max
            };
          }
        }

        _this3.setSession(tr);
      }

      if (tr.name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN) {
        tr.name = (0,_common_url__WEBPACK_IMPORTED_MODULE_6__.slugifyUrl)(currentUrl);
      }

      (0,_navigation_capture_navigation__WEBPACK_IMPORTED_MODULE_7__.captureNavigation)(tr);

      _this3.adjustTransactionTime(tr);

      var breakdownMetrics = _this3._config.get('breakdownMetrics');

      if (breakdownMetrics) {
        tr.captureBreakdown();
      }

      var configContext = _this3._config.get('context');

      (0,_common_context__WEBPACK_IMPORTED_MODULE_8__.addTransactionContext)(tr, configContext);

      _this3._config.events.send(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_END, [tr]);

      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        _this3._logger.debug("end transaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")", tr);
      }
    }, function (err) {
      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        _this3._logger.debug("error ending transaction(" + tr.id + ", " + tr.name + ")", err);
      }
    });
  };

  _proto.setSession = function setSession(tr) {
    var session = this._config.get('session');

    if (session) {
      if (typeof session == 'boolean') {
        tr.session = {
          id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(16),
          sequence: 1
        };
      } else {
        if (session.timestamp && Date.now() - session.timestamp > _common_constants__WEBPACK_IMPORTED_MODULE_1__.SESSION_TIMEOUT) {
          tr.session = {
            id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(16),
            sequence: 1
          };
        } else {
          tr.session = {
            id: session.id,
            sequence: session.sequence ? session.sequence + 1 : 1
          };
        }
      }

      var sessionConfig = {
        session: {
          id: tr.session.id,
          sequence: tr.session.sequence,
          timestamp: Date.now()
        }
      };

      this._config.setConfig(sessionConfig);

      this._config.setLocalConfig(sessionConfig, true);
    }
  };

  _proto.adjustTransactionTime = function adjustTransactionTime(transaction) {
    var spans = transaction.spans;
    var earliestSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getEarliestSpan)(spans);

    if (earliestSpan && earliestSpan._start < transaction._start) {
      transaction._start = earliestSpan._start;
    }

    var latestSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getLatestNonXHRSpan)(spans) || {};
    var latestSpanEnd = latestSpan._end || 0;

    if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
      var transactionEndWithoutDelay = transaction._end - _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD_DELAY;
      var lcp = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.lcp || 0;
      var latestXHRSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getLatestXHRSpan)(spans) || {};
      var latestXHRSpanEnd = latestXHRSpan._end || 0;
      transaction._end = Math.max(latestSpanEnd, latestXHRSpanEnd, lcp, transactionEndWithoutDelay);
    } else if (latestSpanEnd > transaction._end) {
      transaction._end = latestSpanEnd;
    }

    this.truncateSpans(spans, transaction._end);
  };

  _proto.truncateSpans = function truncateSpans(spans, transactionEnd) {
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];

      if (span._end > transactionEnd) {
        span._end = transactionEnd;
        span.type += _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRUNCATED_TYPE;
      }

      if (span._start > transactionEnd) {
        span._start = transactionEnd;
      }
    }
  };

  _proto.shouldIgnoreTransaction = function shouldIgnoreTransaction(transactionName) {
    var ignoreList = this._config.get('ignoreTransactions');

    if (ignoreList && ignoreList.length) {
      for (var i = 0; i < ignoreList.length; i++) {
        var element = ignoreList[i];

        if (typeof element.test === 'function') {
          if (element.test(transactionName)) {
            return true;
          }
        } else if (element === transactionName) {
          return true;
        }
      }
    }

    return false;
  };

  _proto.startSpan = function startSpan(name, type, options) {
    var tr = this.getCurrentTransaction();

    if (!tr) {
      tr = this.createCurrentTransaction(undefined, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPORARY_TYPE, this.createOptions({
        canReuse: true,
        managed: true
      }));
    }

    var span = tr.startSpan(name, type, options);

    if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
      this._logger.debug("startSpan(" + name + ", " + span.type + ")", "on transaction(" + tr.id + ", " + tr.name + ")");
    }

    return span;
  };

  _proto.endSpan = function endSpan(span, context) {
    if (!span) {
      return;
    }

    if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
      var tr = this.getCurrentTransaction();
      tr && this._logger.debug("endSpan(" + span.name + ", " + span.type + ")", "on transaction(" + tr.id + ", " + tr.name + ")");
    }

    span.end(null, context);
  };

  return TransactionService;
}();

/* harmony default export */ __webpack_exports__["default"] = (TransactionService);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/transaction.js":
/*!*****************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/transaction.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/performance-monitoring/span.js");
/* harmony import */ var _span_base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./span-base */ "../rum-core/dist/es/performance-monitoring/span-base.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _breakdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./breakdown */ "../rum-core/dist/es/performance-monitoring/breakdown.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}







var Transaction = function (_SpanBase) {
  _inheritsLoose(Transaction, _SpanBase);

  function Transaction(name, type, options) {
    var _this;

    _this = _SpanBase.call(this, name, type, options) || this;
    _this.traceId = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.generateRandomId)();
    _this.marks = undefined;
    _this.spans = [];
    _this._activeSpans = {};
    _this._activeTasks = new Set();
    _this.blocked = false;
    _this.captureTimings = false;
    _this.breakdownTimings = [];
    _this.sampleRate = _this.options.transactionSampleRate;
    _this.sampled = Math.random() <= _this.sampleRate;
    return _this;
  }

  var _proto = Transaction.prototype;

  _proto.addMarks = function addMarks(obj) {
    this.marks = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.merge)(this.marks || {}, obj);
  };

  _proto.mark = function mark(key) {
    var skey = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.removeInvalidChars)(key);

    var markTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)() - this._start;

    var custom = {};
    custom[skey] = markTime;
    this.addMarks({
      custom: custom
    });
  };

  _proto.canReuse = function canReuse() {
    var threshold = this.options.reuseThreshold || _common_constants__WEBPACK_IMPORTED_MODULE_1__.REUSABILITY_THRESHOLD;
    return !!this.options.canReuse && !this.ended && (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)() - this._start < threshold;
  };

  _proto.redefine = function redefine(name, type, options) {
    if (name) {
      this.name = name;
    }

    if (type) {
      this.type = type;
    }

    if (options) {
      this.options.reuseThreshold = options.reuseThreshold;
      (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.options, options);
    }
  };

  _proto.startSpan = function startSpan(name, type, options) {
    var _this2 = this;

    if (this.ended) {
      return;
    }

    var opts = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.extend)({}, options);

    opts.onEnd = function (trc) {
      _this2._onSpanEnd(trc);
    };

    opts.traceId = this.traceId;
    opts.sampled = this.sampled;
    opts.sampleRate = this.sampleRate;

    if (!opts.parentId) {
      opts.parentId = this.id;
    }

    var span = new _span__WEBPACK_IMPORTED_MODULE_2__.default(name, type, opts);
    this._activeSpans[span.id] = span;

    if (opts.blocking) {
      this.addTask(span.id);
    }

    return span;
  };

  _proto.isFinished = function isFinished() {
    return !this.blocked && this._activeTasks.size === 0;
  };

  _proto.detectFinish = function detectFinish() {
    if (this.isFinished()) this.end();
  };

  _proto.end = function end(endTime) {
    if (this.ended) {
      return;
    }

    this.ended = true;
    this._end = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.getTime)(endTime);

    for (var sid in this._activeSpans) {
      var span = this._activeSpans[sid];
      span.type = span.type + _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRUNCATED_TYPE;
      span.end(endTime);
    }

    this.callOnEnd();
  };

  _proto.captureBreakdown = function captureBreakdown() {
    this.breakdownTimings = (0,_breakdown__WEBPACK_IMPORTED_MODULE_3__.captureBreakdown)(this);
  };

  _proto.block = function block(flag) {
    this.blocked = flag;

    if (!this.blocked) {
      this.detectFinish();
    }
  };

  _proto.addTask = function addTask(taskId) {
    if (!taskId) {
      taskId = 'task-' + (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.generateRandomId)(16);
    }

    this._activeTasks.add(taskId);

    return taskId;
  };

  _proto.removeTask = function removeTask(taskId) {
    var deleted = this._activeTasks.delete(taskId);

    deleted && this.detectFinish();
  };

  _proto.resetFields = function resetFields() {
    this.spans = [];
    this.sampleRate = 0;
  };

  _proto._onSpanEnd = function _onSpanEnd(span) {
    this.spans.push(span);
    delete this._activeSpans[span.id];
    this.removeTask(span.id);
  };

  _proto.isManaged = function isManaged() {
    return !!this.options.managed;
  };

  return Transaction;
}(_span_base__WEBPACK_IMPORTED_MODULE_4__.default);

/* harmony default export */ __webpack_exports__["default"] = (Transaction);

/***/ }),

/***/ "../rum-core/dist/es/state.js":
/*!************************************!*\
  !*** ../rum-core/dist/es/state.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__DEV__": function() { return /* binding */ __DEV__; },
/* harmony export */   "state": function() { return /* binding */ state; }
/* harmony export */ });
var __DEV__ = "development" !== 'production';

var state = {
  bootstrapTime: null,
  lastHiddenStart: Number.MIN_SAFE_INTEGER
};


/***/ }),

/***/ "./src/apm-base.js":
/*!*************************!*\
  !*** ./src/apm-base.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ApmBase; }
/* harmony export */ });
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/instrument.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/observers/page-visibility.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/observers/page-clicks.js");


var ApmBase = function () {
  function ApmBase(serviceFactory, disable) {
    this._disable = disable;
    this.serviceFactory = serviceFactory;
    this._initialized = false;
  }

  var _proto = ApmBase.prototype;

  _proto.isEnabled = function isEnabled() {
    return !this._disable;
  };

  _proto.isActive = function isActive() {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    return this.isEnabled() && this._initialized && configService.get('active');
  };

  _proto.init = function init(config) {
    var _this = this;

    if (this.isEnabled() && !this._initialized) {
      this._initialized = true;

      var _this$serviceFactory$ = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE]),
          configService = _this$serviceFactory$[0],
          loggingService = _this$serviceFactory$[1],
          transactionService = _this$serviceFactory$[2];

      configService.setVersion('5.14.0');
      this.config(config);
      var logLevel = configService.get('logLevel');
      loggingService.setLevel(logLevel);
      var isConfigActive = configService.get('active');

      if (isConfigActive) {
        this.serviceFactory.init();
        var flags = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.getInstrumentationFlags)(configService.get('instrument'), configService.get('disableInstrumentations'));
        var performanceMonitoring = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PERFORMANCE_MONITORING);
        performanceMonitoring.init(flags);

        if (flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR]) {
          var errorLogging = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
          errorLogging.registerListeners();
        }

        if (configService.get('session')) {
          var localConfig = configService.getLocalConfig();

          if (localConfig && localConfig.session) {
            configService.setConfig({
              session: localConfig.session
            });
          }
        }

        var sendPageLoad = function sendPageLoad() {
          return flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD] && _this._sendPageLoadMetrics();
        };

        if (configService.get('centralConfig')) {
          this.fetchCentralConfig().then(sendPageLoad);
        } else {
          sendPageLoad();
        }

        (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__.observePageVisibility)(configService, transactionService);

        if (flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.EVENT_TARGET] && flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CLICK]) {
          (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__.observePageClicks)(transactionService);
        }
      } else {
        this._disable = true;
        loggingService.warn('RUM agent is inactive');
      }
    }

    return this;
  };

  _proto.fetchCentralConfig = function fetchCentralConfig() {
    var _this$serviceFactory$2 = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE]),
        apmServer = _this$serviceFactory$2[0],
        loggingService = _this$serviceFactory$2[1],
        configService = _this$serviceFactory$2[2];

    return apmServer.fetchConfig(configService.get('serviceName'), configService.get('environment')).then(function (config) {
      var transactionSampleRate = config['transaction_sample_rate'];

      if (transactionSampleRate) {
        transactionSampleRate = Number(transactionSampleRate);
        var _config2 = {
          transactionSampleRate: transactionSampleRate
        };

        var _configService$valida = configService.validate(_config2),
            invalid = _configService$valida.invalid;

        if (invalid.length === 0) {
          configService.setConfig(_config2);
        } else {
          var _invalid$ = invalid[0],
              key = _invalid$.key,
              value = _invalid$.value,
              allowed = _invalid$.allowed;
          loggingService.warn("invalid value \"" + value + "\" for " + key + ". Allowed: " + allowed + ".");
        }
      }

      return config;
    }).catch(function (error) {
      loggingService.warn('failed fetching config:', error);
    });
  };

  _proto._sendPageLoadMetrics = function _sendPageLoadMetrics() {
    var tr = this.startTransaction(undefined, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD, {
      managed: true,
      canReuse: true
    });

    if (!tr) {
      return;
    }

    tr.addTask(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD);

    var sendPageLoadMetrics = function sendPageLoadMetrics() {
      setTimeout(function () {
        return tr.removeTask(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD);
      }, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD_DELAY);
    };

    if (document.readyState === 'complete') {
      sendPageLoadMetrics();
    } else {
      window.addEventListener('load', sendPageLoadMetrics);
    }
  };

  _proto.observe = function observe(name, fn) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.events.observe(name, fn);
  };

  _proto.config = function config(_config) {
    var _this$serviceFactory$3 = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE]),
        configService = _this$serviceFactory$3[0],
        loggingService = _this$serviceFactory$3[1];

    var _configService$valida2 = configService.validate(_config),
        missing = _configService$valida2.missing,
        invalid = _configService$valida2.invalid,
        unknown = _configService$valida2.unknown;

    if (unknown.length > 0) {
      var message = 'Unknown config options are specified for RUM agent: ' + unknown.join(', ');
      loggingService.warn(message);
    }

    if (missing.length === 0 && invalid.length === 0) {
      configService.setConfig(_config);
    } else {
      var separator = ', ';
      var _message = "RUM agent isn't correctly configured. ";

      if (missing.length > 0) {
        _message += missing.join(separator) + ' is missing';

        if (invalid.length > 0) {
          _message += separator;
        }
      }

      invalid.forEach(function (_ref, index) {
        var key = _ref.key,
            value = _ref.value,
            allowed = _ref.allowed;
        _message += key + " \"" + value + "\" contains invalid characters! (allowed: " + allowed + ")" + (index !== invalid.length - 1 ? separator : '');
      });
      loggingService.error(_message);
      configService.setConfig({
        active: false
      });
    }
  };

  _proto.setUserContext = function setUserContext(userContext) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.setUserContext(userContext);
  };

  _proto.setCustomContext = function setCustomContext(customContext) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.setCustomContext(customContext);
  };

  _proto.addLabels = function addLabels(labels) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.addLabels(labels);
  };

  _proto.setInitialPageLoadName = function setInitialPageLoadName(name) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.setConfig({
      pageLoadTransactionName: name
    });
  };

  _proto.startTransaction = function startTransaction(name, type, options) {
    if (this.isEnabled()) {
      var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
      return transactionService.startTransaction(name, type, options);
    }
  };

  _proto.startSpan = function startSpan(name, type, options) {
    if (this.isEnabled()) {
      var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
      return transactionService.startSpan(name, type, options);
    }
  };

  _proto.getCurrentTransaction = function getCurrentTransaction() {
    if (this.isEnabled()) {
      var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
      return transactionService.getCurrentTransaction();
    }
  };

  _proto.captureError = function captureError(error) {
    if (this.isEnabled()) {
      var errorLogging = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
      return errorLogging.logError(error);
    }
  };

  _proto.addFilter = function addFilter(fn) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.addFilter(fn);
  };

  return ApmBase;
}();



/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "init": function() { return /* binding */ init; },
/* harmony export */   "apmBase": function() { return /* binding */ apmBase; },
/* harmony export */   "ApmBase": function() { return /* reexport safe */ _apm_base__WEBPACK_IMPORTED_MODULE_0__.default; },
/* harmony export */   "apm": function() { return /* binding */ apmBase; }
/* harmony export */ });
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/bootstrap.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/index.js");
/* harmony import */ var _apm_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apm-base */ "./src/apm-base.js");



function getApmBase() {
  if (_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.isBrowser && window.elasticApm) {
    return window.elasticApm;
  }

  var enabled = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__.bootstrap)();
  var serviceFactory = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__.createServiceFactory)();
  var apmBase = new _apm_base__WEBPACK_IMPORTED_MODULE_0__.default(serviceFactory, !enabled);

  if (_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
    window.elasticApm = apmBase;
  }

  return apmBase;
}

var apmBase = getApmBase();
var init = apmBase.init.bind(apmBase);
/* harmony default export */ __webpack_exports__["default"] = (init);


/***/ }),

/***/ "../../node_modules/error-stack-parser/error-stack-parser.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/error-stack-parser/error-stack-parser.js ***!
  \*******************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! stackframe */ "../../node_modules/stackframe/stackframe.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

    function _map(array, fn, thisArg) {
        if (typeof Array.prototype.map === 'function') {
            return array.map(fn, thisArg);
        } else {
            var output = new Array(array.length);
            for (var i = 0; i < array.length; i++) {
                output[i] = fn.call(thisArg, array[i]);
            }
            return output;
        }
    }

    function _filter(array, fn, thisArg) {
        if (typeof Array.prototype.filter === 'function') {
            return array.filter(fn, thisArg);
        } else {
            var output = [];
            for (var i = 0; i < array.length; i++) {
                if (fn.call(thisArg, array[i])) {
                    output.push(array[i]);
                }
            }
            return output;
        }
    }

    function _indexOf(array, target) {
        if (typeof Array.prototype.indexOf === 'function') {
            return array.indexOf(target);
        } else {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === target) {
                    return i;
                }
            }
            return -1;
        }
    }

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return _map(filtered, function(line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
                }
                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
                var locationParts = this.extractLocation(tokens.pop());
                var functionName = tokens.join(' ') || undefined;
                var fileName = _indexOf(['eval', '<anonymous>'], locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame(functionName, undefined, fileName, locationParts[1], locationParts[2], line);
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return _map(filtered, function(line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame(line);
                } else {
                    var tokens = line.split('@');
                    var locationParts = this.extractLocation(tokens.pop());
                    var functionName = tokens.join('@') || undefined;
                    return new StackFrame(functionName,
                        undefined,
                        locationParts[0],
                        locationParts[1],
                        locationParts[2],
                        line);
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame(undefined, undefined, match[2], match[1], undefined, lines[i]));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(
                        new StackFrame(
                            match[3] || undefined,
                            undefined,
                            match[2],
                            match[1],
                            undefined,
                            lines[i]
                        )
                    );
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return _map(filtered, function(line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                        .replace(/<anonymous function(: (\w+))?>/, '$2')
                        .replace(/\([^\)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^\)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                    undefined : argsRaw.split(',');
                return new StackFrame(
                    functionName,
                    args,
                    locationParts[0],
                    locationParts[1],
                    locationParts[2],
                    line);
            }, this);
        }
    };
}));



/***/ }),

/***/ "../../node_modules/opentracing/lib/constants.js":
/*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/constants.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The FORMAT_BINARY format represents SpanContexts in an opaque binary
 * carrier.
 *
 * Tracer.inject() will set the buffer field to an Array-like (Array,
 * ArrayBuffer, or TypedBuffer) object containing the injected binary data.
 * Any valid Object can be used as long as the buffer field of the object
 * can be set.
 *
 * Tracer.extract() will look for `carrier.buffer`, and that field is
 * expected to be an Array-like object (Array, ArrayBuffer, or
 * TypedBuffer).
 */
exports.FORMAT_BINARY = 'binary';
/**
 * The FORMAT_TEXT_MAP format represents SpanContexts using a
 * string->string map (backed by a Javascript Object) as a carrier.
 *
 * NOTE: Unlike FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP places no restrictions
 * on the characters used in either the keys or the values of the map
 * entries.
 *
 * The FORMAT_TEXT_MAP carrier map may contain unrelated data (e.g.,
 * arbitrary gRPC metadata); as such, the Tracer implementation should use
 * a prefix or other convention to distinguish Tracer-specific key:value
 * pairs.
 */
exports.FORMAT_TEXT_MAP = 'text_map';
/**
 * The FORMAT_HTTP_HEADERS format represents SpanContexts using a
 * character-restricted string->string map (backed by a Javascript Object)
 * as a carrier.
 *
 * Keys and values in the FORMAT_HTTP_HEADERS carrier must be suitable for
 * use as HTTP headers (without modification or further escaping). That is,
 * the keys have a greatly restricted character set, casing for the keys
 * may not be preserved by various intermediaries, and the values should be
 * URL-escaped.
 *
 * The FORMAT_HTTP_HEADERS carrier map may contain unrelated data (e.g.,
 * arbitrary HTTP headers); as such, the Tracer implementation should use a
 * prefix or other convention to distinguish Tracer-specific key:value
 * pairs.
 */
exports.FORMAT_HTTP_HEADERS = 'http_headers';
/**
 * A Span may be the "child of" a parent Span. In a “child of” reference,
 * the parent Span depends on the child Span in some capacity.
 *
 * See more about reference types at https://github.com/opentracing/specification
 */
exports.REFERENCE_CHILD_OF = 'child_of';
/**
 * Some parent Spans do not depend in any way on the result of their child
 * Spans. In these cases, we say merely that the child Span “follows from”
 * the parent Span in a causal sense.
 *
 * See more about reference types at https://github.com/opentracing/specification
 */
exports.REFERENCE_FOLLOWS_FROM = 'follows_from';
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/functions.js":
/*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/functions.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Constants = __webpack_require__(/*! ./constants */ "../../node_modules/opentracing/lib/constants.js");
var reference_1 = __webpack_require__(/*! ./reference */ "../../node_modules/opentracing/lib/reference.js");
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
/**
 * Return a new REFERENCE_CHILD_OF reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
 */
function childOf(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof span_1.default) {
        spanContext = spanContext.context();
    }
    return new reference_1.default(Constants.REFERENCE_CHILD_OF, spanContext);
}
exports.childOf = childOf;
/**
 * Return a new REFERENCE_FOLLOWS_FROM reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
 */
function followsFrom(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof span_1.default) {
        spanContext = spanContext.context();
    }
    return new reference_1.default(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
}
exports.followsFrom = followsFrom;
//# sourceMappingURL=functions.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/noop.js":
/*!**************************************************!*\
  !*** ../../node_modules/opentracing/lib/noop.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
var span_context_1 = __webpack_require__(/*! ./span_context */ "../../node_modules/opentracing/lib/span_context.js");
var tracer_1 = __webpack_require__(/*! ./tracer */ "../../node_modules/opentracing/lib/tracer.js");
exports.tracer = null;
exports.spanContext = null;
exports.span = null;
// Deferred initialization to avoid a dependency cycle where Tracer depends on
// Span which depends on the noop tracer.
function initialize() {
    exports.tracer = new tracer_1.default();
    exports.span = new span_1.default();
    exports.spanContext = new span_context_1.default();
}
exports.initialize = initialize;
//# sourceMappingURL=noop.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/reference.js":
/*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/reference.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
/**
 * Reference pairs a reference type constant (e.g., REFERENCE_CHILD_OF or
 * REFERENCE_FOLLOWS_FROM) with the SpanContext it points to.
 *
 * See the exported childOf() and followsFrom() functions at the package level.
 */
var Reference = /** @class */ (function () {
    /**
     * Initialize a new Reference instance.
     *
     * @param {string} type - the Reference type constant (e.g.,
     *        REFERENCE_CHILD_OF or REFERENCE_FOLLOWS_FROM).
     * @param {SpanContext} referencedContext - the SpanContext being referred
     *        to. As a convenience, a Span instance may be passed in instead
     *        (in which case its .context() is used here).
     */
    function Reference(type, referencedContext) {
        this._type = type;
        this._referencedContext = (referencedContext instanceof span_1.default ?
            referencedContext.context() :
            referencedContext);
    }
    /**
     * @return {string} The Reference type (e.g., REFERENCE_CHILD_OF or
     *         REFERENCE_FOLLOWS_FROM).
     */
    Reference.prototype.type = function () {
        return this._type;
    };
    /**
     * @return {SpanContext} The SpanContext being referred to (e.g., the
     *         parent in a REFERENCE_CHILD_OF Reference).
     */
    Reference.prototype.referencedContext = function () {
        return this._referencedContext;
    };
    return Reference;
}());
exports.default = Reference;
//# sourceMappingURL=reference.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/span.js":
/*!**************************************************!*\
  !*** ../../node_modules/opentracing/lib/span.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var noop = __webpack_require__(/*! ./noop */ "../../node_modules/opentracing/lib/noop.js");
/**
 * Span represents a logical unit of work as part of a broader Trace. Examples
 * of span might include remote procedure calls or a in-process function calls
 * to sub-components. A Trace has a single, top-level "root" Span that in turn
 * may have zero or more child Spans, which in turn may have children.
 */
var Span = /** @class */ (function () {
    function Span() {
    }
    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //
    /**
     * Returns the SpanContext object associated with this Span.
     *
     * @return {SpanContext}
     */
    Span.prototype.context = function () {
        return this._context();
    };
    /**
     * Returns the Tracer object used to create this Span.
     *
     * @return {Tracer}
     */
    Span.prototype.tracer = function () {
        return this._tracer();
    };
    /**
     * Sets the string name for the logical operation this span represents.
     *
     * @param {string} name
     */
    Span.prototype.setOperationName = function (name) {
        this._setOperationName(name);
        return this;
    };
    /**
     * Sets a key:value pair on this Span that also propagates to future
     * children of the associated Span.
     *
     * setBaggageItem() enables powerful functionality given a full-stack
     * opentracing integration (e.g., arbitrary application data from a web
     * client can make it, transparently, all the way into the depths of a
     * storage system), and with it some powerful costs: use this feature with
     * care.
     *
     * IMPORTANT NOTE #1: setBaggageItem() will only propagate baggage items to
     * *future* causal descendants of the associated Span.
     *
     * IMPORTANT NOTE #2: Use this thoughtfully and with care. Every key and
     * value is copied into every local *and remote* child of the associated
     * Span, and that can add up to a lot of network and cpu overhead.
     *
     * @param {string} key
     * @param {string} value
     */
    Span.prototype.setBaggageItem = function (key, value) {
        this._setBaggageItem(key, value);
        return this;
    };
    /**
     * Returns the value for a baggage item given its key.
     *
     * @param  {string} key
     *         The key for the given trace attribute.
     * @return {string}
     *         String value for the given key, or undefined if the key does not
     *         correspond to a set trace attribute.
     */
    Span.prototype.getBaggageItem = function (key) {
        return this._getBaggageItem(key);
    };
    /**
     * Adds a single tag to the span.  See `addTags()` for details.
     *
     * @param {string} key
     * @param {any} value
     */
    Span.prototype.setTag = function (key, value) {
        // NOTE: the call is normalized to a call to _addTags()
        this._addTags((_a = {}, _a[key] = value, _a));
        return this;
        var _a;
    };
    /**
     * Adds the given key value pairs to the set of span tags.
     *
     * Multiple calls to addTags() results in the tags being the superset of
     * all calls.
     *
     * The behavior of setting the same key multiple times on the same span
     * is undefined.
     *
     * The supported type of the values is implementation-dependent.
     * Implementations are expected to safely handle all types of values but
     * may choose to ignore unrecognized / unhandle-able values (e.g. objects
     * with cyclic references, function objects).
     *
     * @return {[type]} [description]
     */
    Span.prototype.addTags = function (keyValueMap) {
        this._addTags(keyValueMap);
        return this;
    };
    /**
     * Add a log record to this Span, optionally at a user-provided timestamp.
     *
     * For example:
     *
     *     span.log({
     *         size: rpc.size(),  // numeric value
     *         URI: rpc.URI(),  // string value
     *         payload: rpc.payload(),  // Object value
     *         "keys can be arbitrary strings": rpc.foo(),
     *     });
     *
     *     span.log({
     *         "error.description": someError.description(),
     *     }, someError.timestampMillis());
     *
     * @param {object} keyValuePairs
     *        An object mapping string keys to arbitrary value types. All
     *        Tracer implementations should support bool, string, and numeric
     *        value types, and some may also support Object values.
     * @param {number} timestamp
     *        An optional parameter specifying the timestamp in milliseconds
     *        since the Unix epoch. Fractional values are allowed so that
     *        timestamps with sub-millisecond accuracy can be represented. If
     *        not specified, the implementation is expected to use its notion
     *        of the current time of the call.
     */
    Span.prototype.log = function (keyValuePairs, timestamp) {
        this._log(keyValuePairs, timestamp);
        return this;
    };
    /**
     * DEPRECATED
     */
    Span.prototype.logEvent = function (eventName, payload) {
        return this._log({ event: eventName, payload: payload });
    };
    /**
     * Sets the end timestamp and finalizes Span state.
     *
     * With the exception of calls to Span.context() (which are always allowed),
     * finish() must be the last call made to any span instance, and to do
     * otherwise leads to undefined behavior.
     *
     * @param  {number} finishTime
     *         Optional finish time in milliseconds as a Unix timestamp. Decimal
     *         values are supported for timestamps with sub-millisecond accuracy.
     *         If not specified, the current time (as defined by the
     *         implementation) will be used.
     */
    Span.prototype.finish = function (finishTime) {
        this._finish(finishTime);
        // Do not return `this`. The Span generally should not be used after it
        // is finished so chaining is not desired in this context.
    };
    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //
    // By default returns a no-op SpanContext.
    Span.prototype._context = function () {
        return noop.spanContext;
    };
    // By default returns a no-op tracer.
    //
    // The base class could store the tracer that created it, but it does not
    // in order to ensure the no-op span implementation has zero members,
    // which allows V8 to aggressively optimize calls to such objects.
    Span.prototype._tracer = function () {
        return noop.tracer;
    };
    // By default does nothing
    Span.prototype._setOperationName = function (name) {
    };
    // By default does nothing
    Span.prototype._setBaggageItem = function (key, value) {
    };
    // By default does nothing
    Span.prototype._getBaggageItem = function (key) {
        return undefined;
    };
    // By default does nothing
    //
    // NOTE: both setTag() and addTags() map to this function. keyValuePairs
    // will always be an associative array.
    Span.prototype._addTags = function (keyValuePairs) {
    };
    // By default does nothing
    Span.prototype._log = function (keyValuePairs, timestamp) {
    };
    // By default does nothing
    //
    // finishTime is expected to be either a number or undefined.
    Span.prototype._finish = function (finishTime) {
    };
    return Span;
}());
exports.Span = Span;
exports.default = Span;
//# sourceMappingURL=span.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/span_context.js":
/*!**********************************************************!*\
  !*** ../../node_modules/opentracing/lib/span_context.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * SpanContext represents Span state that must propagate to descendant Spans
 * and across process boundaries.
 *
 * SpanContext is logically divided into two pieces: the user-level "Baggage"
 * (see setBaggageItem and getBaggageItem) that propagates across Span
 * boundaries and any Tracer-implementation-specific fields that are needed to
 * identify or otherwise contextualize the associated Span instance (e.g., a
 * <trace_id, span_id, sampled> tuple).
 */
var SpanContext = /** @class */ (function () {
    function SpanContext() {
    }
    return SpanContext;
}());
exports.SpanContext = SpanContext;
exports.default = SpanContext;
//# sourceMappingURL=span_context.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/tracer.js":
/*!****************************************************!*\
  !*** ../../node_modules/opentracing/lib/tracer.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Functions = __webpack_require__(/*! ./functions */ "../../node_modules/opentracing/lib/functions.js");
var Noop = __webpack_require__(/*! ./noop */ "../../node_modules/opentracing/lib/noop.js");
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
/**
 * Tracer is the entry-point between the instrumentation API and the tracing
 * implementation.
 *
 * The default object acts as a no-op implementation.
 *
 * Note to implementators: derived classes can choose to directly implement the
 * methods in the "OpenTracing API methods" section, or optionally the subset of
 * underscore-prefixed methods to pick up the argument checking and handling
 * automatically from the base class.
 */
var Tracer = /** @class */ (function () {
    function Tracer() {
    }
    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //
    /**
     * Starts and returns a new Span representing a logical unit of work.
     *
     * For example:
     *
     *     // Start a new (parentless) root Span:
     *     var parent = Tracer.startSpan('DoWork');
     *
     *     // Start a new (child) Span:
     *     var child = Tracer.startSpan('load-from-db', {
     *         childOf: parent.context(),
     *     });
     *
     *     // Start a new async (FollowsFrom) Span:
     *     var child = Tracer.startSpan('async-cache-write', {
     *         references: [
     *             opentracing.followsFrom(parent.context())
     *         ],
     *     });
     *
     * @param {string} name - the name of the operation (REQUIRED).
     * @param {SpanOptions} [options] - options for the newly created span.
     * @return {Span} - a new Span object.
     */
    Tracer.prototype.startSpan = function (name, options) {
        if (options === void 0) { options = {}; }
        // Convert options.childOf to fields.references as needed.
        if (options.childOf) {
            // Convert from a Span or a SpanContext into a Reference.
            var childOf = Functions.childOf(options.childOf);
            if (options.references) {
                options.references.push(childOf);
            }
            else {
                options.references = [childOf];
            }
            delete (options.childOf);
        }
        return this._startSpan(name, options);
    };
    /**
     * Injects the given SpanContext instance for cross-process propagation
     * within `carrier`. The expected type of `carrier` depends on the value of
     * `format.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     var clientSpan = ...;
     *     ...
     *     // Inject clientSpan into a text carrier.
     *     var headersCarrier = {};
     *     Tracer.inject(clientSpan.context(), Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     // Incorporate the textCarrier into the outbound HTTP request header
     *     // map.
     *     Object.assign(outboundHTTPReq.headers, headersCarrier);
     *     // ... send the httpReq
     *
     * @param  {SpanContext} spanContext - the SpanContext to inject into the
     *         carrier object. As a convenience, a Span instance may be passed
     *         in instead (in which case its .context() is used for the
     *         inject()).
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - see the documentation for the chosen `format`
     *         for a description of the carrier object.
     */
    Tracer.prototype.inject = function (spanContext, format, carrier) {
        // Allow the user to pass a Span instead of a SpanContext
        if (spanContext instanceof span_1.default) {
            spanContext = spanContext.context();
        }
        return this._inject(spanContext, format, carrier);
    };
    /**
     * Returns a SpanContext instance extracted from `carrier` in the given
     * `format`.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     // Use the inbound HTTP request's headers as a text map carrier.
     *     var headersCarrier = inboundHTTPReq.headers;
     *     var wireCtx = Tracer.extract(Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     var serverSpan = Tracer.startSpan('...', { childOf : wireCtx });
     *
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - the type of the carrier object is determined by
     *         the format.
     * @return {SpanContext}
     *         The extracted SpanContext, or null if no such SpanContext could
     *         be found in `carrier`
     */
    Tracer.prototype.extract = function (format, carrier) {
        return this._extract(format, carrier);
    };
    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //
    // NOTE: the input to this method is *always* an associative array. The
    // public-facing startSpan() method normalizes the arguments so that
    // all N implementations do not need to worry about variations in the call
    // signature.
    //
    // The default behavior returns a no-op span.
    Tracer.prototype._startSpan = function (name, fields) {
        return Noop.span;
    };
    // The default behavior is a no-op.
    Tracer.prototype._inject = function (spanContext, format, carrier) {
    };
    // The default behavior is to return a no-op SpanContext.
    Tracer.prototype._extract = function (format, carrier) {
        return Noop.spanContext;
    };
    return Tracer;
}());
exports.Tracer = Tracer;
exports.default = Tracer;
//# sourceMappingURL=tracer.js.map

/***/ }),

/***/ "../../node_modules/promise-polyfill/src/finally.js":
/*!**********************************************************!*\
  !*** ../../node_modules/promise-polyfill/src/finally.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        // @ts-ignore
        return constructor.reject(reason);
      });
    }
  );
}

/* harmony default export */ __webpack_exports__["default"] = (finallyConstructor);


/***/ }),

/***/ "../../node_modules/promise-polyfill/src/index.js":
/*!********************************************************!*\
  !*** ../../node_modules/promise-polyfill/src/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _finally__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./finally */ "../../node_modules/promise-polyfill/src/finally.js");


// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = _finally__WEBPACK_IMPORTED_MODULE_0__.default;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
      // @ts-ignore
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Promise);


/***/ }),

/***/ "../../node_modules/stackframe/stackframe.js":
/*!***************************************************!*\
  !*** ../../node_modules/stackframe/stackframe.js ***!
  \***************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function () {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function StackFrame(functionName, args, fileName, lineNumber, columnNumber, source) {
        if (functionName !== undefined) {
            this.setFunctionName(functionName);
        }
        if (args !== undefined) {
            this.setArgs(args);
        }
        if (fileName !== undefined) {
            this.setFileName(fileName);
        }
        if (lineNumber !== undefined) {
            this.setLineNumber(lineNumber);
        }
        if (columnNumber !== undefined) {
            this.setColumnNumber(columnNumber);
        }
        if (source !== undefined) {
            this.setSource(source);
        }
    }

    StackFrame.prototype = {
        getFunctionName: function () {
            return this.functionName;
        },
        setFunctionName: function (v) {
            this.functionName = String(v);
        },

        getArgs: function () {
            return this.args;
        },
        setArgs: function (v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        // NOTE: Property name may be misleading as it includes the path,
        // but it somewhat mirrors V8's JavaScriptStackTraceApi
        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
        getFileName: function () {
            return this.fileName;
        },
        setFileName: function (v) {
            this.fileName = String(v);
        },

        getLineNumber: function () {
            return this.lineNumber;
        },
        setLineNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Line Number must be a Number');
            }
            this.lineNumber = Number(v);
        },

        getColumnNumber: function () {
            return this.columnNumber;
        },
        setColumnNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Column Number must be a Number');
            }
            this.columnNumber = Number(v);
        },

        getSource: function () {
            return this.source;
        },
        setSource: function (v) {
            this.source = String(v);
        },

        toString: function() {
            var functionName = this.getFunctionName() || '{anonymous}';
            var args = '(' + (this.getArgs() || []).join(',') + ')';
            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
            return functionName + args + fileName + lineNumber + columnNumber;
        }
    };

    return StackFrame;
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!****************************!*\
  !*** ./src/opentracing.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTracer": function() { return /* binding */ createTracer; },
/* harmony export */   "init": function() { return /* reexport safe */ _index__WEBPACK_IMPORTED_MODULE_0__.init; },
/* harmony export */   "apm": function() { return /* reexport safe */ _index__WEBPACK_IMPORTED_MODULE_0__.apm; },
/* harmony export */   "apmBase": function() { return /* reexport safe */ _index__WEBPACK_IMPORTED_MODULE_0__.apmBase; },
/* harmony export */   "ApmBase": function() { return /* reexport safe */ _index__WEBPACK_IMPORTED_MODULE_0__.ApmBase; }
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/index.js");
/* harmony import */ var opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! opentracing/lib/tracer */ "../../node_modules/opentracing/lib/tracer.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/opentracing/index.js");




function createTracer(apmBase) {
  if (apmBase._disable) {
    return new opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_1__.Tracer();
  }

  return (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__.createTracer)(apmBase.serviceFactory);
}

if (typeof window !== 'undefined' && window.elasticApm) {
  window.elasticApm.createTracer = createTracer.bind(window.elasticApm, window.elasticApm);
}

/* harmony default export */ __webpack_exports__["default"] = (createTracer);

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpYy1hcG0tb3BlbnRyYWNpbmcudW1kLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9ib290c3RyYXAuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2FmdGVyLWZyYW1lLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9hcG0tc2VydmVyLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9jb21wcmVzcy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vY29uZmlnLXNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vY29udGV4dC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vZXZlbnQtaGFuZGxlci5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vaHR0cC9mZXRjaC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vaHR0cC9yZXNwb25zZS1zdGF0dXMuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2h0dHAveGhyLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9pbnN0cnVtZW50LmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9sb2dnaW5nLXNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL25kanNvbi5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vb2JzZXJ2ZXJzL3BhZ2UtY2xpY2tzLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9vYnNlcnZlcnMvcGFnZS12aXNpYmlsaXR5LmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9wYXRjaGluZy9mZXRjaC1wYXRjaC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vcGF0Y2hpbmcvaGlzdG9yeS1wYXRjaC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vcGF0Y2hpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3BhdGNoaW5nL3BhdGNoLXV0aWxzLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9wYXRjaGluZy94aHItcGF0Y2guanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3BvbHlmaWxscy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vcXVldWUuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3NlcnZpY2UtZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3RydW5jYXRlLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi91cmwuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3V0aWxzLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2Vycm9yLWxvZ2dpbmcvZXJyb3ItbG9nZ2luZy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9lcnJvci1sb2dnaW5nL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2Vycm9yLWxvZ2dpbmcvc3RhY2stdHJhY2UuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvb3BlbnRyYWNpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvb3BlbnRyYWNpbmcvc3Bhbi5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9vcGVudHJhY2luZy90cmFjZXIuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9icmVha2Rvd24uanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9pbmRleC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL21ldHJpY3MuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL2NhcHR1cmUtbmF2aWdhdGlvbi5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL25hdmlnYXRpb24vbWFya3MuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL25hdmlnYXRpb24tdGltaW5nLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbmF2aWdhdGlvbi9yZXNvdXJjZS10aW1pbmcuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL3VzZXItdGltaW5nLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbmF2aWdhdGlvbi91dGlscy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9zcGFuLWJhc2UuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9zcGFuLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvdHJhbnNhY3Rpb24tc2VydmljZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL3RyYW5zYWN0aW9uLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3N0YXRlLmpzIiwid2VicGFjazovL1tuYW1lXS8uL3NyYy9hcG0tYmFzZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uLy4uL25vZGVfbW9kdWxlcy9lcnJvci1zdGFjay1wYXJzZXIvZXJyb3Itc3RhY2stcGFyc2VyLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi8uLi9ub2RlX21vZHVsZXMvb3BlbnRyYWNpbmcvbGliL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvbm9vcC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9yZWZlcmVuY2UuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvc3Bhbi5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9zcGFuX2NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvdHJhY2VyLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi8uLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvZmluYWxseS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uLi8uLi9ub2RlX21vZHVsZXMvc3RhY2tmcmFtZS9zdGFja2ZyYW1lLmpzIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9bbmFtZV0vLi9zcmMvb3BlbnRyYWNpbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZWxhc3RpYy1hcG0tb3BlbnRyYWNpbmdcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiZWxhc3RpYy1hcG0tb3BlbnRyYWNpbmdcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCJpbXBvcnQgeyBpc1BsYXRmb3JtU3VwcG9ydGVkLCBpc0Jyb3dzZXIsIG5vdyB9IGZyb20gJy4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IHBhdGNoQWxsIH0gZnJvbSAnLi9jb21tb24vcGF0Y2hpbmcnO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tICcuL3N0YXRlJztcbnZhciBlbmFibGVkID0gZmFsc2U7XG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwKCkge1xuICBpZiAoaXNQbGF0Zm9ybVN1cHBvcnRlZCgpKSB7XG4gICAgcGF0Y2hBbGwoKTtcbiAgICBzdGF0ZS5ib290c3RyYXBUaW1lID0gbm93KCk7XG4gICAgZW5hYmxlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoaXNCcm93c2VyKSB7XG4gICAgY29uc29sZS5sb2coJ1tFbGFzdGljIEFQTV0gcGxhdGZvcm0gaXMgbm90IHN1cHBvcnRlZCEnKTtcbiAgfVxuXG4gIHJldHVybiBlbmFibGVkO1xufSIsInZhciBSQUZfVElNRU9VVCA9IDEwMDtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFmdGVyRnJhbWUoY2FsbGJhY2spIHtcbiAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYpO1xuICAgIHNldFRpbWVvdXQoY2FsbGJhY2spO1xuICB9O1xuXG4gIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChoYW5kbGVyLCBSQUZfVElNRU9VVCk7XG4gIHZhciByYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaGFuZGxlcik7XG59IiwiaW1wb3J0IFF1ZXVlIGZyb20gJy4vcXVldWUnO1xuaW1wb3J0IHRocm90dGxlIGZyb20gJy4vdGhyb3R0bGUnO1xuaW1wb3J0IE5ESlNPTiBmcm9tICcuL25kanNvbic7XG5pbXBvcnQgeyB0cnVuY2F0ZU1vZGVsLCBNRVRBREFUQV9NT0RFTCB9IGZyb20gJy4vdHJ1bmNhdGUnO1xuaW1wb3J0IHsgRVJST1JTLCBIVFRQX1JFUVVFU1RfVElNRU9VVCwgUVVFVUVfRkxVU0gsIFRSQU5TQUNUSU9OUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuL3BvbHlmaWxscyc7XG5pbXBvcnQgeyBjb21wcmVzc01ldGFkYXRhLCBjb21wcmVzc1RyYW5zYWN0aW9uLCBjb21wcmVzc0Vycm9yLCBjb21wcmVzc1BheWxvYWQgfSBmcm9tICcuL2NvbXByZXNzJztcbmltcG9ydCB7IF9fREVWX18gfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQgeyBzZW5kRmV0Y2hSZXF1ZXN0LCBzaG91bGRVc2VGZXRjaFdpdGhLZWVwQWxpdmUgfSBmcm9tICcuL2h0dHAvZmV0Y2gnO1xuaW1wb3J0IHsgc2VuZFhIUiB9IGZyb20gJy4vaHR0cC94aHInO1xudmFyIFRIUk9UVExFX0lOVEVSVkFMID0gNjAwMDA7XG5cbnZhciBBcG1TZXJ2ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEFwbVNlcnZlcihjb25maWdTZXJ2aWNlLCBsb2dnaW5nU2VydmljZSkge1xuICAgIHRoaXMuX2NvbmZpZ1NlcnZpY2UgPSBjb25maWdTZXJ2aWNlO1xuICAgIHRoaXMuX2xvZ2dpbmdTZXJ2aWNlID0gbG9nZ2luZ1NlcnZpY2U7XG4gICAgdGhpcy5xdWV1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRocm90dGxlRXZlbnRzID0gbm9vcDtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBBcG1TZXJ2ZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHF1ZXVlTGltaXQgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgncXVldWVMaW1pdCcpO1xuXG4gICAgdmFyIGZsdXNoSW50ZXJ2YWwgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnZmx1c2hJbnRlcnZhbCcpO1xuXG4gICAgdmFyIGxpbWl0ID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ2V2ZW50c0xpbWl0Jyk7XG5cbiAgICB2YXIgb25GbHVzaCA9IGZ1bmN0aW9uIG9uRmx1c2goZXZlbnRzKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IF90aGlzLnNlbmRFdmVudHMoZXZlbnRzKTtcblxuICAgICAgaWYgKHByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZS5jYXRjaChmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgICAgX3RoaXMuX2xvZ2dpbmdTZXJ2aWNlLndhcm4oJ0ZhaWxlZCBzZW5kaW5nIGV2ZW50cyEnLCBfdGhpcy5fY29uc3RydWN0RXJyb3IocmVhc29uKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKG9uRmx1c2gsIHtcbiAgICAgIHF1ZXVlTGltaXQ6IHF1ZXVlTGltaXQsXG4gICAgICBmbHVzaEludGVydmFsOiBmbHVzaEludGVydmFsXG4gICAgfSk7XG4gICAgdGhpcy50aHJvdHRsZUV2ZW50cyA9IHRocm90dGxlKHRoaXMucXVldWUuYWRkLmJpbmQodGhpcy5xdWV1ZSksIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfdGhpcy5fbG9nZ2luZ1NlcnZpY2Uud2FybignRHJvcHBlZCBldmVudHMgZHVlIHRvIHRocm90dGxpbmchJyk7XG4gICAgfSwge1xuICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgaW50ZXJ2YWw6IFRIUk9UVExFX0lOVEVSVkFMXG4gICAgfSk7XG5cbiAgICB0aGlzLl9jb25maWdTZXJ2aWNlLm9ic2VydmVFdmVudChRVUVVRV9GTFVTSCwgZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMucXVldWUuZmx1c2goKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uX3Bvc3RKc29uID0gZnVuY3Rpb24gX3Bvc3RKc29uKGVuZFBvaW50LCBwYXlsb2FkKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgaGVhZGVycyA9IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC1uZGpzb24nXG4gICAgfTtcblxuICAgIHZhciBhcG1SZXF1ZXN0ID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ2FwbVJlcXVlc3QnKTtcblxuICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIGJlZm9yZVNlbmQ6IGFwbVJlcXVlc3RcbiAgICB9O1xuICAgIHJldHVybiBjb21wcmVzc1BheWxvYWQocGFyYW1zKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIF90aGlzMi5fbG9nZ2luZ1NlcnZpY2UuZGVidWcoJ0NvbXByZXNzaW5nIHRoZSBwYXlsb2FkIHVzaW5nIENvbXByZXNzaW9uU3RyZWFtIEFQSSBmYWlsZWQnLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIHJldHVybiBfdGhpczIuX21ha2VIdHRwUmVxdWVzdCgnUE9TVCcsIGVuZFBvaW50LCByZXN1bHQpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgIHZhciByZXNwb25zZVRleHQgPSBfcmVmLnJlc3BvbnNlVGV4dDtcbiAgICAgIHJldHVybiByZXNwb25zZVRleHQ7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLl9jb25zdHJ1Y3RFcnJvciA9IGZ1bmN0aW9uIF9jb25zdHJ1Y3RFcnJvcihyZWFzb24pIHtcbiAgICB2YXIgdXJsID0gcmVhc29uLnVybCxcbiAgICAgICAgc3RhdHVzID0gcmVhc29uLnN0YXR1cyxcbiAgICAgICAgcmVzcG9uc2VUZXh0ID0gcmVhc29uLnJlc3BvbnNlVGV4dDtcblxuICAgIGlmICh0eXBlb2Ygc3RhdHVzID09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gcmVhc29uO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlID0gdXJsICsgJyBIVFRQIHN0YXR1czogJyArIHN0YXR1cztcblxuICAgIGlmIChfX0RFVl9fICYmIHJlc3BvbnNlVGV4dCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHNlcnZlckVycm9ycyA9IFtdO1xuICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycyAmJiByZXNwb25zZS5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlc3BvbnNlLmVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZXJFcnJvcnMucHVzaChlcnIubWVzc2FnZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbWVzc2FnZSArPSAnICcgKyBzZXJ2ZXJFcnJvcnMuam9pbignLCcpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dpbmdTZXJ2aWNlLmRlYnVnKCdFcnJvciBwYXJzaW5nIHJlc3BvbnNlIGZyb20gQVBNIHNlcnZlcicsIGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIH07XG5cbiAgX3Byb3RvLl9tYWtlSHR0cFJlcXVlc3QgPSBmdW5jdGlvbiBfbWFrZUh0dHBSZXF1ZXN0KG1ldGhvZCwgdXJsLCBfdGVtcCkge1xuICAgIHZhciBfcmVmMiA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgICBfcmVmMiR0aW1lb3V0ID0gX3JlZjIudGltZW91dCxcbiAgICAgICAgdGltZW91dCA9IF9yZWYyJHRpbWVvdXQgPT09IHZvaWQgMCA/IEhUVFBfUkVRVUVTVF9USU1FT1VUIDogX3JlZjIkdGltZW91dCxcbiAgICAgICAgcGF5bG9hZCA9IF9yZWYyLnBheWxvYWQsXG4gICAgICAgIGhlYWRlcnMgPSBfcmVmMi5oZWFkZXJzLFxuICAgICAgICBiZWZvcmVTZW5kID0gX3JlZjIuYmVmb3JlU2VuZDtcblxuICAgIHZhciBzZW5kQ3JlZGVudGlhbHMgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnc2VuZENyZWRlbnRpYWxzJyk7XG5cbiAgICBpZiAoIWJlZm9yZVNlbmQgJiYgc2hvdWxkVXNlRmV0Y2hXaXRoS2VlcEFsaXZlKG1ldGhvZCwgcGF5bG9hZCkpIHtcbiAgICAgIHJldHVybiBzZW5kRmV0Y2hSZXF1ZXN0KG1ldGhvZCwgdXJsLCB7XG4gICAgICAgIGtlZXBhbGl2ZTogdHJ1ZSxcbiAgICAgICAgdGltZW91dDogdGltZW91dCxcbiAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgc2VuZENyZWRlbnRpYWxzOiBzZW5kQ3JlZGVudGlhbHNcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgaWYgKHJlYXNvbiBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgIHJldHVybiBzZW5kWEhSKG1ldGhvZCwgdXJsLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBiZWZvcmVTZW5kLFxuICAgICAgICAgICAgc2VuZENyZWRlbnRpYWxzOiBzZW5kQ3JlZGVudGlhbHNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IHJlYXNvbjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzZW5kWEhSKG1ldGhvZCwgdXJsLCB7XG4gICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICBiZWZvcmVTZW5kOiBiZWZvcmVTZW5kLFxuICAgICAgc2VuZENyZWRlbnRpYWxzOiBzZW5kQ3JlZGVudGlhbHNcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uZmV0Y2hDb25maWcgPSBmdW5jdGlvbiBmZXRjaENvbmZpZyhzZXJ2aWNlTmFtZSwgZW52aXJvbm1lbnQpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHZhciBfdGhpcyRnZXRFbmRwb2ludHMgPSB0aGlzLmdldEVuZHBvaW50cygpLFxuICAgICAgICBjb25maWdFbmRwb2ludCA9IF90aGlzJGdldEVuZHBvaW50cy5jb25maWdFbmRwb2ludDtcblxuICAgIGlmICghc2VydmljZU5hbWUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnc2VydmljZU5hbWUgaXMgcmVxdWlyZWQgZm9yIGZldGNoaW5nIGNlbnRyYWwgY29uZmlnLicpO1xuICAgIH1cblxuICAgIGNvbmZpZ0VuZHBvaW50ICs9IFwiP3NlcnZpY2UubmFtZT1cIiArIHNlcnZpY2VOYW1lO1xuXG4gICAgaWYgKGVudmlyb25tZW50KSB7XG4gICAgICBjb25maWdFbmRwb2ludCArPSBcIiZzZXJ2aWNlLmVudmlyb25tZW50PVwiICsgZW52aXJvbm1lbnQ7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsQ29uZmlnID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXRMb2NhbENvbmZpZygpO1xuXG4gICAgaWYgKGxvY2FsQ29uZmlnKSB7XG4gICAgICBjb25maWdFbmRwb2ludCArPSBcIiZpZm5vbmVtYXRjaD1cIiArIGxvY2FsQ29uZmlnLmV0YWc7XG4gICAgfVxuXG4gICAgdmFyIGFwbVJlcXVlc3QgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnYXBtUmVxdWVzdCcpO1xuXG4gICAgcmV0dXJuIHRoaXMuX21ha2VIdHRwUmVxdWVzdCgnR0VUJywgY29uZmlnRW5kcG9pbnQsIHtcbiAgICAgIHRpbWVvdXQ6IDUwMDAsXG4gICAgICBiZWZvcmVTZW5kOiBhcG1SZXF1ZXN0XG4gICAgfSkudGhlbihmdW5jdGlvbiAoeGhyKSB7XG4gICAgICB2YXIgc3RhdHVzID0geGhyLnN0YXR1cyxcbiAgICAgICAgICByZXNwb25zZVRleHQgPSB4aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICBpZiAoc3RhdHVzID09PSAzMDQpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsQ29uZmlnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlbW90ZUNvbmZpZyA9IEpTT04ucGFyc2UocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgdmFyIGV0YWcgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2V0YWcnKTtcblxuICAgICAgICBpZiAoZXRhZykge1xuICAgICAgICAgIHJlbW90ZUNvbmZpZy5ldGFnID0gZXRhZy5yZXBsYWNlKC9bXCJdL2csICcnKTtcblxuICAgICAgICAgIF90aGlzMy5fY29uZmlnU2VydmljZS5zZXRMb2NhbENvbmZpZyhyZW1vdGVDb25maWcsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbW90ZUNvbmZpZztcbiAgICAgIH1cbiAgICB9KS5jYXRjaChmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICB2YXIgZXJyb3IgPSBfdGhpczMuX2NvbnN0cnVjdEVycm9yKHJlYXNvbik7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLmNyZWF0ZU1ldGFEYXRhID0gZnVuY3Rpb24gY3JlYXRlTWV0YURhdGEoKSB7XG4gICAgdmFyIGNmZyA9IHRoaXMuX2NvbmZpZ1NlcnZpY2U7XG4gICAgdmFyIG1ldGFkYXRhID0ge1xuICAgICAgc2VydmljZToge1xuICAgICAgICBuYW1lOiBjZmcuZ2V0KCdzZXJ2aWNlTmFtZScpLFxuICAgICAgICB2ZXJzaW9uOiBjZmcuZ2V0KCdzZXJ2aWNlVmVyc2lvbicpLFxuICAgICAgICBhZ2VudDoge1xuICAgICAgICAgIG5hbWU6ICdydW0tanMnLFxuICAgICAgICAgIHZlcnNpb246IGNmZy52ZXJzaW9uXG4gICAgICAgIH0sXG4gICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgbmFtZTogJ2phdmFzY3JpcHQnXG4gICAgICAgIH0sXG4gICAgICAgIGVudmlyb25tZW50OiBjZmcuZ2V0KCdlbnZpcm9ubWVudCcpXG4gICAgICB9LFxuICAgICAgbGFiZWxzOiBjZmcuZ2V0KCdjb250ZXh0LnRhZ3MnKVxuICAgIH07XG4gICAgcmV0dXJuIHRydW5jYXRlTW9kZWwoTUVUQURBVEFfTU9ERUwsIG1ldGFkYXRhKTtcbiAgfTtcblxuICBfcHJvdG8uYWRkRXJyb3IgPSBmdW5jdGlvbiBhZGRFcnJvcihlcnJvcikge1xuICAgIHZhciBfdGhpcyR0aHJvdHRsZUV2ZW50cztcblxuICAgIHRoaXMudGhyb3R0bGVFdmVudHMoKF90aGlzJHRocm90dGxlRXZlbnRzID0ge30sIF90aGlzJHRocm90dGxlRXZlbnRzW0VSUk9SU10gPSBlcnJvciwgX3RoaXMkdGhyb3R0bGVFdmVudHMpKTtcbiAgfTtcblxuICBfcHJvdG8uYWRkVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBhZGRUcmFuc2FjdGlvbih0cmFuc2FjdGlvbikge1xuICAgIHZhciBfdGhpcyR0aHJvdHRsZUV2ZW50czI7XG5cbiAgICB0aGlzLnRocm90dGxlRXZlbnRzKChfdGhpcyR0aHJvdHRsZUV2ZW50czIgPSB7fSwgX3RoaXMkdGhyb3R0bGVFdmVudHMyW1RSQU5TQUNUSU9OU10gPSB0cmFuc2FjdGlvbiwgX3RoaXMkdGhyb3R0bGVFdmVudHMyKSk7XG4gIH07XG5cbiAgX3Byb3RvLm5kanNvbkVycm9ycyA9IGZ1bmN0aW9uIG5kanNvbkVycm9ycyhlcnJvcnMsIGNvbXByZXNzKSB7XG4gICAgdmFyIGtleSA9IGNvbXByZXNzID8gJ2UnIDogJ2Vycm9yJztcbiAgICByZXR1cm4gZXJyb3JzLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHZhciBfTkRKU09OJHN0cmluZ2lmeTtcblxuICAgICAgcmV0dXJuIE5ESlNPTi5zdHJpbmdpZnkoKF9OREpTT04kc3RyaW5naWZ5ID0ge30sIF9OREpTT04kc3RyaW5naWZ5W2tleV0gPSBjb21wcmVzcyA/IGNvbXByZXNzRXJyb3IoZXJyb3IpIDogZXJyb3IsIF9OREpTT04kc3RyaW5naWZ5KSk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLm5kanNvbk1ldHJpY3NldHMgPSBmdW5jdGlvbiBuZGpzb25NZXRyaWNzZXRzKG1ldHJpY3NldHMpIHtcbiAgICByZXR1cm4gbWV0cmljc2V0cy5tYXAoZnVuY3Rpb24gKG1ldHJpY3NldCkge1xuICAgICAgcmV0dXJuIE5ESlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBtZXRyaWNzZXQ6IG1ldHJpY3NldFxuICAgICAgfSk7XG4gICAgfSkuam9pbignJyk7XG4gIH07XG5cbiAgX3Byb3RvLm5kanNvblRyYW5zYWN0aW9ucyA9IGZ1bmN0aW9uIG5kanNvblRyYW5zYWN0aW9ucyh0cmFuc2FjdGlvbnMsIGNvbXByZXNzKSB7XG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICB2YXIga2V5ID0gY29tcHJlc3MgPyAneCcgOiAndHJhbnNhY3Rpb24nO1xuICAgIHJldHVybiB0cmFuc2FjdGlvbnMubWFwKGZ1bmN0aW9uICh0cikge1xuICAgICAgdmFyIF9OREpTT04kc3RyaW5naWZ5MjtcblxuICAgICAgdmFyIHNwYW5zID0gJycsXG4gICAgICAgICAgYnJlYWtkb3ducyA9ICcnO1xuXG4gICAgICBpZiAoIWNvbXByZXNzKSB7XG4gICAgICAgIGlmICh0ci5zcGFucykge1xuICAgICAgICAgIHNwYW5zID0gdHIuc3BhbnMubWFwKGZ1bmN0aW9uIChzcGFuKSB7XG4gICAgICAgICAgICByZXR1cm4gTkRKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHNwYW46IHNwYW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pLmpvaW4oJycpO1xuICAgICAgICAgIGRlbGV0ZSB0ci5zcGFucztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ci5icmVha2Rvd24pIHtcbiAgICAgICAgICBicmVha2Rvd25zID0gX3RoaXM0Lm5kanNvbk1ldHJpY3NldHModHIuYnJlYWtkb3duKTtcbiAgICAgICAgICBkZWxldGUgdHIuYnJlYWtkb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBOREpTT04uc3RyaW5naWZ5KChfTkRKU09OJHN0cmluZ2lmeTIgPSB7fSwgX05ESlNPTiRzdHJpbmdpZnkyW2tleV0gPSBjb21wcmVzcyA/IGNvbXByZXNzVHJhbnNhY3Rpb24odHIpIDogdHIsIF9OREpTT04kc3RyaW5naWZ5MikpICsgc3BhbnMgKyBicmVha2Rvd25zO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5zZW5kRXZlbnRzID0gZnVuY3Rpb24gc2VuZEV2ZW50cyhldmVudHMpIHtcbiAgICB2YXIgX3BheWxvYWQsIF9OREpTT04kc3RyaW5naWZ5MztcblxuICAgIGlmIChldmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHRyYW5zYWN0aW9ucyA9IFtdO1xuICAgIHZhciBlcnJvcnMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZXZlbnQgPSBldmVudHNbaV07XG5cbiAgICAgIGlmIChldmVudFtUUkFOU0FDVElPTlNdKSB7XG4gICAgICAgIHRyYW5zYWN0aW9ucy5wdXNoKGV2ZW50W1RSQU5TQUNUSU9OU10pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnRbRVJST1JTXSkge1xuICAgICAgICBlcnJvcnMucHVzaChldmVudFtFUlJPUlNdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA9PT0gMCAmJiBlcnJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGNmZyA9IHRoaXMuX2NvbmZpZ1NlcnZpY2U7XG4gICAgdmFyIHBheWxvYWQgPSAoX3BheWxvYWQgPSB7fSwgX3BheWxvYWRbVFJBTlNBQ1RJT05TXSA9IHRyYW5zYWN0aW9ucywgX3BheWxvYWRbRVJST1JTXSA9IGVycm9ycywgX3BheWxvYWQpO1xuICAgIHZhciBmaWx0ZXJlZFBheWxvYWQgPSBjZmcuYXBwbHlGaWx0ZXJzKHBheWxvYWQpO1xuXG4gICAgaWYgKCFmaWx0ZXJlZFBheWxvYWQpIHtcbiAgICAgIHRoaXMuX2xvZ2dpbmdTZXJ2aWNlLndhcm4oJ0Ryb3BwZWQgcGF5bG9hZCBkdWUgdG8gZmlsdGVyaW5nIScpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFwaVZlcnNpb24gPSBjZmcuZ2V0KCdhcGlWZXJzaW9uJyk7XG4gICAgdmFyIGNvbXByZXNzID0gYXBpVmVyc2lvbiA+IDI7XG4gICAgdmFyIG5kanNvbiA9IFtdO1xuICAgIHZhciBtZXRhZGF0YSA9IHRoaXMuY3JlYXRlTWV0YURhdGEoKTtcbiAgICB2YXIgbWV0YWRhdGFLZXkgPSBjb21wcmVzcyA/ICdtJyA6ICdtZXRhZGF0YSc7XG4gICAgbmRqc29uLnB1c2goTkRKU09OLnN0cmluZ2lmeSgoX05ESlNPTiRzdHJpbmdpZnkzID0ge30sIF9OREpTT04kc3RyaW5naWZ5M1ttZXRhZGF0YUtleV0gPSBjb21wcmVzcyA/IGNvbXByZXNzTWV0YWRhdGEobWV0YWRhdGEpIDogbWV0YWRhdGEsIF9OREpTT04kc3RyaW5naWZ5MykpKTtcbiAgICBuZGpzb24gPSBuZGpzb24uY29uY2F0KHRoaXMubmRqc29uRXJyb3JzKGZpbHRlcmVkUGF5bG9hZFtFUlJPUlNdLCBjb21wcmVzcyksIHRoaXMubmRqc29uVHJhbnNhY3Rpb25zKGZpbHRlcmVkUGF5bG9hZFtUUkFOU0FDVElPTlNdLCBjb21wcmVzcykpO1xuICAgIHZhciBuZGpzb25QYXlsb2FkID0gbmRqc29uLmpvaW4oJycpO1xuXG4gICAgdmFyIF90aGlzJGdldEVuZHBvaW50czIgPSB0aGlzLmdldEVuZHBvaW50cygpLFxuICAgICAgICBpbnRha2VFbmRwb2ludCA9IF90aGlzJGdldEVuZHBvaW50czIuaW50YWtlRW5kcG9pbnQ7XG5cbiAgICByZXR1cm4gdGhpcy5fcG9zdEpzb24oaW50YWtlRW5kcG9pbnQsIG5kanNvblBheWxvYWQpO1xuICB9O1xuXG4gIF9wcm90by5nZXRFbmRwb2ludHMgPSBmdW5jdGlvbiBnZXRFbmRwb2ludHMoKSB7XG4gICAgdmFyIHNlcnZlclVybCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdzZXJ2ZXJVcmwnKTtcblxuICAgIHZhciBhcGlWZXJzaW9uID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ2FwaVZlcnNpb24nKTtcblxuICAgIHZhciBzZXJ2ZXJVcmxQcmVmaXggPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnc2VydmVyVXJsUHJlZml4JykgfHwgXCIvaW50YWtlL3ZcIiArIGFwaVZlcnNpb24gKyBcIi9ydW0vZXZlbnRzXCI7XG4gICAgdmFyIGludGFrZUVuZHBvaW50ID0gc2VydmVyVXJsICsgc2VydmVyVXJsUHJlZml4O1xuICAgIHZhciBjb25maWdFbmRwb2ludCA9IHNlcnZlclVybCArIFwiL2NvbmZpZy92MS9ydW0vYWdlbnRzXCI7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGFrZUVuZHBvaW50OiBpbnRha2VFbmRwb2ludCxcbiAgICAgIGNvbmZpZ0VuZHBvaW50OiBjb25maWdFbmRwb2ludFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEFwbVNlcnZlcjtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgQXBtU2VydmVyOyIsImltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuL3BvbHlmaWxscyc7XG5pbXBvcnQgeyBOQVZJR0FUSU9OX1RJTUlOR19NQVJLUywgQ09NUFJFU1NFRF9OQVZfVElNSU5HX01BUktTIH0gZnJvbSAnLi4vcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL21hcmtzJztcbmltcG9ydCB7IGlzQmVhY29uSW5zcGVjdGlvbkVuYWJsZWQgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gY29tcHJlc3NTdGFja0ZyYW1lcyhmcmFtZXMpIHtcbiAgcmV0dXJuIGZyYW1lcy5tYXAoZnVuY3Rpb24gKGZyYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFwOiBmcmFtZS5hYnNfcGF0aCxcbiAgICAgIGY6IGZyYW1lLmZpbGVuYW1lLFxuICAgICAgZm46IGZyYW1lLmZ1bmN0aW9uLFxuICAgICAgbGk6IGZyYW1lLmxpbmVubyxcbiAgICAgIGNvOiBmcmFtZS5jb2xub1xuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjb21wcmVzc1Jlc3BvbnNlKHJlc3BvbnNlKSB7XG4gIHJldHVybiB7XG4gICAgdHM6IHJlc3BvbnNlLnRyYW5zZmVyX3NpemUsXG4gICAgZWJzOiByZXNwb25zZS5lbmNvZGVkX2JvZHlfc2l6ZSxcbiAgICBkYnM6IHJlc3BvbnNlLmRlY29kZWRfYm9keV9zaXplXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzSFRUUChodHRwKSB7XG4gIHZhciBjb21wcmVzc2VkID0ge307XG4gIHZhciBtZXRob2QgPSBodHRwLm1ldGhvZCxcbiAgICAgIHN0YXR1c19jb2RlID0gaHR0cC5zdGF0dXNfY29kZSxcbiAgICAgIHVybCA9IGh0dHAudXJsLFxuICAgICAgcmVzcG9uc2UgPSBodHRwLnJlc3BvbnNlO1xuICBjb21wcmVzc2VkLnVybCA9IHVybDtcblxuICBpZiAobWV0aG9kKSB7XG4gICAgY29tcHJlc3NlZC5tdCA9IG1ldGhvZDtcbiAgfVxuXG4gIGlmIChzdGF0dXNfY29kZSkge1xuICAgIGNvbXByZXNzZWQuc2MgPSBzdGF0dXNfY29kZTtcbiAgfVxuXG4gIGlmIChyZXNwb25zZSkge1xuICAgIGNvbXByZXNzZWQuciA9IGNvbXByZXNzUmVzcG9uc2UocmVzcG9uc2UpO1xuICB9XG5cbiAgcmV0dXJuIGNvbXByZXNzZWQ7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzQ29udGV4dChjb250ZXh0KSB7XG4gIGlmICghY29udGV4dCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIGNvbXByZXNzZWQgPSB7fTtcbiAgdmFyIHBhZ2UgPSBjb250ZXh0LnBhZ2UsXG4gICAgICBodHRwID0gY29udGV4dC5odHRwLFxuICAgICAgcmVzcG9uc2UgPSBjb250ZXh0LnJlc3BvbnNlLFxuICAgICAgZGVzdGluYXRpb24gPSBjb250ZXh0LmRlc3RpbmF0aW9uLFxuICAgICAgdXNlciA9IGNvbnRleHQudXNlcixcbiAgICAgIGN1c3RvbSA9IGNvbnRleHQuY3VzdG9tO1xuXG4gIGlmIChwYWdlKSB7XG4gICAgY29tcHJlc3NlZC5wID0ge1xuICAgICAgcmY6IHBhZ2UucmVmZXJlcixcbiAgICAgIHVybDogcGFnZS51cmxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGh0dHApIHtcbiAgICBjb21wcmVzc2VkLmggPSBjb21wcmVzc0hUVFAoaHR0cCk7XG4gIH1cblxuICBpZiAocmVzcG9uc2UpIHtcbiAgICBjb21wcmVzc2VkLnIgPSBjb21wcmVzc1Jlc3BvbnNlKHJlc3BvbnNlKTtcbiAgfVxuXG4gIGlmIChkZXN0aW5hdGlvbikge1xuICAgIHZhciBzZXJ2aWNlID0gZGVzdGluYXRpb24uc2VydmljZTtcbiAgICBjb21wcmVzc2VkLmR0ID0ge1xuICAgICAgc2U6IHtcbiAgICAgICAgbjogc2VydmljZS5uYW1lLFxuICAgICAgICB0OiBzZXJ2aWNlLnR5cGUsXG4gICAgICAgIHJjOiBzZXJ2aWNlLnJlc291cmNlXG4gICAgICB9LFxuICAgICAgYWQ6IGRlc3RpbmF0aW9uLmFkZHJlc3MsXG4gICAgICBwbzogZGVzdGluYXRpb24ucG9ydFxuICAgIH07XG4gIH1cblxuICBpZiAodXNlcikge1xuICAgIGNvbXByZXNzZWQudSA9IHtcbiAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgdW46IHVzZXIudXNlcm5hbWUsXG4gICAgICBlbTogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cblxuICBpZiAoY3VzdG9tKSB7XG4gICAgY29tcHJlc3NlZC5jdSA9IGN1c3RvbTtcbiAgfVxuXG4gIHJldHVybiBjb21wcmVzc2VkO1xufVxuXG5mdW5jdGlvbiBjb21wcmVzc01hcmtzKG1hcmtzKSB7XG4gIGlmICghbWFya3MpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBjb21wcmVzc2VkTnRNYXJrcyA9IGNvbXByZXNzTmF2aWdhdGlvblRpbWluZ01hcmtzKG1hcmtzLm5hdmlnYXRpb25UaW1pbmcpO1xuICB2YXIgY29tcHJlc3NlZCA9IHtcbiAgICBudDogY29tcHJlc3NlZE50TWFya3MsXG4gICAgYTogY29tcHJlc3NBZ2VudE1hcmtzKGNvbXByZXNzZWROdE1hcmtzLCBtYXJrcy5hZ2VudClcbiAgfTtcbiAgcmV0dXJuIGNvbXByZXNzZWQ7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzTmF2aWdhdGlvblRpbWluZ01hcmtzKG50TWFya3MpIHtcbiAgaWYgKCFudE1hcmtzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgY29tcHJlc3NlZCA9IHt9O1xuICBDT01QUkVTU0VEX05BVl9USU1JTkdfTUFSS1MuZm9yRWFjaChmdW5jdGlvbiAobWFyaywgaW5kZXgpIHtcbiAgICB2YXIgbWFwcGluZyA9IE5BVklHQVRJT05fVElNSU5HX01BUktTW2luZGV4XTtcbiAgICBjb21wcmVzc2VkW21hcmtdID0gbnRNYXJrc1ttYXBwaW5nXTtcbiAgfSk7XG4gIHJldHVybiBjb21wcmVzc2VkO1xufVxuXG5mdW5jdGlvbiBjb21wcmVzc0FnZW50TWFya3MoY29tcHJlc3NlZE50TWFya3MsIGFnZW50TWFya3MpIHtcbiAgdmFyIGNvbXByZXNzZWQgPSB7fTtcblxuICBpZiAoY29tcHJlc3NlZE50TWFya3MpIHtcbiAgICBjb21wcmVzc2VkID0ge1xuICAgICAgZmI6IGNvbXByZXNzZWROdE1hcmtzLnJzLFxuICAgICAgZGk6IGNvbXByZXNzZWROdE1hcmtzLmRpLFxuICAgICAgZGM6IGNvbXByZXNzZWROdE1hcmtzLmRjXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhZ2VudE1hcmtzKSB7XG4gICAgdmFyIGZwID0gYWdlbnRNYXJrcy5maXJzdENvbnRlbnRmdWxQYWludDtcbiAgICB2YXIgbHAgPSBhZ2VudE1hcmtzLmxhcmdlc3RDb250ZW50ZnVsUGFpbnQ7XG5cbiAgICBpZiAoZnApIHtcbiAgICAgIGNvbXByZXNzZWQuZnAgPSBmcDtcbiAgICB9XG5cbiAgICBpZiAobHApIHtcbiAgICAgIGNvbXByZXNzZWQubHAgPSBscDtcbiAgICB9XG4gIH1cblxuICBpZiAoT2JqZWN0LmtleXMoY29tcHJlc3NlZCkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gY29tcHJlc3NlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXByZXNzTWV0YWRhdGEobWV0YWRhdGEpIHtcbiAgdmFyIHNlcnZpY2UgPSBtZXRhZGF0YS5zZXJ2aWNlLFxuICAgICAgbGFiZWxzID0gbWV0YWRhdGEubGFiZWxzO1xuICB2YXIgYWdlbnQgPSBzZXJ2aWNlLmFnZW50LFxuICAgICAgbGFuZ3VhZ2UgPSBzZXJ2aWNlLmxhbmd1YWdlO1xuICByZXR1cm4ge1xuICAgIHNlOiB7XG4gICAgICBuOiBzZXJ2aWNlLm5hbWUsXG4gICAgICB2ZTogc2VydmljZS52ZXJzaW9uLFxuICAgICAgYToge1xuICAgICAgICBuOiBhZ2VudC5uYW1lLFxuICAgICAgICB2ZTogYWdlbnQudmVyc2lvblxuICAgICAgfSxcbiAgICAgIGxhOiB7XG4gICAgICAgIG46IGxhbmd1YWdlLm5hbWVcbiAgICAgIH0sXG4gICAgICBlbjogc2VydmljZS5lbnZpcm9ubWVudFxuICAgIH0sXG4gICAgbDogbGFiZWxzXG4gIH07XG59XG5leHBvcnQgZnVuY3Rpb24gY29tcHJlc3NUcmFuc2FjdGlvbih0cmFuc2FjdGlvbikge1xuICB2YXIgc3BhbnMgPSB0cmFuc2FjdGlvbi5zcGFucy5tYXAoZnVuY3Rpb24gKHNwYW4pIHtcbiAgICB2YXIgc3BhbkRhdGEgPSB7XG4gICAgICBpZDogc3Bhbi5pZCxcbiAgICAgIG46IHNwYW4ubmFtZSxcbiAgICAgIHQ6IHNwYW4udHlwZSxcbiAgICAgIHM6IHNwYW4uc3RhcnQsXG4gICAgICBkOiBzcGFuLmR1cmF0aW9uLFxuICAgICAgYzogY29tcHJlc3NDb250ZXh0KHNwYW4uY29udGV4dCksXG4gICAgICBvOiBzcGFuLm91dGNvbWUsXG4gICAgICBzcjogc3Bhbi5zYW1wbGVfcmF0ZVxuICAgIH07XG5cbiAgICBpZiAoc3Bhbi5wYXJlbnRfaWQgIT09IHRyYW5zYWN0aW9uLmlkKSB7XG4gICAgICBzcGFuRGF0YS5waWQgPSBzcGFuLnBhcmVudF9pZDtcbiAgICB9XG5cbiAgICBpZiAoc3Bhbi5zeW5jID09PSB0cnVlKSB7XG4gICAgICBzcGFuRGF0YS5zeSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHNwYW4uc3VidHlwZSkge1xuICAgICAgc3BhbkRhdGEuc3UgPSBzcGFuLnN1YnR5cGU7XG4gICAgfVxuXG4gICAgaWYgKHNwYW4uYWN0aW9uKSB7XG4gICAgICBzcGFuRGF0YS5hYyA9IHNwYW4uYWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiBzcGFuRGF0YTtcbiAgfSk7XG4gIHZhciB0ciA9IHtcbiAgICBpZDogdHJhbnNhY3Rpb24uaWQsXG4gICAgdGlkOiB0cmFuc2FjdGlvbi50cmFjZV9pZCxcbiAgICBuOiB0cmFuc2FjdGlvbi5uYW1lLFxuICAgIHQ6IHRyYW5zYWN0aW9uLnR5cGUsXG4gICAgZDogdHJhbnNhY3Rpb24uZHVyYXRpb24sXG4gICAgYzogY29tcHJlc3NDb250ZXh0KHRyYW5zYWN0aW9uLmNvbnRleHQpLFxuICAgIGs6IGNvbXByZXNzTWFya3ModHJhbnNhY3Rpb24ubWFya3MpLFxuICAgIG1lOiBjb21wcmVzc01ldHJpY3NldHModHJhbnNhY3Rpb24uYnJlYWtkb3duKSxcbiAgICB5OiBzcGFucyxcbiAgICB5Yzoge1xuICAgICAgc2Q6IHNwYW5zLmxlbmd0aFxuICAgIH0sXG4gICAgc206IHRyYW5zYWN0aW9uLnNhbXBsZWQsXG4gICAgc3I6IHRyYW5zYWN0aW9uLnNhbXBsZV9yYXRlLFxuICAgIG86IHRyYW5zYWN0aW9uLm91dGNvbWVcbiAgfTtcblxuICBpZiAodHJhbnNhY3Rpb24uZXhwZXJpZW5jZSkge1xuICAgIHZhciBfdHJhbnNhY3Rpb24kZXhwZXJpZW4gPSB0cmFuc2FjdGlvbi5leHBlcmllbmNlLFxuICAgICAgICBjbHMgPSBfdHJhbnNhY3Rpb24kZXhwZXJpZW4uY2xzLFxuICAgICAgICBmaWQgPSBfdHJhbnNhY3Rpb24kZXhwZXJpZW4uZmlkLFxuICAgICAgICB0YnQgPSBfdHJhbnNhY3Rpb24kZXhwZXJpZW4udGJ0LFxuICAgICAgICBsb25ndGFzayA9IF90cmFuc2FjdGlvbiRleHBlcmllbi5sb25ndGFzaztcbiAgICB0ci5leHAgPSB7XG4gICAgICBjbHM6IGNscyxcbiAgICAgIGZpZDogZmlkLFxuICAgICAgdGJ0OiB0YnQsXG4gICAgICBsdDogbG9uZ3Rhc2tcbiAgICB9O1xuICB9XG5cbiAgaWYgKHRyYW5zYWN0aW9uLnNlc3Npb24pIHtcbiAgICB2YXIgX3RyYW5zYWN0aW9uJHNlc3Npb24gPSB0cmFuc2FjdGlvbi5zZXNzaW9uLFxuICAgICAgICBpZCA9IF90cmFuc2FjdGlvbiRzZXNzaW9uLmlkLFxuICAgICAgICBzZXF1ZW5jZSA9IF90cmFuc2FjdGlvbiRzZXNzaW9uLnNlcXVlbmNlO1xuICAgIHRyLnNlcyA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlcTogc2VxdWVuY2VcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXByZXNzRXJyb3IoZXJyb3IpIHtcbiAgdmFyIGV4Y2VwdGlvbiA9IGVycm9yLmV4Y2VwdGlvbjtcbiAgdmFyIGNvbXByZXNzZWQgPSB7XG4gICAgaWQ6IGVycm9yLmlkLFxuICAgIGNsOiBlcnJvci5jdWxwcml0LFxuICAgIGV4OiB7XG4gICAgICBtZzogZXhjZXB0aW9uLm1lc3NhZ2UsXG4gICAgICBzdDogY29tcHJlc3NTdGFja0ZyYW1lcyhleGNlcHRpb24uc3RhY2t0cmFjZSksXG4gICAgICB0OiBlcnJvci50eXBlXG4gICAgfSxcbiAgICBjOiBjb21wcmVzc0NvbnRleHQoZXJyb3IuY29udGV4dClcbiAgfTtcbiAgdmFyIHRyYW5zYWN0aW9uID0gZXJyb3IudHJhbnNhY3Rpb247XG5cbiAgaWYgKHRyYW5zYWN0aW9uKSB7XG4gICAgY29tcHJlc3NlZC50aWQgPSBlcnJvci50cmFjZV9pZDtcbiAgICBjb21wcmVzc2VkLnBpZCA9IGVycm9yLnBhcmVudF9pZDtcbiAgICBjb21wcmVzc2VkLnhpZCA9IGVycm9yLnRyYW5zYWN0aW9uX2lkO1xuICAgIGNvbXByZXNzZWQueCA9IHtcbiAgICAgIHQ6IHRyYW5zYWN0aW9uLnR5cGUsXG4gICAgICBzbTogdHJhbnNhY3Rpb24uc2FtcGxlZFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gY29tcHJlc3NlZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21wcmVzc01ldHJpY3NldHMoYnJlYWtkb3ducykge1xuICByZXR1cm4gYnJlYWtkb3ducy5tYXAoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgc3BhbiA9IF9yZWYuc3BhbixcbiAgICAgICAgc2FtcGxlcyA9IF9yZWYuc2FtcGxlcztcbiAgICByZXR1cm4ge1xuICAgICAgeToge1xuICAgICAgICB0OiBzcGFuLnR5cGVcbiAgICAgIH0sXG4gICAgICBzYToge1xuICAgICAgICB5c2M6IHtcbiAgICAgICAgICB2OiBzYW1wbGVzWydzcGFuLnNlbGZfdGltZS5jb3VudCddLnZhbHVlXG4gICAgICAgIH0sXG4gICAgICAgIHlzczoge1xuICAgICAgICAgIHY6IHNhbXBsZXNbJ3NwYW4uc2VsZl90aW1lLnN1bS51cyddLnZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21wcmVzc1BheWxvYWQocGFyYW1zLCB0eXBlKSB7XG4gIGlmICh0eXBlID09PSB2b2lkIDApIHtcbiAgICB0eXBlID0gJ2d6aXAnO1xuICB9XG5cbiAgdmFyIGlzQ29tcHJlc3Npb25TdHJlYW1TdXBwb3J0ZWQgPSB0eXBlb2YgQ29tcHJlc3Npb25TdHJlYW0gPT09ICdmdW5jdGlvbic7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIGlmICghaXNDb21wcmVzc2lvblN0cmVhbVN1cHBvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlc29sdmUocGFyYW1zKTtcbiAgICB9XG5cbiAgICBpZiAoaXNCZWFjb25JbnNwZWN0aW9uRW5hYmxlZCgpKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShwYXJhbXMpO1xuICAgIH1cblxuICAgIHZhciBwYXlsb2FkID0gcGFyYW1zLnBheWxvYWQsXG4gICAgICAgIGhlYWRlcnMgPSBwYXJhbXMuaGVhZGVycyxcbiAgICAgICAgYmVmb3JlU2VuZCA9IHBhcmFtcy5iZWZvcmVTZW5kO1xuICAgIHZhciBwYXlsb2FkU3RyZWFtID0gbmV3IEJsb2IoW3BheWxvYWRdKS5zdHJlYW0oKTtcbiAgICB2YXIgY29tcHJlc3NlZFN0cmVhbSA9IHBheWxvYWRTdHJlYW0ucGlwZVRocm91Z2gobmV3IENvbXByZXNzaW9uU3RyZWFtKHR5cGUpKTtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKGNvbXByZXNzZWRTdHJlYW0pLmJsb2IoKS50aGVuKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICBoZWFkZXJzWydDb250ZW50LUVuY29kaW5nJ10gPSB0eXBlO1xuICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICBiZWZvcmVTZW5kOiBiZWZvcmVTZW5kXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59IiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuaW1wb3J0IHsgZ2V0Q3VycmVudFNjcmlwdCwgc2V0TGFiZWwsIG1lcmdlLCBleHRlbmQsIGlzVW5kZWZpbmVkIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gJy4vZXZlbnQtaGFuZGxlcic7XG5pbXBvcnQgeyBDT05GSUdfQ0hBTkdFLCBMT0NBTF9DT05GSUdfS0VZIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5mdW5jdGlvbiBnZXRDb25maWdGcm9tU2NyaXB0KCkge1xuICB2YXIgc2NyaXB0ID0gZ2V0Q3VycmVudFNjcmlwdCgpO1xuICB2YXIgY29uZmlnID0gZ2V0RGF0YUF0dHJpYnV0ZXNGcm9tTm9kZShzY3JpcHQpO1xuICByZXR1cm4gY29uZmlnO1xufVxuXG5mdW5jdGlvbiBnZXREYXRhQXR0cmlidXRlc0Zyb21Ob2RlKG5vZGUpIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgdmFyIGRhdGFBdHRycyA9IHt9O1xuICB2YXIgZGF0YVJlZ2V4ID0gL15kYXRhLShbXFx3LV0rKSQvO1xuICB2YXIgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBhdHRyID0gYXR0cnNbaV07XG5cbiAgICBpZiAoZGF0YVJlZ2V4LnRlc3QoYXR0ci5ub2RlTmFtZSkpIHtcbiAgICAgIHZhciBrZXkgPSBhdHRyLm5vZGVOYW1lLm1hdGNoKGRhdGFSZWdleClbMV07XG4gICAgICB2YXIgY2FtZWxDYXNlZGtleSA9IGtleS5zcGxpdCgnLScpLm1hcChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBpbmRleCA+IDAgPyB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnN1YnN0cmluZygxKSA6IHZhbHVlO1xuICAgICAgfSkuam9pbignJyk7XG4gICAgICBkYXRhQXR0cnNbY2FtZWxDYXNlZGtleV0gPSBhdHRyLnZhbHVlIHx8IGF0dHIubm9kZVZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkYXRhQXR0cnM7XG59XG5cbnZhciBDb25maWcgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENvbmZpZygpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIHNlcnZpY2VOYW1lOiAnJyxcbiAgICAgIHNlcnZpY2VWZXJzaW9uOiAnJyxcbiAgICAgIGVudmlyb25tZW50OiAnJyxcbiAgICAgIHNlcnZlclVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODIwMCcsXG4gICAgICBzZXJ2ZXJVcmxQcmVmaXg6ICcnLFxuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgaW5zdHJ1bWVudDogdHJ1ZSxcbiAgICAgIGRpc2FibGVJbnN0cnVtZW50YXRpb25zOiBbXSxcbiAgICAgIGxvZ0xldmVsOiAnd2FybicsXG4gICAgICBicmVha2Rvd25NZXRyaWNzOiBmYWxzZSxcbiAgICAgIGlnbm9yZVRyYW5zYWN0aW9uczogW10sXG4gICAgICBldmVudHNMaW1pdDogODAsXG4gICAgICBxdWV1ZUxpbWl0OiAtMSxcbiAgICAgIGZsdXNoSW50ZXJ2YWw6IDUwMCxcbiAgICAgIGRpc3RyaWJ1dGVkVHJhY2luZzogdHJ1ZSxcbiAgICAgIGRpc3RyaWJ1dGVkVHJhY2luZ09yaWdpbnM6IFtdLFxuICAgICAgZGlzdHJpYnV0ZWRUcmFjaW5nSGVhZGVyTmFtZTogJ3RyYWNlcGFyZW50JyxcbiAgICAgIHBhZ2VMb2FkVHJhY2VJZDogJycsXG4gICAgICBwYWdlTG9hZFNwYW5JZDogJycsXG4gICAgICBwYWdlTG9hZFNhbXBsZWQ6IGZhbHNlLFxuICAgICAgcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWU6ICcnLFxuICAgICAgcHJvcGFnYXRlVHJhY2VzdGF0ZTogZmFsc2UsXG4gICAgICB0cmFuc2FjdGlvblNhbXBsZVJhdGU6IDEuMCxcbiAgICAgIGNlbnRyYWxDb25maWc6IGZhbHNlLFxuICAgICAgbW9uaXRvckxvbmd0YXNrczogdHJ1ZSxcbiAgICAgIGFwaVZlcnNpb246IDIsXG4gICAgICBjb250ZXh0OiB7fSxcbiAgICAgIHNlc3Npb246IGZhbHNlLFxuICAgICAgYXBtUmVxdWVzdDogbnVsbCxcbiAgICAgIHNlbmRDcmVkZW50aWFsczogZmFsc2VcbiAgICB9O1xuICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuZmlsdGVycyA9IFtdO1xuICAgIHRoaXMudmVyc2lvbiA9ICcnO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IENvbmZpZy5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBzY3JpcHREYXRhID0gZ2V0Q29uZmlnRnJvbVNjcmlwdCgpO1xuICAgIHRoaXMuc2V0Q29uZmlnKHNjcmlwdERhdGEpO1xuICB9O1xuXG4gIF9wcm90by5zZXRWZXJzaW9uID0gZnVuY3Rpb24gc2V0VmVyc2lvbih2ZXJzaW9uKSB7XG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvbjtcbiAgfTtcblxuICBfcHJvdG8uYWRkRmlsdGVyID0gZnVuY3Rpb24gYWRkRmlsdGVyKGNiKSB7XG4gICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCB0byBtdXN0IGJlIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJzLnB1c2goY2IpO1xuICB9O1xuXG4gIF9wcm90by5hcHBseUZpbHRlcnMgPSBmdW5jdGlvbiBhcHBseUZpbHRlcnMoZGF0YSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBkYXRhID0gdGhpcy5maWx0ZXJzW2ldKGRhdGEpO1xuXG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIF9wcm90by5nZXQgPSBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIGtleS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbiAob2JqLCBvYmpLZXkpIHtcbiAgICAgIHJldHVybiBvYmogJiYgb2JqW29iaktleV07XG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9O1xuXG4gIF9wcm90by5zZXRVc2VyQ29udGV4dCA9IGZ1bmN0aW9uIHNldFVzZXJDb250ZXh0KHVzZXJDb250ZXh0KSB7XG4gICAgaWYgKHVzZXJDb250ZXh0ID09PSB2b2lkIDApIHtcbiAgICAgIHVzZXJDb250ZXh0ID0ge307XG4gICAgfVxuXG4gICAgdmFyIGNvbnRleHQgPSB7fTtcbiAgICB2YXIgX3VzZXJDb250ZXh0ID0gdXNlckNvbnRleHQsXG4gICAgICAgIGlkID0gX3VzZXJDb250ZXh0LmlkLFxuICAgICAgICB1c2VybmFtZSA9IF91c2VyQ29udGV4dC51c2VybmFtZSxcbiAgICAgICAgZW1haWwgPSBfdXNlckNvbnRleHQuZW1haWw7XG5cbiAgICBpZiAodHlwZW9mIGlkID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250ZXh0LmlkID0gaWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB1c2VybmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRleHQudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGVtYWlsID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGV4dC5lbWFpbCA9IGVtYWlsO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnLmNvbnRleHQudXNlciA9IGV4dGVuZCh0aGlzLmNvbmZpZy5jb250ZXh0LnVzZXIgfHwge30sIGNvbnRleHQpO1xuICB9O1xuXG4gIF9wcm90by5zZXRDdXN0b21Db250ZXh0ID0gZnVuY3Rpb24gc2V0Q3VzdG9tQ29udGV4dChjdXN0b21Db250ZXh0KSB7XG4gICAgaWYgKGN1c3RvbUNvbnRleHQgPT09IHZvaWQgMCkge1xuICAgICAgY3VzdG9tQ29udGV4dCA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnLmNvbnRleHQuY3VzdG9tID0gZXh0ZW5kKHRoaXMuY29uZmlnLmNvbnRleHQuY3VzdG9tIHx8IHt9LCBjdXN0b21Db250ZXh0KTtcbiAgfTtcblxuICBfcHJvdG8uYWRkTGFiZWxzID0gZnVuY3Rpb24gYWRkTGFiZWxzKHRhZ3MpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5jb250ZXh0LnRhZ3MpIHtcbiAgICAgIHRoaXMuY29uZmlnLmNvbnRleHQudGFncyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGFncyk7XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICByZXR1cm4gc2V0TGFiZWwoaywgdGFnc1trXSwgX3RoaXMuY29uZmlnLmNvbnRleHQudGFncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLnNldENvbmZpZyA9IGZ1bmN0aW9uIHNldENvbmZpZyhwcm9wZXJ0aWVzKSB7XG4gICAgaWYgKHByb3BlcnRpZXMgPT09IHZvaWQgMCkge1xuICAgICAgcHJvcGVydGllcyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBfcHJvcGVydGllcyA9IHByb3BlcnRpZXMsXG4gICAgICAgIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSA9IF9wcm9wZXJ0aWVzLnRyYW5zYWN0aW9uU2FtcGxlUmF0ZSxcbiAgICAgICAgc2VydmVyVXJsID0gX3Byb3BlcnRpZXMuc2VydmVyVXJsO1xuXG4gICAgaWYgKHNlcnZlclVybCkge1xuICAgICAgcHJvcGVydGllcy5zZXJ2ZXJVcmwgPSBzZXJ2ZXJVcmwucmVwbGFjZSgvXFwvKyQvLCAnJyk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0cmFuc2FjdGlvblNhbXBsZVJhdGUpKSB7XG4gICAgICBpZiAodHJhbnNhY3Rpb25TYW1wbGVSYXRlIDwgMC4wMDAxICYmIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSA+IDApIHtcbiAgICAgICAgdHJhbnNhY3Rpb25TYW1wbGVSYXRlID0gMC4wMDAxO1xuICAgICAgfVxuXG4gICAgICBwcm9wZXJ0aWVzLnRyYW5zYWN0aW9uU2FtcGxlUmF0ZSA9IE1hdGgucm91bmQodHJhbnNhY3Rpb25TYW1wbGVSYXRlICogMTAwMDApIC8gMTAwMDA7XG4gICAgfVxuXG4gICAgbWVyZ2UodGhpcy5jb25maWcsIHByb3BlcnRpZXMpO1xuICAgIHRoaXMuZXZlbnRzLnNlbmQoQ09ORklHX0NIQU5HRSwgW3RoaXMuY29uZmlnXSk7XG4gIH07XG5cbiAgX3Byb3RvLnZhbGlkYXRlID0gZnVuY3Rpb24gdmFsaWRhdGUocHJvcGVydGllcykge1xuICAgIGlmIChwcm9wZXJ0aWVzID09PSB2b2lkIDApIHtcbiAgICAgIHByb3BlcnRpZXMgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgcmVxdWlyZWRLZXlzID0gWydzZXJ2aWNlTmFtZScsICdzZXJ2ZXJVcmwnXTtcbiAgICB2YXIgYWxsS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnKTtcbiAgICB2YXIgZXJyb3JzID0ge1xuICAgICAgbWlzc2luZzogW10sXG4gICAgICBpbnZhbGlkOiBbXSxcbiAgICAgIHVua25vd246IFtdXG4gICAgfTtcbiAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChyZXF1aXJlZEtleXMuaW5kZXhPZihrZXkpICE9PSAtMSAmJiAhcHJvcGVydGllc1trZXldKSB7XG4gICAgICAgIGVycm9ycy5taXNzaW5nLnB1c2goa2V5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFsbEtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICBlcnJvcnMudW5rbm93bi5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocHJvcGVydGllcy5zZXJ2aWNlTmFtZSAmJiAhL15bYS16QS1aMC05IF8tXSskLy50ZXN0KHByb3BlcnRpZXMuc2VydmljZU5hbWUpKSB7XG4gICAgICBlcnJvcnMuaW52YWxpZC5wdXNoKHtcbiAgICAgICAga2V5OiAnc2VydmljZU5hbWUnLFxuICAgICAgICB2YWx1ZTogcHJvcGVydGllcy5zZXJ2aWNlTmFtZSxcbiAgICAgICAgYWxsb3dlZDogJ2EteiwgQS1aLCAwLTksIF8sIC0sIDxzcGFjZT4nXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHByb3BlcnRpZXMudHJhbnNhY3Rpb25TYW1wbGVSYXRlO1xuXG4gICAgaWYgKHR5cGVvZiBzYW1wbGVSYXRlICE9PSAndW5kZWZpbmVkJyAmJiAodHlwZW9mIHNhbXBsZVJhdGUgIT09ICdudW1iZXInIHx8IGlzTmFOKHNhbXBsZVJhdGUpIHx8IHNhbXBsZVJhdGUgPCAwIHx8IHNhbXBsZVJhdGUgPiAxKSkge1xuICAgICAgZXJyb3JzLmludmFsaWQucHVzaCh7XG4gICAgICAgIGtleTogJ3RyYW5zYWN0aW9uU2FtcGxlUmF0ZScsXG4gICAgICAgIHZhbHVlOiBzYW1wbGVSYXRlLFxuICAgICAgICBhbGxvd2VkOiAnTnVtYmVyIGJldHdlZW4gMCBhbmQgMSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBlcnJvcnM7XG4gIH07XG5cbiAgX3Byb3RvLmdldExvY2FsQ29uZmlnID0gZnVuY3Rpb24gZ2V0TG9jYWxDb25maWcoKSB7XG4gICAgdmFyIHN0b3JhZ2UgPSBzZXNzaW9uU3RvcmFnZTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5zZXNzaW9uKSB7XG4gICAgICBzdG9yYWdlID0gbG9jYWxTdG9yYWdlO1xuICAgIH1cblxuICAgIHZhciBjb25maWcgPSBzdG9yYWdlLmdldEl0ZW0oTE9DQUxfQ09ORklHX0tFWSk7XG5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShjb25maWcpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uc2V0TG9jYWxDb25maWcgPSBmdW5jdGlvbiBzZXRMb2NhbENvbmZpZyhjb25maWcsIG1lcmdlKSB7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgaWYgKG1lcmdlKSB7XG4gICAgICAgIHZhciBwcmV2Q29uZmlnID0gdGhpcy5nZXRMb2NhbENvbmZpZygpO1xuICAgICAgICBjb25maWcgPSBfZXh0ZW5kcyh7fSwgcHJldkNvbmZpZywgY29uZmlnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0b3JhZ2UgPSBzZXNzaW9uU3RvcmFnZTtcblxuICAgICAgaWYgKHRoaXMuY29uZmlnLnNlc3Npb24pIHtcbiAgICAgICAgc3RvcmFnZSA9IGxvY2FsU3RvcmFnZTtcbiAgICAgIH1cblxuICAgICAgc3RvcmFnZS5zZXRJdGVtKExPQ0FMX0NPTkZJR19LRVksIEpTT04uc3RyaW5naWZ5KGNvbmZpZykpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQobmFtZSwgYXJncykge1xuICAgIHRoaXMuZXZlbnRzLnNlbmQobmFtZSwgYXJncyk7XG4gIH07XG5cbiAgX3Byb3RvLm9ic2VydmVFdmVudCA9IGZ1bmN0aW9uIG9ic2VydmVFdmVudChuYW1lLCBmbikge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vYnNlcnZlKG5hbWUsIGZuKTtcbiAgfTtcblxuICByZXR1cm4gQ29uZmlnO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBDb25maWc7IiwidmFyIFNDSEVEVUxFID0gJ3NjaGVkdWxlJztcbnZhciBJTlZPS0UgPSAnaW52b2tlJztcbnZhciBBRERfRVZFTlRfTElTVEVORVJfU1RSID0gJ2FkZEV2ZW50TGlzdGVuZXInO1xudmFyIFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIgPSAncmVtb3ZlRXZlbnRMaXN0ZW5lcic7XG52YXIgUkVTT1VSQ0VfSU5JVElBVE9SX1RZUEVTID0gWydsaW5rJywgJ2NzcycsICdzY3JpcHQnLCAnaW1nJywgJ3htbGh0dHByZXF1ZXN0JywgJ2ZldGNoJywgJ2JlYWNvbicsICdpZnJhbWUnXTtcbnZhciBSRVVTQUJJTElUWV9USFJFU0hPTEQgPSA1MDAwO1xudmFyIE1BWF9TUEFOX0RVUkFUSU9OID0gNSAqIDYwICogMTAwMDtcbnZhciBQQUdFX0xPQURfREVMQVkgPSAxMDAwO1xudmFyIFBBR0VfTE9BRCA9ICdwYWdlLWxvYWQnO1xudmFyIFJPVVRFX0NIQU5HRSA9ICdyb3V0ZS1jaGFuZ2UnO1xudmFyIFRZUEVfQ1VTVE9NID0gJ2N1c3RvbSc7XG52YXIgVVNFUl9JTlRFUkFDVElPTiA9ICd1c2VyLWludGVyYWN0aW9uJztcbnZhciBIVFRQX1JFUVVFU1RfVFlQRSA9ICdodHRwLXJlcXVlc3QnO1xudmFyIFRFTVBPUkFSWV9UWVBFID0gJ3RlbXBvcmFyeSc7XG52YXIgTkFNRV9VTktOT1dOID0gJ1Vua25vd24nO1xudmFyIFRSQU5TQUNUSU9OX1RZUEVfT1JERVIgPSBbUEFHRV9MT0FELCBST1VURV9DSEFOR0UsIFVTRVJfSU5URVJBQ1RJT04sIEhUVFBfUkVRVUVTVF9UWVBFLCBUWVBFX0NVU1RPTSwgVEVNUE9SQVJZX1RZUEVdO1xudmFyIE9VVENPTUVfU1VDQ0VTUyA9ICdzdWNjZXNzJztcbnZhciBPVVRDT01FX0ZBSUxVUkUgPSAnZmFpbHVyZSc7XG52YXIgT1VUQ09NRV9VTktOT1dOID0gJ3Vua25vd24nO1xudmFyIFVTRVJfVElNSU5HX1RIUkVTSE9MRCA9IDYwO1xudmFyIFRSQU5TQUNUSU9OX1NUQVJUID0gJ3RyYW5zYWN0aW9uOnN0YXJ0JztcbnZhciBUUkFOU0FDVElPTl9FTkQgPSAndHJhbnNhY3Rpb246ZW5kJztcbnZhciBDT05GSUdfQ0hBTkdFID0gJ2NvbmZpZzpjaGFuZ2UnO1xudmFyIFFVRVVFX0ZMVVNIID0gJ3F1ZXVlOmZsdXNoJztcbnZhciBRVUVVRV9BRERfVFJBTlNBQ1RJT04gPSAncXVldWU6YWRkX3RyYW5zYWN0aW9uJztcbnZhciBYTUxIVFRQUkVRVUVTVCA9ICd4bWxodHRwcmVxdWVzdCc7XG52YXIgRkVUQ0ggPSAnZmV0Y2gnO1xudmFyIEhJU1RPUlkgPSAnaGlzdG9yeSc7XG52YXIgRVZFTlRfVEFSR0VUID0gJ2V2ZW50dGFyZ2V0JztcbnZhciBDTElDSyA9ICdjbGljayc7XG52YXIgRVJST1IgPSAnZXJyb3InO1xudmFyIEJFRk9SRV9FVkVOVCA9ICc6YmVmb3JlJztcbnZhciBBRlRFUl9FVkVOVCA9ICc6YWZ0ZXInO1xudmFyIExPQ0FMX0NPTkZJR19LRVkgPSAnZWxhc3RpY19hcG1fY29uZmlnJztcbnZhciBMT05HX1RBU0sgPSAnbG9uZ3Rhc2snO1xudmFyIFBBSU5UID0gJ3BhaW50JztcbnZhciBNRUFTVVJFID0gJ21lYXN1cmUnO1xudmFyIE5BVklHQVRJT04gPSAnbmF2aWdhdGlvbic7XG52YXIgUkVTT1VSQ0UgPSAncmVzb3VyY2UnO1xudmFyIEZJUlNUX0NPTlRFTlRGVUxfUEFJTlQgPSAnZmlyc3QtY29udGVudGZ1bC1wYWludCc7XG52YXIgTEFSR0VTVF9DT05URU5URlVMX1BBSU5UID0gJ2xhcmdlc3QtY29udGVudGZ1bC1wYWludCc7XG52YXIgRklSU1RfSU5QVVQgPSAnZmlyc3QtaW5wdXQnO1xudmFyIExBWU9VVF9TSElGVCA9ICdsYXlvdXQtc2hpZnQnO1xudmFyIEVSUk9SUyA9ICdlcnJvcnMnO1xudmFyIFRSQU5TQUNUSU9OUyA9ICd0cmFuc2FjdGlvbnMnO1xudmFyIENPTkZJR19TRVJWSUNFID0gJ0NvbmZpZ1NlcnZpY2UnO1xudmFyIExPR0dJTkdfU0VSVklDRSA9ICdMb2dnaW5nU2VydmljZSc7XG52YXIgVFJBTlNBQ1RJT05fU0VSVklDRSA9ICdUcmFuc2FjdGlvblNlcnZpY2UnO1xudmFyIEFQTV9TRVJWRVIgPSAnQXBtU2VydmVyJztcbnZhciBQRVJGT1JNQU5DRV9NT05JVE9SSU5HID0gJ1BlcmZvcm1hbmNlTW9uaXRvcmluZyc7XG52YXIgRVJST1JfTE9HR0lORyA9ICdFcnJvckxvZ2dpbmcnO1xudmFyIFRSVU5DQVRFRF9UWVBFID0gJy50cnVuY2F0ZWQnO1xudmFyIEtFWVdPUkRfTElNSVQgPSAxMDI0O1xudmFyIFNFU1NJT05fVElNRU9VVCA9IDMwICogNjAwMDA7XG52YXIgSFRUUF9SRVFVRVNUX1RJTUVPVVQgPSAxMDAwMDtcbmV4cG9ydCB7IFNDSEVEVUxFLCBJTlZPS0UsIEFERF9FVkVOVF9MSVNURU5FUl9TVFIsIFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIsIFJFU09VUkNFX0lOSVRJQVRPUl9UWVBFUywgUkVVU0FCSUxJVFlfVEhSRVNIT0xELCBNQVhfU1BBTl9EVVJBVElPTiwgUEFHRV9MT0FEX0RFTEFZLCBQQUdFX0xPQUQsIFJPVVRFX0NIQU5HRSwgTkFNRV9VTktOT1dOLCBUWVBFX0NVU1RPTSwgVVNFUl9USU1JTkdfVEhSRVNIT0xELCBUUkFOU0FDVElPTl9TVEFSVCwgVFJBTlNBQ1RJT05fRU5ELCBDT05GSUdfQ0hBTkdFLCBRVUVVRV9GTFVTSCwgUVVFVUVfQUREX1RSQU5TQUNUSU9OLCBYTUxIVFRQUkVRVUVTVCwgRkVUQ0gsIEhJU1RPUlksIEVWRU5UX1RBUkdFVCwgQ0xJQ0ssIEVSUk9SLCBCRUZPUkVfRVZFTlQsIEFGVEVSX0VWRU5ULCBMT0NBTF9DT05GSUdfS0VZLCBIVFRQX1JFUVVFU1RfVFlQRSwgTE9OR19UQVNLLCBQQUlOVCwgTUVBU1VSRSwgTkFWSUdBVElPTiwgUkVTT1VSQ0UsIEZJUlNUX0NPTlRFTlRGVUxfUEFJTlQsIExBUkdFU1RfQ09OVEVOVEZVTF9QQUlOVCwgS0VZV09SRF9MSU1JVCwgVEVNUE9SQVJZX1RZUEUsIFVTRVJfSU5URVJBQ1RJT04sIFRSQU5TQUNUSU9OX1RZUEVfT1JERVIsIEVSUk9SUywgVFJBTlNBQ1RJT05TLCBDT05GSUdfU0VSVklDRSwgTE9HR0lOR19TRVJWSUNFLCBUUkFOU0FDVElPTl9TRVJWSUNFLCBBUE1fU0VSVkVSLCBQRVJGT1JNQU5DRV9NT05JVE9SSU5HLCBFUlJPUl9MT0dHSU5HLCBUUlVOQ0FURURfVFlQRSwgRklSU1RfSU5QVVQsIExBWU9VVF9TSElGVCwgT1VUQ09NRV9TVUNDRVNTLCBPVVRDT01FX0ZBSUxVUkUsIE9VVENPTUVfVU5LTk9XTiwgU0VTU0lPTl9USU1FT1VULCBIVFRQX1JFUVVFU1RfVElNRU9VVCB9OyIsInZhciBfZXhjbHVkZWQgPSBbXCJ0YWdzXCJdO1xuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0ge307IHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgdmFyIGtleSwgaTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmltcG9ydCB7IFVybCB9IGZyb20gJy4vdXJsJztcbmltcG9ydCB7IFBBR0VfTE9BRCwgTkFWSUdBVElPTiB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGdldFNlcnZlclRpbWluZ0luZm8sIFBFUkYsIGlzUGVyZlRpbWVsaW5lU3VwcG9ydGVkIH0gZnJvbSAnLi91dGlscyc7XG52YXIgTEVGVF9TUVVBUkVfQlJBQ0tFVCA9IDkxO1xudmFyIFJJR0hUX1NRVUFSRV9CUkFDS0VUID0gOTM7XG52YXIgRVhURVJOQUwgPSAnZXh0ZXJuYWwnO1xudmFyIFJFU09VUkNFID0gJ3Jlc291cmNlJztcbnZhciBIQVJEX05BVklHQVRJT04gPSAnaGFyZC1uYXZpZ2F0aW9uJztcblxuZnVuY3Rpb24gZ2V0UG9ydE51bWJlcihwb3J0LCBwcm90b2NvbCkge1xuICBpZiAocG9ydCA9PT0gJycpIHtcbiAgICBwb3J0ID0gcHJvdG9jb2wgPT09ICdodHRwOicgPyAnODAnIDogcHJvdG9jb2wgPT09ICdodHRwczonID8gJzQ0MycgOiAnJztcbiAgfVxuXG4gIHJldHVybiBwb3J0O1xufVxuXG5mdW5jdGlvbiBnZXRSZXNwb25zZUNvbnRleHQocGVyZlRpbWluZ0VudHJ5KSB7XG4gIHZhciB0cmFuc2ZlclNpemUgPSBwZXJmVGltaW5nRW50cnkudHJhbnNmZXJTaXplLFxuICAgICAgZW5jb2RlZEJvZHlTaXplID0gcGVyZlRpbWluZ0VudHJ5LmVuY29kZWRCb2R5U2l6ZSxcbiAgICAgIGRlY29kZWRCb2R5U2l6ZSA9IHBlcmZUaW1pbmdFbnRyeS5kZWNvZGVkQm9keVNpemUsXG4gICAgICBzZXJ2ZXJUaW1pbmcgPSBwZXJmVGltaW5nRW50cnkuc2VydmVyVGltaW5nO1xuICB2YXIgcmVzcENvbnRleHQgPSB7XG4gICAgdHJhbnNmZXJfc2l6ZTogdHJhbnNmZXJTaXplLFxuICAgIGVuY29kZWRfYm9keV9zaXplOiBlbmNvZGVkQm9keVNpemUsXG4gICAgZGVjb2RlZF9ib2R5X3NpemU6IGRlY29kZWRCb2R5U2l6ZVxuICB9O1xuICB2YXIgc2VydmVyVGltaW5nU3RyID0gZ2V0U2VydmVyVGltaW5nSW5mbyhzZXJ2ZXJUaW1pbmcpO1xuXG4gIGlmIChzZXJ2ZXJUaW1pbmdTdHIpIHtcbiAgICByZXNwQ29udGV4dC5oZWFkZXJzID0ge1xuICAgICAgJ3NlcnZlci10aW1pbmcnOiBzZXJ2ZXJUaW1pbmdTdHJcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHJlc3BDb250ZXh0O1xufVxuXG5mdW5jdGlvbiBnZXREZXN0aW5hdGlvbihwYXJzZWRVcmwpIHtcbiAgdmFyIHBvcnQgPSBwYXJzZWRVcmwucG9ydCxcbiAgICAgIHByb3RvY29sID0gcGFyc2VkVXJsLnByb3RvY29sLFxuICAgICAgaG9zdG5hbWUgPSBwYXJzZWRVcmwuaG9zdG5hbWU7XG4gIHZhciBwb3J0TnVtYmVyID0gZ2V0UG9ydE51bWJlcihwb3J0LCBwcm90b2NvbCk7XG4gIHZhciBpcHY2SG9zdG5hbWUgPSBob3N0bmFtZS5jaGFyQ29kZUF0KDApID09PSBMRUZUX1NRVUFSRV9CUkFDS0VUICYmIGhvc3RuYW1lLmNoYXJDb2RlQXQoaG9zdG5hbWUubGVuZ3RoIC0gMSkgPT09IFJJR0hUX1NRVUFSRV9CUkFDS0VUO1xuICB2YXIgYWRkcmVzcyA9IGhvc3RuYW1lO1xuXG4gIGlmIChpcHY2SG9zdG5hbWUpIHtcbiAgICBhZGRyZXNzID0gaG9zdG5hbWUuc2xpY2UoMSwgLTEpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXJ2aWNlOiB7XG4gICAgICByZXNvdXJjZTogaG9zdG5hbWUgKyAnOicgKyBwb3J0TnVtYmVyLFxuICAgICAgbmFtZTogJycsXG4gICAgICB0eXBlOiAnJ1xuICAgIH0sXG4gICAgYWRkcmVzczogYWRkcmVzcyxcbiAgICBwb3J0OiBOdW1iZXIocG9ydE51bWJlcilcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVzb3VyY2VDb250ZXh0KGRhdGEpIHtcbiAgdmFyIGVudHJ5ID0gZGF0YS5lbnRyeSxcbiAgICAgIHVybCA9IGRhdGEudXJsO1xuICB2YXIgcGFyc2VkVXJsID0gbmV3IFVybCh1cmwpO1xuICB2YXIgZGVzdGluYXRpb24gPSBnZXREZXN0aW5hdGlvbihwYXJzZWRVcmwpO1xuICByZXR1cm4ge1xuICAgIGh0dHA6IHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgcmVzcG9uc2U6IGdldFJlc3BvbnNlQ29udGV4dChlbnRyeSlcbiAgICB9LFxuICAgIGRlc3RpbmF0aW9uOiBkZXN0aW5hdGlvblxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRFeHRlcm5hbENvbnRleHQoZGF0YSkge1xuICB2YXIgdXJsID0gZGF0YS51cmwsXG4gICAgICBtZXRob2QgPSBkYXRhLm1ldGhvZCxcbiAgICAgIHRhcmdldCA9IGRhdGEudGFyZ2V0LFxuICAgICAgcmVzcG9uc2UgPSBkYXRhLnJlc3BvbnNlO1xuICB2YXIgcGFyc2VkVXJsID0gbmV3IFVybCh1cmwpO1xuICB2YXIgZGVzdGluYXRpb24gPSBnZXREZXN0aW5hdGlvbihwYXJzZWRVcmwpO1xuICB2YXIgY29udGV4dCA9IHtcbiAgICBodHRwOiB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogcGFyc2VkVXJsLmhyZWZcbiAgICB9LFxuICAgIGRlc3RpbmF0aW9uOiBkZXN0aW5hdGlvblxuICB9O1xuICB2YXIgc3RhdHVzQ29kZTtcblxuICBpZiAodGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQuc3RhdHVzICE9PSAndW5kZWZpbmVkJykge1xuICAgIHN0YXR1c0NvZGUgPSB0YXJnZXQuc3RhdHVzO1xuICB9IGVsc2UgaWYgKHJlc3BvbnNlKSB7XG4gICAgc3RhdHVzQ29kZSA9IHJlc3BvbnNlLnN0YXR1cztcbiAgfVxuXG4gIGNvbnRleHQuaHR0cC5zdGF0dXNfY29kZSA9IHN0YXR1c0NvZGU7XG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5mdW5jdGlvbiBnZXROYXZpZ2F0aW9uQ29udGV4dChkYXRhKSB7XG4gIHZhciB1cmwgPSBkYXRhLnVybDtcbiAgdmFyIHBhcnNlZFVybCA9IG5ldyBVcmwodXJsKTtcbiAgdmFyIGRlc3RpbmF0aW9uID0gZ2V0RGVzdGluYXRpb24ocGFyc2VkVXJsKTtcbiAgcmV0dXJuIHtcbiAgICBkZXN0aW5hdGlvbjogZGVzdGluYXRpb25cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhZ2VDb250ZXh0KCkge1xuICByZXR1cm4ge1xuICAgIHBhZ2U6IHtcbiAgICAgIHJlZmVyZXI6IGRvY3VtZW50LnJlZmVycmVyLFxuICAgICAgdXJsOiBsb2NhdGlvbi5ocmVmXG4gICAgfVxuICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFNwYW5Db250ZXh0KHNwYW4sIGRhdGEpIHtcbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHR5cGUgPSBzcGFuLnR5cGU7XG4gIHZhciBjb250ZXh0O1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgRVhURVJOQUw6XG4gICAgICBjb250ZXh0ID0gZ2V0RXh0ZXJuYWxDb250ZXh0KGRhdGEpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFJFU09VUkNFOlxuICAgICAgY29udGV4dCA9IGdldFJlc291cmNlQ29udGV4dChkYXRhKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBIQVJEX05BVklHQVRJT046XG4gICAgICBjb250ZXh0ID0gZ2V0TmF2aWdhdGlvbkNvbnRleHQoZGF0YSk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHNwYW4uYWRkQ29udGV4dChjb250ZXh0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRUcmFuc2FjdGlvbkNvbnRleHQodHJhbnNhY3Rpb24sIF90ZW1wKSB7XG4gIHZhciBfcmVmID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICB0YWdzID0gX3JlZi50YWdzLFxuICAgICAgY29uZmlnQ29udGV4dCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYsIF9leGNsdWRlZCk7XG5cbiAgdmFyIHBhZ2VDb250ZXh0ID0gZ2V0UGFnZUNvbnRleHQoKTtcbiAgdmFyIHJlc3BvbnNlQ29udGV4dCA9IHt9O1xuXG4gIGlmICh0cmFuc2FjdGlvbi50eXBlID09PSBQQUdFX0xPQUQgJiYgaXNQZXJmVGltZWxpbmVTdXBwb3J0ZWQoKSkge1xuICAgIHZhciBlbnRyaWVzID0gUEVSRi5nZXRFbnRyaWVzQnlUeXBlKE5BVklHQVRJT04pO1xuXG4gICAgaWYgKGVudHJpZXMgJiYgZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXNwb25zZUNvbnRleHQgPSB7XG4gICAgICAgIHJlc3BvbnNlOiBnZXRSZXNwb25zZUNvbnRleHQoZW50cmllc1swXSlcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgdHJhbnNhY3Rpb24uYWRkQ29udGV4dChwYWdlQ29udGV4dCwgcmVzcG9uc2VDb250ZXh0LCBjb25maWdDb250ZXh0KTtcbn0iLCJpbXBvcnQgeyBCRUZPUkVfRVZFTlQsIEFGVEVSX0VWRU5UIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG52YXIgRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBFdmVudEhhbmRsZXIoKSB7XG4gICAgdGhpcy5vYnNlcnZlcnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBFdmVudEhhbmRsZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5vYnNlcnZlID0gZnVuY3Rpb24gb2JzZXJ2ZShuYW1lLCBmbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoIXRoaXMub2JzZXJ2ZXJzW25hbWVdKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzW25hbWVdID0gW107XG4gICAgICB9XG5cbiAgICAgIHRoaXMub2JzZXJ2ZXJzW25hbWVdLnB1c2goZm4pO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gX3RoaXMub2JzZXJ2ZXJzW25hbWVdLmluZGV4T2YoZm4pO1xuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgX3RoaXMub2JzZXJ2ZXJzW25hbWVdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5zZW5kT25seSA9IGZ1bmN0aW9uIHNlbmRPbmx5KG5hbWUsIGFyZ3MpIHtcbiAgICB2YXIgb2JzID0gdGhpcy5vYnNlcnZlcnNbbmFtZV07XG5cbiAgICBpZiAob2JzKSB7XG4gICAgICBvYnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLCBlcnJvci5zdGFjayk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uc2VuZCA9IGZ1bmN0aW9uIHNlbmQobmFtZSwgYXJncykge1xuICAgIHRoaXMuc2VuZE9ubHkobmFtZSArIEJFRk9SRV9FVkVOVCwgYXJncyk7XG4gICAgdGhpcy5zZW5kT25seShuYW1lLCBhcmdzKTtcbiAgICB0aGlzLnNlbmRPbmx5KG5hbWUgKyBBRlRFUl9FVkVOVCwgYXJncyk7XG4gIH07XG5cbiAgcmV0dXJuIEV2ZW50SGFuZGxlcjtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyOyIsImZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmltcG9ydCB7IEhUVFBfUkVRVUVTVF9USU1FT1VUIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IGlzUmVzcG9uc2VTdWNjZXNzZnVsIH0gZnJvbSAnLi9yZXNwb25zZS1zdGF0dXMnO1xuZXhwb3J0IHZhciBCWVRFX0xJTUlUID0gNjAgKiAxMDAwO1xuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZFVzZUZldGNoV2l0aEtlZXBBbGl2ZShtZXRob2QsIHBheWxvYWQpIHtcbiAgaWYgKCFpc0ZldGNoU3VwcG9ydGVkKCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaXNLZWVwQWxpdmVTdXBwb3J0ZWQgPSAoJ2tlZXBhbGl2ZScgaW4gbmV3IFJlcXVlc3QoJycpKTtcblxuICBpZiAoIWlzS2VlcEFsaXZlU3VwcG9ydGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHNpemUgPSBjYWxjdWxhdGVTaXplKHBheWxvYWQpO1xuICByZXR1cm4gbWV0aG9kID09PSAnUE9TVCcgJiYgc2l6ZSA8IEJZVEVfTElNSVQ7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VuZEZldGNoUmVxdWVzdChtZXRob2QsIHVybCwgX3JlZikge1xuICB2YXIgX3JlZiRrZWVwYWxpdmUgPSBfcmVmLmtlZXBhbGl2ZSxcbiAgICAgIGtlZXBhbGl2ZSA9IF9yZWYka2VlcGFsaXZlID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWYka2VlcGFsaXZlLFxuICAgICAgX3JlZiR0aW1lb3V0ID0gX3JlZi50aW1lb3V0LFxuICAgICAgdGltZW91dCA9IF9yZWYkdGltZW91dCA9PT0gdm9pZCAwID8gSFRUUF9SRVFVRVNUX1RJTUVPVVQgOiBfcmVmJHRpbWVvdXQsXG4gICAgICBwYXlsb2FkID0gX3JlZi5wYXlsb2FkLFxuICAgICAgaGVhZGVycyA9IF9yZWYuaGVhZGVycyxcbiAgICAgIHNlbmRDcmVkZW50aWFscyA9IF9yZWYuc2VuZENyZWRlbnRpYWxzO1xuICB2YXIgdGltZW91dENvbmZpZyA9IHt9O1xuXG4gIGlmICh0eXBlb2YgQWJvcnRDb250cm9sbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgdGltZW91dENvbmZpZy5zaWduYWwgPSBjb250cm9sbGVyLnNpZ25hbDtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBjb250cm9sbGVyLmFib3J0KCk7XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICB2YXIgZmV0Y2hSZXNwb25zZTtcbiAgcmV0dXJuIHdpbmRvdy5mZXRjaCh1cmwsIF9leHRlbmRzKHtcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgbWV0aG9kOiBtZXRob2QsXG4gICAga2VlcGFsaXZlOiBrZWVwYWxpdmUsXG4gICAgY3JlZGVudGlhbHM6IHNlbmRDcmVkZW50aWFscyA/ICdpbmNsdWRlJyA6ICdvbWl0J1xuICB9LCB0aW1lb3V0Q29uZmlnKSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICBmZXRjaFJlc3BvbnNlID0gcmVzcG9uc2U7XG4gICAgcmV0dXJuIGZldGNoUmVzcG9uc2UudGV4dCgpO1xuICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcbiAgICB2YXIgYm9keVJlc3BvbnNlID0ge1xuICAgICAgdXJsOiB1cmwsXG4gICAgICBzdGF0dXM6IGZldGNoUmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHRcbiAgICB9O1xuXG4gICAgaWYgKCFpc1Jlc3BvbnNlU3VjY2Vzc2Z1bChmZXRjaFJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICAgIHRocm93IGJvZHlSZXNwb25zZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYm9keVJlc3BvbnNlO1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0ZldGNoU3VwcG9ydGVkKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdy5mZXRjaCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygd2luZG93LlJlcXVlc3QgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVNpemUocGF5bG9hZCkge1xuICBpZiAoIXBheWxvYWQpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChwYXlsb2FkIGluc3RhbmNlb2YgQmxvYikge1xuICAgIHJldHVybiBwYXlsb2FkLnNpemU7XG4gIH1cblxuICByZXR1cm4gbmV3IEJsb2IoW3BheWxvYWRdKS5zaXplO1xufSIsImV4cG9ydCBmdW5jdGlvbiBpc1Jlc3BvbnNlU3VjY2Vzc2Z1bChzdGF0dXMpIHtcbiAgaWYgKHN0YXR1cyA9PT0gMCB8fCBzdGF0dXMgPiAzOTkgJiYgc3RhdHVzIDwgNjAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59IiwiaW1wb3J0IHsgWEhSX0lHTk9SRSB9IGZyb20gJy4uL3BhdGNoaW5nL3BhdGNoLXV0aWxzJztcbmltcG9ydCB7IGlzUmVzcG9uc2VTdWNjZXNzZnVsIH0gZnJvbSAnLi9yZXNwb25zZS1zdGF0dXMnO1xuaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4uL3BvbHlmaWxscyc7XG5leHBvcnQgZnVuY3Rpb24gc2VuZFhIUihtZXRob2QsIHVybCwgX3JlZikge1xuICB2YXIgX3JlZiR0aW1lb3V0ID0gX3JlZi50aW1lb3V0LFxuICAgICAgdGltZW91dCA9IF9yZWYkdGltZW91dCA9PT0gdm9pZCAwID8gSFRUUF9SRVFVRVNUX1RJTUVPVVQgOiBfcmVmJHRpbWVvdXQsXG4gICAgICBwYXlsb2FkID0gX3JlZi5wYXlsb2FkLFxuICAgICAgaGVhZGVycyA9IF9yZWYuaGVhZGVycyxcbiAgICAgIGJlZm9yZVNlbmQgPSBfcmVmLmJlZm9yZVNlbmQsXG4gICAgICBzZW5kQ3JlZGVudGlhbHMgPSBfcmVmLnNlbmRDcmVkZW50aWFscztcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhocltYSFJfSUdOT1JFXSA9IHRydWU7XG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgIHhoci50aW1lb3V0ID0gdGltZW91dDtcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gc2VuZENyZWRlbnRpYWxzO1xuXG4gICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgIGZvciAodmFyIGhlYWRlciBpbiBoZWFkZXJzKSB7XG4gICAgICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KGhlYWRlcikpIHtcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgcmVzcG9uc2VUZXh0ID0geGhyLnJlc3BvbnNlVGV4dDtcblxuICAgICAgICBpZiAoaXNSZXNwb25zZVN1Y2Nlc3NmdWwoc3RhdHVzKSkge1xuICAgICAgICAgIHJlc29sdmUoeGhyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgICAgIHJlc3BvbnNlVGV4dDogcmVzcG9uc2VUZXh0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RhdHVzID0geGhyLnN0YXR1cyxcbiAgICAgICAgICByZXNwb25zZVRleHQgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgcmVqZWN0KHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICByZXNwb25zZVRleHQ6IHJlc3BvbnNlVGV4dFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBjYW5TZW5kID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgYmVmb3JlU2VuZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FuU2VuZCA9IGJlZm9yZVNlbmQoe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgIHhocjogeGhyXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY2FuU2VuZCkge1xuICAgICAgeGhyLnNlbmQocGF5bG9hZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlamVjdCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBzdGF0dXM6IDAsXG4gICAgICAgIHJlc3BvbnNlVGV4dDogJ1JlcXVlc3QgcmVqZWN0ZWQgYnkgdXNlciBjb25maWd1cmF0aW9uLidcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59IiwiaW1wb3J0IHsgWE1MSFRUUFJFUVVFU1QsIEZFVENILCBISVNUT1JZLCBQQUdFX0xPQUQsIEVSUk9SLCBFVkVOVF9UQVJHRVQsIENMSUNLIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIGdldEluc3RydW1lbnRhdGlvbkZsYWdzKGluc3RydW1lbnQsIGRpc2FibGVkSW5zdHJ1bWVudGF0aW9ucykge1xuICB2YXIgX2ZsYWdzO1xuXG4gIHZhciBmbGFncyA9IChfZmxhZ3MgPSB7fSwgX2ZsYWdzW1hNTEhUVFBSRVFVRVNUXSA9IGZhbHNlLCBfZmxhZ3NbRkVUQ0hdID0gZmFsc2UsIF9mbGFnc1tISVNUT1JZXSA9IGZhbHNlLCBfZmxhZ3NbUEFHRV9MT0FEXSA9IGZhbHNlLCBfZmxhZ3NbRVJST1JdID0gZmFsc2UsIF9mbGFnc1tFVkVOVF9UQVJHRVRdID0gZmFsc2UsIF9mbGFnc1tDTElDS10gPSBmYWxzZSwgX2ZsYWdzKTtcblxuICBpZiAoIWluc3RydW1lbnQpIHtcbiAgICByZXR1cm4gZmxhZ3M7XG4gIH1cblxuICBPYmplY3Qua2V5cyhmbGFncykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGRpc2FibGVkSW5zdHJ1bWVudGF0aW9ucy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICBmbGFnc1trZXldID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmxhZ3M7XG59IiwiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vdXRpbHMnO1xuXG52YXIgTG9nZ2luZ1NlcnZpY2UgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIExvZ2dpbmdTZXJ2aWNlKHNwZWMpIHtcbiAgICBpZiAoc3BlYyA9PT0gdm9pZCAwKSB7XG4gICAgICBzcGVjID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5sZXZlbHMgPSBbJ3RyYWNlJywgJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddO1xuICAgIHRoaXMubGV2ZWwgPSBzcGVjLmxldmVsIHx8ICd3YXJuJztcbiAgICB0aGlzLnByZWZpeCA9IHNwZWMucHJlZml4IHx8ICcnO1xuICAgIHRoaXMucmVzZXRMb2dNZXRob2RzKCk7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gTG9nZ2luZ1NlcnZpY2UucHJvdG90eXBlO1xuXG4gIF9wcm90by5zaG91bGRMb2cgPSBmdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcbiAgICByZXR1cm4gdGhpcy5sZXZlbHMuaW5kZXhPZihsZXZlbCkgPj0gdGhpcy5sZXZlbHMuaW5kZXhPZih0aGlzLmxldmVsKTtcbiAgfTtcblxuICBfcHJvdG8uc2V0TGV2ZWwgPSBmdW5jdGlvbiBzZXRMZXZlbChsZXZlbCkge1xuICAgIGlmIChsZXZlbCA9PT0gdGhpcy5sZXZlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGV2ZWwgPSBsZXZlbDtcbiAgICB0aGlzLnJlc2V0TG9nTWV0aG9kcygpO1xuICB9O1xuXG4gIF9wcm90by5yZXNldExvZ01ldGhvZHMgPSBmdW5jdGlvbiByZXNldExvZ01ldGhvZHMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMubGV2ZWxzLmZvckVhY2goZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICBfdGhpc1tsZXZlbF0gPSBfdGhpcy5zaG91bGRMb2cobGV2ZWwpID8gbG9nIDogbm9vcDtcblxuICAgICAgZnVuY3Rpb24gbG9nKCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZExldmVsID0gbGV2ZWw7XG5cbiAgICAgICAgaWYgKGxldmVsID09PSAndHJhY2UnIHx8IGxldmVsID09PSAnZGVidWcnKSB7XG4gICAgICAgICAgbm9ybWFsaXplZExldmVsID0gJ2luZm8nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIGFyZ3NbMF0gPSB0aGlzLnByZWZpeCArIGFyZ3NbMF07XG5cbiAgICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgICB2YXIgcmVhbE1ldGhvZCA9IGNvbnNvbGVbbm9ybWFsaXplZExldmVsXSB8fCBjb25zb2xlLmxvZztcblxuICAgICAgICAgIGlmICh0eXBlb2YgcmVhbE1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmVhbE1ldGhvZC5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gTG9nZ2luZ1NlcnZpY2U7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2dpbmdTZXJ2aWNlOyIsInZhciBOREpTT04gPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE5ESlNPTigpIHt9XG5cbiAgTkRKU09OLnN0cmluZ2lmeSA9IGZ1bmN0aW9uIHN0cmluZ2lmeShvYmplY3QpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0KSArICdcXG4nO1xuICB9O1xuXG4gIHJldHVybiBOREpTT047XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IE5ESlNPTjsiLCJpbXBvcnQgeyBVU0VSX0lOVEVSQUNUSU9OIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbnZhciBJTlRFUkFDVElWRV9TRUxFQ1RPUiA9ICdhW2RhdGEtdHJhbnNhY3Rpb24tbmFtZV0sIGJ1dHRvbltkYXRhLXRyYW5zYWN0aW9uLW5hbWVdJztcbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlUGFnZUNsaWNrcyh0cmFuc2FjdGlvblNlcnZpY2UpIHtcbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIGNsaWNrSGFuZGxlcihldmVudCkge1xuICAgIGlmIChldmVudC50YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICBjcmVhdGVVc2VySW50ZXJhY3Rpb25UcmFuc2FjdGlvbih0cmFuc2FjdGlvblNlcnZpY2UsIGV2ZW50LnRhcmdldCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBldmVudE5hbWUgPSAnY2xpY2snO1xuICB2YXIgdXNlQ2FwdHVyZSA9IHRydWU7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2xpY2tIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNsaWNrSGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVVzZXJJbnRlcmFjdGlvblRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uU2VydmljZSwgdGFyZ2V0KSB7XG4gIHZhciBfZ2V0VHJhbnNhY3Rpb25NZXRhZGEgPSBnZXRUcmFuc2FjdGlvbk1ldGFkYXRhKHRhcmdldCksXG4gICAgICB0cmFuc2FjdGlvbk5hbWUgPSBfZ2V0VHJhbnNhY3Rpb25NZXRhZGEudHJhbnNhY3Rpb25OYW1lLFxuICAgICAgY29udGV4dCA9IF9nZXRUcmFuc2FjdGlvbk1ldGFkYS5jb250ZXh0O1xuXG4gIHZhciB0ciA9IHRyYW5zYWN0aW9uU2VydmljZS5zdGFydFRyYW5zYWN0aW9uKFwiQ2xpY2sgLSBcIiArIHRyYW5zYWN0aW9uTmFtZSwgVVNFUl9JTlRFUkFDVElPTiwge1xuICAgIG1hbmFnZWQ6IHRydWUsXG4gICAgY2FuUmV1c2U6IHRydWUsXG4gICAgcmV1c2VUaHJlc2hvbGQ6IDMwMFxuICB9KTtcblxuICBpZiAodHIgJiYgY29udGV4dCkge1xuICAgIHRyLmFkZENvbnRleHQoY29udGV4dCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb25NZXRhZGF0YSh0YXJnZXQpIHtcbiAgdmFyIG1ldGFkYXRhID0ge1xuICAgIHRyYW5zYWN0aW9uTmFtZTogbnVsbCxcbiAgICBjb250ZXh0OiBudWxsXG4gIH07XG4gIG1ldGFkYXRhLnRyYW5zYWN0aW9uTmFtZSA9IGJ1aWxkVHJhbnNhY3Rpb25OYW1lKHRhcmdldCk7XG4gIHZhciBjbGFzc2VzID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcblxuICBpZiAoY2xhc3Nlcykge1xuICAgIG1ldGFkYXRhLmNvbnRleHQgPSB7XG4gICAgICBjdXN0b206IHtcbiAgICAgICAgY2xhc3NlczogY2xhc3Nlc1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gbWV0YWRhdGE7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkVHJhbnNhY3Rpb25OYW1lKHRhcmdldCkge1xuICB2YXIgZHROYW1lID0gZmluZEN1c3RvbVRyYW5zYWN0aW9uTmFtZSh0YXJnZXQpO1xuXG4gIGlmIChkdE5hbWUpIHtcbiAgICByZXR1cm4gZHROYW1lO1xuICB9XG5cbiAgdmFyIHRhZ05hbWUgPSB0YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICB2YXIgbmFtZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblxuICBpZiAoISFuYW1lKSB7XG4gICAgcmV0dXJuIHRhZ05hbWUgKyBcIltcXFwiXCIgKyBuYW1lICsgXCJcXFwiXVwiO1xuICB9XG5cbiAgcmV0dXJuIHRhZ05hbWU7XG59XG5cbmZ1bmN0aW9uIGZpbmRDdXN0b21UcmFuc2FjdGlvbk5hbWUodGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQuY2xvc2VzdCkge1xuICAgIHZhciBlbGVtZW50ID0gdGFyZ2V0LmNsb3Nlc3QoSU5URVJBQ1RJVkVfU0VMRUNUT1IpO1xuICAgIHJldHVybiBlbGVtZW50ID8gZWxlbWVudC5kYXRhc2V0LnRyYW5zYWN0aW9uTmFtZSA6IG51bGw7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0LmRhdGFzZXQudHJhbnNhY3Rpb25OYW1lO1xufSIsImltcG9ydCB7IFFVRVVFX0FERF9UUkFOU0FDVElPTiwgUVVFVUVfRkxVU0ggfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tICcuLi8uLi9zdGF0ZSc7XG5pbXBvcnQgeyBub3cgfSBmcm9tICcuLi91dGlscyc7XG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZVBhZ2VWaXNpYmlsaXR5KGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSkge1xuICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJykge1xuICAgIHN0YXRlLmxhc3RIaWRkZW5TdGFydCA9IDA7XG4gIH1cblxuICB2YXIgdmlzaWJpbGl0eUNoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbiB2aXNpYmlsaXR5Q2hhbmdlSGFuZGxlcigpIHtcbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgb25QYWdlSGlkZGVuKGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBwYWdlSGlkZUhhbmRsZXIgPSBmdW5jdGlvbiBwYWdlSGlkZUhhbmRsZXIoKSB7XG4gICAgcmV0dXJuIG9uUGFnZUhpZGRlbihjb25maWdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpO1xuICB9O1xuXG4gIHZhciB1c2VDYXB0dXJlID0gdHJ1ZTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCB2aXNpYmlsaXR5Q2hhbmdlSGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlaGlkZScsIHBhZ2VIaWRlSGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCB2aXNpYmlsaXR5Q2hhbmdlSGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BhZ2VoaWRlJywgcGFnZUhpZGVIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25QYWdlSGlkZGVuKGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSkge1xuICB2YXIgdHIgPSB0cmFuc2FjdGlvblNlcnZpY2UuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG5cbiAgaWYgKHRyKSB7XG4gICAgdmFyIHVub2JzZXJ2ZSA9IGNvbmZpZ1NlcnZpY2Uub2JzZXJ2ZUV2ZW50KFFVRVVFX0FERF9UUkFOU0FDVElPTiwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uZmlnU2VydmljZS5kaXNwYXRjaEV2ZW50KFFVRVVFX0ZMVVNIKTtcbiAgICAgIHN0YXRlLmxhc3RIaWRkZW5TdGFydCA9IG5vdygpO1xuICAgICAgdW5vYnNlcnZlKCk7XG4gICAgfSk7XG4gICAgdHIuZW5kKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnU2VydmljZS5kaXNwYXRjaEV2ZW50KFFVRVVFX0ZMVVNIKTtcbiAgICBzdGF0ZS5sYXN0SGlkZGVuU3RhcnQgPSBub3coKTtcbiAgfVxufSIsImltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuLi9wb2x5ZmlsbHMnO1xuaW1wb3J0IHsgZ2xvYmFsU3RhdGUgfSBmcm9tICcuL3BhdGNoLXV0aWxzJztcbmltcG9ydCB7IFNDSEVEVUxFLCBJTlZPS0UsIEZFVENIIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IHNjaGVkdWxlTWljcm9UYXNrIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgaXNGZXRjaFN1cHBvcnRlZCB9IGZyb20gJy4uL2h0dHAvZmV0Y2gnO1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoRmV0Y2goY2FsbGJhY2spIHtcbiAgaWYgKCFpc0ZldGNoU3VwcG9ydGVkKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmdW5jdGlvbiBzY2hlZHVsZVRhc2sodGFzaykge1xuICAgIHRhc2suc3RhdGUgPSBTQ0hFRFVMRTtcbiAgICBjYWxsYmFjayhTQ0hFRFVMRSwgdGFzayk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VUYXNrKHRhc2spIHtcbiAgICB0YXNrLnN0YXRlID0gSU5WT0tFO1xuICAgIGNhbGxiYWNrKElOVk9LRSwgdGFzayk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZUVycm9yKHRhc2ssIGVycm9yKSB7XG4gICAgdGFzay5kYXRhLmFib3J0ZWQgPSBpc0Fib3J0RXJyb3IoZXJyb3IpO1xuICAgIHRhc2suZGF0YS5lcnJvciA9IGVycm9yO1xuICAgIGludm9rZVRhc2sodGFzayk7XG4gIH1cblxuICBmdW5jdGlvbiByZWFkU3RyZWFtKHN0cmVhbSwgdGFzaykge1xuICAgIHZhciByZWFkZXIgPSBzdHJlYW0uZ2V0UmVhZGVyKCk7XG5cbiAgICB2YXIgcmVhZCA9IGZ1bmN0aW9uIHJlYWQoKSB7XG4gICAgICByZWFkZXIucmVhZCgpLnRoZW4oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIGRvbmUgPSBfcmVmLmRvbmU7XG5cbiAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICBpbnZva2VUYXNrKHRhc2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlYWQoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGhhbmRsZVJlc3BvbnNlRXJyb3IodGFzaywgZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJlYWQoKTtcbiAgfVxuXG4gIHZhciBuYXRpdmVGZXRjaCA9IHdpbmRvdy5mZXRjaDtcblxuICB3aW5kb3cuZmV0Y2ggPSBmdW5jdGlvbiAoaW5wdXQsIGluaXQpIHtcbiAgICB2YXIgZmV0Y2hTZWxmID0gdGhpcztcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgcmVxdWVzdCwgdXJsO1xuICAgIHZhciBpc1VSTCA9IGlucHV0IGluc3RhbmNlb2YgVVJMO1xuXG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgfHwgaXNVUkwpIHtcbiAgICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdCk7XG5cbiAgICAgIGlmIChpc1VSTCkge1xuICAgICAgICB1cmwgPSByZXF1ZXN0LnVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybCA9IGlucHV0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaW5wdXQpIHtcbiAgICAgIHJlcXVlc3QgPSBpbnB1dDtcbiAgICAgIHVybCA9IHJlcXVlc3QudXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmF0aXZlRmV0Y2guYXBwbHkoZmV0Y2hTZWxmLCBhcmdzKTtcbiAgICB9XG5cbiAgICB2YXIgdGFzayA9IHtcbiAgICAgIHNvdXJjZTogRkVUQ0gsXG4gICAgICBzdGF0ZTogJycsXG4gICAgICB0eXBlOiAnbWFjcm9UYXNrJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdGFyZ2V0OiByZXF1ZXN0LFxuICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgYWJvcnRlZDogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBnbG9iYWxTdGF0ZS5mZXRjaEluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgc2NoZWR1bGVUYXNrKHRhc2spO1xuICAgICAgdmFyIHByb21pc2U7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHByb21pc2UgPSBuYXRpdmVGZXRjaC5hcHBseShmZXRjaFNlbGYsIFtyZXF1ZXN0XSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB0YXNrLmRhdGEuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgaW52b2tlVGFzayh0YXNrKTtcbiAgICAgICAgZ2xvYmFsU3RhdGUuZmV0Y2hJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB2YXIgY2xvbmVkUmVzcG9uc2UgPSByZXNwb25zZS5jbG9uZSA/IHJlc3BvbnNlLmNsb25lKCkgOiB7fTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIHNjaGVkdWxlTWljcm9UYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0YXNrLmRhdGEucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICAgICAgICB2YXIgYm9keSA9IGNsb25lZFJlc3BvbnNlLmJvZHk7XG5cbiAgICAgICAgICBpZiAoYm9keSkge1xuICAgICAgICAgICAgcmVhZFN0cmVhbShib2R5LCB0YXNrKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW52b2tlVGFzayh0YXNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIHNjaGVkdWxlTWljcm9UYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBoYW5kbGVSZXNwb25zZUVycm9yKHRhc2ssIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGdsb2JhbFN0YXRlLmZldGNoSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBpc0Fib3J0RXJyb3IoZXJyb3IpIHtcbiAgcmV0dXJuIGVycm9yICYmIGVycm9yLm5hbWUgPT09ICdBYm9ydEVycm9yJztcbn0iLCJpbXBvcnQgeyBJTlZPS0UsIEhJU1RPUlkgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoSGlzdG9yeShjYWxsYmFjaykge1xuICBpZiAoIXdpbmRvdy5oaXN0b3J5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG5hdGl2ZVB1c2hTdGF0ZSA9IGhpc3RvcnkucHVzaFN0YXRlO1xuXG4gIGlmICh0eXBlb2YgbmF0aXZlUHVzaFN0YXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUsIHRpdGxlLCB1cmwpIHtcbiAgICAgIHZhciB0YXNrID0ge1xuICAgICAgICBzb3VyY2U6IEhJU1RPUlksXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjYWxsYmFjayhJTlZPS0UsIHRhc2spO1xuICAgICAgbmF0aXZlUHVzaFN0YXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxufSIsImltcG9ydCB7IHBhdGNoWE1MSHR0cFJlcXVlc3QgfSBmcm9tICcuL3hoci1wYXRjaCc7XG5pbXBvcnQgeyBwYXRjaEZldGNoIH0gZnJvbSAnLi9mZXRjaC1wYXRjaCc7XG5pbXBvcnQgeyBwYXRjaEhpc3RvcnkgfSBmcm9tICcuL2hpc3RvcnktcGF0Y2gnO1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuLi9ldmVudC1oYW5kbGVyJztcbmltcG9ydCB7IEhJU1RPUlksIEZFVENILCBYTUxIVFRQUkVRVUVTVCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG52YXIgcGF0Y2hFdmVudEhhbmRsZXIgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG52YXIgYWxyZWFkeVBhdGNoZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gcGF0Y2hBbGwoKSB7XG4gIGlmICghYWxyZWFkeVBhdGNoZWQpIHtcbiAgICBhbHJlYWR5UGF0Y2hlZCA9IHRydWU7XG4gICAgcGF0Y2hYTUxIdHRwUmVxdWVzdChmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLnNlbmQoWE1MSFRUUFJFUVVFU1QsIFtldmVudCwgdGFza10pO1xuICAgIH0pO1xuICAgIHBhdGNoRmV0Y2goZnVuY3Rpb24gKGV2ZW50LCB0YXNrKSB7XG4gICAgICBwYXRjaEV2ZW50SGFuZGxlci5zZW5kKEZFVENILCBbZXZlbnQsIHRhc2tdKTtcbiAgICB9KTtcbiAgICBwYXRjaEhpc3RvcnkoZnVuY3Rpb24gKGV2ZW50LCB0YXNrKSB7XG4gICAgICBwYXRjaEV2ZW50SGFuZGxlci5zZW5kKEhJU1RPUlksIFtldmVudCwgdGFza10pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHBhdGNoRXZlbnRIYW5kbGVyO1xufVxuXG5leHBvcnQgeyBwYXRjaEFsbCwgcGF0Y2hFdmVudEhhbmRsZXIgfTsiLCJleHBvcnQgdmFyIGdsb2JhbFN0YXRlID0ge1xuICBmZXRjaEluUHJvZ3Jlc3M6IGZhbHNlXG59O1xuZXhwb3J0IGZ1bmN0aW9uIGFwbVN5bWJvbChuYW1lKSB7XG4gIHJldHVybiAnX19hcG1fc3ltYm9sX18nICsgbmFtZTtcbn1cblxuZnVuY3Rpb24gaXNQcm9wZXJ0eVdyaXRhYmxlKHByb3BlcnR5RGVzYykge1xuICBpZiAoIXByb3BlcnR5RGVzYykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHByb3BlcnR5RGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gISh0eXBlb2YgcHJvcGVydHlEZXNjLmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgcHJvcGVydHlEZXNjLnNldCA9PT0gJ3VuZGVmaW5lZCcpO1xufVxuXG5mdW5jdGlvbiBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocGF0Y2hlZCwgb3JpZ2luYWwpIHtcbiAgcGF0Y2hlZFthcG1TeW1ib2woJ09yaWdpbmFsRGVsZWdhdGUnKV0gPSBvcmlnaW5hbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoTWV0aG9kKHRhcmdldCwgbmFtZSwgcGF0Y2hGbikge1xuICB2YXIgcHJvdG8gPSB0YXJnZXQ7XG5cbiAgd2hpbGUgKHByb3RvICYmICFwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgfVxuXG4gIGlmICghcHJvdG8gJiYgdGFyZ2V0W25hbWVdKSB7XG4gICAgcHJvdG8gPSB0YXJnZXQ7XG4gIH1cblxuICB2YXIgZGVsZWdhdGVOYW1lID0gYXBtU3ltYm9sKG5hbWUpO1xuICB2YXIgZGVsZWdhdGU7XG5cbiAgaWYgKHByb3RvICYmICEoZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdKSkge1xuICAgIGRlbGVnYXRlID0gcHJvdG9bZGVsZWdhdGVOYW1lXSA9IHByb3RvW25hbWVdO1xuICAgIHZhciBkZXNjID0gcHJvdG8gJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG5cbiAgICBpZiAoaXNQcm9wZXJ0eVdyaXRhYmxlKGRlc2MpKSB7XG4gICAgICB2YXIgcGF0Y2hEZWxlZ2F0ZSA9IHBhdGNoRm4oZGVsZWdhdGUsIGRlbGVnYXRlTmFtZSwgbmFtZSk7XG5cbiAgICAgIHByb3RvW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcGF0Y2hEZWxlZ2F0ZSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW25hbWVdLCBkZWxlZ2F0ZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlbGVnYXRlO1xufVxuZXhwb3J0IHZhciBYSFJfSUdOT1JFID0gYXBtU3ltYm9sKCd4aHJJZ25vcmUnKTtcbmV4cG9ydCB2YXIgWEhSX1NZTkMgPSBhcG1TeW1ib2woJ3hoclN5bmMnKTtcbmV4cG9ydCB2YXIgWEhSX1VSTCA9IGFwbVN5bWJvbCgneGhyVVJMJyk7XG5leHBvcnQgdmFyIFhIUl9NRVRIT0QgPSBhcG1TeW1ib2woJ3hock1ldGhvZCcpOyIsImltcG9ydCB7IHBhdGNoTWV0aG9kLCBYSFJfU1lOQywgWEhSX1VSTCwgWEhSX01FVEhPRCwgWEhSX0lHTk9SRSB9IGZyb20gJy4vcGF0Y2gtdXRpbHMnO1xuaW1wb3J0IHsgU0NIRURVTEUsIElOVk9LRSwgWE1MSFRUUFJFUVVFU1QsIEFERF9FVkVOVF9MSVNURU5FUl9TVFIgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoWE1MSHR0cFJlcXVlc3QoY2FsbGJhY2spIHtcbiAgdmFyIFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlO1xuXG4gIGlmICghWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUgfHwgIVhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlW0FERF9FVkVOVF9MSVNURU5FUl9TVFJdKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIFJFQURZX1NUQVRFX0NIQU5HRSA9ICdyZWFkeXN0YXRlY2hhbmdlJztcbiAgdmFyIExPQUQgPSAnbG9hZCc7XG4gIHZhciBFUlJPUiA9ICdlcnJvcic7XG4gIHZhciBUSU1FT1VUID0gJ3RpbWVvdXQnO1xuICB2YXIgQUJPUlQgPSAnYWJvcnQnO1xuXG4gIGZ1bmN0aW9uIGludm9rZVRhc2sodGFzaywgc3RhdHVzKSB7XG4gICAgaWYgKHRhc2suc3RhdGUgIT09IElOVk9LRSkge1xuICAgICAgdGFzay5zdGF0ZSA9IElOVk9LRTtcbiAgICAgIHRhc2suZGF0YS5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICBjYWxsYmFjayhJTlZPS0UsIHRhc2spO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgaWYgKHRhc2suc3RhdGUgPT09IFNDSEVEVUxFKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGFzay5zdGF0ZSA9IFNDSEVEVUxFO1xuICAgIGNhbGxiYWNrKFNDSEVEVUxFLCB0YXNrKTtcbiAgICB2YXIgdGFyZ2V0ID0gdGFzay5kYXRhLnRhcmdldDtcblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVyKG5hbWUpIHtcbiAgICAgIHRhcmdldFtBRERfRVZFTlRfTElTVEVORVJfU1RSXShuYW1lLCBmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgdHlwZSA9IF9yZWYudHlwZTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gUkVBRFlfU1RBVEVfQ0hBTkdFKSB7XG4gICAgICAgICAgaWYgKHRhcmdldC5yZWFkeVN0YXRlID09PSA0ICYmIHRhcmdldC5zdGF0dXMgIT09IDApIHtcbiAgICAgICAgICAgIGludm9rZVRhc2sodGFzaywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHN0YXR1cyA9IHR5cGUgPT09IExPQUQgPyAnc3VjY2VzcycgOiB0eXBlO1xuICAgICAgICAgIGludm9rZVRhc2sodGFzaywgc3RhdHVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIoUkVBRFlfU1RBVEVfQ0hBTkdFKTtcbiAgICBhZGRMaXN0ZW5lcihMT0FEKTtcbiAgICBhZGRMaXN0ZW5lcihUSU1FT1VUKTtcbiAgICBhZGRMaXN0ZW5lcihFUlJPUik7XG4gICAgYWRkTGlzdGVuZXIoQUJPUlQpO1xuICB9XG5cbiAgdmFyIG9wZW5OYXRpdmUgPSBwYXRjaE1ldGhvZChYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICBpZiAoIXNlbGZbWEhSX0lHTk9SRV0pIHtcbiAgICAgICAgc2VsZltYSFJfTUVUSE9EXSA9IGFyZ3NbMF07XG4gICAgICAgIHNlbGZbWEhSX1VSTF0gPSBhcmdzWzFdO1xuICAgICAgICBzZWxmW1hIUl9TWU5DXSA9IGFyZ3NbMl0gPT09IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3Blbk5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9O1xuICB9KTtcbiAgdmFyIHNlbmROYXRpdmUgPSBwYXRjaE1ldGhvZChYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgJ3NlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICBpZiAoc2VsZltYSFJfSUdOT1JFXSkge1xuICAgICAgICByZXR1cm4gc2VuZE5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRhc2sgPSB7XG4gICAgICAgIHNvdXJjZTogWE1MSFRUUFJFUVVFU1QsXG4gICAgICAgIHN0YXRlOiAnJyxcbiAgICAgICAgdHlwZTogJ21hY3JvVGFzaycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0YXJnZXQ6IHNlbGYsXG4gICAgICAgICAgbWV0aG9kOiBzZWxmW1hIUl9NRVRIT0RdLFxuICAgICAgICAgIHN5bmM6IHNlbGZbWEhSX1NZTkNdLFxuICAgICAgICAgIHVybDogc2VsZltYSFJfVVJMXSxcbiAgICAgICAgICBzdGF0dXM6ICcnXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHNjaGVkdWxlVGFzayh0YXNrKTtcbiAgICAgICAgcmV0dXJuIHNlbmROYXRpdmUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGludm9rZVRhc2sodGFzaywgRVJST1IpO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSIsImltcG9ydCBQcm9taXNlUG9sbHlmaWxsIGZyb20gJ3Byb21pc2UtcG9seWZpbGwnO1xuaW1wb3J0IHsgaXNCcm93c2VyIH0gZnJvbSAnLi91dGlscyc7XG52YXIgbG9jYWwgPSB7fTtcblxuaWYgKGlzQnJvd3Nlcikge1xuICBsb2NhbCA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gIGxvY2FsID0gc2VsZjtcbn1cblxudmFyIFByb21pc2UgPSAnUHJvbWlzZScgaW4gbG9jYWwgPyBsb2NhbC5Qcm9taXNlIDogUHJvbWlzZVBvbGx5ZmlsbDtcbmV4cG9ydCB7IFByb21pc2UgfTsiLCJ2YXIgUXVldWUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFF1ZXVlKG9uRmx1c2gsIG9wdHMpIHtcbiAgICBpZiAob3B0cyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRzID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5vbkZsdXNoID0gb25GbHVzaDtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5xdWV1ZUxpbWl0ID0gb3B0cy5xdWV1ZUxpbWl0IHx8IC0xO1xuICAgIHRoaXMuZmx1c2hJbnRlcnZhbCA9IG9wdHMuZmx1c2hJbnRlcnZhbCB8fCAwO1xuICAgIHRoaXMudGltZW91dElkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFF1ZXVlLnByb3RvdHlwZTtcblxuICBfcHJvdG8uX3NldFRpbWVyID0gZnVuY3Rpb24gX3NldFRpbWVyKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLmZsdXNoKCk7XG4gICAgfSwgdGhpcy5mbHVzaEludGVydmFsKTtcbiAgfTtcblxuICBfcHJvdG8uX2NsZWFyID0gZnVuY3Rpb24gX2NsZWFyKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy50aW1lb3V0SWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgdGhpcy50aW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICB9O1xuXG4gIF9wcm90by5mbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHRoaXMub25GbHVzaCh0aGlzLml0ZW1zKTtcblxuICAgIHRoaXMuX2NsZWFyKCk7XG4gIH07XG5cbiAgX3Byb3RvLmFkZCA9IGZ1bmN0aW9uIGFkZChpdGVtKSB7XG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXG4gICAgaWYgKHRoaXMucXVldWVMaW1pdCAhPT0gLTEgJiYgdGhpcy5pdGVtcy5sZW5ndGggPj0gdGhpcy5xdWV1ZUxpbWl0KSB7XG4gICAgICB0aGlzLmZsdXNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy50aW1lb3V0SWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX3NldFRpbWVyKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBRdWV1ZTtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgUXVldWU7IiwidmFyIF9zZXJ2aWNlQ3JlYXRvcnM7XG5cbmltcG9ydCBBcG1TZXJ2ZXIgZnJvbSAnLi9hcG0tc2VydmVyJztcbmltcG9ydCBDb25maWdTZXJ2aWNlIGZyb20gJy4vY29uZmlnLXNlcnZpY2UnO1xuaW1wb3J0IExvZ2dpbmdTZXJ2aWNlIGZyb20gJy4vbG9nZ2luZy1zZXJ2aWNlJztcbmltcG9ydCB7IENPTkZJR19DSEFOR0UsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIEFQTV9TRVJWRVIgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBfX0RFVl9fIH0gZnJvbSAnLi4vc3RhdGUnO1xudmFyIHNlcnZpY2VDcmVhdG9ycyA9IChfc2VydmljZUNyZWF0b3JzID0ge30sIF9zZXJ2aWNlQ3JlYXRvcnNbQ09ORklHX1NFUlZJQ0VdID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IENvbmZpZ1NlcnZpY2UoKTtcbn0sIF9zZXJ2aWNlQ3JlYXRvcnNbTE9HR0lOR19TRVJWSUNFXSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBMb2dnaW5nU2VydmljZSh7XG4gICAgcHJlZml4OiAnW0VsYXN0aWMgQVBNXSAnXG4gIH0pO1xufSwgX3NlcnZpY2VDcmVhdG9yc1tBUE1fU0VSVkVSXSA9IGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIHZhciBfZmFjdG9yeSRnZXRTZXJ2aWNlID0gZmFjdG9yeS5nZXRTZXJ2aWNlKFtDT05GSUdfU0VSVklDRSwgTE9HR0lOR19TRVJWSUNFXSksXG4gICAgICBjb25maWdTZXJ2aWNlID0gX2ZhY3RvcnkkZ2V0U2VydmljZVswXSxcbiAgICAgIGxvZ2dpbmdTZXJ2aWNlID0gX2ZhY3RvcnkkZ2V0U2VydmljZVsxXTtcblxuICByZXR1cm4gbmV3IEFwbVNlcnZlcihjb25maWdTZXJ2aWNlLCBsb2dnaW5nU2VydmljZSk7XG59LCBfc2VydmljZUNyZWF0b3JzKTtcblxudmFyIFNlcnZpY2VGYWN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTZXJ2aWNlRmFjdG9yeSgpIHtcbiAgICB0aGlzLmluc3RhbmNlcyA9IHt9O1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBTZXJ2aWNlRmFjdG9yeS5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpO1xuICAgIGNvbmZpZ1NlcnZpY2UuaW5pdCgpO1xuXG4gICAgdmFyIF90aGlzJGdldFNlcnZpY2UgPSB0aGlzLmdldFNlcnZpY2UoW0xPR0dJTkdfU0VSVklDRSwgQVBNX1NFUlZFUl0pLFxuICAgICAgICBsb2dnaW5nU2VydmljZSA9IF90aGlzJGdldFNlcnZpY2VbMF0sXG4gICAgICAgIGFwbVNlcnZlciA9IF90aGlzJGdldFNlcnZpY2VbMV07XG5cbiAgICBjb25maWdTZXJ2aWNlLmV2ZW50cy5vYnNlcnZlKENPTkZJR19DSEFOR0UsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBsb2dMZXZlbCA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdsb2dMZXZlbCcpO1xuICAgICAgbG9nZ2luZ1NlcnZpY2Uuc2V0TGV2ZWwobG9nTGV2ZWwpO1xuICAgIH0pO1xuICAgIGFwbVNlcnZlci5pbml0KCk7XG4gIH07XG5cbiAgX3Byb3RvLmdldFNlcnZpY2UgPSBmdW5jdGlvbiBnZXRTZXJ2aWNlKG5hbWUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKCF0aGlzLmluc3RhbmNlc1tuYW1lXSkge1xuICAgICAgICBpZiAodHlwZW9mIHNlcnZpY2VDcmVhdG9yc1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoaXMuaW5zdGFuY2VzW25hbWVdID0gc2VydmljZUNyZWF0b3JzW25hbWVdKHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKF9fREVWX18pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQ2Fubm90IGdldCBzZXJ2aWNlLCBObyBjcmVhdG9yIGZvcjogJyArIG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc1tuYW1lXTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lLm1hcChmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0U2VydmljZShuKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gU2VydmljZUZhY3Rvcnk7XG59KCk7XG5cbmV4cG9ydCB7IHNlcnZpY2VDcmVhdG9ycywgU2VydmljZUZhY3RvcnkgfTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aHJvdHRsZShmbiwgb25UaHJvdHRsZSwgb3B0cykge1xuICB2YXIgY29udGV4dCA9IHRoaXM7XG4gIHZhciBsaW1pdCA9IG9wdHMubGltaXQ7XG4gIHZhciBpbnRlcnZhbCA9IG9wdHMuaW50ZXJ2YWw7XG4gIHZhciBjb3VudGVyID0gMDtcbiAgdmFyIHRpbWVvdXRJZDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBjb3VudGVyKys7XG5cbiAgICBpZiAodHlwZW9mIHRpbWVvdXRJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb3VudGVyID0gMDtcbiAgICAgICAgdGltZW91dElkID0gdW5kZWZpbmVkO1xuICAgICAgfSwgaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGlmIChjb3VudGVyID4gbGltaXQgJiYgdHlwZW9mIG9uVGhyb3R0bGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvblRocm90dGxlLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbn0iLCJpbXBvcnQgeyBLRVlXT1JEX0xJTUlUIH0gZnJvbSAnLi9jb25zdGFudHMnO1xudmFyIE1FVEFEQVRBX01PREVMID0ge1xuICBzZXJ2aWNlOiB7XG4gICAgbmFtZTogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICAgIHZlcnNpb246IHRydWUsXG4gICAgYWdlbnQ6IHtcbiAgICAgIHZlcnNpb246IFtLRVlXT1JEX0xJTUlULCB0cnVlXVxuICAgIH0sXG4gICAgZW52aXJvbm1lbnQ6IHRydWVcbiAgfSxcbiAgbGFiZWxzOiB7XG4gICAgJyonOiB0cnVlXG4gIH1cbn07XG52YXIgUkVTUE9OU0VfTU9ERUwgPSB7XG4gICcqJzogdHJ1ZSxcbiAgaGVhZGVyczoge1xuICAgICcqJzogdHJ1ZVxuICB9XG59O1xudmFyIERFU1RJTkFUSU9OX01PREVMID0ge1xuICBhZGRyZXNzOiBbS0VZV09SRF9MSU1JVF0sXG4gIHNlcnZpY2U6IHtcbiAgICAnKic6IFtLRVlXT1JEX0xJTUlULCB0cnVlXVxuICB9XG59O1xudmFyIENPTlRFWFRfTU9ERUwgPSB7XG4gIHVzZXI6IHtcbiAgICBpZDogdHJ1ZSxcbiAgICBlbWFpbDogdHJ1ZSxcbiAgICB1c2VybmFtZTogdHJ1ZVxuICB9LFxuICB0YWdzOiB7XG4gICAgJyonOiB0cnVlXG4gIH0sXG4gIGh0dHA6IHtcbiAgICByZXNwb25zZTogUkVTUE9OU0VfTU9ERUxcbiAgfSxcbiAgZGVzdGluYXRpb246IERFU1RJTkFUSU9OX01PREVMLFxuICByZXNwb25zZTogUkVTUE9OU0VfTU9ERUxcbn07XG52YXIgU1BBTl9NT0RFTCA9IHtcbiAgbmFtZTogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICB0eXBlOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIGlkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHRyYWNlX2lkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHBhcmVudF9pZDogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICB0cmFuc2FjdGlvbl9pZDogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICBzdWJ0eXBlOiB0cnVlLFxuICBhY3Rpb246IHRydWUsXG4gIGNvbnRleHQ6IENPTlRFWFRfTU9ERUxcbn07XG52YXIgVFJBTlNBQ1RJT05fTU9ERUwgPSB7XG4gIG5hbWU6IHRydWUsXG4gIHBhcmVudF9pZDogdHJ1ZSxcbiAgdHlwZTogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICBpZDogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICB0cmFjZV9pZDogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICBzcGFuX2NvdW50OiB7XG4gICAgc3RhcnRlZDogW0tFWVdPUkRfTElNSVQsIHRydWVdXG4gIH0sXG4gIGNvbnRleHQ6IENPTlRFWFRfTU9ERUxcbn07XG52YXIgRVJST1JfTU9ERUwgPSB7XG4gIGlkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHRyYWNlX2lkOiB0cnVlLFxuICB0cmFuc2FjdGlvbl9pZDogdHJ1ZSxcbiAgcGFyZW50X2lkOiB0cnVlLFxuICBjdWxwcml0OiB0cnVlLFxuICBleGNlcHRpb246IHtcbiAgICB0eXBlOiB0cnVlXG4gIH0sXG4gIHRyYW5zYWN0aW9uOiB7XG4gICAgdHlwZTogdHJ1ZVxuICB9LFxuICBjb250ZXh0OiBDT05URVhUX01PREVMXG59O1xuXG5mdW5jdGlvbiB0cnVuY2F0ZSh2YWx1ZSwgbGltaXQsIHJlcXVpcmVkLCBwbGFjZWhvbGRlcikge1xuICBpZiAobGltaXQgPT09IHZvaWQgMCkge1xuICAgIGxpbWl0ID0gS0VZV09SRF9MSU1JVDtcbiAgfVxuXG4gIGlmIChyZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgcmVxdWlyZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmIChwbGFjZWhvbGRlciA9PT0gdm9pZCAwKSB7XG4gICAgcGxhY2Vob2xkZXIgPSAnTi9BJztcbiAgfVxuXG4gIGlmIChyZXF1aXJlZCAmJiBpc0VtcHR5KHZhbHVlKSkge1xuICAgIHZhbHVlID0gcGxhY2Vob2xkZXI7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZS5zdWJzdHJpbmcoMCwgbGltaXQpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSAnJyB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlVmFsdWUodGFyZ2V0LCBrZXksIGN1cnJNb2RlbCkge1xuICB2YXIgdmFsdWUgPSB0cnVuY2F0ZSh0YXJnZXRba2V5XSwgY3Vyck1vZGVsWzBdLCBjdXJyTW9kZWxbMV0pO1xuXG4gIGlmIChpc0VtcHR5KHZhbHVlKSkge1xuICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0YXJnZXRba2V5XSA9IHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZU1vZGVsKG1vZGVsLCB0YXJnZXQsIGNoaWxkVGFyZ2V0KSB7XG4gIGlmIChtb2RlbCA9PT0gdm9pZCAwKSB7XG4gICAgbW9kZWwgPSB7fTtcbiAgfVxuXG4gIGlmIChjaGlsZFRhcmdldCA9PT0gdm9pZCAwKSB7XG4gICAgY2hpbGRUYXJnZXQgPSB0YXJnZXQ7XG4gIH1cblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG1vZGVsKTtcbiAgdmFyIGVtcHR5QXJyID0gW107XG5cbiAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoaSkge1xuICAgIHZhciBjdXJyS2V5ID0ga2V5c1tpXTtcbiAgICB2YXIgY3Vyck1vZGVsID0gbW9kZWxbY3VycktleV0gPT09IHRydWUgPyBlbXB0eUFyciA6IG1vZGVsW2N1cnJLZXldO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGN1cnJNb2RlbCkpIHtcbiAgICAgIHRydW5jYXRlTW9kZWwoY3Vyck1vZGVsLCB0YXJnZXQsIGNoaWxkVGFyZ2V0W2N1cnJLZXldKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGN1cnJLZXkgPT09ICcqJykge1xuICAgICAgICBPYmplY3Qua2V5cyhjaGlsZFRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHJlcGxhY2VWYWx1ZShjaGlsZFRhcmdldCwga2V5LCBjdXJyTW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcGxhY2VWYWx1ZShjaGlsZFRhcmdldCwgY3VycktleSwgY3Vyck1vZGVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgX2xvb3AoaSk7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5leHBvcnQgeyB0cnVuY2F0ZSwgdHJ1bmNhdGVNb2RlbCwgU1BBTl9NT0RFTCwgVFJBTlNBQ1RJT05fTU9ERUwsIEVSUk9SX01PREVMLCBNRVRBREFUQV9NT0RFTCwgUkVTUE9OU0VfTU9ERUwgfTsiLCJpbXBvcnQgeyBpc0Jyb3dzZXIgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gaXNEZWZhdWx0UG9ydChwb3J0LCBwcm90b2NvbCkge1xuICBzd2l0Y2ggKHByb3RvY29sKSB7XG4gICAgY2FzZSAnaHR0cDonOlxuICAgICAgcmV0dXJuIHBvcnQgPT09ICc4MCc7XG5cbiAgICBjYXNlICdodHRwczonOlxuICAgICAgcmV0dXJuIHBvcnQgPT09ICc0NDMnO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbnZhciBSVUxFUyA9IFtbJyMnLCAnaGFzaCddLCBbJz8nLCAncXVlcnknXSwgWycvJywgJ3BhdGgnXSwgWydAJywgJ2F1dGgnLCAxXSwgW05hTiwgJ2hvc3QnLCB1bmRlZmluZWQsIDFdXTtcbnZhciBQUk9UT0NPTF9SRUdFWCA9IC9eKFthLXpdW2EtejAtOS4rLV0qOik/KFxcL1xcLyk/KFtcXFNcXHNdKikvaTtcbmV4cG9ydCB2YXIgVXJsID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBVcmwodXJsKSB7XG4gICAgdmFyIF90aGlzJGV4dHJhY3RQcm90b2NvbCA9IHRoaXMuZXh0cmFjdFByb3RvY29sKHVybCB8fCAnJyksXG4gICAgICAgIHByb3RvY29sID0gX3RoaXMkZXh0cmFjdFByb3RvY29sLnByb3RvY29sLFxuICAgICAgICBhZGRyZXNzID0gX3RoaXMkZXh0cmFjdFByb3RvY29sLmFkZHJlc3MsXG4gICAgICAgIHNsYXNoZXMgPSBfdGhpcyRleHRyYWN0UHJvdG9jb2wuc2xhc2hlcztcblxuICAgIHZhciByZWxhdGl2ZSA9ICFwcm90b2NvbCAmJiAhc2xhc2hlcztcbiAgICB2YXIgbG9jYXRpb24gPSB0aGlzLmdldExvY2F0aW9uKCk7XG4gICAgdmFyIGluc3RydWN0aW9ucyA9IFJVTEVTLnNsaWNlKCk7XG4gICAgYWRkcmVzcyA9IGFkZHJlc3MucmVwbGFjZSgnXFxcXCcsICcvJyk7XG5cbiAgICBpZiAoIXNsYXNoZXMpIHtcbiAgICAgIGluc3RydWN0aW9uc1syXSA9IFtOYU4sICdwYXRoJ107XG4gICAgfVxuXG4gICAgdmFyIGluZGV4O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnN0cnVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpbnN0cnVjdGlvbiA9IGluc3RydWN0aW9uc1tpXTtcbiAgICAgIHZhciBwYXJzZSA9IGluc3RydWN0aW9uWzBdO1xuICAgICAgdmFyIGtleSA9IGluc3RydWN0aW9uWzFdO1xuXG4gICAgICBpZiAodHlwZW9mIHBhcnNlID09PSAnc3RyaW5nJykge1xuICAgICAgICBpbmRleCA9IGFkZHJlc3MuaW5kZXhPZihwYXJzZSk7XG5cbiAgICAgICAgaWYgKH5pbmRleCkge1xuICAgICAgICAgIHZhciBpbnN0TGVuZ3RoID0gaW5zdHJ1Y3Rpb25bMl07XG5cbiAgICAgICAgICBpZiAoaW5zdExlbmd0aCkge1xuICAgICAgICAgICAgdmFyIG5ld0luZGV4ID0gYWRkcmVzcy5sYXN0SW5kZXhPZihwYXJzZSk7XG4gICAgICAgICAgICBpbmRleCA9IE1hdGgubWF4KGluZGV4LCBuZXdJbmRleCk7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKGluZGV4ICsgaW5zdExlbmd0aCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGFkZHJlc3Muc2xpY2UoaW5kZXgpO1xuICAgICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gYWRkcmVzcztcbiAgICAgICAgYWRkcmVzcyA9ICcnO1xuICAgICAgfVxuXG4gICAgICB0aGlzW2tleV0gPSB0aGlzW2tleV0gfHwgKHJlbGF0aXZlICYmIGluc3RydWN0aW9uWzNdID8gbG9jYXRpb25ba2V5XSB8fCAnJyA6ICcnKTtcbiAgICAgIGlmIChpbnN0cnVjdGlvblszXSkgdGhpc1trZXldID0gdGhpc1trZXldLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aXZlICYmIHRoaXMucGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgdGhpcy5wYXRoID0gJy8nICsgdGhpcy5wYXRoO1xuICAgIH1cblxuICAgIHRoaXMucmVsYXRpdmUgPSByZWxhdGl2ZTtcbiAgICB0aGlzLnByb3RvY29sID0gcHJvdG9jb2wgfHwgbG9jYXRpb24ucHJvdG9jb2w7XG4gICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdDtcbiAgICB0aGlzLnBvcnQgPSAnJztcblxuICAgIGlmICgvOlxcZCskLy50ZXN0KHRoaXMuaG9zdCkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuaG9zdC5zcGxpdCgnOicpO1xuICAgICAgdmFyIHBvcnQgPSB2YWx1ZS5wb3AoKTtcbiAgICAgIHZhciBob3N0bmFtZSA9IHZhbHVlLmpvaW4oJzonKTtcblxuICAgICAgaWYgKGlzRGVmYXVsdFBvcnQocG9ydCwgdGhpcy5wcm90b2NvbCkpIHtcbiAgICAgICAgdGhpcy5ob3N0ID0gaG9zdG5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBvcnQgPSBwb3J0O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW4gPSB0aGlzLnByb3RvY29sICYmIHRoaXMuaG9zdCAmJiB0aGlzLnByb3RvY29sICE9PSAnZmlsZTonID8gdGhpcy5wcm90b2NvbCArICcvLycgKyB0aGlzLmhvc3QgOiAnbnVsbCc7XG4gICAgdGhpcy5ocmVmID0gdGhpcy50b1N0cmluZygpO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFVybC5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMucHJvdG9jb2w7XG4gICAgcmVzdWx0ICs9ICcvLyc7XG5cbiAgICBpZiAodGhpcy5hdXRoKSB7XG4gICAgICB2YXIgUkVEQUNURUQgPSAnW1JFREFDVEVEXSc7XG4gICAgICB2YXIgdXNlcnBhc3MgPSB0aGlzLmF1dGguc3BsaXQoJzonKTtcbiAgICAgIHZhciB1c2VybmFtZSA9IHVzZXJwYXNzWzBdID8gUkVEQUNURUQgOiAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IHVzZXJwYXNzWzFdID8gJzonICsgUkVEQUNURUQgOiAnJztcbiAgICAgIHJlc3VsdCArPSB1c2VybmFtZSArIHBhc3N3b3JkICsgJ0AnO1xuICAgIH1cblxuICAgIHJlc3VsdCArPSB0aGlzLmhvc3Q7XG4gICAgcmVzdWx0ICs9IHRoaXMucGF0aDtcbiAgICByZXN1bHQgKz0gdGhpcy5xdWVyeTtcbiAgICByZXN1bHQgKz0gdGhpcy5oYXNoO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgX3Byb3RvLmdldExvY2F0aW9uID0gZnVuY3Rpb24gZ2V0TG9jYXRpb24oKSB7XG4gICAgdmFyIGdsb2JhbFZhciA9IHt9O1xuXG4gICAgaWYgKGlzQnJvd3Nlcikge1xuICAgICAgZ2xvYmFsVmFyID0gd2luZG93O1xuICAgIH1cblxuICAgIHJldHVybiBnbG9iYWxWYXIubG9jYXRpb247XG4gIH07XG5cbiAgX3Byb3RvLmV4dHJhY3RQcm90b2NvbCA9IGZ1bmN0aW9uIGV4dHJhY3RQcm90b2NvbCh1cmwpIHtcbiAgICB2YXIgbWF0Y2ggPSBQUk9UT0NPTF9SRUdFWC5leGVjKHVybCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3RvY29sOiBtYXRjaFsxXSA/IG1hdGNoWzFdLnRvTG93ZXJDYXNlKCkgOiAnJyxcbiAgICAgIHNsYXNoZXM6ICEhbWF0Y2hbMl0sXG4gICAgICBhZGRyZXNzOiBtYXRjaFszXVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIFVybDtcbn0oKTtcbmV4cG9ydCBmdW5jdGlvbiBzbHVnaWZ5VXJsKHVybFN0ciwgZGVwdGgpIHtcbiAgaWYgKGRlcHRoID09PSB2b2lkIDApIHtcbiAgICBkZXB0aCA9IDI7XG4gIH1cblxuICB2YXIgcGFyc2VkVXJsID0gbmV3IFVybCh1cmxTdHIpO1xuICB2YXIgcXVlcnkgPSBwYXJzZWRVcmwucXVlcnksXG4gICAgICBwYXRoID0gcGFyc2VkVXJsLnBhdGg7XG4gIHZhciBwYXRoUGFydHMgPSBwYXRoLnN1YnN0cmluZygxKS5zcGxpdCgnLycpO1xuICB2YXIgcmVkYWN0U3RyaW5nID0gJzppZCc7XG4gIHZhciB3aWxkY2FyZCA9ICcqJztcbiAgdmFyIHNwZWNpYWxDaGFyc1JlZ2V4ID0gL1xcV3xfL2c7XG4gIHZhciBkaWdpdHNSZWdleCA9IC9bMC05XS9nO1xuICB2YXIgbG93ZXJDYXNlUmVnZXggPSAvW2Etel0vZztcbiAgdmFyIHVwcGVyQ2FzZVJlZ2V4ID0gL1tBLVpdL2c7XG4gIHZhciByZWRhY3RlZFBhcnRzID0gW107XG4gIHZhciByZWRhY3RlZEJlZm9yZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBwYXRoUGFydHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgdmFyIHBhcnQgPSBwYXRoUGFydHNbaW5kZXhdO1xuXG4gICAgaWYgKHJlZGFjdGVkQmVmb3JlIHx8IGluZGV4ID4gZGVwdGggLSAxKSB7XG4gICAgICBpZiAocGFydCkge1xuICAgICAgICByZWRhY3RlZFBhcnRzLnB1c2god2lsZGNhcmQpO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgbnVtYmVyT2ZTcGVjaWFsQ2hhcnMgPSAocGFydC5tYXRjaChzcGVjaWFsQ2hhcnNSZWdleCkgfHwgW10pLmxlbmd0aDtcblxuICAgIGlmIChudW1iZXJPZlNwZWNpYWxDaGFycyA+PSAyKSB7XG4gICAgICByZWRhY3RlZFBhcnRzLnB1c2gocmVkYWN0U3RyaW5nKTtcbiAgICAgIHJlZGFjdGVkQmVmb3JlID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBudW1iZXJPZkRpZ2l0cyA9IChwYXJ0Lm1hdGNoKGRpZ2l0c1JlZ2V4KSB8fCBbXSkubGVuZ3RoO1xuXG4gICAgaWYgKG51bWJlck9mRGlnaXRzID4gMyB8fCBwYXJ0Lmxlbmd0aCA+IDMgJiYgbnVtYmVyT2ZEaWdpdHMgLyBwYXJ0Lmxlbmd0aCA+PSAwLjMpIHtcbiAgICAgIHJlZGFjdGVkUGFydHMucHVzaChyZWRhY3RTdHJpbmcpO1xuICAgICAgcmVkYWN0ZWRCZWZvcmUgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIG51bWJlcm9mVXBwZXJDYXNlID0gKHBhcnQubWF0Y2godXBwZXJDYXNlUmVnZXgpIHx8IFtdKS5sZW5ndGg7XG4gICAgdmFyIG51bWJlcm9mTG93ZXJDYXNlID0gKHBhcnQubWF0Y2gobG93ZXJDYXNlUmVnZXgpIHx8IFtdKS5sZW5ndGg7XG4gICAgdmFyIGxvd2VyQ2FzZVJhdGUgPSBudW1iZXJvZkxvd2VyQ2FzZSAvIHBhcnQubGVuZ3RoO1xuICAgIHZhciB1cHBlckNhc2VSYXRlID0gbnVtYmVyb2ZVcHBlckNhc2UgLyBwYXJ0Lmxlbmd0aDtcblxuICAgIGlmIChwYXJ0Lmxlbmd0aCA+IDUgJiYgKHVwcGVyQ2FzZVJhdGUgPiAwLjMgJiYgdXBwZXJDYXNlUmF0ZSA8IDAuNiB8fCBsb3dlckNhc2VSYXRlID4gMC4zICYmIGxvd2VyQ2FzZVJhdGUgPCAwLjYpKSB7XG4gICAgICByZWRhY3RlZFBhcnRzLnB1c2gocmVkYWN0U3RyaW5nKTtcbiAgICAgIHJlZGFjdGVkQmVmb3JlID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHBhcnQgJiYgcmVkYWN0ZWRQYXJ0cy5wdXNoKHBhcnQpO1xuICB9XG5cbiAgdmFyIHJlZGFjdGVkID0gJy8nICsgKHJlZGFjdGVkUGFydHMubGVuZ3RoID49IDIgPyByZWRhY3RlZFBhcnRzLmpvaW4oJy8nKSA6IHJlZGFjdGVkUGFydHMuam9pbignJykpICsgKHF1ZXJ5ID8gJz97cXVlcnl9JyA6ICcnKTtcbiAgcmV0dXJuIHJlZGFjdGVkO1xufSIsImltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuL3BvbHlmaWxscyc7XG52YXIgc2xpY2UgPSBbXS5zbGljZTtcbnZhciBpc0Jyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbnZhciBQRVJGID0gaXNCcm93c2VyICYmIHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcgPyBwZXJmb3JtYW5jZSA6IHt9O1xuXG5mdW5jdGlvbiBpc0NPUlNTdXBwb3J0ZWQoKSB7XG4gIHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJldHVybiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHI7XG59XG5cbnZhciBieXRlVG9IZXggPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXhbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xufVxuXG5mdW5jdGlvbiBieXRlc1RvSGV4KGJ1ZmZlcikge1xuICB2YXIgaGV4T2N0ZXRzID0gW107XG5cbiAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGJ1ZmZlci5sZW5ndGg7IF9pKyspIHtcbiAgICBoZXhPY3RldHMucHVzaChieXRlVG9IZXhbYnVmZmVyW19pXV0pO1xuICB9XG5cbiAgcmV0dXJuIGhleE9jdGV0cy5qb2luKCcnKTtcbn1cblxudmFyIGRlc3RpbmF0aW9uID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuXG5mdW5jdGlvbiBybmcoKSB7XG4gIGlmICh0eXBlb2YgY3J5cHRvICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhkZXN0aW5hdGlvbik7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1zQ3J5cHRvICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbUlkKGxlbmd0aCkge1xuICB2YXIgaWQgPSBieXRlc1RvSGV4KHJuZygpKTtcbiAgcmV0dXJuIGlkLnN1YnN0cigwLCBsZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBnZXREdEhlYWRlclZhbHVlKHNwYW4pIHtcbiAgdmFyIGR0VmVyc2lvbiA9ICcwMCc7XG4gIHZhciBkdFVuU2FtcGxlZEZsYWdzID0gJzAwJztcbiAgdmFyIGR0U2FtcGxlZEZsYWdzID0gJzAxJztcblxuICBpZiAoc3BhbiAmJiBzcGFuLnRyYWNlSWQgJiYgc3Bhbi5pZCAmJiBzcGFuLnBhcmVudElkKSB7XG4gICAgdmFyIGZsYWdzID0gc3Bhbi5zYW1wbGVkID8gZHRTYW1wbGVkRmxhZ3MgOiBkdFVuU2FtcGxlZEZsYWdzO1xuICAgIHZhciBpZCA9IHNwYW4uc2FtcGxlZCA/IHNwYW4uaWQgOiBzcGFuLnBhcmVudElkO1xuICAgIHJldHVybiBkdFZlcnNpb24gKyAnLScgKyBzcGFuLnRyYWNlSWQgKyAnLScgKyBpZCArICctJyArIGZsYWdzO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlRHRIZWFkZXJWYWx1ZSh2YWx1ZSkge1xuICB2YXIgcGFyc2VkID0gL14oW1xcZGEtZl17Mn0pLShbXFxkYS1mXXszMn0pLShbXFxkYS1mXXsxNn0pLShbXFxkYS1mXXsyfSkkLy5leGVjKHZhbHVlKTtcblxuICBpZiAocGFyc2VkKSB7XG4gICAgdmFyIGZsYWdzID0gcGFyc2VkWzRdO1xuICAgIHZhciBzYW1wbGVkID0gZmxhZ3MgIT09ICcwMCc7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYWNlSWQ6IHBhcnNlZFsyXSxcbiAgICAgIGlkOiBwYXJzZWRbM10sXG4gICAgICBzYW1wbGVkOiBzYW1wbGVkXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0R0SGVhZGVyVmFsaWQoaGVhZGVyKSB7XG4gIHJldHVybiAvXltcXGRhLWZdezJ9LVtcXGRhLWZdezMyfS1bXFxkYS1mXXsxNn0tW1xcZGEtZl17Mn0kLy50ZXN0KGhlYWRlcikgJiYgaGVhZGVyLnNsaWNlKDMsIDM1KSAhPT0gJzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwJyAmJiBoZWFkZXIuc2xpY2UoMzYsIDUyKSAhPT0gJzAwMDAwMDAwMDAwMDAwMDAnO1xufVxuXG5mdW5jdGlvbiBnZXRUU0hlYWRlclZhbHVlKF9yZWYpIHtcbiAgdmFyIHNhbXBsZVJhdGUgPSBfcmVmLnNhbXBsZVJhdGU7XG5cbiAgaWYgKHR5cGVvZiBzYW1wbGVSYXRlICE9PSAnbnVtYmVyJyB8fCBTdHJpbmcoc2FtcGxlUmF0ZSkubGVuZ3RoID4gMjU2KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIE5BTUVTUEFDRSA9ICdlcyc7XG4gIHZhciBTRVBBUkFUT1IgPSAnPSc7XG4gIHJldHVybiBcIlwiICsgTkFNRVNQQUNFICsgU0VQQVJBVE9SICsgXCJzOlwiICsgc2FtcGxlUmF0ZTtcbn1cblxuZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdGFyZ2V0LnNldFJlcXVlc3RIZWFkZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0YXJnZXQuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodGFyZ2V0LmhlYWRlcnMgJiYgdHlwZW9mIHRhcmdldC5oZWFkZXJzLmFwcGVuZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRhcmdldC5oZWFkZXJzLmFwcGVuZChuYW1lLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0W25hbWVdID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tTYW1lT3JpZ2luKHNvdXJjZSwgdGFyZ2V0KSB7XG4gIHZhciBpc1NhbWUgPSBmYWxzZTtcblxuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICBpc1NhbWUgPSBzb3VyY2UgPT09IHRhcmdldDtcbiAgfSBlbHNlIGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldC50ZXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaXNTYW1lID0gdGFyZ2V0LnRlc3Qoc291cmNlKTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICB0YXJnZXQuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgaWYgKCFpc1NhbWUpIHtcbiAgICAgICAgaXNTYW1lID0gY2hlY2tTYW1lT3JpZ2luKHNvdXJjZSwgdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gaXNTYW1lO1xufVxuXG5mdW5jdGlvbiBpc1BsYXRmb3JtU3VwcG9ydGVkKCkge1xuICByZXR1cm4gaXNCcm93c2VyICYmIHR5cGVvZiBTZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIEpTT04uc3RyaW5naWZ5ID09PSAnZnVuY3Rpb24nICYmIFBFUkYgJiYgdHlwZW9mIFBFUkYubm93ID09PSAnZnVuY3Rpb24nICYmIGlzQ09SU1N1cHBvcnRlZCgpO1xufVxuXG5mdW5jdGlvbiBzZXRMYWJlbChrZXksIHZhbHVlLCBvYmopIHtcbiAgaWYgKCFvYmogfHwgIWtleSkgcmV0dXJuO1xuICB2YXIgc2tleSA9IHJlbW92ZUludmFsaWRDaGFycyhrZXkpO1xuICB2YXIgdmFsdWVUeXBlID0gdHlwZW9mIHZhbHVlO1xuXG4gIGlmICh2YWx1ZSAhPSB1bmRlZmluZWQgJiYgdmFsdWVUeXBlICE9PSAnYm9vbGVhbicgJiYgdmFsdWVUeXBlICE9PSAnbnVtYmVyJykge1xuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIG9ialtza2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBnZXRTZXJ2ZXJUaW1pbmdJbmZvKHNlcnZlclRpbWluZ0VudHJpZXMpIHtcbiAgaWYgKHNlcnZlclRpbWluZ0VudHJpZXMgPT09IHZvaWQgMCkge1xuICAgIHNlcnZlclRpbWluZ0VudHJpZXMgPSBbXTtcbiAgfVxuXG4gIHZhciBzZXJ2ZXJUaW1pbmdJbmZvID0gW107XG4gIHZhciBlbnRyeVNlcGFyYXRvciA9ICcsICc7XG4gIHZhciB2YWx1ZVNlcGFyYXRvciA9ICc7JztcblxuICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBzZXJ2ZXJUaW1pbmdFbnRyaWVzLmxlbmd0aDsgX2kyKyspIHtcbiAgICB2YXIgX3NlcnZlclRpbWluZ0VudHJpZXMkID0gc2VydmVyVGltaW5nRW50cmllc1tfaTJdLFxuICAgICAgICBuYW1lID0gX3NlcnZlclRpbWluZ0VudHJpZXMkLm5hbWUsXG4gICAgICAgIGR1cmF0aW9uID0gX3NlcnZlclRpbWluZ0VudHJpZXMkLmR1cmF0aW9uLFxuICAgICAgICBkZXNjcmlwdGlvbiA9IF9zZXJ2ZXJUaW1pbmdFbnRyaWVzJC5kZXNjcmlwdGlvbjtcbiAgICB2YXIgdGltaW5nVmFsdWUgPSBuYW1lO1xuXG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICB0aW1pbmdWYWx1ZSArPSB2YWx1ZVNlcGFyYXRvciArICdkZXNjPScgKyBkZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgIHRpbWluZ1ZhbHVlICs9IHZhbHVlU2VwYXJhdG9yICsgJ2R1cj0nICsgZHVyYXRpb247XG4gICAgfVxuXG4gICAgc2VydmVyVGltaW5nSW5mby5wdXNoKHRpbWluZ1ZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiBzZXJ2ZXJUaW1pbmdJbmZvLmpvaW4oZW50cnlTZXBhcmF0b3IpO1xufVxuXG5mdW5jdGlvbiBnZXRUaW1lT3JpZ2luKCkge1xuICByZXR1cm4gUEVSRi50aW1pbmcuZmV0Y2hTdGFydDtcbn1cblxuZnVuY3Rpb24gc3RyaXBRdWVyeVN0cmluZ0Zyb21VcmwodXJsKSB7XG4gIHJldHVybiB1cmwgJiYgdXJsLnNwbGl0KCc/JylbMF07XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGJhc2VFeHRlbmQoZHN0LCBvYmpzLCBkZWVwKSB7XG4gIGZvciAodmFyIGkgPSAwLCBpaSA9IG9ianMubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgIHZhciBvYmogPSBvYmpzW2ldO1xuICAgIGlmICghaXNPYmplY3Qob2JqKSAmJiAhaXNGdW5jdGlvbihvYmopKSBjb250aW51ZTtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAgICBmb3IgKHZhciBqID0gMCwgamogPSBrZXlzLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2pdO1xuICAgICAgdmFyIHNyYyA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoZGVlcCAmJiBpc09iamVjdChzcmMpKSB7XG4gICAgICAgIGlmICghaXNPYmplY3QoZHN0W2tleV0pKSBkc3Rba2V5XSA9IEFycmF5LmlzQXJyYXkoc3JjKSA/IFtdIDoge307XG4gICAgICAgIGJhc2VFeHRlbmQoZHN0W2tleV0sIFtzcmNdLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkc3Rba2V5XSA9IHNyYztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZHN0O1xufVxuXG5mdW5jdGlvbiBnZXRFbGFzdGljU2NyaXB0KCkge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzY3JpcHRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIHNjID0gc2NyaXB0c1tpXTtcblxuICAgICAgaWYgKHNjLnNyYy5pbmRleE9mKCdlbGFzdGljJykgPiAwKSB7XG4gICAgICAgIHJldHVybiBzYztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q3VycmVudFNjcmlwdCgpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgY3VycmVudFNjcmlwdCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQ7XG5cbiAgICBpZiAoIWN1cnJlbnRTY3JpcHQpIHtcbiAgICAgIHJldHVybiBnZXRFbGFzdGljU2NyaXB0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRTY3JpcHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXh0ZW5kKGRzdCkge1xuICByZXR1cm4gYmFzZUV4dGVuZChkc3QsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBtZXJnZShkc3QpIHtcbiAgcmV0dXJuIGJhc2VFeHRlbmQoZHN0LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIHRydWUpO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuZnVuY3Rpb24gZmluZChhcnJheSwgcHJlZGljYXRlLCB0aGlzQXJnKSB7XG4gIGlmIChhcnJheSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJyYXkgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xuICB9XG5cbiAgdmFyIG8gPSBPYmplY3QoYXJyYXkpO1xuICB2YXIgbGVuID0gby5sZW5ndGggPj4+IDA7XG5cbiAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcmVkaWNhdGUgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICB2YXIgayA9IDA7XG5cbiAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICB2YXIga1ZhbHVlID0gb1trXTtcblxuICAgIGlmIChwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCBrVmFsdWUsIGssIG8pKSB7XG4gICAgICByZXR1cm4ga1ZhbHVlO1xuICAgIH1cblxuICAgIGsrKztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUludmFsaWRDaGFycyhrZXkpIHtcbiAgcmV0dXJuIGtleS5yZXBsYWNlKC9bLipcIl0vZywgJ18nKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGF0ZXN0U3BhbihzcGFucywgdHlwZUZpbHRlcikge1xuICB2YXIgbGF0ZXN0U3BhbiA9IG51bGw7XG5cbiAgZm9yICh2YXIgX2kzID0gMDsgX2kzIDwgc3BhbnMubGVuZ3RoOyBfaTMrKykge1xuICAgIHZhciBzcGFuID0gc3BhbnNbX2kzXTtcblxuICAgIGlmICh0eXBlRmlsdGVyICYmIHR5cGVGaWx0ZXIoc3Bhbi50eXBlKSAmJiAoIWxhdGVzdFNwYW4gfHwgbGF0ZXN0U3Bhbi5fZW5kIDwgc3Bhbi5fZW5kKSkge1xuICAgICAgbGF0ZXN0U3BhbiA9IHNwYW47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxhdGVzdFNwYW47XG59XG5cbmZ1bmN0aW9uIGdldExhdGVzdE5vblhIUlNwYW4oc3BhbnMpIHtcbiAgcmV0dXJuIGdldExhdGVzdFNwYW4oc3BhbnMsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIFN0cmluZyh0eXBlKS5pbmRleE9mKCdleHRlcm5hbCcpID09PSAtMTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldExhdGVzdFhIUlNwYW4oc3BhbnMpIHtcbiAgcmV0dXJuIGdldExhdGVzdFNwYW4oc3BhbnMsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIFN0cmluZyh0eXBlKS5pbmRleE9mKCdleHRlcm5hbCcpICE9PSAtMTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEVhcmxpZXN0U3BhbihzcGFucykge1xuICB2YXIgZWFybGllc3RTcGFuID0gc3BhbnNbMF07XG5cbiAgZm9yICh2YXIgX2k0ID0gMTsgX2k0IDwgc3BhbnMubGVuZ3RoOyBfaTQrKykge1xuICAgIHZhciBzcGFuID0gc3BhbnNbX2k0XTtcblxuICAgIGlmIChlYXJsaWVzdFNwYW4uX3N0YXJ0ID4gc3Bhbi5fc3RhcnQpIHtcbiAgICAgIGVhcmxpZXN0U3BhbiA9IHNwYW47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVhcmxpZXN0U3Bhbjtcbn1cblxuZnVuY3Rpb24gbm93KCkge1xuICByZXR1cm4gUEVSRi5ub3coKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGltZSh0aW1lKSB7XG4gIHJldHVybiB0eXBlb2YgdGltZSA9PT0gJ251bWJlcicgJiYgdGltZSA+PSAwID8gdGltZSA6IG5vdygpO1xufVxuXG5mdW5jdGlvbiBnZXREdXJhdGlvbihzdGFydCwgZW5kKSB7XG4gIGlmIChpc1VuZGVmaW5lZChlbmQpIHx8IGlzVW5kZWZpbmVkKHN0YXJ0KSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlSW50KGVuZCAtIHN0YXJ0KTtcbn1cblxuZnVuY3Rpb24gc2NoZWR1bGVNYWNyb1Rhc2soY2FsbGJhY2spIHtcbiAgc2V0VGltZW91dChjYWxsYmFjaywgMCk7XG59XG5cbmZ1bmN0aW9uIHNjaGVkdWxlTWljcm9UYXNrKGNhbGxiYWNrKSB7XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCgpIHtcbiAgcmV0dXJuIHR5cGVvZiBQRVJGLmdldEVudHJpZXNCeVR5cGUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzUGVyZlR5cGVTdXBwb3J0ZWQodHlwZSkge1xuICByZXR1cm4gdHlwZW9mIFBlcmZvcm1hbmNlT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnICYmIFBlcmZvcm1hbmNlT2JzZXJ2ZXIuc3VwcG9ydGVkRW50cnlUeXBlcyAmJiBQZXJmb3JtYW5jZU9ic2VydmVyLnN1cHBvcnRlZEVudHJ5VHlwZXMuaW5kZXhPZih0eXBlKSA+PSAwO1xufVxuXG5mdW5jdGlvbiBpc0JlYWNvbkluc3BlY3Rpb25FbmFibGVkKCkge1xuICB2YXIgZmxhZ05hbWUgPSAnX2VsYXN0aWNfaW5zcGVjdF9iZWFjb25fJztcblxuICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShmbGFnTmFtZSkgIT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKCF3aW5kb3cuVVJMIHx8ICF3aW5kb3cuVVJMU2VhcmNoUGFyYW1zKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB2YXIgcGFyc2VkVXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgdmFyIGlzRmxhZ1NldCA9IHBhcnNlZFVybC5zZWFyY2hQYXJhbXMuaGFzKGZsYWdOYW1lKTtcblxuICAgIGlmIChpc0ZsYWdTZXQpIHtcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oZmxhZ05hbWUsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBpc0ZsYWdTZXQ7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSh0aW1pbmcpIHtcbiAgcmV0dXJuIHRpbWluZy5yZWRpcmVjdFN0YXJ0ID4gMDtcbn1cblxuZXhwb3J0IHsgZXh0ZW5kLCBtZXJnZSwgaXNVbmRlZmluZWQsIG5vb3AsIGJhc2VFeHRlbmQsIGJ5dGVzVG9IZXgsIGlzQ09SU1N1cHBvcnRlZCwgaXNPYmplY3QsIGlzRnVuY3Rpb24sIGlzUGxhdGZvcm1TdXBwb3J0ZWQsIGlzRHRIZWFkZXJWYWxpZCwgcGFyc2VEdEhlYWRlclZhbHVlLCBnZXRTZXJ2ZXJUaW1pbmdJbmZvLCBnZXREdEhlYWRlclZhbHVlLCBnZXRUU0hlYWRlclZhbHVlLCBnZXRDdXJyZW50U2NyaXB0LCBnZXRFbGFzdGljU2NyaXB0LCBnZXRUaW1lT3JpZ2luLCBnZW5lcmF0ZVJhbmRvbUlkLCBnZXRFYXJsaWVzdFNwYW4sIGdldExhdGVzdE5vblhIUlNwYW4sIGdldExhdGVzdFhIUlNwYW4sIGdldER1cmF0aW9uLCBnZXRUaW1lLCBub3csIHJuZywgY2hlY2tTYW1lT3JpZ2luLCBzY2hlZHVsZU1hY3JvVGFzaywgc2NoZWR1bGVNaWNyb1Rhc2ssIHNldExhYmVsLCBzZXRSZXF1ZXN0SGVhZGVyLCBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybCwgZmluZCwgcmVtb3ZlSW52YWxpZENoYXJzLCBQRVJGLCBpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCwgaXNCcm93c2VyLCBpc1BlcmZUeXBlU3VwcG9ydGVkLCBpc0JlYWNvbkluc3BlY3Rpb25FbmFibGVkLCBpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSB9OyIsInZhciBfZXhjbHVkZWQgPSBbXCJ0YWdzXCJdO1xuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0ge307IHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgdmFyIGtleSwgaTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmltcG9ydCB7IGNyZWF0ZVN0YWNrVHJhY2VzLCBmaWx0ZXJJbnZhbGlkRnJhbWVzIH0gZnJvbSAnLi9zdGFjay10cmFjZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbUlkLCBtZXJnZSwgZXh0ZW5kIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IGdldFBhZ2VDb250ZXh0IH0gZnJvbSAnLi4vY29tbW9uL2NvbnRleHQnO1xuaW1wb3J0IHsgdHJ1bmNhdGVNb2RlbCwgRVJST1JfTU9ERUwgfSBmcm9tICcuLi9jb21tb24vdHJ1bmNhdGUnO1xuaW1wb3J0IHN0YWNrUGFyc2VyIGZyb20gJ2Vycm9yLXN0YWNrLXBhcnNlcic7XG52YXIgSUdOT1JFX0tFWVMgPSBbJ3N0YWNrJywgJ21lc3NhZ2UnXTtcblxuZnVuY3Rpb24gZ2V0RXJyb3JQcm9wZXJ0aWVzKGVycm9yKSB7XG4gIHZhciBwcm9wZXJ0eUZvdW5kID0gZmFsc2U7XG4gIHZhciBwcm9wZXJ0aWVzID0ge307XG4gIE9iamVjdC5rZXlzKGVycm9yKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoSUdOT1JFX0tFWVMuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdmFsID0gZXJyb3Jba2V5XTtcblxuICAgIGlmICh2YWwgPT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbC50b0lTT1N0cmluZyAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuICAgICAgdmFsID0gdmFsLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgcHJvcGVydGllc1trZXldID0gdmFsO1xuICAgIHByb3BlcnR5Rm91bmQgPSB0cnVlO1xuICB9KTtcblxuICBpZiAocHJvcGVydHlGb3VuZCkge1xuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICB9XG59XG5cbnZhciBFcnJvckxvZ2dpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEVycm9yTG9nZ2luZyhhcG1TZXJ2ZXIsIGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSkge1xuICAgIHRoaXMuX2FwbVNlcnZlciA9IGFwbVNlcnZlcjtcbiAgICB0aGlzLl9jb25maWdTZXJ2aWNlID0gY29uZmlnU2VydmljZTtcbiAgICB0aGlzLl90cmFuc2FjdGlvblNlcnZpY2UgPSB0cmFuc2FjdGlvblNlcnZpY2U7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gRXJyb3JMb2dnaW5nLnByb3RvdHlwZTtcblxuICBfcHJvdG8uY3JlYXRlRXJyb3JEYXRhTW9kZWwgPSBmdW5jdGlvbiBjcmVhdGVFcnJvckRhdGFNb2RlbChlcnJvckV2ZW50KSB7XG4gICAgdmFyIGZyYW1lcyA9IGNyZWF0ZVN0YWNrVHJhY2VzKHN0YWNrUGFyc2VyLCBlcnJvckV2ZW50KTtcbiAgICB2YXIgZmlsdGVyZWRGcmFtZXMgPSBmaWx0ZXJJbnZhbGlkRnJhbWVzKGZyYW1lcyk7XG4gICAgdmFyIGN1bHByaXQgPSAnKGlubGluZSBzY3JpcHQpJztcbiAgICB2YXIgbGFzdEZyYW1lID0gZmlsdGVyZWRGcmFtZXNbZmlsdGVyZWRGcmFtZXMubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAobGFzdEZyYW1lICYmIGxhc3RGcmFtZS5maWxlbmFtZSkge1xuICAgICAgY3VscHJpdCA9IGxhc3RGcmFtZS5maWxlbmFtZTtcbiAgICB9XG5cbiAgICB2YXIgbWVzc2FnZSA9IGVycm9yRXZlbnQubWVzc2FnZSxcbiAgICAgICAgZXJyb3IgPSBlcnJvckV2ZW50LmVycm9yO1xuICAgIHZhciBlcnJvck1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHZhciBlcnJvclR5cGUgPSAnJztcbiAgICB2YXIgZXJyb3JDb250ZXh0ID0ge307XG5cbiAgICBpZiAoZXJyb3IgJiYgdHlwZW9mIGVycm9yID09PSAnb2JqZWN0Jykge1xuICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3JNZXNzYWdlIHx8IGVycm9yLm1lc3NhZ2U7XG4gICAgICBlcnJvclR5cGUgPSBlcnJvci5uYW1lO1xuICAgICAgdmFyIGN1c3RvbVByb3BlcnRpZXMgPSBnZXRFcnJvclByb3BlcnRpZXMoZXJyb3IpO1xuXG4gICAgICBpZiAoY3VzdG9tUHJvcGVydGllcykge1xuICAgICAgICBlcnJvckNvbnRleHQuY3VzdG9tID0gY3VzdG9tUHJvcGVydGllcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWVycm9yVHlwZSkge1xuICAgICAgaWYgKGVycm9yTWVzc2FnZSAmJiBlcnJvck1lc3NhZ2UuaW5kZXhPZignOicpID4gLTEpIHtcbiAgICAgICAgZXJyb3JUeXBlID0gZXJyb3JNZXNzYWdlLnNwbGl0KCc6JylbMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRUcmFuc2FjdGlvbiA9IHRoaXMuX3RyYW5zYWN0aW9uU2VydmljZS5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKTtcblxuICAgIHZhciB0cmFuc2FjdGlvbkNvbnRleHQgPSBjdXJyZW50VHJhbnNhY3Rpb24gPyBjdXJyZW50VHJhbnNhY3Rpb24uY29udGV4dCA6IHt9O1xuXG4gICAgdmFyIF90aGlzJF9jb25maWdTZXJ2aWNlJCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdjb250ZXh0JyksXG4gICAgICAgIHRhZ3MgPSBfdGhpcyRfY29uZmlnU2VydmljZSQudGFncyxcbiAgICAgICAgY29uZmlnQ29udGV4dCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF90aGlzJF9jb25maWdTZXJ2aWNlJCwgX2V4Y2x1ZGVkKTtcblxuICAgIHZhciBwYWdlQ29udGV4dCA9IGdldFBhZ2VDb250ZXh0KCk7XG4gICAgdmFyIGNvbnRleHQgPSBtZXJnZSh7fSwgcGFnZUNvbnRleHQsIHRyYW5zYWN0aW9uQ29udGV4dCwgY29uZmlnQ29udGV4dCwgZXJyb3JDb250ZXh0KTtcbiAgICB2YXIgZXJyb3JPYmplY3QgPSB7XG4gICAgICBpZDogZ2VuZXJhdGVSYW5kb21JZCgpLFxuICAgICAgY3VscHJpdDogY3VscHJpdCxcbiAgICAgIGV4Y2VwdGlvbjoge1xuICAgICAgICBtZXNzYWdlOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgIHN0YWNrdHJhY2U6IGZpbHRlcmVkRnJhbWVzLFxuICAgICAgICB0eXBlOiBlcnJvclR5cGVcbiAgICAgIH0sXG4gICAgICBjb250ZXh0OiBjb250ZXh0XG4gICAgfTtcblxuICAgIGlmIChjdXJyZW50VHJhbnNhY3Rpb24pIHtcbiAgICAgIGVycm9yT2JqZWN0ID0gZXh0ZW5kKGVycm9yT2JqZWN0LCB7XG4gICAgICAgIHRyYWNlX2lkOiBjdXJyZW50VHJhbnNhY3Rpb24udHJhY2VJZCxcbiAgICAgICAgcGFyZW50X2lkOiBjdXJyZW50VHJhbnNhY3Rpb24uaWQsXG4gICAgICAgIHRyYW5zYWN0aW9uX2lkOiBjdXJyZW50VHJhbnNhY3Rpb24uaWQsXG4gICAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICAgdHlwZTogY3VycmVudFRyYW5zYWN0aW9uLnR5cGUsXG4gICAgICAgICAgc2FtcGxlZDogY3VycmVudFRyYW5zYWN0aW9uLnNhbXBsZWRcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydW5jYXRlTW9kZWwoRVJST1JfTU9ERUwsIGVycm9yT2JqZWN0KTtcbiAgfTtcblxuICBfcHJvdG8ubG9nRXJyb3JFdmVudCA9IGZ1bmN0aW9uIGxvZ0Vycm9yRXZlbnQoZXJyb3JFdmVudCkge1xuICAgIGlmICh0eXBlb2YgZXJyb3JFdmVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZXJyb3JPYmplY3QgPSB0aGlzLmNyZWF0ZUVycm9yRGF0YU1vZGVsKGVycm9yRXZlbnQpO1xuXG4gICAgaWYgKHR5cGVvZiBlcnJvck9iamVjdC5leGNlcHRpb24ubWVzc2FnZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9hcG1TZXJ2ZXIuYWRkRXJyb3IoZXJyb3JPYmplY3QpO1xuICB9O1xuXG4gIF9wcm90by5yZWdpc3Rlckxpc3RlbmVycyA9IGZ1bmN0aW9uIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3JFdmVudCkge1xuICAgICAgcmV0dXJuIF90aGlzLmxvZ0Vycm9yRXZlbnQoZXJyb3JFdmVudCk7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3VuaGFuZGxlZHJlamVjdGlvbicsIGZ1bmN0aW9uIChwcm9taXNlUmVqZWN0aW9uRXZlbnQpIHtcbiAgICAgIHJldHVybiBfdGhpcy5sb2dQcm9taXNlRXZlbnQocHJvbWlzZVJlamVjdGlvbkV2ZW50KTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8ubG9nUHJvbWlzZUV2ZW50ID0gZnVuY3Rpb24gbG9nUHJvbWlzZUV2ZW50KHByb21pc2VSZWplY3Rpb25FdmVudCkge1xuICAgIHZhciBwcmVmaXggPSAnVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uOiAnO1xuICAgIHZhciByZWFzb24gPSBwcm9taXNlUmVqZWN0aW9uRXZlbnQucmVhc29uO1xuXG4gICAgaWYgKHJlYXNvbiA9PSBudWxsKSB7XG4gICAgICByZWFzb24gPSAnPG5vIHJlYXNvbiBzcGVjaWZpZWQ+JztcbiAgICB9XG5cbiAgICB2YXIgZXJyb3JFdmVudDtcblxuICAgIGlmICh0eXBlb2YgcmVhc29uLm1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgbmFtZSA9IHJlYXNvbi5uYW1lID8gcmVhc29uLm5hbWUgKyAnOiAnIDogJyc7XG4gICAgICBlcnJvckV2ZW50ID0ge1xuICAgICAgICBlcnJvcjogcmVhc29uLFxuICAgICAgICBtZXNzYWdlOiBwcmVmaXggKyBuYW1lICsgcmVhc29uLm1lc3NhZ2VcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYXNvbiA9IHR5cGVvZiByZWFzb24gPT09ICdvYmplY3QnID8gJzxvYmplY3Q+JyA6IHR5cGVvZiByZWFzb24gPT09ICdmdW5jdGlvbicgPyAnPGZ1bmN0aW9uPicgOiByZWFzb247XG4gICAgICBlcnJvckV2ZW50ID0ge1xuICAgICAgICBtZXNzYWdlOiBwcmVmaXggKyByZWFzb25cbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5sb2dFcnJvckV2ZW50KGVycm9yRXZlbnQpO1xuICB9O1xuXG4gIF9wcm90by5sb2dFcnJvciA9IGZ1bmN0aW9uIGxvZ0Vycm9yKG1lc3NhZ2VPckVycm9yKSB7XG4gICAgdmFyIGVycm9yRXZlbnQgPSB7fTtcblxuICAgIGlmICh0eXBlb2YgbWVzc2FnZU9yRXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlcnJvckV2ZW50Lm1lc3NhZ2UgPSBtZXNzYWdlT3JFcnJvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JFdmVudC5lcnJvciA9IG1lc3NhZ2VPckVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmxvZ0Vycm9yRXZlbnQoZXJyb3JFdmVudCk7XG4gIH07XG5cbiAgcmV0dXJuIEVycm9yTG9nZ2luZztcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JMb2dnaW5nOyIsImltcG9ydCBFcnJvckxvZ2dpbmcgZnJvbSAnLi9lcnJvci1sb2dnaW5nJztcbmltcG9ydCB7IENPTkZJR19TRVJWSUNFLCBUUkFOU0FDVElPTl9TRVJWSUNFLCBFUlJPUl9MT0dHSU5HLCBBUE1fU0VSVkVSIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBzZXJ2aWNlQ3JlYXRvcnMgfSBmcm9tICcuLi9jb21tb24vc2VydmljZS1mYWN0b3J5JztcblxuZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlcygpIHtcbiAgc2VydmljZUNyZWF0b3JzW0VSUk9SX0xPR0dJTkddID0gZnVuY3Rpb24gKHNlcnZpY2VGYWN0b3J5KSB7XG4gICAgdmFyIF9zZXJ2aWNlRmFjdG9yeSRnZXRTZSA9IHNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoW0FQTV9TRVJWRVIsIENPTkZJR19TRVJWSUNFLCBUUkFOU0FDVElPTl9TRVJWSUNFXSksXG4gICAgICAgIGFwbVNlcnZlciA9IF9zZXJ2aWNlRmFjdG9yeSRnZXRTZVswXSxcbiAgICAgICAgY29uZmlnU2VydmljZSA9IF9zZXJ2aWNlRmFjdG9yeSRnZXRTZVsxXSxcbiAgICAgICAgdHJhbnNhY3Rpb25TZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlWzJdO1xuXG4gICAgcmV0dXJuIG5ldyBFcnJvckxvZ2dpbmcoYXBtU2VydmVyLCBjb25maWdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpO1xuICB9O1xufVxuXG5leHBvcnQgeyByZWdpc3RlclNlcnZpY2VzIH07IiwiZnVuY3Rpb24gZmlsZVBhdGhUb0ZpbGVOYW1lKGZpbGVVcmwpIHtcbiAgdmFyIG9yaWdpbiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gfHwgd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSArICh3aW5kb3cubG9jYXRpb24ucG9ydCA/ICc6JyArIHdpbmRvdy5sb2NhdGlvbi5wb3J0IDogJycpO1xuXG4gIGlmIChmaWxlVXJsLmluZGV4T2Yob3JpZ2luKSA+IC0xKSB7XG4gICAgZmlsZVVybCA9IGZpbGVVcmwucmVwbGFjZShvcmlnaW4gKyAnLycsICcnKTtcbiAgfVxuXG4gIHJldHVybiBmaWxlVXJsO1xufVxuXG5mdW5jdGlvbiBjbGVhbkZpbGVQYXRoKGZpbGVQYXRoKSB7XG4gIGlmIChmaWxlUGF0aCA9PT0gdm9pZCAwKSB7XG4gICAgZmlsZVBhdGggPSAnJztcbiAgfVxuXG4gIGlmIChmaWxlUGF0aCA9PT0gJzxhbm9ueW1vdXM+Jykge1xuICAgIGZpbGVQYXRoID0gJyc7XG4gIH1cblxuICByZXR1cm4gZmlsZVBhdGg7XG59XG5cbmZ1bmN0aW9uIGlzRmlsZUlubGluZShmaWxlVXJsKSB7XG4gIGlmIChmaWxlVXJsKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoZmlsZVVybCkgPT09IDA7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0YWNrRnJhbWVzKHN0YWNrRnJhbWVzKSB7XG4gIHJldHVybiBzdGFja0ZyYW1lcy5tYXAoZnVuY3Rpb24gKGZyYW1lKSB7XG4gICAgaWYgKGZyYW1lLmZ1bmN0aW9uTmFtZSkge1xuICAgICAgZnJhbWUuZnVuY3Rpb25OYW1lID0gbm9ybWFsaXplRnVuY3Rpb25OYW1lKGZyYW1lLmZ1bmN0aW9uTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZyYW1lO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRnVuY3Rpb25OYW1lKGZuTmFtZSkge1xuICB2YXIgcGFydHMgPSBmbk5hbWUuc3BsaXQoJy8nKTtcblxuICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgIGZuTmFtZSA9IFsnT2JqZWN0JywgcGFydHNbcGFydHMubGVuZ3RoIC0gMV1dLmpvaW4oJy4nKTtcbiAgfSBlbHNlIHtcbiAgICBmbk5hbWUgPSBwYXJ0c1swXTtcbiAgfVxuXG4gIGZuTmFtZSA9IGZuTmFtZS5yZXBsYWNlKC8uPCQvZ2ksICcuPGFub255bW91cz4nKTtcbiAgZm5OYW1lID0gZm5OYW1lLnJlcGxhY2UoL15Bbm9ueW1vdXMgZnVuY3Rpb24kLywgJzxhbm9ueW1vdXM+Jyk7XG4gIHBhcnRzID0gZm5OYW1lLnNwbGl0KCcuJyk7XG5cbiAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICBmbk5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgfSBlbHNlIHtcbiAgICBmbk5hbWUgPSBwYXJ0c1swXTtcbiAgfVxuXG4gIHJldHVybiBmbk5hbWU7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRTdGFja1RyYWNlKHN0YWNrVHJhY2VzKSB7XG4gIGlmIChzdGFja1RyYWNlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoc3RhY2tUcmFjZXMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIHN0YWNrVHJhY2UgPSBzdGFja1RyYWNlc1swXTtcbiAgICByZXR1cm4gJ2xpbmVOdW1iZXInIGluIHN0YWNrVHJhY2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0YWNrVHJhY2VzKHN0YWNrUGFyc2VyLCBlcnJvckV2ZW50KSB7XG4gIHZhciBlcnJvciA9IGVycm9yRXZlbnQuZXJyb3IsXG4gICAgICBmaWxlbmFtZSA9IGVycm9yRXZlbnQuZmlsZW5hbWUsXG4gICAgICBsaW5lbm8gPSBlcnJvckV2ZW50LmxpbmVubyxcbiAgICAgIGNvbG5vID0gZXJyb3JFdmVudC5jb2xubztcbiAgdmFyIHN0YWNrVHJhY2VzID0gW107XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN0YWNrVHJhY2VzID0gc3RhY2tQYXJzZXIucGFyc2UoZXJyb3IpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cblxuICBpZiAoIWlzVmFsaWRTdGFja1RyYWNlKHN0YWNrVHJhY2VzKSkge1xuICAgIHN0YWNrVHJhY2VzID0gW3tcbiAgICAgIGZpbGVOYW1lOiBmaWxlbmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IGxpbmVubyxcbiAgICAgIGNvbHVtbk51bWJlcjogY29sbm9cbiAgICB9XTtcbiAgfVxuXG4gIHZhciBub3JtYWxpemVkU3RhY2tUcmFjZXMgPSBub3JtYWxpemVTdGFja0ZyYW1lcyhzdGFja1RyYWNlcyk7XG4gIHJldHVybiBub3JtYWxpemVkU3RhY2tUcmFjZXMubWFwKGZ1bmN0aW9uIChzdGFjaykge1xuICAgIHZhciBmaWxlTmFtZSA9IHN0YWNrLmZpbGVOYW1lLFxuICAgICAgICBsaW5lTnVtYmVyID0gc3RhY2subGluZU51bWJlcixcbiAgICAgICAgY29sdW1uTnVtYmVyID0gc3RhY2suY29sdW1uTnVtYmVyLFxuICAgICAgICBfc3RhY2skZnVuY3Rpb25OYW1lID0gc3RhY2suZnVuY3Rpb25OYW1lLFxuICAgICAgICBmdW5jdGlvbk5hbWUgPSBfc3RhY2skZnVuY3Rpb25OYW1lID09PSB2b2lkIDAgPyAnPGFub255bW91cz4nIDogX3N0YWNrJGZ1bmN0aW9uTmFtZTtcblxuICAgIGlmICghZmlsZU5hbWUgJiYgIWxpbmVOdW1iZXIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBpZiAoIWNvbHVtbk51bWJlciAmJiAhbGluZU51bWJlcikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHZhciBmaWxlUGF0aCA9IGNsZWFuRmlsZVBhdGgoZmlsZU5hbWUpO1xuICAgIHZhciBjbGVhbmVkRmlsZU5hbWUgPSBmaWxlUGF0aFRvRmlsZU5hbWUoZmlsZVBhdGgpO1xuXG4gICAgaWYgKGlzRmlsZUlubGluZShmaWxlUGF0aCkpIHtcbiAgICAgIGNsZWFuZWRGaWxlTmFtZSA9ICcoaW5saW5lIHNjcmlwdCknO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhYnNfcGF0aDogZmlsZU5hbWUsXG4gICAgICBmaWxlbmFtZTogY2xlYW5lZEZpbGVOYW1lLFxuICAgICAgZnVuY3Rpb246IGZ1bmN0aW9uTmFtZSxcbiAgICAgIGxpbmVubzogbGluZU51bWJlcixcbiAgICAgIGNvbG5vOiBjb2x1bW5OdW1iZXJcbiAgICB9O1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJJbnZhbGlkRnJhbWVzKGZyYW1lcykge1xuICByZXR1cm4gZnJhbWVzLmZpbHRlcihmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBmaWxlbmFtZSA9IF9yZWYuZmlsZW5hbWUsXG4gICAgICAgIGxpbmVubyA9IF9yZWYubGluZW5vO1xuICAgIHJldHVybiB0eXBlb2YgZmlsZW5hbWUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBsaW5lbm8gIT09ICd1bmRlZmluZWQnO1xuICB9KTtcbn0iLCJpbXBvcnQgeyByZWdpc3RlclNlcnZpY2VzIGFzIHJlZ2lzdGVyRXJyb3JTZXJ2aWNlcyB9IGZyb20gJy4vZXJyb3ItbG9nZ2luZyc7XG5pbXBvcnQgeyByZWdpc3RlclNlcnZpY2VzIGFzIHJlZ2lzdGVyUGVyZlNlcnZpY2VzIH0gZnJvbSAnLi9wZXJmb3JtYW5jZS1tb25pdG9yaW5nJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi9jb21tb24vc2VydmljZS1mYWN0b3J5JztcbmltcG9ydCB7IGlzUGxhdGZvcm1TdXBwb3J0ZWQsIHNjaGVkdWxlTWljcm9UYXNrLCBzY2hlZHVsZU1hY3JvVGFzaywgaXNCcm93c2VyIH0gZnJvbSAnLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgcGF0Y2hBbGwsIHBhdGNoRXZlbnRIYW5kbGVyIH0gZnJvbSAnLi9jb21tb24vcGF0Y2hpbmcnO1xuaW1wb3J0IHsgb2JzZXJ2ZVBhZ2VWaXNpYmlsaXR5LCBvYnNlcnZlUGFnZUNsaWNrcyB9IGZyb20gJy4vY29tbW9uL29ic2VydmVycyc7XG5pbXBvcnQgeyBQQUdFX0xPQURfREVMQVksIFBBR0VfTE9BRCwgRVJST1IsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0UsIEFQTV9TRVJWRVIsIFBFUkZPUk1BTkNFX01PTklUT1JJTkcsIEVSUk9SX0xPR0dJTkcsIEVWRU5UX1RBUkdFVCwgQ0xJQ0sgfSBmcm9tICcuL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0SW5zdHJ1bWVudGF0aW9uRmxhZ3MgfSBmcm9tICcuL2NvbW1vbi9pbnN0cnVtZW50JztcbmltcG9ydCBhZnRlckZyYW1lIGZyb20gJy4vY29tbW9uL2FmdGVyLWZyYW1lJztcbmltcG9ydCB7IGJvb3RzdHJhcCB9IGZyb20gJy4vYm9vdHN0cmFwJztcbmltcG9ydCB7IGNyZWF0ZVRyYWNlciB9IGZyb20gJy4vb3BlbnRyYWNpbmcnO1xuXG5mdW5jdGlvbiBjcmVhdGVTZXJ2aWNlRmFjdG9yeSgpIHtcbiAgcmVnaXN0ZXJQZXJmU2VydmljZXMoKTtcbiAgcmVnaXN0ZXJFcnJvclNlcnZpY2VzKCk7XG4gIHZhciBzZXJ2aWNlRmFjdG9yeSA9IG5ldyBTZXJ2aWNlRmFjdG9yeSgpO1xuICByZXR1cm4gc2VydmljZUZhY3Rvcnk7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVNlcnZpY2VGYWN0b3J5LCBTZXJ2aWNlRmFjdG9yeSwgcGF0Y2hBbGwsIHBhdGNoRXZlbnRIYW5kbGVyLCBpc1BsYXRmb3JtU3VwcG9ydGVkLCBpc0Jyb3dzZXIsIGdldEluc3RydW1lbnRhdGlvbkZsYWdzLCBjcmVhdGVUcmFjZXIsIHNjaGVkdWxlTWljcm9UYXNrLCBzY2hlZHVsZU1hY3JvVGFzaywgYWZ0ZXJGcmFtZSwgRVJST1IsIFBBR0VfTE9BRF9ERUxBWSwgUEFHRV9MT0FELCBDT05GSUdfU0VSVklDRSwgTE9HR0lOR19TRVJWSUNFLCBUUkFOU0FDVElPTl9TRVJWSUNFLCBBUE1fU0VSVkVSLCBQRVJGT1JNQU5DRV9NT05JVE9SSU5HLCBFUlJPUl9MT0dHSU5HLCBFVkVOVF9UQVJHRVQsIENMSUNLLCBib290c3RyYXAsIG9ic2VydmVQYWdlVmlzaWJpbGl0eSwgb2JzZXJ2ZVBhZ2VDbGlja3MgfTsiLCJpbXBvcnQgVHJhY2VyIGZyb20gJy4vdHJhY2VyJztcbmltcG9ydCBTcGFuIGZyb20gJy4vc3Bhbic7XG5pbXBvcnQgeyBUUkFOU0FDVElPTl9TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFBFUkZPUk1BTkNFX01PTklUT1JJTkcsIEVSUk9SX0xPR0dJTkcgfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcblxuZnVuY3Rpb24gY3JlYXRlVHJhY2VyKHNlcnZpY2VGYWN0b3J5KSB7XG4gIHZhciBwZXJmb3JtYW5jZU1vbml0b3JpbmcgPSBzZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFBFUkZPUk1BTkNFX01PTklUT1JJTkcpO1xuICB2YXIgdHJhbnNhY3Rpb25TZXJ2aWNlID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShUUkFOU0FDVElPTl9TRVJWSUNFKTtcbiAgdmFyIGVycm9yTG9nZ2luZyA9IHNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoRVJST1JfTE9HR0lORyk7XG4gIHZhciBsb2dnaW5nU2VydmljZSA9IHNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoTE9HR0lOR19TRVJWSUNFKTtcbiAgcmV0dXJuIG5ldyBUcmFjZXIocGVyZm9ybWFuY2VNb25pdG9yaW5nLCB0cmFuc2FjdGlvblNlcnZpY2UsIGxvZ2dpbmdTZXJ2aWNlLCBlcnJvckxvZ2dpbmcpO1xufVxuXG5leHBvcnQgeyBTcGFuLCBUcmFjZXIsIGNyZWF0ZVRyYWNlciB9OyIsImZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5pbXBvcnQgeyBTcGFuIGFzIG90U3BhbiB9IGZyb20gJ29wZW50cmFjaW5nL2xpYi9zcGFuJztcbmltcG9ydCB7IGV4dGVuZCwgZ2V0VGltZU9yaWdpbiB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi4vcGVyZm9ybWFuY2UtbW9uaXRvcmluZy90cmFuc2FjdGlvbic7XG5cbnZhciBTcGFuID0gZnVuY3Rpb24gKF9vdFNwYW4pIHtcbiAgX2luaGVyaXRzTG9vc2UoU3BhbiwgX290U3Bhbik7XG5cbiAgZnVuY3Rpb24gU3Bhbih0cmFjZXIsIHNwYW4pIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IF9vdFNwYW4uY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgIF90aGlzLl9fdHJhY2VyID0gdHJhY2VyO1xuICAgIF90aGlzLnNwYW4gPSBzcGFuO1xuICAgIF90aGlzLmlzVHJhbnNhY3Rpb24gPSBzcGFuIGluc3RhbmNlb2YgVHJhbnNhY3Rpb247XG4gICAgX3RoaXMuc3BhbkNvbnRleHQgPSB7XG4gICAgICBpZDogc3Bhbi5pZCxcbiAgICAgIHRyYWNlSWQ6IHNwYW4udHJhY2VJZCxcbiAgICAgIHNhbXBsZWQ6IHNwYW4uc2FtcGxlZFxuICAgIH07XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFNwYW4ucHJvdG90eXBlO1xuXG4gIF9wcm90by5fY29udGV4dCA9IGZ1bmN0aW9uIF9jb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLnNwYW5Db250ZXh0O1xuICB9O1xuXG4gIF9wcm90by5fdHJhY2VyID0gZnVuY3Rpb24gX3RyYWNlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RyYWNlcjtcbiAgfTtcblxuICBfcHJvdG8uX3NldE9wZXJhdGlvbk5hbWUgPSBmdW5jdGlvbiBfc2V0T3BlcmF0aW9uTmFtZShuYW1lKSB7XG4gICAgdGhpcy5zcGFuLm5hbWUgPSBuYW1lO1xuICB9O1xuXG4gIF9wcm90by5fYWRkVGFncyA9IGZ1bmN0aW9uIF9hZGRUYWdzKGtleVZhbHVlUGFpcnMpIHtcbiAgICB2YXIgdGFncyA9IGV4dGVuZCh7fSwga2V5VmFsdWVQYWlycyk7XG5cbiAgICBpZiAodGFncy50eXBlKSB7XG4gICAgICB0aGlzLnNwYW4udHlwZSA9IHRhZ3MudHlwZTtcbiAgICAgIGRlbGV0ZSB0YWdzLnR5cGU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNUcmFuc2FjdGlvbikge1xuICAgICAgdmFyIHVzZXJJZCA9IHRhZ3NbJ3VzZXIuaWQnXTtcbiAgICAgIHZhciB1c2VybmFtZSA9IHRhZ3NbJ3VzZXIudXNlcm5hbWUnXTtcbiAgICAgIHZhciBlbWFpbCA9IHRhZ3NbJ3VzZXIuZW1haWwnXTtcblxuICAgICAgaWYgKHVzZXJJZCB8fCB1c2VybmFtZSB8fCBlbWFpbCkge1xuICAgICAgICB0aGlzLnNwYW4uYWRkQ29udGV4dCh7XG4gICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgaWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRlbGV0ZSB0YWdzWyd1c2VyLmlkJ107XG4gICAgICAgIGRlbGV0ZSB0YWdzWyd1c2VyLnVzZXJuYW1lJ107XG4gICAgICAgIGRlbGV0ZSB0YWdzWyd1c2VyLmVtYWlsJ107XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zcGFuLmFkZExhYmVscyh0YWdzKTtcbiAgfTtcblxuICBfcHJvdG8uX2xvZyA9IGZ1bmN0aW9uIF9sb2cobG9nLCB0aW1lc3RhbXApIHtcbiAgICBpZiAobG9nLmV2ZW50ID09PSAnZXJyb3InKSB7XG4gICAgICBpZiAobG9nWydlcnJvci5vYmplY3QnXSkge1xuICAgICAgICB0aGlzLl9fdHJhY2VyLmVycm9yTG9nZ2luZy5sb2dFcnJvcihsb2dbJ2Vycm9yLm9iamVjdCddKTtcbiAgICAgIH0gZWxzZSBpZiAobG9nLm1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5fX3RyYWNlci5lcnJvckxvZ2dpbmcubG9nRXJyb3IobG9nLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uX2ZpbmlzaCA9IGZ1bmN0aW9uIF9maW5pc2goZmluaXNoVGltZSkge1xuICAgIHRoaXMuc3Bhbi5lbmQoKTtcblxuICAgIGlmIChmaW5pc2hUaW1lKSB7XG4gICAgICB0aGlzLnNwYW4uX2VuZCA9IGZpbmlzaFRpbWUgLSBnZXRUaW1lT3JpZ2luKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBTcGFuO1xufShvdFNwYW4pO1xuXG5leHBvcnQgZGVmYXVsdCBTcGFuOyIsImZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5pbXBvcnQgeyBUcmFjZXIgYXMgb3RUcmFjZXIgfSBmcm9tICdvcGVudHJhY2luZy9saWIvdHJhY2VyJztcbmltcG9ydCB7IFJFRkVSRU5DRV9DSElMRF9PRiwgRk9STUFUX1RFWFRfTUFQLCBGT1JNQVRfSFRUUF9IRUFERVJTLCBGT1JNQVRfQklOQVJZIH0gZnJvbSAnb3BlbnRyYWNpbmcvbGliL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBTcGFuIGFzIE5vb3BTcGFuIH0gZnJvbSAnb3BlbnRyYWNpbmcvbGliL3NwYW4nO1xuaW1wb3J0IHsgZ2V0VGltZU9yaWdpbiwgZmluZCB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBfX0RFVl9fIH0gZnJvbSAnLi4vc3RhdGUnO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi9zcGFuJztcblxudmFyIFRyYWNlciA9IGZ1bmN0aW9uIChfb3RUcmFjZXIpIHtcbiAgX2luaGVyaXRzTG9vc2UoVHJhY2VyLCBfb3RUcmFjZXIpO1xuXG4gIGZ1bmN0aW9uIFRyYWNlcihwZXJmb3JtYW5jZU1vbml0b3JpbmcsIHRyYW5zYWN0aW9uU2VydmljZSwgbG9nZ2luZ1NlcnZpY2UsIGVycm9yTG9nZ2luZykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX290VHJhY2VyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICBfdGhpcy5wZXJmb3JtYW5jZU1vbml0b3JpbmcgPSBwZXJmb3JtYW5jZU1vbml0b3Jpbmc7XG4gICAgX3RoaXMudHJhbnNhY3Rpb25TZXJ2aWNlID0gdHJhbnNhY3Rpb25TZXJ2aWNlO1xuICAgIF90aGlzLmxvZ2dpbmdTZXJ2aWNlID0gbG9nZ2luZ1NlcnZpY2U7XG4gICAgX3RoaXMuZXJyb3JMb2dnaW5nID0gZXJyb3JMb2dnaW5nO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBUcmFjZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5fc3RhcnRTcGFuID0gZnVuY3Rpb24gX3N0YXJ0U3BhbihuYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIHNwYW5PcHRpb25zID0ge1xuICAgICAgbWFuYWdlZDogdHJ1ZVxuICAgIH07XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgc3Bhbk9wdGlvbnMudGltZXN0YW1wID0gb3B0aW9ucy5zdGFydFRpbWU7XG5cbiAgICAgIGlmIChvcHRpb25zLmNoaWxkT2YpIHtcbiAgICAgICAgc3Bhbk9wdGlvbnMucGFyZW50SWQgPSBvcHRpb25zLmNoaWxkT2YuaWQ7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMucmVmZXJlbmNlcyAmJiBvcHRpb25zLnJlZmVyZW5jZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5yZWZlcmVuY2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgICAgdGhpcy5sb2dnaW5nU2VydmljZS5kZWJ1ZygnRWxhc3RpYyBBUE0gT3BlblRyYWNpbmc6IFVuc3VwcG9ydGVkIG51bWJlciBvZiByZWZlcmVuY2VzLCBvbmx5IHRoZSBmaXJzdCBjaGlsZE9mIHJlZmVyZW5jZSB3aWxsIGJlIHJlY29yZGVkLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZFJlZiA9IGZpbmQob3B0aW9ucy5yZWZlcmVuY2VzLCBmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgICAgcmV0dXJuIHJlZi50eXBlKCkgPT09IFJFRkVSRU5DRV9DSElMRF9PRjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNoaWxkUmVmKSB7XG4gICAgICAgICAgc3Bhbk9wdGlvbnMucGFyZW50SWQgPSBjaGlsZFJlZi5yZWZlcmVuY2VkQ29udGV4dCgpLmlkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNwYW47XG4gICAgdmFyIGN1cnJlbnRUcmFuc2FjdGlvbiA9IHRoaXMudHJhbnNhY3Rpb25TZXJ2aWNlLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuXG4gICAgaWYgKGN1cnJlbnRUcmFuc2FjdGlvbikge1xuICAgICAgc3BhbiA9IHRoaXMudHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0U3BhbihuYW1lLCB1bmRlZmluZWQsIHNwYW5PcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3BhbiA9IHRoaXMudHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0VHJhbnNhY3Rpb24obmFtZSwgdW5kZWZpbmVkLCBzcGFuT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKCFzcGFuKSB7XG4gICAgICByZXR1cm4gbmV3IE5vb3BTcGFuKCk7XG4gICAgfVxuXG4gICAgaWYgKHNwYW5PcHRpb25zLnRpbWVzdGFtcCkge1xuICAgICAgc3Bhbi5fc3RhcnQgPSBzcGFuT3B0aW9ucy50aW1lc3RhbXAgLSBnZXRUaW1lT3JpZ2luKCk7XG4gICAgfVxuXG4gICAgdmFyIG90U3BhbiA9IG5ldyBTcGFuKHRoaXMsIHNwYW4pO1xuXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy50YWdzKSB7XG4gICAgICBvdFNwYW4uYWRkVGFncyhvcHRpb25zLnRhZ3MpO1xuICAgIH1cblxuICAgIHJldHVybiBvdFNwYW47XG4gIH07XG5cbiAgX3Byb3RvLl9pbmplY3QgPSBmdW5jdGlvbiBfaW5qZWN0KHNwYW5Db250ZXh0LCBmb3JtYXQsIGNhcnJpZXIpIHtcbiAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgICAgY2FzZSBGT1JNQVRfVEVYVF9NQVA6XG4gICAgICBjYXNlIEZPUk1BVF9IVFRQX0hFQURFUlM6XG4gICAgICAgIHRoaXMucGVyZm9ybWFuY2VNb25pdG9yaW5nLmluamVjdER0SGVhZGVyKHNwYW5Db250ZXh0LCBjYXJyaWVyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgRk9STUFUX0JJTkFSWTpcbiAgICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgICB0aGlzLmxvZ2dpbmdTZXJ2aWNlLmRlYnVnKCdFbGFzdGljIEFQTSBPcGVuVHJhY2luZzogYmluYXJ5IGNhcnJpZXIgZm9ybWF0IGlzIG5vdCBzdXBwb3J0ZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLl9leHRyYWN0ID0gZnVuY3Rpb24gX2V4dHJhY3QoZm9ybWF0LCBjYXJyaWVyKSB7XG4gICAgdmFyIGN0eDtcblxuICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICBjYXNlIEZPUk1BVF9URVhUX01BUDpcbiAgICAgIGNhc2UgRk9STUFUX0hUVFBfSEVBREVSUzpcbiAgICAgICAgY3R4ID0gdGhpcy5wZXJmb3JtYW5jZU1vbml0b3JpbmcuZXh0cmFjdER0SGVhZGVyKGNhcnJpZXIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBGT1JNQVRfQklOQVJZOlxuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIHRoaXMubG9nZ2luZ1NlcnZpY2UuZGVidWcoJ0VsYXN0aWMgQVBNIE9wZW5UcmFjaW5nOiBiaW5hcnkgY2FycmllciBmb3JtYXQgaXMgbm90IHN1cHBvcnRlZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICghY3R4KSB7XG4gICAgICBjdHggPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgcmV0dXJuIFRyYWNlcjtcbn0ob3RUcmFjZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBUcmFjZXI7IiwiaW1wb3J0IHsgZ2V0RHVyYXRpb24sIFBFUkYgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgUEFHRV9MT0FELCBUUlVOQ0FURURfVFlQRSB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xudmFyIHBhZ2VMb2FkQnJlYWtkb3ducyA9IFtbJ2RvbWFpbkxvb2t1cFN0YXJ0JywgJ2RvbWFpbkxvb2t1cEVuZCcsICdETlMnXSwgWydjb25uZWN0U3RhcnQnLCAnY29ubmVjdEVuZCcsICdUQ1AnXSwgWydyZXF1ZXN0U3RhcnQnLCAncmVzcG9uc2VTdGFydCcsICdSZXF1ZXN0J10sIFsncmVzcG9uc2VTdGFydCcsICdyZXNwb25zZUVuZCcsICdSZXNwb25zZSddLCBbJ2RvbUxvYWRpbmcnLCAnZG9tQ29tcGxldGUnLCAnUHJvY2Vzc2luZyddLCBbJ2xvYWRFdmVudFN0YXJ0JywgJ2xvYWRFdmVudEVuZCcsICdMb2FkJ11dO1xuXG5mdW5jdGlvbiBnZXRWYWx1ZSh2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVTZWxmVGltZSh0cmFuc2FjdGlvbikge1xuICB2YXIgc3BhbnMgPSB0cmFuc2FjdGlvbi5zcGFucyxcbiAgICAgIF9zdGFydCA9IHRyYW5zYWN0aW9uLl9zdGFydCxcbiAgICAgIF9lbmQgPSB0cmFuc2FjdGlvbi5fZW5kO1xuXG4gIGlmIChzcGFucy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJhbnNhY3Rpb24uZHVyYXRpb24oKTtcbiAgfVxuXG4gIHNwYW5zLnNvcnQoZnVuY3Rpb24gKHNwYW4xLCBzcGFuMikge1xuICAgIHJldHVybiBzcGFuMS5fc3RhcnQgLSBzcGFuMi5fc3RhcnQ7XG4gIH0pO1xuICB2YXIgc3BhbiA9IHNwYW5zWzBdO1xuICB2YXIgc3BhbkVuZCA9IHNwYW4uX2VuZDtcbiAgdmFyIHNwYW5TdGFydCA9IHNwYW4uX3N0YXJ0O1xuICB2YXIgbGFzdENvbnRpbnVvdXNFbmQgPSBzcGFuRW5kO1xuICB2YXIgc2VsZlRpbWUgPSBzcGFuU3RhcnQgLSBfc3RhcnQ7XG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIHNwYW4gPSBzcGFuc1tpXTtcbiAgICBzcGFuU3RhcnQgPSBzcGFuLl9zdGFydDtcbiAgICBzcGFuRW5kID0gc3Bhbi5fZW5kO1xuXG4gICAgaWYgKHNwYW5TdGFydCA+IGxhc3RDb250aW51b3VzRW5kKSB7XG4gICAgICBzZWxmVGltZSArPSBzcGFuU3RhcnQgLSBsYXN0Q29udGludW91c0VuZDtcbiAgICAgIGxhc3RDb250aW51b3VzRW5kID0gc3BhbkVuZDtcbiAgICB9IGVsc2UgaWYgKHNwYW5FbmQgPiBsYXN0Q29udGludW91c0VuZCkge1xuICAgICAgbGFzdENvbnRpbnVvdXNFbmQgPSBzcGFuRW5kO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsYXN0Q29udGludW91c0VuZCA8IF9lbmQpIHtcbiAgICBzZWxmVGltZSArPSBfZW5kIC0gbGFzdENvbnRpbnVvdXNFbmQ7XG4gIH1cblxuICByZXR1cm4gc2VsZlRpbWU7XG59XG5cbmZ1bmN0aW9uIGdyb3VwU3BhbnModHJhbnNhY3Rpb24pIHtcbiAgdmFyIHNwYW5NYXAgPSB7fTtcbiAgdmFyIHRyYW5zYWN0aW9uU2VsZlRpbWUgPSBjYWxjdWxhdGVTZWxmVGltZSh0cmFuc2FjdGlvbik7XG4gIHNwYW5NYXBbJ2FwcCddID0ge1xuICAgIGNvdW50OiAxLFxuICAgIGR1cmF0aW9uOiB0cmFuc2FjdGlvblNlbGZUaW1lXG4gIH07XG4gIHZhciBzcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc3BhbiA9IHNwYW5zW2ldO1xuICAgIHZhciBkdXJhdGlvbiA9IHNwYW4uZHVyYXRpb24oKTtcblxuICAgIGlmIChkdXJhdGlvbiA9PT0gMCB8fCBkdXJhdGlvbiA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZSA9IHNwYW4udHlwZSxcbiAgICAgICAgc3VidHlwZSA9IHNwYW4uc3VidHlwZTtcbiAgICB2YXIga2V5ID0gdHlwZS5yZXBsYWNlKFRSVU5DQVRFRF9UWVBFLCAnJyk7XG5cbiAgICBpZiAoc3VidHlwZSkge1xuICAgICAga2V5ICs9ICcuJyArIHN1YnR5cGU7XG4gICAgfVxuXG4gICAgaWYgKCFzcGFuTWFwW2tleV0pIHtcbiAgICAgIHNwYW5NYXBba2V5XSA9IHtcbiAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgIGNvdW50OiAwXG4gICAgICB9O1xuICAgIH1cblxuICAgIHNwYW5NYXBba2V5XS5jb3VudCsrO1xuICAgIHNwYW5NYXBba2V5XS5kdXJhdGlvbiArPSBkdXJhdGlvbjtcbiAgfVxuXG4gIHJldHVybiBzcGFuTWFwO1xufVxuXG5mdW5jdGlvbiBnZXRTcGFuQnJlYWtkb3duKHRyYW5zYWN0aW9uRGV0YWlscywgX3JlZikge1xuICB2YXIgZGV0YWlscyA9IF9yZWYuZGV0YWlscyxcbiAgICAgIF9yZWYkY291bnQgPSBfcmVmLmNvdW50LFxuICAgICAgY291bnQgPSBfcmVmJGNvdW50ID09PSB2b2lkIDAgPyAxIDogX3JlZiRjb3VudCxcbiAgICAgIGR1cmF0aW9uID0gX3JlZi5kdXJhdGlvbjtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2FjdGlvbjogdHJhbnNhY3Rpb25EZXRhaWxzLFxuICAgIHNwYW46IGRldGFpbHMsXG4gICAgc2FtcGxlczoge1xuICAgICAgJ3NwYW4uc2VsZl90aW1lLmNvdW50JzogZ2V0VmFsdWUoY291bnQpLFxuICAgICAgJ3NwYW4uc2VsZl90aW1lLnN1bS51cyc6IGdldFZhbHVlKGR1cmF0aW9uICogMTAwMClcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXB0dXJlQnJlYWtkb3duKHRyYW5zYWN0aW9uLCB0aW1pbmdzKSB7XG4gIGlmICh0aW1pbmdzID09PSB2b2lkIDApIHtcbiAgICB0aW1pbmdzID0gUEVSRi50aW1pbmc7XG4gIH1cblxuICB2YXIgYnJlYWtkb3ducyA9IFtdO1xuICB2YXIgbmFtZSA9IHRyYW5zYWN0aW9uLm5hbWUsXG4gICAgICB0eXBlID0gdHJhbnNhY3Rpb24udHlwZSxcbiAgICAgIHNhbXBsZWQgPSB0cmFuc2FjdGlvbi5zYW1wbGVkO1xuICB2YXIgdHJhbnNhY3Rpb25EZXRhaWxzID0ge1xuICAgIG5hbWU6IG5hbWUsXG4gICAgdHlwZTogdHlwZVxuICB9O1xuXG4gIGlmICghc2FtcGxlZCkge1xuICAgIHJldHVybiBicmVha2Rvd25zO1xuICB9XG5cbiAgaWYgKHR5cGUgPT09IFBBR0VfTE9BRCAmJiB0aW1pbmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlTG9hZEJyZWFrZG93bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjdXJyZW50ID0gcGFnZUxvYWRCcmVha2Rvd25zW2ldO1xuICAgICAgdmFyIHN0YXJ0ID0gdGltaW5nc1tjdXJyZW50WzBdXTtcbiAgICAgIHZhciBlbmQgPSB0aW1pbmdzW2N1cnJlbnRbMV1dO1xuICAgICAgdmFyIGR1cmF0aW9uID0gZ2V0RHVyYXRpb24oc3RhcnQsIGVuZCk7XG5cbiAgICAgIGlmIChkdXJhdGlvbiA9PT0gMCB8fCBkdXJhdGlvbiA9PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBicmVha2Rvd25zLnB1c2goZ2V0U3BhbkJyZWFrZG93bih0cmFuc2FjdGlvbkRldGFpbHMsIHtcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIHR5cGU6IGN1cnJlbnRbMl1cbiAgICAgICAgfSxcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uXG4gICAgICB9KSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBzcGFuTWFwID0gZ3JvdXBTcGFucyh0cmFuc2FjdGlvbik7XG4gICAgT2JqZWN0LmtleXMoc3Bhbk1hcCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgX2tleSRzcGxpdCA9IGtleS5zcGxpdCgnLicpLFxuICAgICAgICAgIHR5cGUgPSBfa2V5JHNwbGl0WzBdLFxuICAgICAgICAgIHN1YnR5cGUgPSBfa2V5JHNwbGl0WzFdO1xuXG4gICAgICB2YXIgX3NwYW5NYXAka2V5ID0gc3Bhbk1hcFtrZXldLFxuICAgICAgICAgIGR1cmF0aW9uID0gX3NwYW5NYXAka2V5LmR1cmF0aW9uLFxuICAgICAgICAgIGNvdW50ID0gX3NwYW5NYXAka2V5LmNvdW50O1xuICAgICAgYnJlYWtkb3ducy5wdXNoKGdldFNwYW5CcmVha2Rvd24odHJhbnNhY3Rpb25EZXRhaWxzLCB7XG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgIHN1YnR5cGU6IHN1YnR5cGVcbiAgICAgICAgfSxcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICBjb3VudDogY291bnRcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBicmVha2Rvd25zO1xufSIsImltcG9ydCBQZXJmb3JtYW5jZU1vbml0b3JpbmcgZnJvbSAnLi9wZXJmb3JtYW5jZS1tb25pdG9yaW5nJztcbmltcG9ydCBUcmFuc2FjdGlvblNlcnZpY2UgZnJvbSAnLi90cmFuc2FjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEFQTV9TRVJWRVIsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0UsIFBFUkZPUk1BTkNFX01PTklUT1JJTkcgfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IHNlcnZpY2VDcmVhdG9ycyB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlLWZhY3RvcnknO1xuXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2VzKCkge1xuICBzZXJ2aWNlQ3JlYXRvcnNbVFJBTlNBQ1RJT05fU0VSVklDRV0gPSBmdW5jdGlvbiAoc2VydmljZUZhY3RvcnkpIHtcbiAgICB2YXIgX3NlcnZpY2VGYWN0b3J5JGdldFNlID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbTE9HR0lOR19TRVJWSUNFLCBDT05GSUdfU0VSVklDRV0pLFxuICAgICAgICBsb2dnaW5nU2VydmljZSA9IF9zZXJ2aWNlRmFjdG9yeSRnZXRTZVswXSxcbiAgICAgICAgY29uZmlnU2VydmljZSA9IF9zZXJ2aWNlRmFjdG9yeSRnZXRTZVsxXTtcblxuICAgIHJldHVybiBuZXcgVHJhbnNhY3Rpb25TZXJ2aWNlKGxvZ2dpbmdTZXJ2aWNlLCBjb25maWdTZXJ2aWNlKTtcbiAgfTtcblxuICBzZXJ2aWNlQ3JlYXRvcnNbUEVSRk9STUFOQ0VfTU9OSVRPUklOR10gPSBmdW5jdGlvbiAoc2VydmljZUZhY3RvcnkpIHtcbiAgICB2YXIgX3NlcnZpY2VGYWN0b3J5JGdldFNlMiA9IHNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoW0FQTV9TRVJWRVIsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0VdKSxcbiAgICAgICAgYXBtU2VydmVyID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlMlswXSxcbiAgICAgICAgY29uZmlnU2VydmljZSA9IF9zZXJ2aWNlRmFjdG9yeSRnZXRTZTJbMV0sXG4gICAgICAgIGxvZ2dpbmdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlMlsyXSxcbiAgICAgICAgdHJhbnNhY3Rpb25TZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlMlszXTtcblxuICAgIHJldHVybiBuZXcgUGVyZm9ybWFuY2VNb25pdG9yaW5nKGFwbVNlcnZlciwgY29uZmlnU2VydmljZSwgbG9nZ2luZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSk7XG4gIH07XG59XG5cbmV4cG9ydCB7IHJlZ2lzdGVyU2VydmljZXMgfTsiLCJpbXBvcnQgeyBMT05HX1RBU0ssIExBUkdFU1RfQ09OVEVOVEZVTF9QQUlOVCwgRklSU1RfQ09OVEVOVEZVTF9QQUlOVCwgRklSU1RfSU5QVVQsIExBWU9VVF9TSElGVCB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgbm9vcCwgUEVSRiwgaXNQZXJmVHlwZVN1cHBvcnRlZCwgaXNSZWRpcmVjdEluZm9BdmFpbGFibGUgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi9zcGFuJztcbmV4cG9ydCB2YXIgbWV0cmljcyA9IHtcbiAgZmlkOiAwLFxuICBmY3A6IDAsXG4gIHRidDoge1xuICAgIHN0YXJ0OiBJbmZpbml0eSxcbiAgICBkdXJhdGlvbjogMFxuICB9LFxuICBjbHM6IHtcbiAgICBzY29yZTogMCxcbiAgICBmaXJzdEVudHJ5VGltZTogTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLFxuICAgIHByZXZFbnRyeVRpbWU6IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSxcbiAgICBjdXJyZW50U2Vzc2lvblNjb3JlOiAwXG4gIH0sXG4gIGxvbmd0YXNrOiB7XG4gICAgY291bnQ6IDAsXG4gICAgZHVyYXRpb246IDAsXG4gICAgbWF4OiAwXG4gIH1cbn07XG52YXIgTE9OR19UQVNLX1RIUkVTSE9MRCA9IDUwO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvbmdUYXNrU3BhbnMobG9uZ3Rhc2tzLCBhZ2cpIHtcbiAgdmFyIHNwYW5zID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb25ndGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgX2xvbmd0YXNrcyRpID0gbG9uZ3Rhc2tzW2ldLFxuICAgICAgICBuYW1lID0gX2xvbmd0YXNrcyRpLm5hbWUsXG4gICAgICAgIHN0YXJ0VGltZSA9IF9sb25ndGFza3MkaS5zdGFydFRpbWUsXG4gICAgICAgIGR1cmF0aW9uID0gX2xvbmd0YXNrcyRpLmR1cmF0aW9uLFxuICAgICAgICBhdHRyaWJ1dGlvbiA9IF9sb25ndGFza3MkaS5hdHRyaWJ1dGlvbjtcbiAgICB2YXIgZW5kID0gc3RhcnRUaW1lICsgZHVyYXRpb247XG4gICAgdmFyIHNwYW4gPSBuZXcgU3BhbihcIkxvbmd0YXNrKFwiICsgbmFtZSArIFwiKVwiLCBMT05HX1RBU0ssIHtcbiAgICAgIHN0YXJ0VGltZTogc3RhcnRUaW1lXG4gICAgfSk7XG4gICAgYWdnLmNvdW50Kys7XG4gICAgYWdnLmR1cmF0aW9uICs9IGR1cmF0aW9uO1xuICAgIGFnZy5tYXggPSBNYXRoLm1heChkdXJhdGlvbiwgYWdnLm1heCk7XG5cbiAgICBpZiAoYXR0cmlidXRpb24ubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIF9hdHRyaWJ1dGlvbiQgPSBhdHRyaWJ1dGlvblswXSxcbiAgICAgICAgICBfbmFtZSA9IF9hdHRyaWJ1dGlvbiQubmFtZSxcbiAgICAgICAgICBjb250YWluZXJUeXBlID0gX2F0dHJpYnV0aW9uJC5jb250YWluZXJUeXBlLFxuICAgICAgICAgIGNvbnRhaW5lck5hbWUgPSBfYXR0cmlidXRpb24kLmNvbnRhaW5lck5hbWUsXG4gICAgICAgICAgY29udGFpbmVySWQgPSBfYXR0cmlidXRpb24kLmNvbnRhaW5lcklkO1xuICAgICAgdmFyIGN1c3RvbUNvbnRleHQgPSB7XG4gICAgICAgIGF0dHJpYnV0aW9uOiBfbmFtZSxcbiAgICAgICAgdHlwZTogY29udGFpbmVyVHlwZVxuICAgICAgfTtcblxuICAgICAgaWYgKGNvbnRhaW5lck5hbWUpIHtcbiAgICAgICAgY3VzdG9tQ29udGV4dC5uYW1lID0gY29udGFpbmVyTmFtZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbnRhaW5lcklkKSB7XG4gICAgICAgIGN1c3RvbUNvbnRleHQuaWQgPSBjb250YWluZXJJZDtcbiAgICAgIH1cblxuICAgICAgc3Bhbi5hZGRDb250ZXh0KHtcbiAgICAgICAgY3VzdG9tOiBjdXN0b21Db250ZXh0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzcGFuLmVuZChlbmQpO1xuICAgIHNwYW5zLnB1c2goc3Bhbik7XG4gIH1cblxuICByZXR1cm4gc3BhbnM7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmlyc3RJbnB1dERlbGF5U3BhbihmaWRFbnRyaWVzKSB7XG4gIHZhciBmaXJzdElucHV0ID0gZmlkRW50cmllc1swXTtcblxuICBpZiAoZmlyc3RJbnB1dCkge1xuICAgIHZhciBzdGFydFRpbWUgPSBmaXJzdElucHV0LnN0YXJ0VGltZSxcbiAgICAgICAgcHJvY2Vzc2luZ1N0YXJ0ID0gZmlyc3RJbnB1dC5wcm9jZXNzaW5nU3RhcnQ7XG4gICAgdmFyIHNwYW4gPSBuZXcgU3BhbignRmlyc3QgSW5wdXQgRGVsYXknLCBGSVJTVF9JTlBVVCwge1xuICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWVcbiAgICB9KTtcbiAgICBzcGFuLmVuZChwcm9jZXNzaW5nU3RhcnQpO1xuICAgIHJldHVybiBzcGFuO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVG90YWxCbG9ja2luZ1RpbWVTcGFuKHRidE9iamVjdCkge1xuICB2YXIgc3RhcnQgPSB0YnRPYmplY3Quc3RhcnQsXG4gICAgICBkdXJhdGlvbiA9IHRidE9iamVjdC5kdXJhdGlvbjtcbiAgdmFyIHRidFNwYW4gPSBuZXcgU3BhbignVG90YWwgQmxvY2tpbmcgVGltZScsIExPTkdfVEFTSywge1xuICAgIHN0YXJ0VGltZTogc3RhcnRcbiAgfSk7XG4gIHRidFNwYW4uZW5kKHN0YXJ0ICsgZHVyYXRpb24pO1xuICByZXR1cm4gdGJ0U3Bhbjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVUb3RhbEJsb2NraW5nVGltZShsb25ndGFza0VudHJpZXMpIHtcbiAgbG9uZ3Rhc2tFbnRyaWVzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgdmFyIG5hbWUgPSBlbnRyeS5uYW1lLFxuICAgICAgICBzdGFydFRpbWUgPSBlbnRyeS5zdGFydFRpbWUsXG4gICAgICAgIGR1cmF0aW9uID0gZW50cnkuZHVyYXRpb247XG5cbiAgICBpZiAoc3RhcnRUaW1lIDwgbWV0cmljcy5mY3ApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmFtZSAhPT0gJ3NlbGYnICYmIG5hbWUuaW5kZXhPZignc2FtZS1vcmlnaW4nKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtZXRyaWNzLnRidC5zdGFydCA9IE1hdGgubWluKG1ldHJpY3MudGJ0LnN0YXJ0LCBzdGFydFRpbWUpO1xuICAgIHZhciBibG9ja2luZ1RpbWUgPSBkdXJhdGlvbiAtIExPTkdfVEFTS19USFJFU0hPTEQ7XG5cbiAgICBpZiAoYmxvY2tpbmdUaW1lID4gMCkge1xuICAgICAgbWV0cmljcy50YnQuZHVyYXRpb24gKz0gYmxvY2tpbmdUaW1lO1xuICAgIH1cbiAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlQ3VtdWxhdGl2ZUxheW91dFNoaWZ0KGNsc0VudHJpZXMpIHtcbiAgY2xzRW50cmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgIGlmICghZW50cnkuaGFkUmVjZW50SW5wdXQgJiYgZW50cnkudmFsdWUpIHtcbiAgICAgIHZhciBzaG91bGRDcmVhdGVOZXdTZXNzaW9uID0gZW50cnkuc3RhcnRUaW1lIC0gbWV0cmljcy5jbHMuZmlyc3RFbnRyeVRpbWUgPiA1MDAwIHx8IGVudHJ5LnN0YXJ0VGltZSAtIG1ldHJpY3MuY2xzLnByZXZFbnRyeVRpbWUgPiAxMDAwO1xuXG4gICAgICBpZiAoc2hvdWxkQ3JlYXRlTmV3U2Vzc2lvbikge1xuICAgICAgICBtZXRyaWNzLmNscy5maXJzdEVudHJ5VGltZSA9IGVudHJ5LnN0YXJ0VGltZTtcbiAgICAgICAgbWV0cmljcy5jbHMuY3VycmVudFNlc3Npb25TY29yZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIG1ldHJpY3MuY2xzLnByZXZFbnRyeVRpbWUgPSBlbnRyeS5zdGFydFRpbWU7XG4gICAgICBtZXRyaWNzLmNscy5jdXJyZW50U2Vzc2lvblNjb3JlICs9IGVudHJ5LnZhbHVlO1xuICAgICAgbWV0cmljcy5jbHMuc2NvcmUgPSBNYXRoLm1heChtZXRyaWNzLmNscy5zY29yZSwgbWV0cmljcy5jbHMuY3VycmVudFNlc3Npb25TY29yZSk7XG4gICAgfVxuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYXB0dXJlT2JzZXJ2ZXJFbnRyaWVzKGxpc3QsIF9yZWYpIHtcbiAgdmFyIGlzSGFyZE5hdmlnYXRpb24gPSBfcmVmLmlzSGFyZE5hdmlnYXRpb24sXG4gICAgICB0clN0YXJ0ID0gX3JlZi50clN0YXJ0O1xuICB2YXIgbG9uZ3Rhc2tFbnRyaWVzID0gbGlzdC5nZXRFbnRyaWVzQnlUeXBlKExPTkdfVEFTSykuZmlsdGVyKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgIHJldHVybiBlbnRyeS5zdGFydFRpbWUgPj0gdHJTdGFydDtcbiAgfSk7XG4gIHZhciBsb25nVGFza1NwYW5zID0gY3JlYXRlTG9uZ1Rhc2tTcGFucyhsb25ndGFza0VudHJpZXMsIG1ldHJpY3MubG9uZ3Rhc2spO1xuICB2YXIgcmVzdWx0ID0ge1xuICAgIHNwYW5zOiBsb25nVGFza1NwYW5zLFxuICAgIG1hcmtzOiB7fVxuICB9O1xuXG4gIGlmICghaXNIYXJkTmF2aWdhdGlvbikge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB2YXIgbGNwRW50cmllcyA9IGxpc3QuZ2V0RW50cmllc0J5VHlwZShMQVJHRVNUX0NPTlRFTlRGVUxfUEFJTlQpO1xuICB2YXIgbGFzdExjcEVudHJ5ID0gbGNwRW50cmllc1tsY3BFbnRyaWVzLmxlbmd0aCAtIDFdO1xuXG4gIGlmIChsYXN0TGNwRW50cnkpIHtcbiAgICB2YXIgbGNwID0gcGFyc2VJbnQobGFzdExjcEVudHJ5LnN0YXJ0VGltZSk7XG4gICAgbWV0cmljcy5sY3AgPSBsY3A7XG4gICAgcmVzdWx0Lm1hcmtzLmxhcmdlc3RDb250ZW50ZnVsUGFpbnQgPSBsY3A7XG4gIH1cblxuICB2YXIgdGltaW5nID0gUEVSRi50aW1pbmc7XG4gIHZhciB1bmxvYWREaWZmID0gdGltaW5nLmZldGNoU3RhcnQgLSB0aW1pbmcubmF2aWdhdGlvblN0YXJ0O1xuXG4gIGlmIChpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSh0aW1pbmcpKSB7XG4gICAgdW5sb2FkRGlmZiA9IDA7XG4gIH1cblxuICB2YXIgZmNwRW50cnkgPSBsaXN0LmdldEVudHJpZXNCeU5hbWUoRklSU1RfQ09OVEVOVEZVTF9QQUlOVClbMF07XG5cbiAgaWYgKGZjcEVudHJ5KSB7XG4gICAgdmFyIGZjcCA9IHBhcnNlSW50KHVubG9hZERpZmYgPj0gMCA/IGZjcEVudHJ5LnN0YXJ0VGltZSAtIHVubG9hZERpZmYgOiBmY3BFbnRyeS5zdGFydFRpbWUpO1xuICAgIG1ldHJpY3MuZmNwID0gZmNwO1xuICAgIHJlc3VsdC5tYXJrcy5maXJzdENvbnRlbnRmdWxQYWludCA9IGZjcDtcbiAgfVxuXG4gIHZhciBmaWRFbnRyaWVzID0gbGlzdC5nZXRFbnRyaWVzQnlUeXBlKEZJUlNUX0lOUFVUKTtcbiAgdmFyIGZpZFNwYW4gPSBjcmVhdGVGaXJzdElucHV0RGVsYXlTcGFuKGZpZEVudHJpZXMpO1xuXG4gIGlmIChmaWRTcGFuKSB7XG4gICAgbWV0cmljcy5maWQgPSBmaWRTcGFuLmR1cmF0aW9uKCk7XG4gICAgcmVzdWx0LnNwYW5zLnB1c2goZmlkU3Bhbik7XG4gIH1cblxuICBjYWxjdWxhdGVUb3RhbEJsb2NraW5nVGltZShsb25ndGFza0VudHJpZXMpO1xuICB2YXIgY2xzRW50cmllcyA9IGxpc3QuZ2V0RW50cmllc0J5VHlwZShMQVlPVVRfU0hJRlQpO1xuICBjYWxjdWxhdGVDdW11bGF0aXZlTGF5b3V0U2hpZnQoY2xzRW50cmllcyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnQgdmFyIFBlcmZFbnRyeVJlY29yZGVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBQZXJmRW50cnlSZWNvcmRlcihjYWxsYmFjaykge1xuICAgIHRoaXMucG8gPSB7XG4gICAgICBvYnNlcnZlOiBub29wLFxuICAgICAgZGlzY29ubmVjdDogbm9vcFxuICAgIH07XG5cbiAgICBpZiAod2luZG93LlBlcmZvcm1hbmNlT2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMucG8gPSBuZXcgUGVyZm9ybWFuY2VPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgdmFyIF9wcm90byA9IFBlcmZFbnRyeVJlY29yZGVyLnByb3RvdHlwZTtcblxuICBfcHJvdG8uc3RhcnQgPSBmdW5jdGlvbiBzdGFydCh0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghaXNQZXJmVHlwZVN1cHBvcnRlZCh0eXBlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucG8ub2JzZXJ2ZSh7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGJ1ZmZlcmVkOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChfKSB7fVxuICB9O1xuXG4gIF9wcm90by5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICB0aGlzLnBvLmRpc2Nvbm5lY3QoKTtcbiAgfTtcblxuICByZXR1cm4gUGVyZkVudHJ5UmVjb3JkZXI7XG59KCk7IiwiaW1wb3J0IHsgUEVSRiwgaXNQZXJmVGltZWxpbmVTdXBwb3J0ZWQsIGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IFBBR0VfTE9BRCwgUkVTT1VSQ0UsIE1FQVNVUkUgfSBmcm9tICcuLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IHN0YXRlIH0gZnJvbSAnLi4vLi4vc3RhdGUnO1xuaW1wb3J0IHsgY3JlYXRlTmF2aWdhdGlvblRpbWluZ1NwYW5zIH0gZnJvbSAnLi9uYXZpZ2F0aW9uLXRpbWluZyc7XG5pbXBvcnQgeyBjcmVhdGVVc2VyVGltaW5nU3BhbnMgfSBmcm9tICcuL3VzZXItdGltaW5nJztcbmltcG9ydCB7IGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbnMgfSBmcm9tICcuL3Jlc291cmNlLXRpbWluZyc7XG5pbXBvcnQgeyBnZXRQYWdlTG9hZE1hcmtzIH0gZnJvbSAnLi9tYXJrcyc7XG5cbmZ1bmN0aW9uIGNhcHR1cmVOYXZpZ2F0aW9uKHRyYW5zYWN0aW9uKSB7XG4gIGlmICghdHJhbnNhY3Rpb24uY2FwdHVyZVRpbWluZ3MpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdHJFbmQgPSB0cmFuc2FjdGlvbi5fZW5kO1xuXG4gIGlmICh0cmFuc2FjdGlvbi50eXBlID09PSBQQUdFX0xPQUQpIHtcbiAgICBpZiAodHJhbnNhY3Rpb24ubWFya3MgJiYgdHJhbnNhY3Rpb24ubWFya3MuY3VzdG9tKSB7XG4gICAgICB2YXIgY3VzdG9tTWFya3MgPSB0cmFuc2FjdGlvbi5tYXJrcy5jdXN0b207XG4gICAgICBPYmplY3Qua2V5cyhjdXN0b21NYXJrcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGN1c3RvbU1hcmtzW2tleV0gKz0gdHJhbnNhY3Rpb24uX3N0YXJ0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIHRyU3RhcnQgPSAwO1xuICAgIHRyYW5zYWN0aW9uLl9zdGFydCA9IHRyU3RhcnQ7XG4gICAgdmFyIHRpbWluZ3MgPSBQRVJGLnRpbWluZztcbiAgICB2YXIgYmFzZVRpbWUgPSBpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSh0aW1pbmdzKSA/IHRpbWluZ3MucmVkaXJlY3RTdGFydCA6IHRpbWluZ3MuZmV0Y2hTdGFydDtcbiAgICBjcmVhdGVOYXZpZ2F0aW9uVGltaW5nU3BhbnModGltaW5ncywgYmFzZVRpbWUsIHRyU3RhcnQsIHRyRW5kKS5mb3JFYWNoKGZ1bmN0aW9uIChzcGFuKSB7XG4gICAgICBzcGFuLnRyYWNlSWQgPSB0cmFuc2FjdGlvbi50cmFjZUlkO1xuICAgICAgc3Bhbi5zYW1wbGVkID0gdHJhbnNhY3Rpb24uc2FtcGxlZDtcblxuICAgICAgaWYgKHNwYW4ucGFnZVJlc3BvbnNlICYmIHRyYW5zYWN0aW9uLm9wdGlvbnMucGFnZUxvYWRTcGFuSWQpIHtcbiAgICAgICAgc3Bhbi5pZCA9IHRyYW5zYWN0aW9uLm9wdGlvbnMucGFnZUxvYWRTcGFuSWQ7XG4gICAgICB9XG5cbiAgICAgIHRyYW5zYWN0aW9uLnNwYW5zLnB1c2goc3Bhbik7XG4gICAgfSk7XG4gICAgdHJhbnNhY3Rpb24uYWRkTWFya3MoZ2V0UGFnZUxvYWRNYXJrcyh0aW1pbmdzKSk7XG4gIH1cblxuICBpZiAoaXNQZXJmVGltZWxpbmVTdXBwb3J0ZWQoKSkge1xuICAgIHZhciBfdHJTdGFydCA9IHRyYW5zYWN0aW9uLl9zdGFydDtcbiAgICB2YXIgcmVzb3VyY2VFbnRyaWVzID0gUEVSRi5nZXRFbnRyaWVzQnlUeXBlKFJFU09VUkNFKTtcbiAgICBjcmVhdGVSZXNvdXJjZVRpbWluZ1NwYW5zKHJlc291cmNlRW50cmllcywgc3RhdGUuYm9vdHN0cmFwVGltZSwgX3RyU3RhcnQsIHRyRW5kKS5mb3JFYWNoKGZ1bmN0aW9uIChzcGFuKSB7XG4gICAgICByZXR1cm4gdHJhbnNhY3Rpb24uc3BhbnMucHVzaChzcGFuKTtcbiAgICB9KTtcbiAgICB2YXIgdXNlckVudHJpZXMgPSBQRVJGLmdldEVudHJpZXNCeVR5cGUoTUVBU1VSRSk7XG4gICAgY3JlYXRlVXNlclRpbWluZ1NwYW5zKHVzZXJFbnRyaWVzLCBfdHJTdGFydCwgdHJFbmQpLmZvckVhY2goZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgIHJldHVybiB0cmFuc2FjdGlvbi5zcGFucy5wdXNoKHNwYW4pO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7IGNhcHR1cmVOYXZpZ2F0aW9uLCBjcmVhdGVOYXZpZ2F0aW9uVGltaW5nU3BhbnMsIGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbnMsIGNyZWF0ZVVzZXJUaW1pbmdTcGFucywgZ2V0UGFnZUxvYWRNYXJrcyB9OyIsImltcG9ydCB7IGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJztcbnZhciBOQVZJR0FUSU9OX1RJTUlOR19NQVJLUyA9IFsnZmV0Y2hTdGFydCcsICdkb21haW5Mb29rdXBTdGFydCcsICdkb21haW5Mb29rdXBFbmQnLCAnY29ubmVjdFN0YXJ0JywgJ2Nvbm5lY3RFbmQnLCAncmVxdWVzdFN0YXJ0JywgJ3Jlc3BvbnNlU3RhcnQnLCAncmVzcG9uc2VFbmQnLCAnZG9tTG9hZGluZycsICdkb21JbnRlcmFjdGl2ZScsICdkb21Db250ZW50TG9hZGVkRXZlbnRTdGFydCcsICdkb21Db250ZW50TG9hZGVkRXZlbnRFbmQnLCAnZG9tQ29tcGxldGUnLCAnbG9hZEV2ZW50U3RhcnQnLCAnbG9hZEV2ZW50RW5kJ107XG52YXIgQ09NUFJFU1NFRF9OQVZfVElNSU5HX01BUktTID0gWydmcycsICdscycsICdsZScsICdjcycsICdjZScsICdxcycsICdycycsICdyZScsICdkbCcsICdkaScsICdkcycsICdkZScsICdkYycsICdlcycsICdlZSddO1xuXG5mdW5jdGlvbiBnZXRQYWdlTG9hZE1hcmtzKHRpbWluZykge1xuICB2YXIgbWFya3MgPSBnZXROYXZpZ2F0aW9uVGltaW5nTWFya3ModGltaW5nKTtcblxuICBpZiAobWFya3MgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYXZpZ2F0aW9uVGltaW5nOiBtYXJrcyxcbiAgICBhZ2VudDoge1xuICAgICAgdGltZVRvRmlyc3RCeXRlOiBtYXJrcy5yZXNwb25zZVN0YXJ0LFxuICAgICAgZG9tSW50ZXJhY3RpdmU6IG1hcmtzLmRvbUludGVyYWN0aXZlLFxuICAgICAgZG9tQ29tcGxldGU6IG1hcmtzLmRvbUNvbXBsZXRlXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXROYXZpZ2F0aW9uVGltaW5nTWFya3ModGltaW5nKSB7XG4gIHZhciByZWRpcmVjdFN0YXJ0ID0gdGltaW5nLnJlZGlyZWN0U3RhcnQsXG4gICAgICBmZXRjaFN0YXJ0ID0gdGltaW5nLmZldGNoU3RhcnQsXG4gICAgICBuYXZpZ2F0aW9uU3RhcnQgPSB0aW1pbmcubmF2aWdhdGlvblN0YXJ0LFxuICAgICAgcmVzcG9uc2VTdGFydCA9IHRpbWluZy5yZXNwb25zZVN0YXJ0LFxuICAgICAgcmVzcG9uc2VFbmQgPSB0aW1pbmcucmVzcG9uc2VFbmQ7XG5cbiAgaWYgKGZldGNoU3RhcnQgPj0gbmF2aWdhdGlvblN0YXJ0ICYmIHJlc3BvbnNlU3RhcnQgPj0gZmV0Y2hTdGFydCAmJiByZXNwb25zZUVuZCA+PSByZXNwb25zZVN0YXJ0KSB7XG4gICAgdmFyIG1hcmtzID0ge307XG4gICAgTkFWSUdBVElPTl9USU1JTkdfTUFSS1MuZm9yRWFjaChmdW5jdGlvbiAodGltaW5nS2V5KSB7XG4gICAgICB2YXIgbSA9IHRpbWluZ1t0aW1pbmdLZXldO1xuXG4gICAgICBpZiAobSAmJiBtID49IGZldGNoU3RhcnQpIHtcbiAgICAgICAgaWYgKGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlKHRpbWluZykpIHtcbiAgICAgICAgICBtYXJrc1t0aW1pbmdLZXldID0gcGFyc2VJbnQobSAtIHJlZGlyZWN0U3RhcnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtzW3RpbWluZ0tleV0gPSBwYXJzZUludChtIC0gZmV0Y2hTdGFydCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWFya3M7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IHsgZ2V0UGFnZUxvYWRNYXJrcywgTkFWSUdBVElPTl9USU1JTkdfTUFSS1MsIENPTVBSRVNTRURfTkFWX1RJTUlOR19NQVJLUyB9OyIsImltcG9ydCB7IHNob3VsZENyZWF0ZVNwYW4gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBTcGFuIGZyb20gJy4uL3NwYW4nO1xudmFyIGV2ZW50UGFpcnMgPSBbWydyZWRpcmVjdFN0YXJ0JywgJ3JlZGlyZWN0RW5kJywgJ1JlZGlyZWN0J10sIFsnZG9tYWluTG9va3VwU3RhcnQnLCAnZG9tYWluTG9va3VwRW5kJywgJ0RvbWFpbiBsb29rdXAnXSwgWydjb25uZWN0U3RhcnQnLCAnY29ubmVjdEVuZCcsICdNYWtpbmcgYSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXInXSwgWydyZXF1ZXN0U3RhcnQnLCAncmVzcG9uc2VFbmQnLCAnUmVxdWVzdGluZyBhbmQgcmVjZWl2aW5nIHRoZSBkb2N1bWVudCddLCBbJ2RvbUxvYWRpbmcnLCAnZG9tSW50ZXJhY3RpdmUnLCAnUGFyc2luZyB0aGUgZG9jdW1lbnQsIGV4ZWN1dGluZyBzeW5jLiBzY3JpcHRzJ10sIFsnZG9tQ29udGVudExvYWRlZEV2ZW50U3RhcnQnLCAnZG9tQ29udGVudExvYWRlZEV2ZW50RW5kJywgJ0ZpcmUgXCJET01Db250ZW50TG9hZGVkXCIgZXZlbnQnXSwgWydsb2FkRXZlbnRTdGFydCcsICdsb2FkRXZlbnRFbmQnLCAnRmlyZSBcImxvYWRcIiBldmVudCddXTtcblxuZnVuY3Rpb24gY3JlYXRlTmF2aWdhdGlvblRpbWluZ1NwYW5zKHRpbWluZ3MsIGJhc2VUaW1lLCB0clN0YXJ0LCB0ckVuZCkge1xuICB2YXIgc3BhbnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50UGFpcnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc3RhcnQgPSB0aW1pbmdzW2V2ZW50UGFpcnNbaV1bMF1dO1xuICAgIHZhciBlbmQgPSB0aW1pbmdzW2V2ZW50UGFpcnNbaV1bMV1dO1xuXG4gICAgaWYgKCFzaG91bGRDcmVhdGVTcGFuKHN0YXJ0LCBlbmQsIHRyU3RhcnQsIHRyRW5kLCBiYXNlVGltZSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBzcGFuID0gbmV3IFNwYW4oZXZlbnRQYWlyc1tpXVsyXSwgJ2hhcmQtbmF2aWdhdGlvbi5icm93c2VyLXRpbWluZycpO1xuICAgIHZhciBkYXRhID0gbnVsbDtcblxuICAgIGlmIChldmVudFBhaXJzW2ldWzBdID09PSAncmVxdWVzdFN0YXJ0Jykge1xuICAgICAgc3Bhbi5wYWdlUmVzcG9uc2UgPSB0cnVlO1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgdXJsOiBsb2NhdGlvbi5vcmlnaW5cbiAgICAgIH07XG4gICAgfVxuXG4gICAgc3Bhbi5fc3RhcnQgPSBzdGFydCAtIGJhc2VUaW1lO1xuICAgIHNwYW4uZW5kKGVuZCAtIGJhc2VUaW1lLCBkYXRhKTtcbiAgICBzcGFucy5wdXNoKHNwYW4pO1xuICB9XG5cbiAgcmV0dXJuIHNwYW5zO1xufVxuXG5leHBvcnQgeyBjcmVhdGVOYXZpZ2F0aW9uVGltaW5nU3BhbnMgfTsiLCJpbXBvcnQgeyBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybCB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBzaG91bGRDcmVhdGVTcGFuIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBSRVNPVVJDRV9JTklUSUFUT1JfVFlQRVMgfSBmcm9tICcuLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCBTcGFuIGZyb20gJy4uL3NwYW4nO1xuXG5mdW5jdGlvbiBjcmVhdGVSZXNvdXJjZVRpbWluZ1NwYW4ocmVzb3VyY2VUaW1pbmdFbnRyeSkge1xuICB2YXIgbmFtZSA9IHJlc291cmNlVGltaW5nRW50cnkubmFtZSxcbiAgICAgIGluaXRpYXRvclR5cGUgPSByZXNvdXJjZVRpbWluZ0VudHJ5LmluaXRpYXRvclR5cGUsXG4gICAgICBzdGFydFRpbWUgPSByZXNvdXJjZVRpbWluZ0VudHJ5LnN0YXJ0VGltZSxcbiAgICAgIHJlc3BvbnNlRW5kID0gcmVzb3VyY2VUaW1pbmdFbnRyeS5yZXNwb25zZUVuZDtcbiAgdmFyIGtpbmQgPSAncmVzb3VyY2UnO1xuXG4gIGlmIChpbml0aWF0b3JUeXBlKSB7XG4gICAga2luZCArPSAnLicgKyBpbml0aWF0b3JUeXBlO1xuICB9XG5cbiAgdmFyIHNwYW5OYW1lID0gc3RyaXBRdWVyeVN0cmluZ0Zyb21VcmwobmFtZSk7XG4gIHZhciBzcGFuID0gbmV3IFNwYW4oc3Bhbk5hbWUsIGtpbmQpO1xuICBzcGFuLl9zdGFydCA9IHN0YXJ0VGltZTtcbiAgc3Bhbi5lbmQocmVzcG9uc2VFbmQsIHtcbiAgICB1cmw6IG5hbWUsXG4gICAgZW50cnk6IHJlc291cmNlVGltaW5nRW50cnlcbiAgfSk7XG4gIHJldHVybiBzcGFuO1xufVxuXG5mdW5jdGlvbiBpc0NhcHR1cmVkQnlQYXRjaGluZyhyZXNvdXJjZVN0YXJ0VGltZSwgcmVxdWVzdFBhdGNoVGltZSkge1xuICByZXR1cm4gcmVxdWVzdFBhdGNoVGltZSAhPSBudWxsICYmIHJlc291cmNlU3RhcnRUaW1lID4gcmVxdWVzdFBhdGNoVGltZTtcbn1cblxuZnVuY3Rpb24gaXNJbnRha2VBUElFbmRwb2ludCh1cmwpIHtcbiAgcmV0dXJuIC9pbnRha2VcXC92XFxkK1xcL3J1bVxcL2V2ZW50cy8udGVzdCh1cmwpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVSZXNvdXJjZVRpbWluZ1NwYW5zKGVudHJpZXMsIHJlcXVlc3RQYXRjaFRpbWUsIHRyU3RhcnQsIHRyRW5kKSB7XG4gIHZhciBzcGFucyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBfZW50cmllcyRpID0gZW50cmllc1tpXSxcbiAgICAgICAgaW5pdGlhdG9yVHlwZSA9IF9lbnRyaWVzJGkuaW5pdGlhdG9yVHlwZSxcbiAgICAgICAgbmFtZSA9IF9lbnRyaWVzJGkubmFtZSxcbiAgICAgICAgc3RhcnRUaW1lID0gX2VudHJpZXMkaS5zdGFydFRpbWUsXG4gICAgICAgIHJlc3BvbnNlRW5kID0gX2VudHJpZXMkaS5yZXNwb25zZUVuZDtcblxuICAgIGlmIChSRVNPVVJDRV9JTklUSUFUT1JfVFlQRVMuaW5kZXhPZihpbml0aWF0b3JUeXBlKSA9PT0gLTEgfHwgbmFtZSA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoKGluaXRpYXRvclR5cGUgPT09ICd4bWxodHRwcmVxdWVzdCcgfHwgaW5pdGlhdG9yVHlwZSA9PT0gJ2ZldGNoJykgJiYgKGlzSW50YWtlQVBJRW5kcG9pbnQobmFtZSkgfHwgaXNDYXB0dXJlZEJ5UGF0Y2hpbmcoc3RhcnRUaW1lLCByZXF1ZXN0UGF0Y2hUaW1lKSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChzaG91bGRDcmVhdGVTcGFuKHN0YXJ0VGltZSwgcmVzcG9uc2VFbmQsIHRyU3RhcnQsIHRyRW5kKSkge1xuICAgICAgc3BhbnMucHVzaChjcmVhdGVSZXNvdXJjZVRpbWluZ1NwYW4oZW50cmllc1tpXSkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzcGFucztcbn1cblxuZXhwb3J0IHsgY3JlYXRlUmVzb3VyY2VUaW1pbmdTcGFucyB9OyIsImltcG9ydCB7IFVTRVJfVElNSU5HX1RIUkVTSE9MRCB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2hvdWxkQ3JlYXRlU3BhbiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi4vc3Bhbic7XG5cbmZ1bmN0aW9uIGNyZWF0ZVVzZXJUaW1pbmdTcGFucyhlbnRyaWVzLCB0clN0YXJ0LCB0ckVuZCkge1xuICB2YXIgdXNlclRpbWluZ1NwYW5zID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9lbnRyaWVzJGkgPSBlbnRyaWVzW2ldLFxuICAgICAgICBuYW1lID0gX2VudHJpZXMkaS5uYW1lLFxuICAgICAgICBzdGFydFRpbWUgPSBfZW50cmllcyRpLnN0YXJ0VGltZSxcbiAgICAgICAgZHVyYXRpb24gPSBfZW50cmllcyRpLmR1cmF0aW9uO1xuICAgIHZhciBlbmQgPSBzdGFydFRpbWUgKyBkdXJhdGlvbjtcblxuICAgIGlmIChkdXJhdGlvbiA8PSBVU0VSX1RJTUlOR19USFJFU0hPTEQgfHwgIXNob3VsZENyZWF0ZVNwYW4oc3RhcnRUaW1lLCBlbmQsIHRyU3RhcnQsIHRyRW5kKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIGtpbmQgPSAnYXBwJztcbiAgICB2YXIgc3BhbiA9IG5ldyBTcGFuKG5hbWUsIGtpbmQpO1xuICAgIHNwYW4uX3N0YXJ0ID0gc3RhcnRUaW1lO1xuICAgIHNwYW4uZW5kKGVuZCk7XG4gICAgdXNlclRpbWluZ1NwYW5zLnB1c2goc3Bhbik7XG4gIH1cblxuICByZXR1cm4gdXNlclRpbWluZ1NwYW5zO1xufVxuXG5leHBvcnQgeyBjcmVhdGVVc2VyVGltaW5nU3BhbnMgfTsiLCJpbXBvcnQgeyBNQVhfU1BBTl9EVVJBVElPTiB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuXG5mdW5jdGlvbiBzaG91bGRDcmVhdGVTcGFuKHN0YXJ0LCBlbmQsIHRyU3RhcnQsIHRyRW5kLCBiYXNlVGltZSkge1xuICBpZiAoYmFzZVRpbWUgPT09IHZvaWQgMCkge1xuICAgIGJhc2VUaW1lID0gMDtcbiAgfVxuXG4gIHJldHVybiB0eXBlb2Ygc3RhcnQgPT09ICdudW1iZXInICYmIHR5cGVvZiBlbmQgPT09ICdudW1iZXInICYmIHN0YXJ0ID49IGJhc2VUaW1lICYmIGVuZCA+IHN0YXJ0ICYmIHN0YXJ0IC0gYmFzZVRpbWUgPj0gdHJTdGFydCAmJiBlbmQgLSBiYXNlVGltZSA8PSB0ckVuZCAmJiBlbmQgLSBzdGFydCA8IE1BWF9TUEFOX0RVUkFUSU9OICYmIHN0YXJ0IC0gYmFzZVRpbWUgPCBNQVhfU1BBTl9EVVJBVElPTiAmJiBlbmQgLSBiYXNlVGltZSA8IE1BWF9TUEFOX0RVUkFUSU9OO1xufVxuXG5leHBvcnQgeyBzaG91bGRDcmVhdGVTcGFuIH07IiwiaW1wb3J0IHsgY2hlY2tTYW1lT3JpZ2luLCBpc0R0SGVhZGVyVmFsaWQsIHBhcnNlRHRIZWFkZXJWYWx1ZSwgZ2V0RHRIZWFkZXJWYWx1ZSwgZ2V0VFNIZWFkZXJWYWx1ZSwgc3RyaXBRdWVyeVN0cmluZ0Zyb21VcmwsIHNldFJlcXVlc3RIZWFkZXIgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgVXJsIH0gZnJvbSAnLi4vY29tbW9uL3VybCc7XG5pbXBvcnQgeyBwYXRjaEV2ZW50SGFuZGxlciB9IGZyb20gJy4uL2NvbW1vbi9wYXRjaGluZyc7XG5pbXBvcnQgeyBnbG9iYWxTdGF0ZSB9IGZyb20gJy4uL2NvbW1vbi9wYXRjaGluZy9wYXRjaC11dGlscyc7XG5pbXBvcnQgeyBTQ0hFRFVMRSwgSU5WT0tFLCBUUkFOU0FDVElPTl9FTkQsIEFGVEVSX0VWRU5ULCBGRVRDSCwgSElTVE9SWSwgWE1MSFRUUFJFUVVFU1QsIEhUVFBfUkVRVUVTVF9UWVBFLCBPVVRDT01FX0ZBSUxVUkUsIE9VVENPTUVfU1VDQ0VTUywgT1VUQ09NRV9VTktOT1dOLCBRVUVVRV9BRERfVFJBTlNBQ1RJT04gfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IHRydW5jYXRlTW9kZWwsIFNQQU5fTU9ERUwsIFRSQU5TQUNUSU9OX01PREVMIH0gZnJvbSAnLi4vY29tbW9uL3RydW5jYXRlJztcbmltcG9ydCB7IF9fREVWX18gfSBmcm9tICcuLi9zdGF0ZSc7XG52YXIgU0lNSUxBUl9TUEFOX1RPX1RSQU5TQUNUSU9OX1JBVElPID0gMC4wNTtcbnZhciBUUkFOU0FDVElPTl9EVVJBVElPTl9USFJFU0hPTEQgPSA2MDAwMDtcbmV4cG9ydCBmdW5jdGlvbiBncm91cFNtYWxsQ29udGludW91c2x5U2ltaWxhclNwYW5zKG9yaWdpbmFsU3BhbnMsIHRyYW5zRHVyYXRpb24sIHRocmVzaG9sZCkge1xuICBvcmlnaW5hbFNwYW5zLnNvcnQoZnVuY3Rpb24gKHNwYW5BLCBzcGFuQikge1xuICAgIHJldHVybiBzcGFuQS5fc3RhcnQgLSBzcGFuQi5fc3RhcnQ7XG4gIH0pO1xuICB2YXIgc3BhbnMgPSBbXTtcbiAgdmFyIGxhc3RDb3VudCA9IDE7XG4gIG9yaWdpbmFsU3BhbnMuZm9yRWFjaChmdW5jdGlvbiAoc3BhbiwgaW5kZXgpIHtcbiAgICBpZiAoc3BhbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBzcGFucy5wdXNoKHNwYW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGFzdFNwYW4gPSBzcGFuc1tzcGFucy5sZW5ndGggLSAxXTtcbiAgICAgIHZhciBpc0NvbnRpbnVvdXNseVNpbWlsYXIgPSBsYXN0U3Bhbi50eXBlID09PSBzcGFuLnR5cGUgJiYgbGFzdFNwYW4uc3VidHlwZSA9PT0gc3Bhbi5zdWJ0eXBlICYmIGxhc3RTcGFuLmFjdGlvbiA9PT0gc3Bhbi5hY3Rpb24gJiYgbGFzdFNwYW4ubmFtZSA9PT0gc3Bhbi5uYW1lICYmIHNwYW4uZHVyYXRpb24oKSAvIHRyYW5zRHVyYXRpb24gPCB0aHJlc2hvbGQgJiYgKHNwYW4uX3N0YXJ0IC0gbGFzdFNwYW4uX2VuZCkgLyB0cmFuc0R1cmF0aW9uIDwgdGhyZXNob2xkO1xuICAgICAgdmFyIGlzTGFzdFNwYW4gPSBvcmlnaW5hbFNwYW5zLmxlbmd0aCA9PT0gaW5kZXggKyAxO1xuXG4gICAgICBpZiAoaXNDb250aW51b3VzbHlTaW1pbGFyKSB7XG4gICAgICAgIGxhc3RDb3VudCsrO1xuICAgICAgICBsYXN0U3Bhbi5fZW5kID0gc3Bhbi5fZW5kO1xuICAgICAgfVxuXG4gICAgICBpZiAobGFzdENvdW50ID4gMSAmJiAoIWlzQ29udGludW91c2x5U2ltaWxhciB8fCBpc0xhc3RTcGFuKSkge1xuICAgICAgICBsYXN0U3Bhbi5uYW1lID0gbGFzdENvdW50ICsgJ3ggJyArIGxhc3RTcGFuLm5hbWU7XG4gICAgICAgIGxhc3RDb3VudCA9IDE7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNDb250aW51b3VzbHlTaW1pbGFyKSB7XG4gICAgICAgIHNwYW5zLnB1c2goc3Bhbik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHNwYW5zO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkanVzdFRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKSB7XG4gIGlmICh0cmFuc2FjdGlvbi5zYW1wbGVkKSB7XG4gICAgdmFyIGZpbHRlcmRTcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zLmZpbHRlcihmdW5jdGlvbiAoc3Bhbikge1xuICAgICAgcmV0dXJuIHNwYW4uZHVyYXRpb24oKSA+IDAgJiYgc3Bhbi5fc3RhcnQgPj0gdHJhbnNhY3Rpb24uX3N0YXJ0ICYmIHNwYW4uX2VuZCA8PSB0cmFuc2FjdGlvbi5fZW5kO1xuICAgIH0pO1xuXG4gICAgaWYgKHRyYW5zYWN0aW9uLmlzTWFuYWdlZCgpKSB7XG4gICAgICB2YXIgZHVyYXRpb24gPSB0cmFuc2FjdGlvbi5kdXJhdGlvbigpO1xuICAgICAgdmFyIHNpbWlsYXJTcGFucyA9IGdyb3VwU21hbGxDb250aW51b3VzbHlTaW1pbGFyU3BhbnMoZmlsdGVyZFNwYW5zLCBkdXJhdGlvbiwgU0lNSUxBUl9TUEFOX1RPX1RSQU5TQUNUSU9OX1JBVElPKTtcbiAgICAgIHRyYW5zYWN0aW9uLnNwYW5zID0gc2ltaWxhclNwYW5zO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFuc2FjdGlvbi5zcGFucyA9IGZpbHRlcmRTcGFucztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdHJhbnNhY3Rpb24ucmVzZXRGaWVsZHMoKTtcbiAgfVxuXG4gIHJldHVybiB0cmFuc2FjdGlvbjtcbn1cblxudmFyIFBlcmZvcm1hbmNlTW9uaXRvcmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUGVyZm9ybWFuY2VNb25pdG9yaW5nKGFwbVNlcnZlciwgY29uZmlnU2VydmljZSwgbG9nZ2luZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSkge1xuICAgIHRoaXMuX2FwbVNlcnZlciA9IGFwbVNlcnZlcjtcbiAgICB0aGlzLl9jb25maWdTZXJ2aWNlID0gY29uZmlnU2VydmljZTtcbiAgICB0aGlzLl9sb2dnaW5TZXJ2aWNlID0gbG9nZ2luZ1NlcnZpY2U7XG4gICAgdGhpcy5fdHJhbnNhY3Rpb25TZXJ2aWNlID0gdHJhbnNhY3Rpb25TZXJ2aWNlO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFBlcmZvcm1hbmNlTW9uaXRvcmluZy5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmluaXQgPSBmdW5jdGlvbiBpbml0KGZsYWdzKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChmbGFncyA9PT0gdm9pZCAwKSB7XG4gICAgICBmbGFncyA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMuX2NvbmZpZ1NlcnZpY2UuZXZlbnRzLm9ic2VydmUoVFJBTlNBQ1RJT05fRU5EICsgQUZURVJfRVZFTlQsIGZ1bmN0aW9uICh0cikge1xuICAgICAgdmFyIHBheWxvYWQgPSBfdGhpcy5jcmVhdGVUcmFuc2FjdGlvblBheWxvYWQodHIpO1xuXG4gICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICBfdGhpcy5fYXBtU2VydmVyLmFkZFRyYW5zYWN0aW9uKHBheWxvYWQpO1xuXG4gICAgICAgIF90aGlzLl9jb25maWdTZXJ2aWNlLmRpc3BhdGNoRXZlbnQoUVVFVUVfQUREX1RSQU5TQUNUSU9OKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChmbGFnc1tISVNUT1JZXSkge1xuICAgICAgcGF0Y2hFdmVudEhhbmRsZXIub2JzZXJ2ZShISVNUT1JZLCB0aGlzLmdldEhpc3RvcnlTdWIoKSk7XG4gICAgfVxuXG4gICAgaWYgKGZsYWdzW1hNTEhUVFBSRVFVRVNUXSkge1xuICAgICAgcGF0Y2hFdmVudEhhbmRsZXIub2JzZXJ2ZShYTUxIVFRQUkVRVUVTVCwgdGhpcy5nZXRYSFJTdWIoKSk7XG4gICAgfVxuXG4gICAgaWYgKGZsYWdzW0ZFVENIXSkge1xuICAgICAgcGF0Y2hFdmVudEhhbmRsZXIub2JzZXJ2ZShGRVRDSCwgdGhpcy5nZXRGZXRjaFN1YigpKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmdldEhpc3RvcnlTdWIgPSBmdW5jdGlvbiBnZXRIaXN0b3J5U3ViKCkge1xuICAgIHZhciB0cmFuc2FjdGlvblNlcnZpY2UgPSB0aGlzLl90cmFuc2FjdGlvblNlcnZpY2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCwgdGFzaykge1xuICAgICAgaWYgKHRhc2suc291cmNlID09PSBISVNUT1JZICYmIGV2ZW50ID09PSBJTlZPS0UpIHtcbiAgICAgICAgdHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0VHJhbnNhY3Rpb24odGFzay5kYXRhLnRpdGxlLCAncm91dGUtY2hhbmdlJywge1xuICAgICAgICAgIG1hbmFnZWQ6IHRydWUsXG4gICAgICAgICAgY2FuUmV1c2U6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBfcHJvdG8uZ2V0WEhSU3ViID0gZnVuY3Rpb24gZ2V0WEhSU3ViKCkge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCwgdGFzaykge1xuICAgICAgaWYgKHRhc2suc291cmNlID09PSBYTUxIVFRQUkVRVUVTVCAmJiAhZ2xvYmFsU3RhdGUuZmV0Y2hJblByb2dyZXNzKSB7XG4gICAgICAgIF90aGlzMi5wcm9jZXNzQVBJQ2FsbHMoZXZlbnQsIHRhc2spO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgX3Byb3RvLmdldEZldGNoU3ViID0gZnVuY3Rpb24gZ2V0RmV0Y2hTdWIoKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50LCB0YXNrKSB7XG4gICAgICBpZiAodGFzay5zb3VyY2UgPT09IEZFVENIKSB7XG4gICAgICAgIF90aGlzMy5wcm9jZXNzQVBJQ2FsbHMoZXZlbnQsIHRhc2spO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgX3Byb3RvLnByb2Nlc3NBUElDYWxscyA9IGZ1bmN0aW9uIHByb2Nlc3NBUElDYWxscyhldmVudCwgdGFzaykge1xuICAgIHZhciBjb25maWdTZXJ2aWNlID0gdGhpcy5fY29uZmlnU2VydmljZTtcbiAgICB2YXIgdHJhbnNhY3Rpb25TZXJ2aWNlID0gdGhpcy5fdHJhbnNhY3Rpb25TZXJ2aWNlO1xuXG4gICAgaWYgKHRhc2suZGF0YSAmJiB0YXNrLmRhdGEudXJsKSB7XG4gICAgICB2YXIgZW5kcG9pbnRzID0gdGhpcy5fYXBtU2VydmVyLmdldEVuZHBvaW50cygpO1xuXG4gICAgICB2YXIgaXNPd25FbmRwb2ludCA9IE9iamVjdC5rZXlzKGVuZHBvaW50cykuc29tZShmdW5jdGlvbiAoZW5kcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRhc2suZGF0YS51cmwuaW5kZXhPZihlbmRwb2ludHNbZW5kcG9pbnRdKSAhPT0gLTE7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGlzT3duRW5kcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChldmVudCA9PT0gU0NIRURVTEUgJiYgdGFzay5kYXRhKSB7XG4gICAgICB2YXIgZGF0YSA9IHRhc2suZGF0YTtcbiAgICAgIHZhciByZXF1ZXN0VXJsID0gbmV3IFVybChkYXRhLnVybCk7XG4gICAgICB2YXIgc3Bhbk5hbWUgPSBkYXRhLm1ldGhvZCArICcgJyArIChyZXF1ZXN0VXJsLnJlbGF0aXZlID8gcmVxdWVzdFVybC5wYXRoIDogc3RyaXBRdWVyeVN0cmluZ0Zyb21VcmwocmVxdWVzdFVybC5ocmVmKSk7XG5cbiAgICAgIGlmICghdHJhbnNhY3Rpb25TZXJ2aWNlLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpKSB7XG4gICAgICAgIHRyYW5zYWN0aW9uU2VydmljZS5zdGFydFRyYW5zYWN0aW9uKHNwYW5OYW1lLCBIVFRQX1JFUVVFU1RfVFlQRSwge1xuICAgICAgICAgIG1hbmFnZWQ6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzcGFuID0gdHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0U3BhbihzcGFuTmFtZSwgJ2V4dGVybmFsLmh0dHAnLCB7XG4gICAgICAgIGJsb2NraW5nOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFzcGFuKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGlzRHRFbmFibGVkID0gY29uZmlnU2VydmljZS5nZXQoJ2Rpc3RyaWJ1dGVkVHJhY2luZycpO1xuICAgICAgdmFyIGR0T3JpZ2lucyA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdkaXN0cmlidXRlZFRyYWNpbmdPcmlnaW5zJyk7XG4gICAgICB2YXIgY3VycmVudFVybCA9IG5ldyBVcmwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgdmFyIGlzU2FtZU9yaWdpbiA9IGNoZWNrU2FtZU9yaWdpbihyZXF1ZXN0VXJsLm9yaWdpbiwgY3VycmVudFVybC5vcmlnaW4pIHx8IGNoZWNrU2FtZU9yaWdpbihyZXF1ZXN0VXJsLm9yaWdpbiwgZHRPcmlnaW5zKTtcbiAgICAgIHZhciB0YXJnZXQgPSBkYXRhLnRhcmdldDtcblxuICAgICAgaWYgKGlzRHRFbmFibGVkICYmIGlzU2FtZU9yaWdpbiAmJiB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5pbmplY3REdEhlYWRlcihzcGFuLCB0YXJnZXQpO1xuICAgICAgICB2YXIgcHJvcGFnYXRlVHJhY2VzdGF0ZSA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdwcm9wYWdhdGVUcmFjZXN0YXRlJyk7XG5cbiAgICAgICAgaWYgKHByb3BhZ2F0ZVRyYWNlc3RhdGUpIHtcbiAgICAgICAgICB0aGlzLmluamVjdFRTSGVhZGVyKHNwYW4sIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoX19ERVZfXykge1xuICAgICAgICB0aGlzLl9sb2dnaW5TZXJ2aWNlLmRlYnVnKFwiQ291bGQgbm90IGluamVjdCBkaXN0cmlidXRlZCB0cmFjaW5nIGhlYWRlciB0byB0aGUgcmVxdWVzdCBvcmlnaW4gKCdcIiArIHJlcXVlc3RVcmwub3JpZ2luICsgXCInKSBmcm9tIHRoZSBjdXJyZW50IG9yaWdpbiAoJ1wiICsgY3VycmVudFVybC5vcmlnaW4gKyBcIicpXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5zeW5jKSB7XG4gICAgICAgIHNwYW4uc3luYyA9IGRhdGEuc3luYztcbiAgICAgIH1cblxuICAgICAgZGF0YS5zcGFuID0gc3BhbjtcbiAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBJTlZPS0UpIHtcbiAgICAgIHZhciBfZGF0YSA9IHRhc2suZGF0YTtcblxuICAgICAgaWYgKF9kYXRhICYmIF9kYXRhLnNwYW4pIHtcbiAgICAgICAgdmFyIF9zcGFuID0gX2RhdGEuc3BhbixcbiAgICAgICAgICAgIHJlc3BvbnNlID0gX2RhdGEucmVzcG9uc2UsXG4gICAgICAgICAgICBfdGFyZ2V0ID0gX2RhdGEudGFyZ2V0O1xuICAgICAgICB2YXIgc3RhdHVzO1xuXG4gICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgIHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGF0dXMgPSBfdGFyZ2V0LnN0YXR1cztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvdXRjb21lO1xuXG4gICAgICAgIGlmIChfZGF0YS5zdGF0dXMgIT0gJ2Fib3J0JyAmJiAhX2RhdGEuYWJvcnRlZCkge1xuICAgICAgICAgIGlmIChzdGF0dXMgPj0gNDAwIHx8IHN0YXR1cyA9PSAwKSB7XG4gICAgICAgICAgICBvdXRjb21lID0gT1VUQ09NRV9GQUlMVVJFO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRjb21lID0gT1VUQ09NRV9TVUNDRVNTO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXRjb21lID0gT1VUQ09NRV9VTktOT1dOO1xuICAgICAgICB9XG5cbiAgICAgICAgX3NwYW4ub3V0Y29tZSA9IG91dGNvbWU7XG4gICAgICAgIHZhciB0ciA9IHRyYW5zYWN0aW9uU2VydmljZS5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKTtcblxuICAgICAgICBpZiAodHIgJiYgdHIudHlwZSA9PT0gSFRUUF9SRVFVRVNUX1RZUEUpIHtcbiAgICAgICAgICB0ci5vdXRjb21lID0gb3V0Y29tZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zYWN0aW9uU2VydmljZS5lbmRTcGFuKF9zcGFuLCBfZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5pbmplY3REdEhlYWRlciA9IGZ1bmN0aW9uIGluamVjdER0SGVhZGVyKHNwYW4sIHRhcmdldCkge1xuICAgIHZhciBoZWFkZXJOYW1lID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ2Rpc3RyaWJ1dGVkVHJhY2luZ0hlYWRlck5hbWUnKTtcblxuICAgIHZhciBoZWFkZXJWYWx1ZSA9IGdldER0SGVhZGVyVmFsdWUoc3Bhbik7XG4gICAgdmFyIGlzSGVhZGVyVmFsaWQgPSBpc0R0SGVhZGVyVmFsaWQoaGVhZGVyVmFsdWUpO1xuXG4gICAgaWYgKGlzSGVhZGVyVmFsaWQgJiYgaGVhZGVyVmFsdWUgJiYgaGVhZGVyTmFtZSkge1xuICAgICAgc2V0UmVxdWVzdEhlYWRlcih0YXJnZXQsIGhlYWRlck5hbWUsIGhlYWRlclZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmluamVjdFRTSGVhZGVyID0gZnVuY3Rpb24gaW5qZWN0VFNIZWFkZXIoc3BhbiwgdGFyZ2V0KSB7XG4gICAgdmFyIGhlYWRlclZhbHVlID0gZ2V0VFNIZWFkZXJWYWx1ZShzcGFuKTtcblxuICAgIGlmIChoZWFkZXJWYWx1ZSkge1xuICAgICAgc2V0UmVxdWVzdEhlYWRlcih0YXJnZXQsICd0cmFjZXN0YXRlJywgaGVhZGVyVmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZXh0cmFjdER0SGVhZGVyID0gZnVuY3Rpb24gZXh0cmFjdER0SGVhZGVyKHRhcmdldCkge1xuICAgIHZhciBjb25maWdTZXJ2aWNlID0gdGhpcy5fY29uZmlnU2VydmljZTtcbiAgICB2YXIgaGVhZGVyTmFtZSA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdkaXN0cmlidXRlZFRyYWNpbmdIZWFkZXJOYW1lJyk7XG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gcGFyc2VEdEhlYWRlclZhbHVlKHRhcmdldFtoZWFkZXJOYW1lXSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5maWx0ZXJUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIGZpbHRlclRyYW5zYWN0aW9uKHRyKSB7XG4gICAgdmFyIGR1cmF0aW9uID0gdHIuZHVyYXRpb24oKTtcblxuICAgIGlmICghZHVyYXRpb24pIHtcbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJ0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiKSB3YXMgZGlzY2FyZGVkISBcIjtcblxuICAgICAgICBpZiAoZHVyYXRpb24gPT09IDApIHtcbiAgICAgICAgICBtZXNzYWdlICs9IFwiVHJhbnNhY3Rpb24gZHVyYXRpb24gaXMgMFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lc3NhZ2UgKz0gXCJUcmFuc2FjdGlvbiB3YXNuJ3QgZW5kZWRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dpblNlcnZpY2UuZGVidWcobWVzc2FnZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHIuaXNNYW5hZ2VkKCkpIHtcbiAgICAgIGlmIChkdXJhdGlvbiA+IFRSQU5TQUNUSU9OX0RVUkFUSU9OX1RIUkVTSE9MRCkge1xuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIHRoaXMuX2xvZ2dpblNlcnZpY2UuZGVidWcoXCJ0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiKSB3YXMgZGlzY2FyZGVkISBUcmFuc2FjdGlvbiBkdXJhdGlvbiAoXCIgKyBkdXJhdGlvbiArIFwiKSBpcyBncmVhdGVyIHRoYW4gbWFuYWdlZCB0cmFuc2FjdGlvbiB0aHJlc2hvbGQgKFwiICsgVFJBTlNBQ1RJT05fRFVSQVRJT05fVEhSRVNIT0xEICsgXCIpXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHIuc2FtcGxlZCAmJiB0ci5zcGFucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgICB0aGlzLl9sb2dnaW5TZXJ2aWNlLmRlYnVnKFwidHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIikgd2FzIGRpc2NhcmRlZCEgVHJhbnNhY3Rpb24gZG9lcyBub3QgaGF2ZSBhbnkgc3BhbnNcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgX3Byb3RvLmNyZWF0ZVRyYW5zYWN0aW9uRGF0YU1vZGVsID0gZnVuY3Rpb24gY3JlYXRlVHJhbnNhY3Rpb25EYXRhTW9kZWwodHJhbnNhY3Rpb24pIHtcbiAgICB2YXIgdHJhbnNhY3Rpb25TdGFydCA9IHRyYW5zYWN0aW9uLl9zdGFydDtcbiAgICB2YXIgc3BhbnMgPSB0cmFuc2FjdGlvbi5zcGFucy5tYXAoZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgIHZhciBzcGFuRGF0YSA9IHtcbiAgICAgICAgaWQ6IHNwYW4uaWQsXG4gICAgICAgIHRyYW5zYWN0aW9uX2lkOiB0cmFuc2FjdGlvbi5pZCxcbiAgICAgICAgcGFyZW50X2lkOiBzcGFuLnBhcmVudElkIHx8IHRyYW5zYWN0aW9uLmlkLFxuICAgICAgICB0cmFjZV9pZDogdHJhbnNhY3Rpb24udHJhY2VJZCxcbiAgICAgICAgbmFtZTogc3Bhbi5uYW1lLFxuICAgICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICAgIHN1YnR5cGU6IHNwYW4uc3VidHlwZSxcbiAgICAgICAgYWN0aW9uOiBzcGFuLmFjdGlvbixcbiAgICAgICAgc3luYzogc3Bhbi5zeW5jLFxuICAgICAgICBzdGFydDogcGFyc2VJbnQoc3Bhbi5fc3RhcnQgLSB0cmFuc2FjdGlvblN0YXJ0KSxcbiAgICAgICAgZHVyYXRpb246IHNwYW4uZHVyYXRpb24oKSxcbiAgICAgICAgY29udGV4dDogc3Bhbi5jb250ZXh0LFxuICAgICAgICBvdXRjb21lOiBzcGFuLm91dGNvbWUsXG4gICAgICAgIHNhbXBsZV9yYXRlOiBzcGFuLnNhbXBsZVJhdGVcbiAgICAgIH07XG4gICAgICByZXR1cm4gdHJ1bmNhdGVNb2RlbChTUEFOX01PREVMLCBzcGFuRGF0YSk7XG4gICAgfSk7XG4gICAgdmFyIHRyYW5zYWN0aW9uRGF0YSA9IHtcbiAgICAgIGlkOiB0cmFuc2FjdGlvbi5pZCxcbiAgICAgIHRyYWNlX2lkOiB0cmFuc2FjdGlvbi50cmFjZUlkLFxuICAgICAgc2Vzc2lvbjogdHJhbnNhY3Rpb24uc2Vzc2lvbixcbiAgICAgIG5hbWU6IHRyYW5zYWN0aW9uLm5hbWUsXG4gICAgICB0eXBlOiB0cmFuc2FjdGlvbi50eXBlLFxuICAgICAgZHVyYXRpb246IHRyYW5zYWN0aW9uLmR1cmF0aW9uKCksXG4gICAgICBzcGFuczogc3BhbnMsXG4gICAgICBjb250ZXh0OiB0cmFuc2FjdGlvbi5jb250ZXh0LFxuICAgICAgbWFya3M6IHRyYW5zYWN0aW9uLm1hcmtzLFxuICAgICAgYnJlYWtkb3duOiB0cmFuc2FjdGlvbi5icmVha2Rvd25UaW1pbmdzLFxuICAgICAgc3Bhbl9jb3VudDoge1xuICAgICAgICBzdGFydGVkOiBzcGFucy5sZW5ndGhcbiAgICAgIH0sXG4gICAgICBzYW1wbGVkOiB0cmFuc2FjdGlvbi5zYW1wbGVkLFxuICAgICAgc2FtcGxlX3JhdGU6IHRyYW5zYWN0aW9uLnNhbXBsZVJhdGUsXG4gICAgICBleHBlcmllbmNlOiB0cmFuc2FjdGlvbi5leHBlcmllbmNlLFxuICAgICAgb3V0Y29tZTogdHJhbnNhY3Rpb24ub3V0Y29tZVxuICAgIH07XG4gICAgcmV0dXJuIHRydW5jYXRlTW9kZWwoVFJBTlNBQ1RJT05fTU9ERUwsIHRyYW5zYWN0aW9uRGF0YSk7XG4gIH07XG5cbiAgX3Byb3RvLmNyZWF0ZVRyYW5zYWN0aW9uUGF5bG9hZCA9IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zYWN0aW9uUGF5bG9hZCh0cmFuc2FjdGlvbikge1xuICAgIHZhciBhZGp1c3RlZFRyYW5zYWN0aW9uID0gYWRqdXN0VHJhbnNhY3Rpb24odHJhbnNhY3Rpb24pO1xuICAgIHZhciBmaWx0ZXJlZCA9IHRoaXMuZmlsdGVyVHJhbnNhY3Rpb24oYWRqdXN0ZWRUcmFuc2FjdGlvbik7XG5cbiAgICBpZiAoZmlsdGVyZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVRyYW5zYWN0aW9uRGF0YU1vZGVsKHRyYW5zYWN0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFBlcmZvcm1hbmNlTW9uaXRvcmluZztcbn0oKTtcblxuZXhwb3J0IHsgUGVyZm9ybWFuY2VNb25pdG9yaW5nIGFzIGRlZmF1bHQgfTsiLCJpbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbUlkLCBzZXRMYWJlbCwgbWVyZ2UsIGdldER1cmF0aW9uLCBnZXRUaW1lIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IE5BTUVfVU5LTk9XTiwgVFlQRV9DVVNUT00gfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcblxudmFyIFNwYW5CYXNlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTcGFuQmFzZShuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGlmICghbmFtZSkge1xuICAgICAgbmFtZSA9IE5BTUVfVU5LTk9XTjtcbiAgICB9XG5cbiAgICBpZiAoIXR5cGUpIHtcbiAgICAgIHR5cGUgPSBUWVBFX0NVU1RPTTtcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmlkID0gb3B0aW9ucy5pZCB8fCBnZW5lcmF0ZVJhbmRvbUlkKDE2KTtcbiAgICB0aGlzLnRyYWNlSWQgPSBvcHRpb25zLnRyYWNlSWQ7XG4gICAgdGhpcy5zYW1wbGVkID0gb3B0aW9ucy5zYW1wbGVkO1xuICAgIHRoaXMuc2FtcGxlUmF0ZSA9IG9wdGlvbnMuc2FtcGxlUmF0ZTtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IG9wdGlvbnMudGltZXN0YW1wO1xuICAgIHRoaXMuX3N0YXJ0ID0gZ2V0VGltZShvcHRpb25zLnN0YXJ0VGltZSk7XG4gICAgdGhpcy5fZW5kID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgICB0aGlzLm91dGNvbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5vbkVuZCA9IG9wdGlvbnMub25FbmQ7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU3BhbkJhc2UucHJvdG90eXBlO1xuXG4gIF9wcm90by5lbnN1cmVDb250ZXh0ID0gZnVuY3Rpb24gZW5zdXJlQ29udGV4dCgpIHtcbiAgICBpZiAoIXRoaXMuY29udGV4dCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0ge307XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5hZGRMYWJlbHMgPSBmdW5jdGlvbiBhZGRMYWJlbHModGFncykge1xuICAgIHRoaXMuZW5zdXJlQ29udGV4dCgpO1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoIWN0eC50YWdzKSB7XG4gICAgICBjdHgudGFncyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGFncyk7XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICByZXR1cm4gc2V0TGFiZWwoaywgdGFnc1trXSwgY3R4LnRhZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5hZGRDb250ZXh0ID0gZnVuY3Rpb24gYWRkQ29udGV4dCgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgY29udGV4dCA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGNvbnRleHRbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgdGhpcy5lbnN1cmVDb250ZXh0KCk7XG4gICAgbWVyZ2UuYXBwbHkodm9pZCAwLCBbdGhpcy5jb250ZXh0XS5jb25jYXQoY29udGV4dCkpO1xuICB9O1xuXG4gIF9wcm90by5lbmQgPSBmdW5jdGlvbiBlbmQoZW5kVGltZSkge1xuICAgIGlmICh0aGlzLmVuZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5lbmRlZCA9IHRydWU7XG4gICAgdGhpcy5fZW5kID0gZ2V0VGltZShlbmRUaW1lKTtcbiAgICB0aGlzLmNhbGxPbkVuZCgpO1xuICB9O1xuXG4gIF9wcm90by5jYWxsT25FbmQgPSBmdW5jdGlvbiBjYWxsT25FbmQoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uRW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uRW5kKHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZHVyYXRpb24gPSBmdW5jdGlvbiBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gZ2V0RHVyYXRpb24odGhpcy5fc3RhcnQsIHRoaXMuX2VuZCk7XG4gIH07XG5cbiAgcmV0dXJuIFNwYW5CYXNlO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBTcGFuQmFzZTsiLCJmdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuaW1wb3J0IFNwYW5CYXNlIGZyb20gJy4vc3Bhbi1iYXNlJztcbmltcG9ydCB7IGFkZFNwYW5Db250ZXh0IH0gZnJvbSAnLi4vY29tbW9uL2NvbnRleHQnO1xuXG52YXIgU3BhbiA9IGZ1bmN0aW9uIChfU3BhbkJhc2UpIHtcbiAgX2luaGVyaXRzTG9vc2UoU3BhbiwgX1NwYW5CYXNlKTtcblxuICBmdW5jdGlvbiBTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IF9TcGFuQmFzZS5jYWxsKHRoaXMsIG5hbWUsIHR5cGUsIG9wdGlvbnMpIHx8IHRoaXM7XG4gICAgX3RoaXMucGFyZW50SWQgPSBfdGhpcy5vcHRpb25zLnBhcmVudElkO1xuICAgIF90aGlzLnN1YnR5cGUgPSB1bmRlZmluZWQ7XG4gICAgX3RoaXMuYWN0aW9uID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKF90aGlzLnR5cGUuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgdmFyIGZpZWxkcyA9IF90aGlzLnR5cGUuc3BsaXQoJy4nLCAzKTtcblxuICAgICAgX3RoaXMudHlwZSA9IGZpZWxkc1swXTtcbiAgICAgIF90aGlzLnN1YnR5cGUgPSBmaWVsZHNbMV07XG4gICAgICBfdGhpcy5hY3Rpb24gPSBmaWVsZHNbMl07XG4gICAgfVxuXG4gICAgX3RoaXMuc3luYyA9IF90aGlzLm9wdGlvbnMuc3luYztcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU3Bhbi5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmVuZCA9IGZ1bmN0aW9uIGVuZChlbmRUaW1lLCBkYXRhKSB7XG4gICAgX1NwYW5CYXNlLnByb3RvdHlwZS5lbmQuY2FsbCh0aGlzLCBlbmRUaW1lKTtcblxuICAgIGFkZFNwYW5Db250ZXh0KHRoaXMsIGRhdGEpO1xuICB9O1xuXG4gIHJldHVybiBTcGFuO1xufShTcGFuQmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNwYW47IiwiaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4uL2NvbW1vbi9wb2x5ZmlsbHMnO1xuaW1wb3J0IFRyYW5zYWN0aW9uIGZyb20gJy4vdHJhbnNhY3Rpb24nO1xuaW1wb3J0IHsgUGVyZkVudHJ5UmVjb3JkZXIsIGNhcHR1cmVPYnNlcnZlckVudHJpZXMsIG1ldHJpY3MsIGNyZWF0ZVRvdGFsQmxvY2tpbmdUaW1lU3BhbiB9IGZyb20gJy4vbWV0cmljcyc7XG5pbXBvcnQgeyBleHRlbmQsIGdldEVhcmxpZXN0U3BhbiwgZ2V0TGF0ZXN0Tm9uWEhSU3BhbiwgZ2V0TGF0ZXN0WEhSU3BhbiwgaXNQZXJmVHlwZVN1cHBvcnRlZCwgZ2VuZXJhdGVSYW5kb21JZCB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBjYXB0dXJlTmF2aWdhdGlvbiB9IGZyb20gJy4vbmF2aWdhdGlvbi9jYXB0dXJlLW5hdmlnYXRpb24nO1xuaW1wb3J0IHsgUEFHRV9MT0FELCBOQU1FX1VOS05PV04sIFRSQU5TQUNUSU9OX1NUQVJULCBUUkFOU0FDVElPTl9FTkQsIFRFTVBPUkFSWV9UWVBFLCBUUkFOU0FDVElPTl9UWVBFX09SREVSLCBMQVJHRVNUX0NPTlRFTlRGVUxfUEFJTlQsIExPTkdfVEFTSywgUEFJTlQsIFRSVU5DQVRFRF9UWVBFLCBGSVJTVF9JTlBVVCwgTEFZT1VUX1NISUZULCBTRVNTSU9OX1RJTUVPVVQsIFBBR0VfTE9BRF9ERUxBWSB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgYWRkVHJhbnNhY3Rpb25Db250ZXh0IH0gZnJvbSAnLi4vY29tbW9uL2NvbnRleHQnO1xuaW1wb3J0IHsgX19ERVZfXywgc3RhdGUgfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQgeyBzbHVnaWZ5VXJsIH0gZnJvbSAnLi4vY29tbW9uL3VybCc7XG5cbnZhciBUcmFuc2FjdGlvblNlcnZpY2UgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFRyYW5zYWN0aW9uU2VydmljZShsb2dnZXIsIGNvbmZpZykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgIHRoaXMuY3VycmVudFRyYW5zYWN0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmVzcEludGVydmFsSWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5yZWNvcmRlciA9IG5ldyBQZXJmRW50cnlSZWNvcmRlcihmdW5jdGlvbiAobGlzdCkge1xuICAgICAgdmFyIHRyID0gX3RoaXMuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG5cbiAgICAgIGlmICh0ciAmJiB0ci5jYXB0dXJlVGltaW5ncykge1xuICAgICAgICB2YXIgX3RyJHNwYW5zO1xuXG4gICAgICAgIHZhciBpc0hhcmROYXZpZ2F0aW9uID0gdHIudHlwZSA9PT0gUEFHRV9MT0FEO1xuXG4gICAgICAgIHZhciBfY2FwdHVyZU9ic2VydmVyRW50cmkgPSBjYXB0dXJlT2JzZXJ2ZXJFbnRyaWVzKGxpc3QsIHtcbiAgICAgICAgICBpc0hhcmROYXZpZ2F0aW9uOiBpc0hhcmROYXZpZ2F0aW9uLFxuICAgICAgICAgIHRyU3RhcnQ6IGlzSGFyZE5hdmlnYXRpb24gPyAwIDogdHIuX3N0YXJ0XG4gICAgICAgIH0pLFxuICAgICAgICAgICAgc3BhbnMgPSBfY2FwdHVyZU9ic2VydmVyRW50cmkuc3BhbnMsXG4gICAgICAgICAgICBtYXJrcyA9IF9jYXB0dXJlT2JzZXJ2ZXJFbnRyaS5tYXJrcztcblxuICAgICAgICAoX3RyJHNwYW5zID0gdHIuc3BhbnMpLnB1c2guYXBwbHkoX3RyJHNwYW5zLCBzcGFucyk7XG5cbiAgICAgICAgdHIuYWRkTWFya3Moe1xuICAgICAgICAgIGFnZW50OiBtYXJrc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBUcmFuc2FjdGlvblNlcnZpY2UucHJvdG90eXBlO1xuXG4gIF9wcm90by5jcmVhdGVDdXJyZW50VHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBjcmVhdGVDdXJyZW50VHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIHZhciB0ciA9IG5ldyBUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBvcHRpb25zKTtcbiAgICB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbiA9IHRyO1xuICAgIHJldHVybiB0cjtcbiAgfTtcblxuICBfcHJvdG8uZ2V0Q3VycmVudFRyYW5zYWN0aW9uID0gZnVuY3Rpb24gZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbiAmJiAhdGhpcy5jdXJyZW50VHJhbnNhY3Rpb24uZW5kZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbjtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmNyZWF0ZU9wdGlvbnMgPSBmdW5jdGlvbiBjcmVhdGVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICB2YXIgY29uZmlnID0gdGhpcy5fY29uZmlnLmNvbmZpZztcbiAgICB2YXIgcHJlc2V0T3B0aW9ucyA9IHtcbiAgICAgIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZTogY29uZmlnLnRyYW5zYWN0aW9uU2FtcGxlUmF0ZVxuICAgIH07XG4gICAgdmFyIHBlcmZPcHRpb25zID0gZXh0ZW5kKHByZXNldE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgaWYgKHBlcmZPcHRpb25zLm1hbmFnZWQpIHtcbiAgICAgIHBlcmZPcHRpb25zID0gZXh0ZW5kKHtcbiAgICAgICAgcGFnZUxvYWRUcmFjZUlkOiBjb25maWcucGFnZUxvYWRUcmFjZUlkLFxuICAgICAgICBwYWdlTG9hZFNhbXBsZWQ6IGNvbmZpZy5wYWdlTG9hZFNhbXBsZWQsXG4gICAgICAgIHBhZ2VMb2FkU3BhbklkOiBjb25maWcucGFnZUxvYWRTcGFuSWQsXG4gICAgICAgIHBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lOiBjb25maWcucGFnZUxvYWRUcmFuc2FjdGlvbk5hbWVcbiAgICAgIH0sIHBlcmZPcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGVyZk9wdGlvbnM7XG4gIH07XG5cbiAgX3Byb3RvLnN0YXJ0TWFuYWdlZFRyYW5zYWN0aW9uID0gZnVuY3Rpb24gc3RhcnRNYW5hZ2VkVHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgcGVyZk9wdGlvbnMpIHtcbiAgICB2YXIgdHIgPSB0aGlzLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuICAgIHZhciBpc1JlZGVmaW5lZCA9IGZhbHNlO1xuXG4gICAgaWYgKCF0cikge1xuICAgICAgdHIgPSB0aGlzLmNyZWF0ZUN1cnJlbnRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBwZXJmT3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmICh0ci5jYW5SZXVzZSgpICYmIHBlcmZPcHRpb25zLmNhblJldXNlKSB7XG4gICAgICB2YXIgcmVkZWZpbmVUeXBlID0gdHIudHlwZTtcbiAgICAgIHZhciBjdXJyZW50VHlwZU9yZGVyID0gVFJBTlNBQ1RJT05fVFlQRV9PUkRFUi5pbmRleE9mKHRyLnR5cGUpO1xuICAgICAgdmFyIHJlZGVmaW5lVHlwZU9yZGVyID0gVFJBTlNBQ1RJT05fVFlQRV9PUkRFUi5pbmRleE9mKHR5cGUpO1xuXG4gICAgICBpZiAoY3VycmVudFR5cGVPcmRlciA+PSAwICYmIHJlZGVmaW5lVHlwZU9yZGVyIDwgY3VycmVudFR5cGVPcmRlcikge1xuICAgICAgICByZWRlZmluZVR5cGUgPSB0eXBlO1xuICAgICAgfVxuXG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoXCJyZWRlZmluaW5nIHRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIsIFwiICsgdHIudHlwZSArIFwiKVwiLCAndG8nLCBcIihcIiArIChuYW1lIHx8IHRyLm5hbWUpICsgXCIsIFwiICsgcmVkZWZpbmVUeXBlICsgXCIpXCIsIHRyKTtcbiAgICAgIH1cblxuICAgICAgdHIucmVkZWZpbmUobmFtZSwgcmVkZWZpbmVUeXBlLCBwZXJmT3B0aW9ucyk7XG4gICAgICBpc1JlZGVmaW5lZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhcImVuZGluZyBwcmV2aW91cyB0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiKVwiLCB0cik7XG4gICAgICB9XG5cbiAgICAgIHRyLmVuZCgpO1xuICAgICAgdHIgPSB0aGlzLmNyZWF0ZUN1cnJlbnRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBwZXJmT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKHRyLnR5cGUgPT09IFBBR0VfTE9BRCkge1xuICAgICAgaWYgKCFpc1JlZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnJlY29yZGVyLnN0YXJ0KExBUkdFU1RfQ09OVEVOVEZVTF9QQUlOVCk7XG4gICAgICAgIHRoaXMucmVjb3JkZXIuc3RhcnQoUEFJTlQpO1xuICAgICAgICB0aGlzLnJlY29yZGVyLnN0YXJ0KEZJUlNUX0lOUFVUKTtcbiAgICAgICAgdGhpcy5yZWNvcmRlci5zdGFydChMQVlPVVRfU0hJRlQpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGVyZk9wdGlvbnMucGFnZUxvYWRUcmFjZUlkKSB7XG4gICAgICAgIHRyLnRyYWNlSWQgPSBwZXJmT3B0aW9ucy5wYWdlTG9hZFRyYWNlSWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChwZXJmT3B0aW9ucy5wYWdlTG9hZFNhbXBsZWQpIHtcbiAgICAgICAgdHIuc2FtcGxlZCA9IHBlcmZPcHRpb25zLnBhZ2VMb2FkU2FtcGxlZDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRyLm5hbWUgPT09IE5BTUVfVU5LTk9XTiAmJiBwZXJmT3B0aW9ucy5wYWdlTG9hZFRyYW5zYWN0aW9uTmFtZSkge1xuICAgICAgICB0ci5uYW1lID0gcGVyZk9wdGlvbnMucGFnZUxvYWRUcmFuc2FjdGlvbk5hbWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFpc1JlZGVmaW5lZCAmJiB0aGlzLl9jb25maWcuZ2V0KCdtb25pdG9yTG9uZ3Rhc2tzJykpIHtcbiAgICAgIHRoaXMucmVjb3JkZXIuc3RhcnQoTE9OR19UQVNLKTtcbiAgICB9XG5cbiAgICBpZiAodHIuc2FtcGxlZCkge1xuICAgICAgdHIuY2FwdHVyZVRpbWluZ3MgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiB0cjtcbiAgfTtcblxuICBfcHJvdG8uc3RhcnRUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIHN0YXJ0VHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgdmFyIHBlcmZPcHRpb25zID0gdGhpcy5jcmVhdGVPcHRpb25zKG9wdGlvbnMpO1xuICAgIHZhciB0cjtcbiAgICB2YXIgZmlyZU9uc3RhcnRIb29rID0gdHJ1ZTtcblxuICAgIGlmIChwZXJmT3B0aW9ucy5tYW5hZ2VkKSB7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudFRyYW5zYWN0aW9uO1xuICAgICAgdHIgPSB0aGlzLnN0YXJ0TWFuYWdlZFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIHBlcmZPcHRpb25zKTtcblxuICAgICAgaWYgKGN1cnJlbnQgPT09IHRyKSB7XG4gICAgICAgIGZpcmVPbnN0YXJ0SG9vayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0ciA9IG5ldyBUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBwZXJmT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdHIub25FbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX3RoaXMyLmhhbmRsZVRyYW5zYWN0aW9uRW5kKHRyKTtcbiAgICB9O1xuXG4gICAgaWYgKGZpcmVPbnN0YXJ0SG9vaykge1xuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKFwic3RhcnRUcmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiLCBcIiArIHRyLnR5cGUgKyBcIilcIik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NvbmZpZy5ldmVudHMuc2VuZChUUkFOU0FDVElPTl9TVEFSVCwgW3RyXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyO1xuICB9O1xuXG4gIF9wcm90by5oYW5kbGVUcmFuc2FjdGlvbkVuZCA9IGZ1bmN0aW9uIGhhbmRsZVRyYW5zYWN0aW9uRW5kKHRyKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICB0aGlzLnJlY29yZGVyLnN0b3AoKTtcbiAgICB2YXIgY3VycmVudFVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuYW1lID0gdHIubmFtZSxcbiAgICAgICAgICB0eXBlID0gdHIudHlwZTtcbiAgICAgIHZhciBsYXN0SGlkZGVuU3RhcnQgPSBzdGF0ZS5sYXN0SGlkZGVuU3RhcnQ7XG5cbiAgICAgIGlmIChsYXN0SGlkZGVuU3RhcnQgPj0gdHIuX3N0YXJ0KSB7XG4gICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgX3RoaXMzLl9sb2dnZXIuZGVidWcoXCJ0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgbmFtZSArIFwiLCBcIiArIHR5cGUgKyBcIikgd2FzIGRpc2NhcmRlZCEgVGhlIHBhZ2Ugd2FzIGhpZGRlbiBkdXJpbmcgdGhlIHRyYW5zYWN0aW9uIVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzMy5zaG91bGRJZ25vcmVUcmFuc2FjdGlvbihuYW1lKSB8fCB0eXBlID09PSBURU1QT1JBUllfVFlQRSkge1xuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIF90aGlzMy5fbG9nZ2VyLmRlYnVnKFwidHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIG5hbWUgKyBcIiwgXCIgKyB0eXBlICsgXCIpIGlzIGlnbm9yZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlID09PSBQQUdFX0xPQUQpIHtcbiAgICAgICAgdmFyIHBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lID0gX3RoaXMzLl9jb25maWcuZ2V0KCdwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZScpO1xuXG4gICAgICAgIGlmIChuYW1lID09PSBOQU1FX1VOS05PV04gJiYgcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWUpIHtcbiAgICAgICAgICB0ci5uYW1lID0gcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHIuY2FwdHVyZVRpbWluZ3MpIHtcbiAgICAgICAgICB2YXIgY2xzID0gbWV0cmljcy5jbHMsXG4gICAgICAgICAgICAgIGZpZCA9IG1ldHJpY3MuZmlkLFxuICAgICAgICAgICAgICB0YnQgPSBtZXRyaWNzLnRidCxcbiAgICAgICAgICAgICAgbG9uZ3Rhc2sgPSBtZXRyaWNzLmxvbmd0YXNrO1xuXG4gICAgICAgICAgaWYgKHRidC5kdXJhdGlvbiA+IDApIHtcbiAgICAgICAgICAgIHRyLnNwYW5zLnB1c2goY3JlYXRlVG90YWxCbG9ja2luZ1RpbWVTcGFuKHRidCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRyLmV4cGVyaWVuY2UgPSB7fTtcblxuICAgICAgICAgIGlmIChpc1BlcmZUeXBlU3VwcG9ydGVkKExPTkdfVEFTSykpIHtcbiAgICAgICAgICAgIHRyLmV4cGVyaWVuY2UudGJ0ID0gdGJ0LmR1cmF0aW9uO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc1BlcmZUeXBlU3VwcG9ydGVkKExBWU9VVF9TSElGVCkpIHtcbiAgICAgICAgICAgIHRyLmV4cGVyaWVuY2UuY2xzID0gY2xzLnNjb3JlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChmaWQgPiAwKSB7XG4gICAgICAgICAgICB0ci5leHBlcmllbmNlLmZpZCA9IGZpZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobG9uZ3Rhc2suY291bnQgPiAwKSB7XG4gICAgICAgICAgICB0ci5leHBlcmllbmNlLmxvbmd0YXNrID0ge1xuICAgICAgICAgICAgICBjb3VudDogbG9uZ3Rhc2suY291bnQsXG4gICAgICAgICAgICAgIHN1bTogbG9uZ3Rhc2suZHVyYXRpb24sXG4gICAgICAgICAgICAgIG1heDogbG9uZ3Rhc2subWF4XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMy5zZXRTZXNzaW9uKHRyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRyLm5hbWUgPT09IE5BTUVfVU5LTk9XTikge1xuICAgICAgICB0ci5uYW1lID0gc2x1Z2lmeVVybChjdXJyZW50VXJsKTtcbiAgICAgIH1cblxuICAgICAgY2FwdHVyZU5hdmlnYXRpb24odHIpO1xuXG4gICAgICBfdGhpczMuYWRqdXN0VHJhbnNhY3Rpb25UaW1lKHRyKTtcblxuICAgICAgdmFyIGJyZWFrZG93bk1ldHJpY3MgPSBfdGhpczMuX2NvbmZpZy5nZXQoJ2JyZWFrZG93bk1ldHJpY3MnKTtcblxuICAgICAgaWYgKGJyZWFrZG93bk1ldHJpY3MpIHtcbiAgICAgICAgdHIuY2FwdHVyZUJyZWFrZG93bigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29uZmlnQ29udGV4dCA9IF90aGlzMy5fY29uZmlnLmdldCgnY29udGV4dCcpO1xuXG4gICAgICBhZGRUcmFuc2FjdGlvbkNvbnRleHQodHIsIGNvbmZpZ0NvbnRleHQpO1xuXG4gICAgICBfdGhpczMuX2NvbmZpZy5ldmVudHMuc2VuZChUUkFOU0FDVElPTl9FTkQsIFt0cl0pO1xuXG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICBfdGhpczMuX2xvZ2dlci5kZWJ1ZyhcImVuZCB0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiLCBcIiArIHRyLnR5cGUgKyBcIilcIiwgdHIpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIF90aGlzMy5fbG9nZ2VyLmRlYnVnKFwiZXJyb3IgZW5kaW5nIHRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpXCIsIGVycik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLnNldFNlc3Npb24gPSBmdW5jdGlvbiBzZXRTZXNzaW9uKHRyKSB7XG4gICAgdmFyIHNlc3Npb24gPSB0aGlzLl9jb25maWcuZ2V0KCdzZXNzaW9uJyk7XG5cbiAgICBpZiAoc2Vzc2lvbikge1xuICAgICAgaWYgKHR5cGVvZiBzZXNzaW9uID09ICdib29sZWFuJykge1xuICAgICAgICB0ci5zZXNzaW9uID0ge1xuICAgICAgICAgIGlkOiBnZW5lcmF0ZVJhbmRvbUlkKDE2KSxcbiAgICAgICAgICBzZXF1ZW5jZTogMVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNlc3Npb24udGltZXN0YW1wICYmIERhdGUubm93KCkgLSBzZXNzaW9uLnRpbWVzdGFtcCA+IFNFU1NJT05fVElNRU9VVCkge1xuICAgICAgICAgIHRyLnNlc3Npb24gPSB7XG4gICAgICAgICAgICBpZDogZ2VuZXJhdGVSYW5kb21JZCgxNiksXG4gICAgICAgICAgICBzZXF1ZW5jZTogMVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHIuc2Vzc2lvbiA9IHtcbiAgICAgICAgICAgIGlkOiBzZXNzaW9uLmlkLFxuICAgICAgICAgICAgc2VxdWVuY2U6IHNlc3Npb24uc2VxdWVuY2UgPyBzZXNzaW9uLnNlcXVlbmNlICsgMSA6IDFcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBzZXNzaW9uQ29uZmlnID0ge1xuICAgICAgICBzZXNzaW9uOiB7XG4gICAgICAgICAgaWQ6IHRyLnNlc3Npb24uaWQsXG4gICAgICAgICAgc2VxdWVuY2U6IHRyLnNlc3Npb24uc2VxdWVuY2UsXG4gICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX2NvbmZpZy5zZXRDb25maWcoc2Vzc2lvbkNvbmZpZyk7XG5cbiAgICAgIHRoaXMuX2NvbmZpZy5zZXRMb2NhbENvbmZpZyhzZXNzaW9uQ29uZmlnLCB0cnVlKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmFkanVzdFRyYW5zYWN0aW9uVGltZSA9IGZ1bmN0aW9uIGFkanVzdFRyYW5zYWN0aW9uVGltZSh0cmFuc2FjdGlvbikge1xuICAgIHZhciBzcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zO1xuICAgIHZhciBlYXJsaWVzdFNwYW4gPSBnZXRFYXJsaWVzdFNwYW4oc3BhbnMpO1xuXG4gICAgaWYgKGVhcmxpZXN0U3BhbiAmJiBlYXJsaWVzdFNwYW4uX3N0YXJ0IDwgdHJhbnNhY3Rpb24uX3N0YXJ0KSB7XG4gICAgICB0cmFuc2FjdGlvbi5fc3RhcnQgPSBlYXJsaWVzdFNwYW4uX3N0YXJ0O1xuICAgIH1cblxuICAgIHZhciBsYXRlc3RTcGFuID0gZ2V0TGF0ZXN0Tm9uWEhSU3BhbihzcGFucykgfHwge307XG4gICAgdmFyIGxhdGVzdFNwYW5FbmQgPSBsYXRlc3RTcGFuLl9lbmQgfHwgMDtcblxuICAgIGlmICh0cmFuc2FjdGlvbi50eXBlID09PSBQQUdFX0xPQUQpIHtcbiAgICAgIHZhciB0cmFuc2FjdGlvbkVuZFdpdGhvdXREZWxheSA9IHRyYW5zYWN0aW9uLl9lbmQgLSBQQUdFX0xPQURfREVMQVk7XG4gICAgICB2YXIgbGNwID0gbWV0cmljcy5sY3AgfHwgMDtcbiAgICAgIHZhciBsYXRlc3RYSFJTcGFuID0gZ2V0TGF0ZXN0WEhSU3BhbihzcGFucykgfHwge307XG4gICAgICB2YXIgbGF0ZXN0WEhSU3BhbkVuZCA9IGxhdGVzdFhIUlNwYW4uX2VuZCB8fCAwO1xuICAgICAgdHJhbnNhY3Rpb24uX2VuZCA9IE1hdGgubWF4KGxhdGVzdFNwYW5FbmQsIGxhdGVzdFhIUlNwYW5FbmQsIGxjcCwgdHJhbnNhY3Rpb25FbmRXaXRob3V0RGVsYXkpO1xuICAgIH0gZWxzZSBpZiAobGF0ZXN0U3BhbkVuZCA+IHRyYW5zYWN0aW9uLl9lbmQpIHtcbiAgICAgIHRyYW5zYWN0aW9uLl9lbmQgPSBsYXRlc3RTcGFuRW5kO1xuICAgIH1cblxuICAgIHRoaXMudHJ1bmNhdGVTcGFucyhzcGFucywgdHJhbnNhY3Rpb24uX2VuZCk7XG4gIH07XG5cbiAgX3Byb3RvLnRydW5jYXRlU3BhbnMgPSBmdW5jdGlvbiB0cnVuY2F0ZVNwYW5zKHNwYW5zLCB0cmFuc2FjdGlvbkVuZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzcGFuID0gc3BhbnNbaV07XG5cbiAgICAgIGlmIChzcGFuLl9lbmQgPiB0cmFuc2FjdGlvbkVuZCkge1xuICAgICAgICBzcGFuLl9lbmQgPSB0cmFuc2FjdGlvbkVuZDtcbiAgICAgICAgc3Bhbi50eXBlICs9IFRSVU5DQVRFRF9UWVBFO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Bhbi5fc3RhcnQgPiB0cmFuc2FjdGlvbkVuZCkge1xuICAgICAgICBzcGFuLl9zdGFydCA9IHRyYW5zYWN0aW9uRW5kO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uc2hvdWxkSWdub3JlVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBzaG91bGRJZ25vcmVUcmFuc2FjdGlvbih0cmFuc2FjdGlvbk5hbWUpIHtcbiAgICB2YXIgaWdub3JlTGlzdCA9IHRoaXMuX2NvbmZpZy5nZXQoJ2lnbm9yZVRyYW5zYWN0aW9ucycpO1xuXG4gICAgaWYgKGlnbm9yZUxpc3QgJiYgaWdub3JlTGlzdC5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaWdub3JlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGlnbm9yZUxpc3RbaV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50LnRlc3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC50ZXN0KHRyYW5zYWN0aW9uTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50ID09PSB0cmFuc2FjdGlvbk5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBfcHJvdG8uc3RhcnRTcGFuID0gZnVuY3Rpb24gc3RhcnRTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgdHIgPSB0aGlzLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuXG4gICAgaWYgKCF0cikge1xuICAgICAgdHIgPSB0aGlzLmNyZWF0ZUN1cnJlbnRUcmFuc2FjdGlvbih1bmRlZmluZWQsIFRFTVBPUkFSWV9UWVBFLCB0aGlzLmNyZWF0ZU9wdGlvbnMoe1xuICAgICAgICBjYW5SZXVzZTogdHJ1ZSxcbiAgICAgICAgbWFuYWdlZDogdHJ1ZVxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIHZhciBzcGFuID0gdHIuc3RhcnRTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpO1xuXG4gICAgaWYgKF9fREVWX18pIHtcbiAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhcInN0YXJ0U3BhbihcIiArIG5hbWUgKyBcIiwgXCIgKyBzcGFuLnR5cGUgKyBcIilcIiwgXCJvbiB0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiKVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3BhbjtcbiAgfTtcblxuICBfcHJvdG8uZW5kU3BhbiA9IGZ1bmN0aW9uIGVuZFNwYW4oc3BhbiwgY29udGV4dCkge1xuICAgIGlmICghc3Bhbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICB2YXIgdHIgPSB0aGlzLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuICAgICAgdHIgJiYgdGhpcy5fbG9nZ2VyLmRlYnVnKFwiZW5kU3BhbihcIiArIHNwYW4ubmFtZSArIFwiLCBcIiArIHNwYW4udHlwZSArIFwiKVwiLCBcIm9uIHRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpXCIpO1xuICAgIH1cblxuICAgIHNwYW4uZW5kKG51bGwsIGNvbnRleHQpO1xuICB9O1xuXG4gIHJldHVybiBUcmFuc2FjdGlvblNlcnZpY2U7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uU2VydmljZTsiLCJmdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuaW1wb3J0IFNwYW4gZnJvbSAnLi9zcGFuJztcbmltcG9ydCBTcGFuQmFzZSBmcm9tICcuL3NwYW4tYmFzZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbUlkLCBtZXJnZSwgbm93LCBnZXRUaW1lLCBleHRlbmQsIHJlbW92ZUludmFsaWRDaGFycyB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBSRVVTQUJJTElUWV9USFJFU0hPTEQsIFRSVU5DQVRFRF9UWVBFIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBjYXB0dXJlQnJlYWtkb3duIGFzIF9jYXB0dXJlQnJlYWtkb3duIH0gZnJvbSAnLi9icmVha2Rvd24nO1xuXG52YXIgVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiAoX1NwYW5CYXNlKSB7XG4gIF9pbmhlcml0c0xvb3NlKFRyYW5zYWN0aW9uLCBfU3BhbkJhc2UpO1xuXG4gIGZ1bmN0aW9uIFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IF9TcGFuQmFzZS5jYWxsKHRoaXMsIG5hbWUsIHR5cGUsIG9wdGlvbnMpIHx8IHRoaXM7XG4gICAgX3RoaXMudHJhY2VJZCA9IGdlbmVyYXRlUmFuZG9tSWQoKTtcbiAgICBfdGhpcy5tYXJrcyA9IHVuZGVmaW5lZDtcbiAgICBfdGhpcy5zcGFucyA9IFtdO1xuICAgIF90aGlzLl9hY3RpdmVTcGFucyA9IHt9O1xuICAgIF90aGlzLl9hY3RpdmVUYXNrcyA9IG5ldyBTZXQoKTtcbiAgICBfdGhpcy5ibG9ja2VkID0gZmFsc2U7XG4gICAgX3RoaXMuY2FwdHVyZVRpbWluZ3MgPSBmYWxzZTtcbiAgICBfdGhpcy5icmVha2Rvd25UaW1pbmdzID0gW107XG4gICAgX3RoaXMuc2FtcGxlUmF0ZSA9IF90aGlzLm9wdGlvbnMudHJhbnNhY3Rpb25TYW1wbGVSYXRlO1xuICAgIF90aGlzLnNhbXBsZWQgPSBNYXRoLnJhbmRvbSgpIDw9IF90aGlzLnNhbXBsZVJhdGU7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFRyYW5zYWN0aW9uLnByb3RvdHlwZTtcblxuICBfcHJvdG8uYWRkTWFya3MgPSBmdW5jdGlvbiBhZGRNYXJrcyhvYmopIHtcbiAgICB0aGlzLm1hcmtzID0gbWVyZ2UodGhpcy5tYXJrcyB8fCB7fSwgb2JqKTtcbiAgfTtcblxuICBfcHJvdG8ubWFyayA9IGZ1bmN0aW9uIG1hcmsoa2V5KSB7XG4gICAgdmFyIHNrZXkgPSByZW1vdmVJbnZhbGlkQ2hhcnMoa2V5KTtcblxuICAgIHZhciBtYXJrVGltZSA9IG5vdygpIC0gdGhpcy5fc3RhcnQ7XG5cbiAgICB2YXIgY3VzdG9tID0ge307XG4gICAgY3VzdG9tW3NrZXldID0gbWFya1RpbWU7XG4gICAgdGhpcy5hZGRNYXJrcyh7XG4gICAgICBjdXN0b206IGN1c3RvbVxuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5jYW5SZXVzZSA9IGZ1bmN0aW9uIGNhblJldXNlKCkge1xuICAgIHZhciB0aHJlc2hvbGQgPSB0aGlzLm9wdGlvbnMucmV1c2VUaHJlc2hvbGQgfHwgUkVVU0FCSUxJVFlfVEhSRVNIT0xEO1xuICAgIHJldHVybiAhIXRoaXMub3B0aW9ucy5jYW5SZXVzZSAmJiAhdGhpcy5lbmRlZCAmJiBub3coKSAtIHRoaXMuX3N0YXJ0IDwgdGhyZXNob2xkO1xuICB9O1xuXG4gIF9wcm90by5yZWRlZmluZSA9IGZ1bmN0aW9uIHJlZGVmaW5lKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSkge1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zLnJldXNlVGhyZXNob2xkID0gb3B0aW9ucy5yZXVzZVRocmVzaG9sZDtcbiAgICAgIGV4dGVuZCh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uc3RhcnRTcGFuID0gZnVuY3Rpb24gc3RhcnRTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIGlmICh0aGlzLmVuZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG9wdHMgPSBleHRlbmQoe30sIG9wdGlvbnMpO1xuXG4gICAgb3B0cy5vbkVuZCA9IGZ1bmN0aW9uICh0cmMpIHtcbiAgICAgIF90aGlzMi5fb25TcGFuRW5kKHRyYyk7XG4gICAgfTtcblxuICAgIG9wdHMudHJhY2VJZCA9IHRoaXMudHJhY2VJZDtcbiAgICBvcHRzLnNhbXBsZWQgPSB0aGlzLnNhbXBsZWQ7XG4gICAgb3B0cy5zYW1wbGVSYXRlID0gdGhpcy5zYW1wbGVSYXRlO1xuXG4gICAgaWYgKCFvcHRzLnBhcmVudElkKSB7XG4gICAgICBvcHRzLnBhcmVudElkID0gdGhpcy5pZDtcbiAgICB9XG5cbiAgICB2YXIgc3BhbiA9IG5ldyBTcGFuKG5hbWUsIHR5cGUsIG9wdHMpO1xuICAgIHRoaXMuX2FjdGl2ZVNwYW5zW3NwYW4uaWRdID0gc3BhbjtcblxuICAgIGlmIChvcHRzLmJsb2NraW5nKSB7XG4gICAgICB0aGlzLmFkZFRhc2soc3Bhbi5pZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwYW47XG4gIH07XG5cbiAgX3Byb3RvLmlzRmluaXNoZWQgPSBmdW5jdGlvbiBpc0ZpbmlzaGVkKCkge1xuICAgIHJldHVybiAhdGhpcy5ibG9ja2VkICYmIHRoaXMuX2FjdGl2ZVRhc2tzLnNpemUgPT09IDA7XG4gIH07XG5cbiAgX3Byb3RvLmRldGVjdEZpbmlzaCA9IGZ1bmN0aW9uIGRldGVjdEZpbmlzaCgpIHtcbiAgICBpZiAodGhpcy5pc0ZpbmlzaGVkKCkpIHRoaXMuZW5kKCk7XG4gIH07XG5cbiAgX3Byb3RvLmVuZCA9IGZ1bmN0aW9uIGVuZChlbmRUaW1lKSB7XG4gICAgaWYgKHRoaXMuZW5kZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmVuZGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9lbmQgPSBnZXRUaW1lKGVuZFRpbWUpO1xuXG4gICAgZm9yICh2YXIgc2lkIGluIHRoaXMuX2FjdGl2ZVNwYW5zKSB7XG4gICAgICB2YXIgc3BhbiA9IHRoaXMuX2FjdGl2ZVNwYW5zW3NpZF07XG4gICAgICBzcGFuLnR5cGUgPSBzcGFuLnR5cGUgKyBUUlVOQ0FURURfVFlQRTtcbiAgICAgIHNwYW4uZW5kKGVuZFRpbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2FsbE9uRW5kKCk7XG4gIH07XG5cbiAgX3Byb3RvLmNhcHR1cmVCcmVha2Rvd24gPSBmdW5jdGlvbiBjYXB0dXJlQnJlYWtkb3duKCkge1xuICAgIHRoaXMuYnJlYWtkb3duVGltaW5ncyA9IF9jYXB0dXJlQnJlYWtkb3duKHRoaXMpO1xuICB9O1xuXG4gIF9wcm90by5ibG9jayA9IGZ1bmN0aW9uIGJsb2NrKGZsYWcpIHtcbiAgICB0aGlzLmJsb2NrZWQgPSBmbGFnO1xuXG4gICAgaWYgKCF0aGlzLmJsb2NrZWQpIHtcbiAgICAgIHRoaXMuZGV0ZWN0RmluaXNoKCk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5hZGRUYXNrID0gZnVuY3Rpb24gYWRkVGFzayh0YXNrSWQpIHtcbiAgICBpZiAoIXRhc2tJZCkge1xuICAgICAgdGFza0lkID0gJ3Rhc2stJyArIGdlbmVyYXRlUmFuZG9tSWQoMTYpO1xuICAgIH1cblxuICAgIHRoaXMuX2FjdGl2ZVRhc2tzLmFkZCh0YXNrSWQpO1xuXG4gICAgcmV0dXJuIHRhc2tJZDtcbiAgfTtcblxuICBfcHJvdG8ucmVtb3ZlVGFzayA9IGZ1bmN0aW9uIHJlbW92ZVRhc2sodGFza0lkKSB7XG4gICAgdmFyIGRlbGV0ZWQgPSB0aGlzLl9hY3RpdmVUYXNrcy5kZWxldGUodGFza0lkKTtcblxuICAgIGRlbGV0ZWQgJiYgdGhpcy5kZXRlY3RGaW5pc2goKTtcbiAgfTtcblxuICBfcHJvdG8ucmVzZXRGaWVsZHMgPSBmdW5jdGlvbiByZXNldEZpZWxkcygpIHtcbiAgICB0aGlzLnNwYW5zID0gW107XG4gICAgdGhpcy5zYW1wbGVSYXRlID0gMDtcbiAgfTtcblxuICBfcHJvdG8uX29uU3BhbkVuZCA9IGZ1bmN0aW9uIF9vblNwYW5FbmQoc3Bhbikge1xuICAgIHRoaXMuc3BhbnMucHVzaChzcGFuKTtcbiAgICBkZWxldGUgdGhpcy5fYWN0aXZlU3BhbnNbc3Bhbi5pZF07XG4gICAgdGhpcy5yZW1vdmVUYXNrKHNwYW4uaWQpO1xuICB9O1xuXG4gIF9wcm90by5pc01hbmFnZWQgPSBmdW5jdGlvbiBpc01hbmFnZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5vcHRpb25zLm1hbmFnZWQ7XG4gIH07XG5cbiAgcmV0dXJuIFRyYW5zYWN0aW9uO1xufShTcGFuQmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uOyIsInZhciBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJztcblxudmFyIHN0YXRlID0ge1xuICBib290c3RyYXBUaW1lOiBudWxsLFxuICBsYXN0SGlkZGVuU3RhcnQ6IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSXG59O1xuZXhwb3J0IHsgX19ERVZfXywgc3RhdGUgfTsiLCIvKipcbiAqIE1JVCBMaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3LXByZXNlbnQsIEVsYXN0aWNzZWFyY2ggQlZcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqL1xuXG5pbXBvcnQge1xuICBnZXRJbnN0cnVtZW50YXRpb25GbGFncyxcbiAgUEFHRV9MT0FEX0RFTEFZLFxuICBQQUdFX0xPQUQsXG4gIEVSUk9SLFxuICBDT05GSUdfU0VSVklDRSxcbiAgTE9HR0lOR19TRVJWSUNFLFxuICBUUkFOU0FDVElPTl9TRVJWSUNFLFxuICBQRVJGT1JNQU5DRV9NT05JVE9SSU5HLFxuICBFUlJPUl9MT0dHSU5HLFxuICBBUE1fU0VSVkVSLFxuICBFVkVOVF9UQVJHRVQsXG4gIENMSUNLLFxuICBvYnNlcnZlUGFnZVZpc2liaWxpdHksXG4gIG9ic2VydmVQYWdlQ2xpY2tzXG59IGZyb20gJ0BlbGFzdGljL2FwbS1ydW0tY29yZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBtQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHNlcnZpY2VGYWN0b3J5LCBkaXNhYmxlKSB7XG4gICAgdGhpcy5fZGlzYWJsZSA9IGRpc2FibGVcbiAgICB0aGlzLnNlcnZpY2VGYWN0b3J5ID0gc2VydmljZUZhY3RvcnlcbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlXG4gIH1cblxuICBpc0VuYWJsZWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLl9kaXNhYmxlXG4gIH1cblxuICBpc0FjdGl2ZSgpIHtcbiAgICBjb25zdCBjb25maWdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKENPTkZJR19TRVJWSUNFKVxuICAgIHJldHVybiB0aGlzLmlzRW5hYmxlZCgpICYmIHRoaXMuX2luaXRpYWxpemVkICYmIGNvbmZpZ1NlcnZpY2UuZ2V0KCdhY3RpdmUnKVxuICB9XG5cbiAgaW5pdChjb25maWcpIHtcbiAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSAmJiAhdGhpcy5faW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZVxuICAgICAgY29uc3QgW1xuICAgICAgICBjb25maWdTZXJ2aWNlLFxuICAgICAgICBsb2dnaW5nU2VydmljZSxcbiAgICAgICAgdHJhbnNhY3Rpb25TZXJ2aWNlXG4gICAgICBdID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFtcbiAgICAgICAgQ09ORklHX1NFUlZJQ0UsXG4gICAgICAgIExPR0dJTkdfU0VSVklDRSxcbiAgICAgICAgVFJBTlNBQ1RJT05fU0VSVklDRVxuICAgICAgXSlcbiAgICAgIC8qKlxuICAgICAgICogU2V0IEFnZW50IHZlcnNpb24gdG8gYmUgc2VudCBhcyBwYXJ0IG9mIG1ldGFkYXRhIHRvIHRoZSBBUE0gU2VydmVyXG4gICAgICAgKi9cbiAgICAgIGNvbmZpZ1NlcnZpY2Uuc2V0VmVyc2lvbignNS4xNC4wJylcbiAgICAgIHRoaXMuY29uZmlnKGNvbmZpZylcbiAgICAgIC8qKlxuICAgICAgICogU2V0IGxldmVsIGhlcmUgdG8gYWNjb3VudCBmb3IgYm90aCBhY3RpdmUgYW5kIGluYWN0aXZlIGNhc2VzXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGxvZ0xldmVsID0gY29uZmlnU2VydmljZS5nZXQoJ2xvZ0xldmVsJylcbiAgICAgIGxvZ2dpbmdTZXJ2aWNlLnNldExldmVsKGxvZ0xldmVsKVxuICAgICAgLyoqXG4gICAgICAgKiBEZWFjdGl2ZSBhZ2VudCB3aGVuIHRoZSBhY3RpdmUgY29uZmlnIGZsYWcgaXMgc2V0IHRvIGZhbHNlXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGlzQ29uZmlnQWN0aXZlID0gY29uZmlnU2VydmljZS5nZXQoJ2FjdGl2ZScpXG4gICAgICBpZiAoaXNDb25maWdBY3RpdmUpIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlRmFjdG9yeS5pbml0KClcblxuICAgICAgICBjb25zdCBmbGFncyA9IGdldEluc3RydW1lbnRhdGlvbkZsYWdzKFxuICAgICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0KCdpbnN0cnVtZW50JyksXG4gICAgICAgICAgY29uZmlnU2VydmljZS5nZXQoJ2Rpc2FibGVJbnN0cnVtZW50YXRpb25zJylcbiAgICAgICAgKVxuXG4gICAgICAgIGNvbnN0IHBlcmZvcm1hbmNlTW9uaXRvcmluZyA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShcbiAgICAgICAgICBQRVJGT1JNQU5DRV9NT05JVE9SSU5HXG4gICAgICAgIClcbiAgICAgICAgcGVyZm9ybWFuY2VNb25pdG9yaW5nLmluaXQoZmxhZ3MpXG5cbiAgICAgICAgaWYgKGZsYWdzW0VSUk9SXSkge1xuICAgICAgICAgIGNvbnN0IGVycm9yTG9nZ2luZyA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShFUlJPUl9MT0dHSU5HKVxuICAgICAgICAgIGVycm9yTG9nZ2luZy5yZWdpc3Rlckxpc3RlbmVycygpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnU2VydmljZS5nZXQoJ3Nlc3Npb24nKSkge1xuICAgICAgICAgIGxldCBsb2NhbENvbmZpZyA9IGNvbmZpZ1NlcnZpY2UuZ2V0TG9jYWxDb25maWcoKVxuICAgICAgICAgIGlmIChsb2NhbENvbmZpZyAmJiBsb2NhbENvbmZpZy5zZXNzaW9uKSB7XG4gICAgICAgICAgICBjb25maWdTZXJ2aWNlLnNldENvbmZpZyh7XG4gICAgICAgICAgICAgIHNlc3Npb246IGxvY2FsQ29uZmlnLnNlc3Npb25cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VuZFBhZ2VMb2FkID0gKCkgPT5cbiAgICAgICAgICBmbGFnc1tQQUdFX0xPQURdICYmIHRoaXMuX3NlbmRQYWdlTG9hZE1ldHJpY3MoKVxuXG4gICAgICAgIGlmIChjb25maWdTZXJ2aWNlLmdldCgnY2VudHJhbENvbmZpZycpKSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogV2FpdGluZyBmb3IgdGhlIHJlbW90ZSBjb25maWcgYmVmb3JlIHNlbmRpbmcgdGhlIHBhZ2UgbG9hZCB0cmFuc2FjdGlvblxuICAgICAgICAgICAqL1xuICAgICAgICAgIHRoaXMuZmV0Y2hDZW50cmFsQ29uZmlnKCkudGhlbihzZW5kUGFnZUxvYWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VuZFBhZ2VMb2FkKClcbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVQYWdlVmlzaWJpbGl0eShjb25maWdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpXG4gICAgICAgIGlmIChmbGFnc1tFVkVOVF9UQVJHRVRdICYmIGZsYWdzW0NMSUNLXSkge1xuICAgICAgICAgIG9ic2VydmVQYWdlQ2xpY2tzKHRyYW5zYWN0aW9uU2VydmljZSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGlzYWJsZSA9IHRydWVcbiAgICAgICAgbG9nZ2luZ1NlcnZpY2Uud2FybignUlVNIGFnZW50IGlzIGluYWN0aXZlJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBgZmV0Y2hDZW50cmFsQ29uZmlnYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYWx3YXlzIHJlc29sdmVcbiAgICogaWYgdGhlIGludGVybmFsIGNvbmZpZyBmZXRjaCBmYWlscyB0aGUgdGhlIHByb21pc2UgcmVzb2x2ZXMgdG8gYHVuZGVmaW5lZGAgb3RoZXJ3aXNlXG4gICAqIGl0IHJlc29sdmVzIHRvIHRoZSBmZXRjaGVkIGNvbmZpZy5cbiAgICovXG4gIGZldGNoQ2VudHJhbENvbmZpZygpIHtcbiAgICBjb25zdCBbXG4gICAgICBhcG1TZXJ2ZXIsXG4gICAgICBsb2dnaW5nU2VydmljZSxcbiAgICAgIGNvbmZpZ1NlcnZpY2VcbiAgICBdID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFtcbiAgICAgIEFQTV9TRVJWRVIsXG4gICAgICBMT0dHSU5HX1NFUlZJQ0UsXG4gICAgICBDT05GSUdfU0VSVklDRVxuICAgIF0pXG5cbiAgICByZXR1cm4gYXBtU2VydmVyXG4gICAgICAuZmV0Y2hDb25maWcoXG4gICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0KCdzZXJ2aWNlTmFtZScpLFxuICAgICAgICBjb25maWdTZXJ2aWNlLmdldCgnZW52aXJvbm1lbnQnKVxuICAgICAgKVxuICAgICAgLnRoZW4oY29uZmlnID0+IHtcbiAgICAgICAgdmFyIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSA9IGNvbmZpZ1sndHJhbnNhY3Rpb25fc2FtcGxlX3JhdGUnXVxuICAgICAgICBpZiAodHJhbnNhY3Rpb25TYW1wbGVSYXRlKSB7XG4gICAgICAgICAgdHJhbnNhY3Rpb25TYW1wbGVSYXRlID0gTnVtYmVyKHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSlcbiAgICAgICAgICBjb25zdCBjb25maWcgPSB7IHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSB9XG4gICAgICAgICAgY29uc3QgeyBpbnZhbGlkIH0gPSBjb25maWdTZXJ2aWNlLnZhbGlkYXRlKGNvbmZpZylcbiAgICAgICAgICBpZiAoaW52YWxpZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2Uuc2V0Q29uZmlnKGNvbmZpZylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeyBrZXksIHZhbHVlLCBhbGxvd2VkIH0gPSBpbnZhbGlkWzBdXG4gICAgICAgICAgICBsb2dnaW5nU2VydmljZS53YXJuKFxuICAgICAgICAgICAgICBgaW52YWxpZCB2YWx1ZSBcIiR7dmFsdWV9XCIgZm9yICR7a2V5fS4gQWxsb3dlZDogJHthbGxvd2VkfS5gXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25maWdcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBsb2dnaW5nU2VydmljZS53YXJuKCdmYWlsZWQgZmV0Y2hpbmcgY29uZmlnOicsIGVycm9yKVxuICAgICAgfSlcbiAgfVxuXG4gIF9zZW5kUGFnZUxvYWRNZXRyaWNzKCkge1xuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIHRyYW5zYWN0aW9uIGlzIHNldCBpbiB0cmFuc2FjdGlvbiBzZXJ2aWNlIHRvXG4gICAgICogYXZvaWQgZHVwbGljYXRpbmcgdGhlIGxvZ2ljIGF0IG11bHRpcGxlIHBsYWNlc1xuICAgICAqL1xuICAgIGNvbnN0IHRyID0gdGhpcy5zdGFydFRyYW5zYWN0aW9uKHVuZGVmaW5lZCwgUEFHRV9MT0FELCB7XG4gICAgICBtYW5hZ2VkOiB0cnVlLFxuICAgICAgY2FuUmV1c2U6IHRydWVcbiAgICB9KVxuXG4gICAgaWYgKCF0cikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdHIuYWRkVGFzayhQQUdFX0xPQUQpXG4gICAgY29uc3Qgc2VuZFBhZ2VMb2FkTWV0cmljcyA9ICgpID0+IHtcbiAgICAgIC8vIFRoZSByZWFzb25zIG9mIHRoaXMgdGltZW91dCBhcmU6XG4gICAgICAvLyAxLiB0byBtYWtlIHN1cmUgUGVyZm9ybWFuY2VUaW1pbmcubG9hZEV2ZW50RW5kIGhhcyBhIHZhbHVlLlxuICAgICAgLy8gMi4gdG8gbWFrZSBzdXJlIHRoZSBhZ2VudCBpbnRlcmNlcHRzIGFsbCB0aGUgTENQIGVudHJpZXMgdHJpZ2dlcmVkIGJ5IHRoZSBicm93c2VyIChhZGRpbmcgYSBkZWxheSBpbiB0aGUgdGltZW91dCkuXG4gICAgICAvLyBUaGUgYnJvd3NlciBtaWdodCBuZWVkIG1vcmUgdGltZSBhZnRlciB0aGUgcGFnZWxvYWQgZXZlbnQgdG8gcmVuZGVyIG90aGVyIGVsZW1lbnRzIChlLmcuIGltYWdlcykuXG4gICAgICAvLyBUaGF0J3MgaW1wb3J0YW50IGJlY2F1c2UgYSBMQ1AgaXMgb25seSB0cmlnZ2VyZWQgd2hlbiB0aGUgcmVsYXRlZCBlbGVtZW50IGlzIGNvbXBsZXRlbHkgcmVuZGVyZWQuXG4gICAgICAvLyBodHRwczovL3czYy5naXRodWIuaW8vbGFyZ2VzdC1jb250ZW50ZnVsLXBhaW50LyNzZWMtYWRkLWxjcC1lbnRyeVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0ci5yZW1vdmVUYXNrKFBBR0VfTE9BRCksIFBBR0VfTE9BRF9ERUxBWSlcbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgc2VuZFBhZ2VMb2FkTWV0cmljcygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgc2VuZFBhZ2VMb2FkTWV0cmljcylcbiAgICB9XG4gIH1cblxuICBvYnNlcnZlKG5hbWUsIGZuKSB7XG4gICAgY29uc3QgY29uZmlnU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSlcbiAgICBjb25maWdTZXJ2aWNlLmV2ZW50cy5vYnNlcnZlKG5hbWUsIGZuKVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIHJlcXVpcmVkIGNvbmZpZyBrZXlzIGFyZSBpbnZhbGlkLCB0aGUgYWdlbnQgaXMgZGVhY3RpdmF0ZWQgd2l0aFxuICAgKiBsb2dnaW5nIGVycm9yIHRvIHRoZSBjb25zb2xlXG4gICAqXG4gICAqIHZhbGlkYXRpb24gZXJyb3IgZm9ybWF0XG4gICAqIHtcbiAgICogIG1pc3Npbmc6IFsgJ2tleTEnLCAna2V5MiddLFxuICAgKiAgaW52YWxpZDogW3tcbiAgICogICAga2V5OiAnYScsXG4gICAqICAgIHZhbHVlOiAnYWJjZCcsXG4gICAqICAgIGFsbG93ZWQ6ICdzdHJpbmcnXG4gICAqICB9XSxcbiAgICogIHVua25vd246IFsna2V5MycsICdrZXk0J11cbiAgICogfVxuICAgKi9cbiAgY29uZmlnKGNvbmZpZykge1xuICAgIGNvbnN0IFtjb25maWdTZXJ2aWNlLCBsb2dnaW5nU2VydmljZV0gPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoW1xuICAgICAgQ09ORklHX1NFUlZJQ0UsXG4gICAgICBMT0dHSU5HX1NFUlZJQ0VcbiAgICBdKVxuICAgIGNvbnN0IHsgbWlzc2luZywgaW52YWxpZCwgdW5rbm93biB9ID0gY29uZmlnU2VydmljZS52YWxpZGF0ZShjb25maWcpXG4gICAgaWYgKHVua25vd24ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICdVbmtub3duIGNvbmZpZyBvcHRpb25zIGFyZSBzcGVjaWZpZWQgZm9yIFJVTSBhZ2VudDogJyArXG4gICAgICAgIHVua25vd24uam9pbignLCAnKVxuICAgICAgbG9nZ2luZ1NlcnZpY2Uud2FybihtZXNzYWdlKVxuICAgIH1cblxuICAgIGlmIChtaXNzaW5nLmxlbmd0aCA9PT0gMCAmJiBpbnZhbGlkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uZmlnU2VydmljZS5zZXRDb25maWcoY29uZmlnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzZXBhcmF0b3IgPSAnLCAnXG4gICAgICBsZXQgbWVzc2FnZSA9IFwiUlVNIGFnZW50IGlzbid0IGNvcnJlY3RseSBjb25maWd1cmVkLiBcIlxuXG4gICAgICBpZiAobWlzc2luZy5sZW5ndGggPiAwKSB7XG4gICAgICAgIG1lc3NhZ2UgKz0gbWlzc2luZy5qb2luKHNlcGFyYXRvcikgKyAnIGlzIG1pc3NpbmcnXG4gICAgICAgIGlmIChpbnZhbGlkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBtZXNzYWdlICs9IHNlcGFyYXRvclxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGludmFsaWQuZm9yRWFjaCgoeyBrZXksIHZhbHVlLCBhbGxvd2VkIH0sIGluZGV4KSA9PiB7XG4gICAgICAgIG1lc3NhZ2UgKz1cbiAgICAgICAgICBgJHtrZXl9IFwiJHt2YWx1ZX1cIiBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMhIChhbGxvd2VkOiAke2FsbG93ZWR9KWAgK1xuICAgICAgICAgIChpbmRleCAhPT0gaW52YWxpZC5sZW5ndGggLSAxID8gc2VwYXJhdG9yIDogJycpXG4gICAgICB9KVxuICAgICAgbG9nZ2luZ1NlcnZpY2UuZXJyb3IobWVzc2FnZSlcbiAgICAgIGNvbmZpZ1NlcnZpY2Uuc2V0Q29uZmlnKHsgYWN0aXZlOiBmYWxzZSB9KVxuICAgIH1cbiAgfVxuXG4gIHNldFVzZXJDb250ZXh0KHVzZXJDb250ZXh0KSB7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgY29uZmlnU2VydmljZS5zZXRVc2VyQ29udGV4dCh1c2VyQ29udGV4dClcbiAgfVxuXG4gIHNldEN1c3RvbUNvbnRleHQoY3VzdG9tQ29udGV4dCkge1xuICAgIHZhciBjb25maWdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKENPTkZJR19TRVJWSUNFKVxuICAgIGNvbmZpZ1NlcnZpY2Uuc2V0Q3VzdG9tQ29udGV4dChjdXN0b21Db250ZXh0KVxuICB9XG5cbiAgYWRkTGFiZWxzKGxhYmVscykge1xuICAgIHZhciBjb25maWdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKENPTkZJR19TRVJWSUNFKVxuICAgIGNvbmZpZ1NlcnZpY2UuYWRkTGFiZWxzKGxhYmVscylcbiAgfVxuXG4gIC8vIFNob3VsZCBjYWxsIHRoaXMgbWV0aG9kIGJlZm9yZSAnbG9hZCcgZXZlbnQgb24gd2luZG93IGlzIGZpcmVkXG4gIHNldEluaXRpYWxQYWdlTG9hZE5hbWUobmFtZSkge1xuICAgIGNvbnN0IGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgY29uZmlnU2VydmljZS5zZXRDb25maWcoe1xuICAgICAgcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWU6IG5hbWVcbiAgICB9KVxuICB9XG5cbiAgc3RhcnRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgIHZhciB0cmFuc2FjdGlvblNlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoXG4gICAgICAgIFRSQU5TQUNUSU9OX1NFUlZJQ0VcbiAgICAgIClcbiAgICAgIHJldHVybiB0cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0U3BhbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgIHZhciB0cmFuc2FjdGlvblNlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoXG4gICAgICAgIFRSQU5TQUNUSU9OX1NFUlZJQ0VcbiAgICAgIClcbiAgICAgIHJldHVybiB0cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCkge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICB2YXIgdHJhbnNhY3Rpb25TZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFxuICAgICAgICBUUkFOU0FDVElPTl9TRVJWSUNFXG4gICAgICApXG4gICAgICByZXR1cm4gdHJhbnNhY3Rpb25TZXJ2aWNlLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpXG4gICAgfVxuICB9XG5cbiAgY2FwdHVyZUVycm9yKGVycm9yKSB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgIHZhciBlcnJvckxvZ2dpbmcgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoRVJST1JfTE9HR0lORylcbiAgICAgIHJldHVybiBlcnJvckxvZ2dpbmcubG9nRXJyb3IoZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgYWRkRmlsdGVyKGZuKSB7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgY29uZmlnU2VydmljZS5hZGRGaWx0ZXIoZm4pXG4gIH1cbn1cbiIsIi8qKlxuICogTUlUIExpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctcHJlc2VudCwgRWxhc3RpY3NlYXJjaCBCVlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG5cbmltcG9ydCB7XG4gIGNyZWF0ZVNlcnZpY2VGYWN0b3J5LFxuICBib290c3RyYXAsXG4gIGlzQnJvd3NlclxufSBmcm9tICdAZWxhc3RpYy9hcG0tcnVtLWNvcmUnXG5pbXBvcnQgQXBtQmFzZSBmcm9tICcuL2FwbS1iYXNlJ1xuXG4vKipcbiAqIFVzZSBhIHNpbmdsZSBpbnN0YW5jZSBvZiBBcG1CYXNlIGFjcm9zcyBhbGwgaW5zdGFuY2Ugb2YgdGhlIGFnZW50XG4gKiBpbmNsdWRpbmcgdGhlIGluc3RhbmNlcyB1c2VkIGluIGZyYW1ld29yayBzcGVjaWZpYyBpbnRlZ3JhdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0QXBtQmFzZSgpIHtcbiAgaWYgKGlzQnJvd3NlciAmJiB3aW5kb3cuZWxhc3RpY0FwbSkge1xuICAgIHJldHVybiB3aW5kb3cuZWxhc3RpY0FwbVxuICB9XG4gIGNvbnN0IGVuYWJsZWQgPSBib290c3RyYXAoKVxuICBjb25zdCBzZXJ2aWNlRmFjdG9yeSA9IGNyZWF0ZVNlcnZpY2VGYWN0b3J5KClcbiAgY29uc3QgYXBtQmFzZSA9IG5ldyBBcG1CYXNlKHNlcnZpY2VGYWN0b3J5LCAhZW5hYmxlZClcblxuICBpZiAoaXNCcm93c2VyKSB7XG4gICAgd2luZG93LmVsYXN0aWNBcG0gPSBhcG1CYXNlXG4gIH1cblxuICByZXR1cm4gYXBtQmFzZVxufVxuXG5jb25zdCBhcG1CYXNlID0gZ2V0QXBtQmFzZSgpXG5jb25zdCBpbml0ID0gYXBtQmFzZS5pbml0LmJpbmQoYXBtQmFzZSlcblxuZXhwb3J0IGRlZmF1bHQgaW5pdFxuZXhwb3J0IHsgaW5pdCwgYXBtQmFzZSwgQXBtQmFzZSwgYXBtQmFzZSBhcyBhcG0gfVxuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnZXJyb3Itc3RhY2stcGFyc2VyJywgWydzdGFja2ZyYW1lJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdzdGFja2ZyYW1lJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuRXJyb3JTdGFja1BhcnNlciA9IGZhY3Rvcnkocm9vdC5TdGFja0ZyYW1lKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIoU3RhY2tGcmFtZSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFAgPSAvKF58QClcXFMrXFw6XFxkKy87XG4gICAgdmFyIENIUk9NRV9JRV9TVEFDS19SRUdFWFAgPSAvXlxccyphdCAuKihcXFMrXFw6XFxkK3xcXChuYXRpdmVcXCkpL207XG4gICAgdmFyIFNBRkFSSV9OQVRJVkVfQ09ERV9SRUdFWFAgPSAvXihldmFsQCk/KFxcW25hdGl2ZSBjb2RlXFxdKT8kLztcblxuICAgIGZ1bmN0aW9uIF9tYXAoYXJyYXksIGZuLCB0aGlzQXJnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLm1hcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5Lm1hcChmbiwgdGhpc0FyZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gbmV3IEFycmF5KGFycmF5Lmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0W2ldID0gZm4uY2FsbCh0aGlzQXJnLCBhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2ZpbHRlcihhcnJheSwgZm4sIHRoaXNBcmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuZmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZuLCB0aGlzQXJnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZm4uY2FsbCh0aGlzQXJnLCBhcnJheVtpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goYXJyYXlbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfaW5kZXhPZihhcnJheSwgdGFyZ2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5pbmRleE9mKHRhcmdldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdpdmVuIGFuIEVycm9yIG9iamVjdCwgZXh0cmFjdCB0aGUgbW9zdCBpbmZvcm1hdGlvbiBmcm9tIGl0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBvYmplY3RcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IG9mIFN0YWNrRnJhbWVzXG4gICAgICAgICAqL1xuICAgICAgICBwYXJzZTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2UoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2t0cmFjZSAhPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGVycm9yWydvcGVyYSNzb3VyY2Vsb2MnXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhY2sgJiYgZXJyb3Iuc3RhY2subWF0Y2goQ0hST01FX0lFX1NUQUNLX1JFR0VYUCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVY4T3JJRShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VGRk9yU2FmYXJpKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcGFyc2UgZ2l2ZW4gRXJyb3Igb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gU2VwYXJhdGUgbGluZSBhbmQgY29sdW1uIG51bWJlcnMgZnJvbSBhIHN0cmluZyBvZiB0aGUgZm9ybTogKFVSSTpMaW5lOkNvbHVtbilcbiAgICAgICAgZXh0cmFjdExvY2F0aW9uOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRleHRyYWN0TG9jYXRpb24odXJsTGlrZSkge1xuICAgICAgICAgICAgLy8gRmFpbC1mYXN0IGJ1dCByZXR1cm4gbG9jYXRpb25zIGxpa2UgXCIobmF0aXZlKVwiXG4gICAgICAgICAgICBpZiAodXJsTGlrZS5pbmRleE9mKCc6JykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt1cmxMaWtlXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlZ0V4cCA9IC8oLis/KSg/OlxcOihcXGQrKSk/KD86XFw6KFxcZCspKT8kLztcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlZ0V4cC5leGVjKHVybExpa2UucmVwbGFjZSgvW1xcKFxcKV0vZywgJycpKTtcbiAgICAgICAgICAgIHJldHVybiBbcGFydHNbMV0sIHBhcnRzWzJdIHx8IHVuZGVmaW5lZCwgcGFydHNbM10gfHwgdW5kZWZpbmVkXTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZVY4T3JJRTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VWOE9ySUUoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IF9maWx0ZXIoZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gX21hcChmaWx0ZXJlZCwgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJyhldmFsICcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBldmFsIGluZm9ybWF0aW9uIHVudGlsIHdlIGltcGxlbWVudCBzdGFja3RyYWNlLmpzL3N0YWNrZnJhbWUjOFxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9ldmFsIGNvZGUvZywgJ2V2YWwnKS5yZXBsYWNlKC8oXFwoZXZhbCBhdCBbXlxcKCldKil8KFxcKVxcLC4qJCkvZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gbGluZS5yZXBsYWNlKC9eXFxzKy8sICcnKS5yZXBsYWNlKC9cXChldmFsIGNvZGUvZywgJygnKS5zcGxpdCgvXFxzKy8pLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24odG9rZW5zLnBvcCgpKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gdG9rZW5zLmpvaW4oJyAnKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gX2luZGV4T2YoWydldmFsJywgJzxhbm9ueW1vdXM+J10sIGxvY2F0aW9uUGFydHNbMF0pID4gLTEgPyB1bmRlZmluZWQgOiBsb2NhdGlvblBhcnRzWzBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKGZ1bmN0aW9uTmFtZSwgdW5kZWZpbmVkLCBmaWxlTmFtZSwgbG9jYXRpb25QYXJ0c1sxXSwgbG9jYXRpb25QYXJ0c1syXSwgbGluZSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZUZGT3JTYWZhcmk6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlRkZPclNhZmFyaShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gX2ZpbHRlcihlcnJvci5zdGFjay5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWxpbmUubWF0Y2goU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIF9tYXAoZmlsdGVyZWQsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGV2YWwgaW5mb3JtYXRpb24gdW50aWwgd2UgaW1wbGVtZW50IHN0YWNrdHJhY2UuanMvc3RhY2tmcmFtZSM4XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignID4gZXZhbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvIGxpbmUgKFxcZCspKD86ID4gZXZhbCBsaW5lIFxcZCspKiA+IGV2YWxcXDpcXGQrXFw6XFxkKy9nLCAnOiQxJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignQCcpID09PSAtMSAmJiBsaW5lLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIGV2YWwgZnJhbWVzIG9ubHkgaGF2ZSBmdW5jdGlvbiBuYW1lcyBhbmQgbm90aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZShsaW5lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gbGluZS5zcGxpdCgnQCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSB0b2tlbnMuam9pbignQCcpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uUGFydHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25QYXJ0c1syXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmEoZSkge1xuICAgICAgICAgICAgaWYgKCFlLnN0YWNrdHJhY2UgfHwgKGUubWVzc2FnZS5pbmRleE9mKCdcXG4nKSA+IC0xICYmXG4gICAgICAgICAgICAgICAgZS5tZXNzYWdlLnNwbGl0KCdcXG4nKS5sZW5ndGggPiBlLnN0YWNrdHJhY2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhOShlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWUuc3RhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhMTAoZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU9wZXJhOTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTkoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspL2k7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMiwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBsaW5lUkUuZXhlYyhsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBTdGFja0ZyYW1lKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBtYXRjaFsyXSwgbWF0Y2hbMV0sIHVuZGVmaW5lZCwgbGluZXNbaV0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTEwOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhMTAoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspKD86OiBJbiBmdW5jdGlvbiAoXFxTKykpPyQvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RhY2tGcmFtZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFszXSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tpXVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBPcGVyYSAxMC42NSsgRXJyb3Iuc3RhY2sgdmVyeSBzaW1pbGFyIHRvIEZGL1NhZmFyaVxuICAgICAgICBwYXJzZU9wZXJhMTE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmExMShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gX2ZpbHRlcihlcnJvci5zdGFjay5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsaW5lLm1hdGNoKEZJUkVGT1hfU0FGQVJJX1NUQUNLX1JFR0VYUCkgJiYgIWxpbmUubWF0Y2goL15FcnJvciBjcmVhdGVkIGF0Lyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIF9tYXAoZmlsdGVyZWQsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gbGluZS5zcGxpdCgnQCcpO1xuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24odG9rZW5zLnBvcCgpKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25DYWxsID0gKHRva2Vucy5zaGlmdCgpIHx8ICcnKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25DYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPGFub255bW91cyBmdW5jdGlvbig6IChcXHcrKSk/Pi8sICckMicpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwoW15cXCldKlxcKS9nLCAnJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzUmF3O1xuICAgICAgICAgICAgICAgIGlmIChmdW5jdGlvbkNhbGwubWF0Y2goL1xcKChbXlxcKV0qKVxcKS8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NSYXcgPSBmdW5jdGlvbkNhbGwucmVwbGFjZSgvXlteXFwoXStcXCgoW15cXCldKilcXCkkLywgJyQxJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gKGFyZ3NSYXcgPT09IHVuZGVmaW5lZCB8fCBhcmdzUmF3ID09PSAnW2FyZ3VtZW50cyBub3QgYXZhaWxhYmxlXScpID9cbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkIDogYXJnc1Jhdy5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZShcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICBhcmdzLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzBdLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICBsaW5lKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbn0pKTtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIFRoZSBGT1JNQVRfQklOQVJZIGZvcm1hdCByZXByZXNlbnRzIFNwYW5Db250ZXh0cyBpbiBhbiBvcGFxdWUgYmluYXJ5XG4gKiBjYXJyaWVyLlxuICpcbiAqIFRyYWNlci5pbmplY3QoKSB3aWxsIHNldCB0aGUgYnVmZmVyIGZpZWxkIHRvIGFuIEFycmF5LWxpa2UgKEFycmF5LFxuICogQXJyYXlCdWZmZXIsIG9yIFR5cGVkQnVmZmVyKSBvYmplY3QgY29udGFpbmluZyB0aGUgaW5qZWN0ZWQgYmluYXJ5IGRhdGEuXG4gKiBBbnkgdmFsaWQgT2JqZWN0IGNhbiBiZSB1c2VkIGFzIGxvbmcgYXMgdGhlIGJ1ZmZlciBmaWVsZCBvZiB0aGUgb2JqZWN0XG4gKiBjYW4gYmUgc2V0LlxuICpcbiAqIFRyYWNlci5leHRyYWN0KCkgd2lsbCBsb29rIGZvciBgY2Fycmllci5idWZmZXJgLCBhbmQgdGhhdCBmaWVsZCBpc1xuICogZXhwZWN0ZWQgdG8gYmUgYW4gQXJyYXktbGlrZSBvYmplY3QgKEFycmF5LCBBcnJheUJ1ZmZlciwgb3JcbiAqIFR5cGVkQnVmZmVyKS5cbiAqL1xuZXhwb3J0cy5GT1JNQVRfQklOQVJZID0gJ2JpbmFyeSc7XG4vKipcbiAqIFRoZSBGT1JNQVRfVEVYVF9NQVAgZm9ybWF0IHJlcHJlc2VudHMgU3BhbkNvbnRleHRzIHVzaW5nIGFcbiAqIHN0cmluZy0+c3RyaW5nIG1hcCAoYmFja2VkIGJ5IGEgSmF2YXNjcmlwdCBPYmplY3QpIGFzIGEgY2Fycmllci5cbiAqXG4gKiBOT1RFOiBVbmxpa2UgRk9STUFUX0hUVFBfSEVBREVSUywgRk9STUFUX1RFWFRfTUFQIHBsYWNlcyBubyByZXN0cmljdGlvbnNcbiAqIG9uIHRoZSBjaGFyYWN0ZXJzIHVzZWQgaW4gZWl0aGVyIHRoZSBrZXlzIG9yIHRoZSB2YWx1ZXMgb2YgdGhlIG1hcFxuICogZW50cmllcy5cbiAqXG4gKiBUaGUgRk9STUFUX1RFWFRfTUFQIGNhcnJpZXIgbWFwIG1heSBjb250YWluIHVucmVsYXRlZCBkYXRhIChlLmcuLFxuICogYXJiaXRyYXJ5IGdSUEMgbWV0YWRhdGEpOyBhcyBzdWNoLCB0aGUgVHJhY2VyIGltcGxlbWVudGF0aW9uIHNob3VsZCB1c2VcbiAqIGEgcHJlZml4IG9yIG90aGVyIGNvbnZlbnRpb24gdG8gZGlzdGluZ3Vpc2ggVHJhY2VyLXNwZWNpZmljIGtleTp2YWx1ZVxuICogcGFpcnMuXG4gKi9cbmV4cG9ydHMuRk9STUFUX1RFWFRfTUFQID0gJ3RleHRfbWFwJztcbi8qKlxuICogVGhlIEZPUk1BVF9IVFRQX0hFQURFUlMgZm9ybWF0IHJlcHJlc2VudHMgU3BhbkNvbnRleHRzIHVzaW5nIGFcbiAqIGNoYXJhY3Rlci1yZXN0cmljdGVkIHN0cmluZy0+c3RyaW5nIG1hcCAoYmFja2VkIGJ5IGEgSmF2YXNjcmlwdCBPYmplY3QpXG4gKiBhcyBhIGNhcnJpZXIuXG4gKlxuICogS2V5cyBhbmQgdmFsdWVzIGluIHRoZSBGT1JNQVRfSFRUUF9IRUFERVJTIGNhcnJpZXIgbXVzdCBiZSBzdWl0YWJsZSBmb3JcbiAqIHVzZSBhcyBIVFRQIGhlYWRlcnMgKHdpdGhvdXQgbW9kaWZpY2F0aW9uIG9yIGZ1cnRoZXIgZXNjYXBpbmcpLiBUaGF0IGlzLFxuICogdGhlIGtleXMgaGF2ZSBhIGdyZWF0bHkgcmVzdHJpY3RlZCBjaGFyYWN0ZXIgc2V0LCBjYXNpbmcgZm9yIHRoZSBrZXlzXG4gKiBtYXkgbm90IGJlIHByZXNlcnZlZCBieSB2YXJpb3VzIGludGVybWVkaWFyaWVzLCBhbmQgdGhlIHZhbHVlcyBzaG91bGQgYmVcbiAqIFVSTC1lc2NhcGVkLlxuICpcbiAqIFRoZSBGT1JNQVRfSFRUUF9IRUFERVJTIGNhcnJpZXIgbWFwIG1heSBjb250YWluIHVucmVsYXRlZCBkYXRhIChlLmcuLFxuICogYXJiaXRyYXJ5IEhUVFAgaGVhZGVycyk7IGFzIHN1Y2gsIHRoZSBUcmFjZXIgaW1wbGVtZW50YXRpb24gc2hvdWxkIHVzZSBhXG4gKiBwcmVmaXggb3Igb3RoZXIgY29udmVudGlvbiB0byBkaXN0aW5ndWlzaCBUcmFjZXItc3BlY2lmaWMga2V5OnZhbHVlXG4gKiBwYWlycy5cbiAqL1xuZXhwb3J0cy5GT1JNQVRfSFRUUF9IRUFERVJTID0gJ2h0dHBfaGVhZGVycyc7XG4vKipcbiAqIEEgU3BhbiBtYXkgYmUgdGhlIFwiY2hpbGQgb2ZcIiBhIHBhcmVudCBTcGFuLiBJbiBhIOKAnGNoaWxkIG9m4oCdIHJlZmVyZW5jZSxcbiAqIHRoZSBwYXJlbnQgU3BhbiBkZXBlbmRzIG9uIHRoZSBjaGlsZCBTcGFuIGluIHNvbWUgY2FwYWNpdHkuXG4gKlxuICogU2VlIG1vcmUgYWJvdXQgcmVmZXJlbmNlIHR5cGVzIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9vcGVudHJhY2luZy9zcGVjaWZpY2F0aW9uXG4gKi9cbmV4cG9ydHMuUkVGRVJFTkNFX0NISUxEX09GID0gJ2NoaWxkX29mJztcbi8qKlxuICogU29tZSBwYXJlbnQgU3BhbnMgZG8gbm90IGRlcGVuZCBpbiBhbnkgd2F5IG9uIHRoZSByZXN1bHQgb2YgdGhlaXIgY2hpbGRcbiAqIFNwYW5zLiBJbiB0aGVzZSBjYXNlcywgd2Ugc2F5IG1lcmVseSB0aGF0IHRoZSBjaGlsZCBTcGFuIOKAnGZvbGxvd3MgZnJvbeKAnVxuICogdGhlIHBhcmVudCBTcGFuIGluIGEgY2F1c2FsIHNlbnNlLlxuICpcbiAqIFNlZSBtb3JlIGFib3V0IHJlZmVyZW5jZSB0eXBlcyBhdCBodHRwczovL2dpdGh1Yi5jb20vb3BlbnRyYWNpbmcvc3BlY2lmaWNhdGlvblxuICovXG5leHBvcnRzLlJFRkVSRU5DRV9GT0xMT1dTX0ZST00gPSAnZm9sbG93c19mcm9tJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnN0YW50cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHNcIik7XG52YXIgcmVmZXJlbmNlXzEgPSByZXF1aXJlKFwiLi9yZWZlcmVuY2VcIik7XG52YXIgc3Bhbl8xID0gcmVxdWlyZShcIi4vc3BhblwiKTtcbi8qKlxuICogUmV0dXJuIGEgbmV3IFJFRkVSRU5DRV9DSElMRF9PRiByZWZlcmVuY2UuXG4gKlxuICogQHBhcmFtIHtTcGFuQ29udGV4dH0gc3BhbkNvbnRleHQgLSB0aGUgcGFyZW50IFNwYW5Db250ZXh0IGluc3RhbmNlIHRvXG4gKiAgICAgICAgcmVmZXJlbmNlLlxuICogQHJldHVybiBhIFJFRkVSRU5DRV9DSElMRF9PRiByZWZlcmVuY2UgcG9pbnRpbmcgdG8gYHNwYW5Db250ZXh0YFxuICovXG5mdW5jdGlvbiBjaGlsZE9mKHNwYW5Db250ZXh0KSB7XG4gICAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gcGFzcyBhIFNwYW4gaW5zdGVhZCBvZiBhIFNwYW5Db250ZXh0XG4gICAgaWYgKHNwYW5Db250ZXh0IGluc3RhbmNlb2Ygc3Bhbl8xLmRlZmF1bHQpIHtcbiAgICAgICAgc3BhbkNvbnRleHQgPSBzcGFuQ29udGV4dC5jb250ZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcmVmZXJlbmNlXzEuZGVmYXVsdChDb25zdGFudHMuUkVGRVJFTkNFX0NISUxEX09GLCBzcGFuQ29udGV4dCk7XG59XG5leHBvcnRzLmNoaWxkT2YgPSBjaGlsZE9mO1xuLyoqXG4gKiBSZXR1cm4gYSBuZXcgUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSByZWZlcmVuY2UuXG4gKlxuICogQHBhcmFtIHtTcGFuQ29udGV4dH0gc3BhbkNvbnRleHQgLSB0aGUgcGFyZW50IFNwYW5Db250ZXh0IGluc3RhbmNlIHRvXG4gKiAgICAgICAgcmVmZXJlbmNlLlxuICogQHJldHVybiBhIFJFRkVSRU5DRV9GT0xMT1dTX0ZST00gcmVmZXJlbmNlIHBvaW50aW5nIHRvIGBzcGFuQ29udGV4dGBcbiAqL1xuZnVuY3Rpb24gZm9sbG93c0Zyb20oc3BhbkNvbnRleHQpIHtcbiAgICAvLyBBbGxvdyB0aGUgdXNlciB0byBwYXNzIGEgU3BhbiBpbnN0ZWFkIG9mIGEgU3BhbkNvbnRleHRcbiAgICBpZiAoc3BhbkNvbnRleHQgaW5zdGFuY2VvZiBzcGFuXzEuZGVmYXVsdCkge1xuICAgICAgICBzcGFuQ29udGV4dCA9IHNwYW5Db250ZXh0LmNvbnRleHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyByZWZlcmVuY2VfMS5kZWZhdWx0KENvbnN0YW50cy5SRUZFUkVOQ0VfRk9MTE9XU19GUk9NLCBzcGFuQ29udGV4dCk7XG59XG5leHBvcnRzLmZvbGxvd3NGcm9tID0gZm9sbG93c0Zyb207XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mdW5jdGlvbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgc3Bhbl8xID0gcmVxdWlyZShcIi4vc3BhblwiKTtcbnZhciBzcGFuX2NvbnRleHRfMSA9IHJlcXVpcmUoXCIuL3NwYW5fY29udGV4dFwiKTtcbnZhciB0cmFjZXJfMSA9IHJlcXVpcmUoXCIuL3RyYWNlclwiKTtcbmV4cG9ydHMudHJhY2VyID0gbnVsbDtcbmV4cG9ydHMuc3BhbkNvbnRleHQgPSBudWxsO1xuZXhwb3J0cy5zcGFuID0gbnVsbDtcbi8vIERlZmVycmVkIGluaXRpYWxpemF0aW9uIHRvIGF2b2lkIGEgZGVwZW5kZW5jeSBjeWNsZSB3aGVyZSBUcmFjZXIgZGVwZW5kcyBvblxuLy8gU3BhbiB3aGljaCBkZXBlbmRzIG9uIHRoZSBub29wIHRyYWNlci5cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgZXhwb3J0cy50cmFjZXIgPSBuZXcgdHJhY2VyXzEuZGVmYXVsdCgpO1xuICAgIGV4cG9ydHMuc3BhbiA9IG5ldyBzcGFuXzEuZGVmYXVsdCgpO1xuICAgIGV4cG9ydHMuc3BhbkNvbnRleHQgPSBuZXcgc3Bhbl9jb250ZXh0XzEuZGVmYXVsdCgpO1xufVxuZXhwb3J0cy5pbml0aWFsaXplID0gaW5pdGlhbGl6ZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vb3AuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgc3Bhbl8xID0gcmVxdWlyZShcIi4vc3BhblwiKTtcbi8qKlxuICogUmVmZXJlbmNlIHBhaXJzIGEgcmVmZXJlbmNlIHR5cGUgY29uc3RhbnQgKGUuZy4sIFJFRkVSRU5DRV9DSElMRF9PRiBvclxuICogUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSkgd2l0aCB0aGUgU3BhbkNvbnRleHQgaXQgcG9pbnRzIHRvLlxuICpcbiAqIFNlZSB0aGUgZXhwb3J0ZWQgY2hpbGRPZigpIGFuZCBmb2xsb3dzRnJvbSgpIGZ1bmN0aW9ucyBhdCB0aGUgcGFja2FnZSBsZXZlbC5cbiAqL1xudmFyIFJlZmVyZW5jZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGEgbmV3IFJlZmVyZW5jZSBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gdGhlIFJlZmVyZW5jZSB0eXBlIGNvbnN0YW50IChlLmcuLFxuICAgICAqICAgICAgICBSRUZFUkVOQ0VfQ0hJTERfT0Ygb3IgUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSkuXG4gICAgICogQHBhcmFtIHtTcGFuQ29udGV4dH0gcmVmZXJlbmNlZENvbnRleHQgLSB0aGUgU3BhbkNvbnRleHQgYmVpbmcgcmVmZXJyZWRcbiAgICAgKiAgICAgICAgdG8uIEFzIGEgY29udmVuaWVuY2UsIGEgU3BhbiBpbnN0YW5jZSBtYXkgYmUgcGFzc2VkIGluIGluc3RlYWRcbiAgICAgKiAgICAgICAgKGluIHdoaWNoIGNhc2UgaXRzIC5jb250ZXh0KCkgaXMgdXNlZCBoZXJlKS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBSZWZlcmVuY2UodHlwZSwgcmVmZXJlbmNlZENvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuX3JlZmVyZW5jZWRDb250ZXh0ID0gKHJlZmVyZW5jZWRDb250ZXh0IGluc3RhbmNlb2Ygc3Bhbl8xLmRlZmF1bHQgP1xuICAgICAgICAgICAgcmVmZXJlbmNlZENvbnRleHQuY29udGV4dCgpIDpcbiAgICAgICAgICAgIHJlZmVyZW5jZWRDb250ZXh0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgUmVmZXJlbmNlIHR5cGUgKGUuZy4sIFJFRkVSRU5DRV9DSElMRF9PRiBvclxuICAgICAqICAgICAgICAgUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSkuXG4gICAgICovXG4gICAgUmVmZXJlbmNlLnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge1NwYW5Db250ZXh0fSBUaGUgU3BhbkNvbnRleHQgYmVpbmcgcmVmZXJyZWQgdG8gKGUuZy4sIHRoZVxuICAgICAqICAgICAgICAgcGFyZW50IGluIGEgUkVGRVJFTkNFX0NISUxEX09GIFJlZmVyZW5jZSkuXG4gICAgICovXG4gICAgUmVmZXJlbmNlLnByb3RvdHlwZS5yZWZlcmVuY2VkQ29udGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZmVyZW5jZWRDb250ZXh0O1xuICAgIH07XG4gICAgcmV0dXJuIFJlZmVyZW5jZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBSZWZlcmVuY2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWZlcmVuY2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbm9vcCA9IHJlcXVpcmUoXCIuL25vb3BcIik7XG4vKipcbiAqIFNwYW4gcmVwcmVzZW50cyBhIGxvZ2ljYWwgdW5pdCBvZiB3b3JrIGFzIHBhcnQgb2YgYSBicm9hZGVyIFRyYWNlLiBFeGFtcGxlc1xuICogb2Ygc3BhbiBtaWdodCBpbmNsdWRlIHJlbW90ZSBwcm9jZWR1cmUgY2FsbHMgb3IgYSBpbi1wcm9jZXNzIGZ1bmN0aW9uIGNhbGxzXG4gKiB0byBzdWItY29tcG9uZW50cy4gQSBUcmFjZSBoYXMgYSBzaW5nbGUsIHRvcC1sZXZlbCBcInJvb3RcIiBTcGFuIHRoYXQgaW4gdHVyblxuICogbWF5IGhhdmUgemVybyBvciBtb3JlIGNoaWxkIFNwYW5zLCB3aGljaCBpbiB0dXJuIG1heSBoYXZlIGNoaWxkcmVuLlxuICovXG52YXIgU3BhbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTcGFuKCkge1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gT3BlblRyYWNpbmcgQVBJIG1ldGhvZHNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgU3BhbkNvbnRleHQgb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCB0aGlzIFNwYW4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTcGFuQ29udGV4dH1cbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5jb250ZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dCgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgVHJhY2VyIG9iamVjdCB1c2VkIHRvIGNyZWF0ZSB0aGlzIFNwYW4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtUcmFjZXJ9XG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUudHJhY2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhY2VyKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBzdHJpbmcgbmFtZSBmb3IgdGhlIGxvZ2ljYWwgb3BlcmF0aW9uIHRoaXMgc3BhbiByZXByZXNlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5zZXRPcGVyYXRpb25OYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdGhpcy5fc2V0T3BlcmF0aW9uTmFtZShuYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXRzIGEga2V5OnZhbHVlIHBhaXIgb24gdGhpcyBTcGFuIHRoYXQgYWxzbyBwcm9wYWdhdGVzIHRvIGZ1dHVyZVxuICAgICAqIGNoaWxkcmVuIG9mIHRoZSBhc3NvY2lhdGVkIFNwYW4uXG4gICAgICpcbiAgICAgKiBzZXRCYWdnYWdlSXRlbSgpIGVuYWJsZXMgcG93ZXJmdWwgZnVuY3Rpb25hbGl0eSBnaXZlbiBhIGZ1bGwtc3RhY2tcbiAgICAgKiBvcGVudHJhY2luZyBpbnRlZ3JhdGlvbiAoZS5nLiwgYXJiaXRyYXJ5IGFwcGxpY2F0aW9uIGRhdGEgZnJvbSBhIHdlYlxuICAgICAqIGNsaWVudCBjYW4gbWFrZSBpdCwgdHJhbnNwYXJlbnRseSwgYWxsIHRoZSB3YXkgaW50byB0aGUgZGVwdGhzIG9mIGFcbiAgICAgKiBzdG9yYWdlIHN5c3RlbSksIGFuZCB3aXRoIGl0IHNvbWUgcG93ZXJmdWwgY29zdHM6IHVzZSB0aGlzIGZlYXR1cmUgd2l0aFxuICAgICAqIGNhcmUuXG4gICAgICpcbiAgICAgKiBJTVBPUlRBTlQgTk9URSAjMTogc2V0QmFnZ2FnZUl0ZW0oKSB3aWxsIG9ubHkgcHJvcGFnYXRlIGJhZ2dhZ2UgaXRlbXMgdG9cbiAgICAgKiAqZnV0dXJlKiBjYXVzYWwgZGVzY2VuZGFudHMgb2YgdGhlIGFzc29jaWF0ZWQgU3Bhbi5cbiAgICAgKlxuICAgICAqIElNUE9SVEFOVCBOT1RFICMyOiBVc2UgdGhpcyB0aG91Z2h0ZnVsbHkgYW5kIHdpdGggY2FyZS4gRXZlcnkga2V5IGFuZFxuICAgICAqIHZhbHVlIGlzIGNvcGllZCBpbnRvIGV2ZXJ5IGxvY2FsICphbmQgcmVtb3RlKiBjaGlsZCBvZiB0aGUgYXNzb2NpYXRlZFxuICAgICAqIFNwYW4sIGFuZCB0aGF0IGNhbiBhZGQgdXAgdG8gYSBsb3Qgb2YgbmV0d29yayBhbmQgY3B1IG92ZXJoZWFkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLnNldEJhZ2dhZ2VJdGVtID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fc2V0QmFnZ2FnZUl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdmFsdWUgZm9yIGEgYmFnZ2FnZSBpdGVtIGdpdmVuIGl0cyBrZXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGtleVxuICAgICAqICAgICAgICAgVGhlIGtleSBmb3IgdGhlIGdpdmVuIHRyYWNlIGF0dHJpYnV0ZS5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICogICAgICAgICBTdHJpbmcgdmFsdWUgZm9yIHRoZSBnaXZlbiBrZXksIG9yIHVuZGVmaW5lZCBpZiB0aGUga2V5IGRvZXMgbm90XG4gICAgICogICAgICAgICBjb3JyZXNwb25kIHRvIGEgc2V0IHRyYWNlIGF0dHJpYnV0ZS5cbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5nZXRCYWdnYWdlSXRlbSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldEJhZ2dhZ2VJdGVtKGtleSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGRzIGEgc2luZ2xlIHRhZyB0byB0aGUgc3Bhbi4gIFNlZSBgYWRkVGFncygpYCBmb3IgZGV0YWlscy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5zZXRUYWcgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAvLyBOT1RFOiB0aGUgY2FsbCBpcyBub3JtYWxpemVkIHRvIGEgY2FsbCB0byBfYWRkVGFncygpXG4gICAgICAgIHRoaXMuX2FkZFRhZ3MoKF9hID0ge30sIF9hW2tleV0gPSB2YWx1ZSwgX2EpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHZhciBfYTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIGdpdmVuIGtleSB2YWx1ZSBwYWlycyB0byB0aGUgc2V0IG9mIHNwYW4gdGFncy5cbiAgICAgKlxuICAgICAqIE11bHRpcGxlIGNhbGxzIHRvIGFkZFRhZ3MoKSByZXN1bHRzIGluIHRoZSB0YWdzIGJlaW5nIHRoZSBzdXBlcnNldCBvZlxuICAgICAqIGFsbCBjYWxscy5cbiAgICAgKlxuICAgICAqIFRoZSBiZWhhdmlvciBvZiBzZXR0aW5nIHRoZSBzYW1lIGtleSBtdWx0aXBsZSB0aW1lcyBvbiB0aGUgc2FtZSBzcGFuXG4gICAgICogaXMgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogVGhlIHN1cHBvcnRlZCB0eXBlIG9mIHRoZSB2YWx1ZXMgaXMgaW1wbGVtZW50YXRpb24tZGVwZW5kZW50LlxuICAgICAqIEltcGxlbWVudGF0aW9ucyBhcmUgZXhwZWN0ZWQgdG8gc2FmZWx5IGhhbmRsZSBhbGwgdHlwZXMgb2YgdmFsdWVzIGJ1dFxuICAgICAqIG1heSBjaG9vc2UgdG8gaWdub3JlIHVucmVjb2duaXplZCAvIHVuaGFuZGxlLWFibGUgdmFsdWVzIChlLmcuIG9iamVjdHNcbiAgICAgKiB3aXRoIGN5Y2xpYyByZWZlcmVuY2VzLCBmdW5jdGlvbiBvYmplY3RzKS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLmFkZFRhZ3MgPSBmdW5jdGlvbiAoa2V5VmFsdWVNYXApIHtcbiAgICAgICAgdGhpcy5fYWRkVGFncyhrZXlWYWx1ZU1hcCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWRkIGEgbG9nIHJlY29yZCB0byB0aGlzIFNwYW4sIG9wdGlvbmFsbHkgYXQgYSB1c2VyLXByb3ZpZGVkIHRpbWVzdGFtcC5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlOlxuICAgICAqXG4gICAgICogICAgIHNwYW4ubG9nKHtcbiAgICAgKiAgICAgICAgIHNpemU6IHJwYy5zaXplKCksICAvLyBudW1lcmljIHZhbHVlXG4gICAgICogICAgICAgICBVUkk6IHJwYy5VUkkoKSwgIC8vIHN0cmluZyB2YWx1ZVxuICAgICAqICAgICAgICAgcGF5bG9hZDogcnBjLnBheWxvYWQoKSwgIC8vIE9iamVjdCB2YWx1ZVxuICAgICAqICAgICAgICAgXCJrZXlzIGNhbiBiZSBhcmJpdHJhcnkgc3RyaW5nc1wiOiBycGMuZm9vKCksXG4gICAgICogICAgIH0pO1xuICAgICAqXG4gICAgICogICAgIHNwYW4ubG9nKHtcbiAgICAgKiAgICAgICAgIFwiZXJyb3IuZGVzY3JpcHRpb25cIjogc29tZUVycm9yLmRlc2NyaXB0aW9uKCksXG4gICAgICogICAgIH0sIHNvbWVFcnJvci50aW1lc3RhbXBNaWxsaXMoKSk7XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0ga2V5VmFsdWVQYWlyc1xuICAgICAqICAgICAgICBBbiBvYmplY3QgbWFwcGluZyBzdHJpbmcga2V5cyB0byBhcmJpdHJhcnkgdmFsdWUgdHlwZXMuIEFsbFxuICAgICAqICAgICAgICBUcmFjZXIgaW1wbGVtZW50YXRpb25zIHNob3VsZCBzdXBwb3J0IGJvb2wsIHN0cmluZywgYW5kIG51bWVyaWNcbiAgICAgKiAgICAgICAgdmFsdWUgdHlwZXMsIGFuZCBzb21lIG1heSBhbHNvIHN1cHBvcnQgT2JqZWN0IHZhbHVlcy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXN0YW1wXG4gICAgICogICAgICAgIEFuIG9wdGlvbmFsIHBhcmFtZXRlciBzcGVjaWZ5aW5nIHRoZSB0aW1lc3RhbXAgaW4gbWlsbGlzZWNvbmRzXG4gICAgICogICAgICAgIHNpbmNlIHRoZSBVbml4IGVwb2NoLiBGcmFjdGlvbmFsIHZhbHVlcyBhcmUgYWxsb3dlZCBzbyB0aGF0XG4gICAgICogICAgICAgIHRpbWVzdGFtcHMgd2l0aCBzdWItbWlsbGlzZWNvbmQgYWNjdXJhY3kgY2FuIGJlIHJlcHJlc2VudGVkLiBJZlxuICAgICAqICAgICAgICBub3Qgc3BlY2lmaWVkLCB0aGUgaW1wbGVtZW50YXRpb24gaXMgZXhwZWN0ZWQgdG8gdXNlIGl0cyBub3Rpb25cbiAgICAgKiAgICAgICAgb2YgdGhlIGN1cnJlbnQgdGltZSBvZiB0aGUgY2FsbC5cbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAoa2V5VmFsdWVQYWlycywgdGltZXN0YW1wKSB7XG4gICAgICAgIHRoaXMuX2xvZyhrZXlWYWx1ZVBhaXJzLCB0aW1lc3RhbXApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERFUFJFQ0FURURcbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5sb2dFdmVudCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIHBheWxvYWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZyh7IGV2ZW50OiBldmVudE5hbWUsIHBheWxvYWQ6IHBheWxvYWQgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBlbmQgdGltZXN0YW1wIGFuZCBmaW5hbGl6ZXMgU3BhbiBzdGF0ZS5cbiAgICAgKlxuICAgICAqIFdpdGggdGhlIGV4Y2VwdGlvbiBvZiBjYWxscyB0byBTcGFuLmNvbnRleHQoKSAod2hpY2ggYXJlIGFsd2F5cyBhbGxvd2VkKSxcbiAgICAgKiBmaW5pc2goKSBtdXN0IGJlIHRoZSBsYXN0IGNhbGwgbWFkZSB0byBhbnkgc3BhbiBpbnN0YW5jZSwgYW5kIHRvIGRvXG4gICAgICogb3RoZXJ3aXNlIGxlYWRzIHRvIHVuZGVmaW5lZCBiZWhhdmlvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge251bWJlcn0gZmluaXNoVGltZVxuICAgICAqICAgICAgICAgT3B0aW9uYWwgZmluaXNoIHRpbWUgaW4gbWlsbGlzZWNvbmRzIGFzIGEgVW5peCB0aW1lc3RhbXAuIERlY2ltYWxcbiAgICAgKiAgICAgICAgIHZhbHVlcyBhcmUgc3VwcG9ydGVkIGZvciB0aW1lc3RhbXBzIHdpdGggc3ViLW1pbGxpc2Vjb25kIGFjY3VyYWN5LlxuICAgICAqICAgICAgICAgSWYgbm90IHNwZWNpZmllZCwgdGhlIGN1cnJlbnQgdGltZSAoYXMgZGVmaW5lZCBieSB0aGVcbiAgICAgKiAgICAgICAgIGltcGxlbWVudGF0aW9uKSB3aWxsIGJlIHVzZWQuXG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24gKGZpbmlzaFRpbWUpIHtcbiAgICAgICAgdGhpcy5fZmluaXNoKGZpbmlzaFRpbWUpO1xuICAgICAgICAvLyBEbyBub3QgcmV0dXJuIGB0aGlzYC4gVGhlIFNwYW4gZ2VuZXJhbGx5IHNob3VsZCBub3QgYmUgdXNlZCBhZnRlciBpdFxuICAgICAgICAvLyBpcyBmaW5pc2hlZCBzbyBjaGFpbmluZyBpcyBub3QgZGVzaXJlZCBpbiB0aGlzIGNvbnRleHQuXG4gICAgfTtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gRGVyaXZlZCBjbGFzc2VzIGNhbiBjaG9vc2UgdG8gaW1wbGVtZW50IHRoZSBiZWxvd1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBCeSBkZWZhdWx0IHJldHVybnMgYSBuby1vcCBTcGFuQ29udGV4dC5cbiAgICBTcGFuLnByb3RvdHlwZS5fY29udGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5vb3Auc3BhbkNvbnRleHQ7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IHJldHVybnMgYSBuby1vcCB0cmFjZXIuXG4gICAgLy9cbiAgICAvLyBUaGUgYmFzZSBjbGFzcyBjb3VsZCBzdG9yZSB0aGUgdHJhY2VyIHRoYXQgY3JlYXRlZCBpdCwgYnV0IGl0IGRvZXMgbm90XG4gICAgLy8gaW4gb3JkZXIgdG8gZW5zdXJlIHRoZSBuby1vcCBzcGFuIGltcGxlbWVudGF0aW9uIGhhcyB6ZXJvIG1lbWJlcnMsXG4gICAgLy8gd2hpY2ggYWxsb3dzIFY4IHRvIGFnZ3Jlc3NpdmVseSBvcHRpbWl6ZSBjYWxscyB0byBzdWNoIG9iamVjdHMuXG4gICAgU3Bhbi5wcm90b3R5cGUuX3RyYWNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5vb3AudHJhY2VyO1xuICAgIH07XG4gICAgLy8gQnkgZGVmYXVsdCBkb2VzIG5vdGhpbmdcbiAgICBTcGFuLnByb3RvdHlwZS5fc2V0T3BlcmF0aW9uTmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIFNwYW4ucHJvdG90eXBlLl9zZXRCYWdnYWdlSXRlbSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIFNwYW4ucHJvdG90eXBlLl9nZXRCYWdnYWdlSXRlbSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8vIEJ5IGRlZmF1bHQgZG9lcyBub3RoaW5nXG4gICAgLy9cbiAgICAvLyBOT1RFOiBib3RoIHNldFRhZygpIGFuZCBhZGRUYWdzKCkgbWFwIHRvIHRoaXMgZnVuY3Rpb24uIGtleVZhbHVlUGFpcnNcbiAgICAvLyB3aWxsIGFsd2F5cyBiZSBhbiBhc3NvY2lhdGl2ZSBhcnJheS5cbiAgICBTcGFuLnByb3RvdHlwZS5fYWRkVGFncyA9IGZ1bmN0aW9uIChrZXlWYWx1ZVBhaXJzKSB7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIFNwYW4ucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbiAoa2V5VmFsdWVQYWlycywgdGltZXN0YW1wKSB7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIC8vXG4gICAgLy8gZmluaXNoVGltZSBpcyBleHBlY3RlZCB0byBiZSBlaXRoZXIgYSBudW1iZXIgb3IgdW5kZWZpbmVkLlxuICAgIFNwYW4ucHJvdG90eXBlLl9maW5pc2ggPSBmdW5jdGlvbiAoZmluaXNoVGltZSkge1xuICAgIH07XG4gICAgcmV0dXJuIFNwYW47XG59KCkpO1xuZXhwb3J0cy5TcGFuID0gU3BhbjtcbmV4cG9ydHMuZGVmYXVsdCA9IFNwYW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFuLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqXG4gKiBTcGFuQ29udGV4dCByZXByZXNlbnRzIFNwYW4gc3RhdGUgdGhhdCBtdXN0IHByb3BhZ2F0ZSB0byBkZXNjZW5kYW50IFNwYW5zXG4gKiBhbmQgYWNyb3NzIHByb2Nlc3MgYm91bmRhcmllcy5cbiAqXG4gKiBTcGFuQ29udGV4dCBpcyBsb2dpY2FsbHkgZGl2aWRlZCBpbnRvIHR3byBwaWVjZXM6IHRoZSB1c2VyLWxldmVsIFwiQmFnZ2FnZVwiXG4gKiAoc2VlIHNldEJhZ2dhZ2VJdGVtIGFuZCBnZXRCYWdnYWdlSXRlbSkgdGhhdCBwcm9wYWdhdGVzIGFjcm9zcyBTcGFuXG4gKiBib3VuZGFyaWVzIGFuZCBhbnkgVHJhY2VyLWltcGxlbWVudGF0aW9uLXNwZWNpZmljIGZpZWxkcyB0aGF0IGFyZSBuZWVkZWQgdG9cbiAqIGlkZW50aWZ5IG9yIG90aGVyd2lzZSBjb250ZXh0dWFsaXplIHRoZSBhc3NvY2lhdGVkIFNwYW4gaW5zdGFuY2UgKGUuZy4sIGFcbiAqIDx0cmFjZV9pZCwgc3Bhbl9pZCwgc2FtcGxlZD4gdHVwbGUpLlxuICovXG52YXIgU3BhbkNvbnRleHQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3BhbkNvbnRleHQoKSB7XG4gICAgfVxuICAgIHJldHVybiBTcGFuQ29udGV4dDtcbn0oKSk7XG5leHBvcnRzLlNwYW5Db250ZXh0ID0gU3BhbkNvbnRleHQ7XG5leHBvcnRzLmRlZmF1bHQgPSBTcGFuQ29udGV4dDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwYW5fY29udGV4dC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBGdW5jdGlvbnMgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnNcIik7XG52YXIgTm9vcCA9IHJlcXVpcmUoXCIuL25vb3BcIik7XG52YXIgc3Bhbl8xID0gcmVxdWlyZShcIi4vc3BhblwiKTtcbi8qKlxuICogVHJhY2VyIGlzIHRoZSBlbnRyeS1wb2ludCBiZXR3ZWVuIHRoZSBpbnN0cnVtZW50YXRpb24gQVBJIGFuZCB0aGUgdHJhY2luZ1xuICogaW1wbGVtZW50YXRpb24uXG4gKlxuICogVGhlIGRlZmF1bHQgb2JqZWN0IGFjdHMgYXMgYSBuby1vcCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBOb3RlIHRvIGltcGxlbWVudGF0b3JzOiBkZXJpdmVkIGNsYXNzZXMgY2FuIGNob29zZSB0byBkaXJlY3RseSBpbXBsZW1lbnQgdGhlXG4gKiBtZXRob2RzIGluIHRoZSBcIk9wZW5UcmFjaW5nIEFQSSBtZXRob2RzXCIgc2VjdGlvbiwgb3Igb3B0aW9uYWxseSB0aGUgc3Vic2V0IG9mXG4gKiB1bmRlcnNjb3JlLXByZWZpeGVkIG1ldGhvZHMgdG8gcGljayB1cCB0aGUgYXJndW1lbnQgY2hlY2tpbmcgYW5kIGhhbmRsaW5nXG4gKiBhdXRvbWF0aWNhbGx5IGZyb20gdGhlIGJhc2UgY2xhc3MuXG4gKi9cbnZhciBUcmFjZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVHJhY2VyKCkge1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gT3BlblRyYWNpbmcgQVBJIG1ldGhvZHNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLyoqXG4gICAgICogU3RhcnRzIGFuZCByZXR1cm5zIGEgbmV3IFNwYW4gcmVwcmVzZW50aW5nIGEgbG9naWNhbCB1bml0IG9mIHdvcmsuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqICAgICAvLyBTdGFydCBhIG5ldyAocGFyZW50bGVzcykgcm9vdCBTcGFuOlxuICAgICAqICAgICB2YXIgcGFyZW50ID0gVHJhY2VyLnN0YXJ0U3BhbignRG9Xb3JrJyk7XG4gICAgICpcbiAgICAgKiAgICAgLy8gU3RhcnQgYSBuZXcgKGNoaWxkKSBTcGFuOlxuICAgICAqICAgICB2YXIgY2hpbGQgPSBUcmFjZXIuc3RhcnRTcGFuKCdsb2FkLWZyb20tZGInLCB7XG4gICAgICogICAgICAgICBjaGlsZE9mOiBwYXJlbnQuY29udGV4dCgpLFxuICAgICAqICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgICAvLyBTdGFydCBhIG5ldyBhc3luYyAoRm9sbG93c0Zyb20pIFNwYW46XG4gICAgICogICAgIHZhciBjaGlsZCA9IFRyYWNlci5zdGFydFNwYW4oJ2FzeW5jLWNhY2hlLXdyaXRlJywge1xuICAgICAqICAgICAgICAgcmVmZXJlbmNlczogW1xuICAgICAqICAgICAgICAgICAgIG9wZW50cmFjaW5nLmZvbGxvd3NGcm9tKHBhcmVudC5jb250ZXh0KCkpXG4gICAgICogICAgICAgICBdLFxuICAgICAqICAgICB9KTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIG9wZXJhdGlvbiAoUkVRVUlSRUQpLlxuICAgICAqIEBwYXJhbSB7U3Bhbk9wdGlvbnN9IFtvcHRpb25zXSAtIG9wdGlvbnMgZm9yIHRoZSBuZXdseSBjcmVhdGVkIHNwYW4uXG4gICAgICogQHJldHVybiB7U3Bhbn0gLSBhIG5ldyBTcGFuIG9iamVjdC5cbiAgICAgKi9cbiAgICBUcmFjZXIucHJvdG90eXBlLnN0YXJ0U3BhbiA9IGZ1bmN0aW9uIChuYW1lLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgICAgIC8vIENvbnZlcnQgb3B0aW9ucy5jaGlsZE9mIHRvIGZpZWxkcy5yZWZlcmVuY2VzIGFzIG5lZWRlZC5cbiAgICAgICAgaWYgKG9wdGlvbnMuY2hpbGRPZikge1xuICAgICAgICAgICAgLy8gQ29udmVydCBmcm9tIGEgU3BhbiBvciBhIFNwYW5Db250ZXh0IGludG8gYSBSZWZlcmVuY2UuXG4gICAgICAgICAgICB2YXIgY2hpbGRPZiA9IEZ1bmN0aW9ucy5jaGlsZE9mKG9wdGlvbnMuY2hpbGRPZik7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5yZWZlcmVuY2VzKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5yZWZlcmVuY2VzLnB1c2goY2hpbGRPZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnJlZmVyZW5jZXMgPSBbY2hpbGRPZl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgKG9wdGlvbnMuY2hpbGRPZik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0U3BhbihuYW1lLCBvcHRpb25zKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEluamVjdHMgdGhlIGdpdmVuIFNwYW5Db250ZXh0IGluc3RhbmNlIGZvciBjcm9zcy1wcm9jZXNzIHByb3BhZ2F0aW9uXG4gICAgICogd2l0aGluIGBjYXJyaWVyYC4gVGhlIGV4cGVjdGVkIHR5cGUgb2YgYGNhcnJpZXJgIGRlcGVuZHMgb24gdGhlIHZhbHVlIG9mXG4gICAgICogYGZvcm1hdC5cbiAgICAgKlxuICAgICAqIE9wZW5UcmFjaW5nIGRlZmluZXMgYSBjb21tb24gc2V0IG9mIGBmb3JtYXRgIHZhbHVlcyAoc2VlXG4gICAgICogRk9STUFUX1RFWFRfTUFQLCBGT1JNQVRfSFRUUF9IRUFERVJTLCBhbmQgRk9STUFUX0JJTkFSWSksIGFuZCBlYWNoIGhhc1xuICAgICAqIGFuIGV4cGVjdGVkIGNhcnJpZXIgdHlwZS5cbiAgICAgKlxuICAgICAqIENvbnNpZGVyIHRoaXMgcHNldWRvY29kZSBleGFtcGxlOlxuICAgICAqXG4gICAgICogICAgIHZhciBjbGllbnRTcGFuID0gLi4uO1xuICAgICAqICAgICAuLi5cbiAgICAgKiAgICAgLy8gSW5qZWN0IGNsaWVudFNwYW4gaW50byBhIHRleHQgY2Fycmllci5cbiAgICAgKiAgICAgdmFyIGhlYWRlcnNDYXJyaWVyID0ge307XG4gICAgICogICAgIFRyYWNlci5pbmplY3QoY2xpZW50U3Bhbi5jb250ZXh0KCksIFRyYWNlci5GT1JNQVRfSFRUUF9IRUFERVJTLCBoZWFkZXJzQ2Fycmllcik7XG4gICAgICogICAgIC8vIEluY29ycG9yYXRlIHRoZSB0ZXh0Q2FycmllciBpbnRvIHRoZSBvdXRib3VuZCBIVFRQIHJlcXVlc3QgaGVhZGVyXG4gICAgICogICAgIC8vIG1hcC5cbiAgICAgKiAgICAgT2JqZWN0LmFzc2lnbihvdXRib3VuZEhUVFBSZXEuaGVhZGVycywgaGVhZGVyc0NhcnJpZXIpO1xuICAgICAqICAgICAvLyAuLi4gc2VuZCB0aGUgaHR0cFJlcVxuICAgICAqXG4gICAgICogQHBhcmFtICB7U3BhbkNvbnRleHR9IHNwYW5Db250ZXh0IC0gdGhlIFNwYW5Db250ZXh0IHRvIGluamVjdCBpbnRvIHRoZVxuICAgICAqICAgICAgICAgY2FycmllciBvYmplY3QuIEFzIGEgY29udmVuaWVuY2UsIGEgU3BhbiBpbnN0YW5jZSBtYXkgYmUgcGFzc2VkXG4gICAgICogICAgICAgICBpbiBpbnN0ZWFkIChpbiB3aGljaCBjYXNlIGl0cyAuY29udGV4dCgpIGlzIHVzZWQgZm9yIHRoZVxuICAgICAqICAgICAgICAgaW5qZWN0KCkpLlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gZm9ybWF0IC0gdGhlIGZvcm1hdCBvZiB0aGUgY2Fycmllci5cbiAgICAgKiBAcGFyYW0gIHthbnl9IGNhcnJpZXIgLSBzZWUgdGhlIGRvY3VtZW50YXRpb24gZm9yIHRoZSBjaG9zZW4gYGZvcm1hdGBcbiAgICAgKiAgICAgICAgIGZvciBhIGRlc2NyaXB0aW9uIG9mIHRoZSBjYXJyaWVyIG9iamVjdC5cbiAgICAgKi9cbiAgICBUcmFjZXIucHJvdG90eXBlLmluamVjdCA9IGZ1bmN0aW9uIChzcGFuQ29udGV4dCwgZm9ybWF0LCBjYXJyaWVyKSB7XG4gICAgICAgIC8vIEFsbG93IHRoZSB1c2VyIHRvIHBhc3MgYSBTcGFuIGluc3RlYWQgb2YgYSBTcGFuQ29udGV4dFxuICAgICAgICBpZiAoc3BhbkNvbnRleHQgaW5zdGFuY2VvZiBzcGFuXzEuZGVmYXVsdCkge1xuICAgICAgICAgICAgc3BhbkNvbnRleHQgPSBzcGFuQ29udGV4dC5jb250ZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2luamVjdChzcGFuQ29udGV4dCwgZm9ybWF0LCBjYXJyaWVyKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBTcGFuQ29udGV4dCBpbnN0YW5jZSBleHRyYWN0ZWQgZnJvbSBgY2FycmllcmAgaW4gdGhlIGdpdmVuXG4gICAgICogYGZvcm1hdGAuXG4gICAgICpcbiAgICAgKiBPcGVuVHJhY2luZyBkZWZpbmVzIGEgY29tbW9uIHNldCBvZiBgZm9ybWF0YCB2YWx1ZXMgKHNlZVxuICAgICAqIEZPUk1BVF9URVhUX01BUCwgRk9STUFUX0hUVFBfSEVBREVSUywgYW5kIEZPUk1BVF9CSU5BUlkpLCBhbmQgZWFjaCBoYXNcbiAgICAgKiBhbiBleHBlY3RlZCBjYXJyaWVyIHR5cGUuXG4gICAgICpcbiAgICAgKiBDb25zaWRlciB0aGlzIHBzZXVkb2NvZGUgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqICAgICAvLyBVc2UgdGhlIGluYm91bmQgSFRUUCByZXF1ZXN0J3MgaGVhZGVycyBhcyBhIHRleHQgbWFwIGNhcnJpZXIuXG4gICAgICogICAgIHZhciBoZWFkZXJzQ2FycmllciA9IGluYm91bmRIVFRQUmVxLmhlYWRlcnM7XG4gICAgICogICAgIHZhciB3aXJlQ3R4ID0gVHJhY2VyLmV4dHJhY3QoVHJhY2VyLkZPUk1BVF9IVFRQX0hFQURFUlMsIGhlYWRlcnNDYXJyaWVyKTtcbiAgICAgKiAgICAgdmFyIHNlcnZlclNwYW4gPSBUcmFjZXIuc3RhcnRTcGFuKCcuLi4nLCB7IGNoaWxkT2YgOiB3aXJlQ3R4IH0pO1xuICAgICAqXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBmb3JtYXQgLSB0aGUgZm9ybWF0IG9mIHRoZSBjYXJyaWVyLlxuICAgICAqIEBwYXJhbSAge2FueX0gY2FycmllciAtIHRoZSB0eXBlIG9mIHRoZSBjYXJyaWVyIG9iamVjdCBpcyBkZXRlcm1pbmVkIGJ5XG4gICAgICogICAgICAgICB0aGUgZm9ybWF0LlxuICAgICAqIEByZXR1cm4ge1NwYW5Db250ZXh0fVxuICAgICAqICAgICAgICAgVGhlIGV4dHJhY3RlZCBTcGFuQ29udGV4dCwgb3IgbnVsbCBpZiBubyBzdWNoIFNwYW5Db250ZXh0IGNvdWxkXG4gICAgICogICAgICAgICBiZSBmb3VuZCBpbiBgY2FycmllcmBcbiAgICAgKi9cbiAgICBUcmFjZXIucHJvdG90eXBlLmV4dHJhY3QgPSBmdW5jdGlvbiAoZm9ybWF0LCBjYXJyaWVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9leHRyYWN0KGZvcm1hdCwgY2Fycmllcik7XG4gICAgfTtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gRGVyaXZlZCBjbGFzc2VzIGNhbiBjaG9vc2UgdG8gaW1wbGVtZW50IHRoZSBiZWxvd1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBOT1RFOiB0aGUgaW5wdXQgdG8gdGhpcyBtZXRob2QgaXMgKmFsd2F5cyogYW4gYXNzb2NpYXRpdmUgYXJyYXkuIFRoZVxuICAgIC8vIHB1YmxpYy1mYWNpbmcgc3RhcnRTcGFuKCkgbWV0aG9kIG5vcm1hbGl6ZXMgdGhlIGFyZ3VtZW50cyBzbyB0aGF0XG4gICAgLy8gYWxsIE4gaW1wbGVtZW50YXRpb25zIGRvIG5vdCBuZWVkIHRvIHdvcnJ5IGFib3V0IHZhcmlhdGlvbnMgaW4gdGhlIGNhbGxcbiAgICAvLyBzaWduYXR1cmUuXG4gICAgLy9cbiAgICAvLyBUaGUgZGVmYXVsdCBiZWhhdmlvciByZXR1cm5zIGEgbm8tb3Agc3Bhbi5cbiAgICBUcmFjZXIucHJvdG90eXBlLl9zdGFydFNwYW4gPSBmdW5jdGlvbiAobmFtZSwgZmllbGRzKSB7XG4gICAgICAgIHJldHVybiBOb29wLnNwYW47XG4gICAgfTtcbiAgICAvLyBUaGUgZGVmYXVsdCBiZWhhdmlvciBpcyBhIG5vLW9wLlxuICAgIFRyYWNlci5wcm90b3R5cGUuX2luamVjdCA9IGZ1bmN0aW9uIChzcGFuQ29udGV4dCwgZm9ybWF0LCBjYXJyaWVyKSB7XG4gICAgfTtcbiAgICAvLyBUaGUgZGVmYXVsdCBiZWhhdmlvciBpcyB0byByZXR1cm4gYSBuby1vcCBTcGFuQ29udGV4dC5cbiAgICBUcmFjZXIucHJvdG90eXBlLl9leHRyYWN0ID0gZnVuY3Rpb24gKGZvcm1hdCwgY2Fycmllcikge1xuICAgICAgICByZXR1cm4gTm9vcC5zcGFuQ29udGV4dDtcbiAgICB9O1xuICAgIHJldHVybiBUcmFjZXI7XG59KCkpO1xuZXhwb3J0cy5UcmFjZXIgPSBUcmFjZXI7XG5leHBvcnRzLmRlZmF1bHQgPSBUcmFjZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFjZXIuanMubWFwIiwiLyoqXG4gKiBAdGhpcyB7UHJvbWlzZX1cbiAqL1xuZnVuY3Rpb24gZmluYWxseUNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XG4gIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gIHJldHVybiB0aGlzLnRoZW4oXG4gICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZWplY3QocmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmluYWxseUNvbnN0cnVjdG9yO1xuIiwiaW1wb3J0IHByb21pc2VGaW5hbGx5IGZyb20gJy4vZmluYWxseSc7XG5cbi8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIHByb21pc2UtcG9seWZpbGwgd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4vLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbnZhciBzZXRUaW1lb3V0RnVuYyA9IHNldFRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGlzQXJyYXkoeCkge1xuICByZXR1cm4gQm9vbGVhbih4ICYmIHR5cGVvZiB4Lmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpO1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuLy8gUG9seWZpbGwgZm9yIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kXG5mdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBmbi5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gIC8qKiBAdHlwZSB7IW51bWJlcn0gKi9cbiAgdGhpcy5fc3RhdGUgPSAwO1xuICAvKiogQHR5cGUgeyFib29sZWFufSAqL1xuICB0aGlzLl9oYW5kbGVkID0gZmFsc2U7XG4gIC8qKiBAdHlwZSB7UHJvbWlzZXx1bmRlZmluZWR9ICovXG4gIHRoaXMuX3ZhbHVlID0gdW5kZWZpbmVkO1xuICAvKiogQHR5cGUgeyFBcnJheTwhRnVuY3Rpb24+fSAqL1xuICB0aGlzLl9kZWZlcnJlZHMgPSBbXTtcblxuICBkb1Jlc29sdmUoZm4sIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGUoc2VsZiwgZGVmZXJyZWQpIHtcbiAgd2hpbGUgKHNlbGYuX3N0YXRlID09PSAzKSB7XG4gICAgc2VsZiA9IHNlbGYuX3ZhbHVlO1xuICB9XG4gIGlmIChzZWxmLl9zdGF0ZSA9PT0gMCkge1xuICAgIHNlbGYuX2RlZmVycmVkcy5wdXNoKGRlZmVycmVkKTtcbiAgICByZXR1cm47XG4gIH1cbiAgc2VsZi5faGFuZGxlZCA9IHRydWU7XG4gIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYiA9IHNlbGYuX3N0YXRlID09PSAxID8gZGVmZXJyZWQub25GdWxmaWxsZWQgOiBkZWZlcnJlZC5vblJlamVjdGVkO1xuICAgIGlmIChjYiA9PT0gbnVsbCkge1xuICAgICAgKHNlbGYuX3N0YXRlID09PSAxID8gcmVzb2x2ZSA6IHJlamVjdCkoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fdmFsdWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmV0O1xuICAgIHRyeSB7XG4gICAgICByZXQgPSBjYihzZWxmLl92YWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVqZWN0KGRlZmVycmVkLnByb21pc2UsIGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHJldCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlKHNlbGYsIG5ld1ZhbHVlKSB7XG4gIHRyeSB7XG4gICAgLy8gUHJvbWlzZSBSZXNvbHV0aW9uIFByb2NlZHVyZTogaHR0cHM6Ly9naXRodWIuY29tL3Byb21pc2VzLWFwbHVzL3Byb21pc2VzLXNwZWMjdGhlLXByb21pc2UtcmVzb2x1dGlvbi1wcm9jZWR1cmVcbiAgICBpZiAobmV3VmFsdWUgPT09IHNlbGYpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLicpO1xuICAgIGlmIChcbiAgICAgIG5ld1ZhbHVlICYmXG4gICAgICAodHlwZW9mIG5ld1ZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgKSB7XG4gICAgICB2YXIgdGhlbiA9IG5ld1ZhbHVlLnRoZW47XG4gICAgICBpZiAobmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIHNlbGYuX3N0YXRlID0gMztcbiAgICAgICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRvUmVzb2x2ZShiaW5kKHRoZW4sIG5ld1ZhbHVlKSwgc2VsZik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5fc3RhdGUgPSAxO1xuICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgZmluYWxlKHNlbGYpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVqZWN0KHNlbGYsIGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuICBzZWxmLl9zdGF0ZSA9IDI7XG4gIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gIGZpbmFsZShzZWxmKTtcbn1cblxuZnVuY3Rpb24gZmluYWxlKHNlbGYpIHtcbiAgaWYgKHNlbGYuX3N0YXRlID09PSAyICYmIHNlbGYuX2RlZmVycmVkcy5sZW5ndGggPT09IDApIHtcbiAgICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpIHtcbiAgICAgIGlmICghc2VsZi5faGFuZGxlZCkge1xuICAgICAgICBQcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbihzZWxmLl92YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5fZGVmZXJyZWRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaGFuZGxlKHNlbGYsIHNlbGYuX2RlZmVycmVkc1tpXSk7XG4gIH1cbiAgc2VsZi5fZGVmZXJyZWRzID0gbnVsbDtcbn1cblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSkge1xuICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xuICB0aGlzLm9uUmVqZWN0ZWQgPSB0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uUmVqZWN0ZWQgOiBudWxsO1xuICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xufVxuXG4vKipcbiAqIFRha2UgYSBwb3RlbnRpYWxseSBtaXNiZWhhdmluZyByZXNvbHZlciBmdW5jdGlvbiBhbmQgbWFrZSBzdXJlXG4gKiBvbkZ1bGZpbGxlZCBhbmQgb25SZWplY3RlZCBhcmUgb25seSBjYWxsZWQgb25jZS5cbiAqXG4gKiBNYWtlcyBubyBndWFyYW50ZWVzIGFib3V0IGFzeW5jaHJvbnkuXG4gKi9cbmZ1bmN0aW9uIGRvUmVzb2x2ZShmbiwgc2VsZikge1xuICB2YXIgZG9uZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIGZuKFxuICAgICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlc29sdmUoc2VsZiwgdmFsdWUpO1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgcmVqZWN0KHNlbGYsIHJlYXNvbik7XG4gICAgICB9XG4gICAgKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlamVjdChzZWxmLCBleCk7XG4gIH1cbn1cblxuUHJvbWlzZS5wcm90b3R5cGVbJ2NhdGNoJ10gPSBmdW5jdGlvbihvblJlamVjdGVkKSB7XG4gIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgLy8gQHRzLWlnbm9yZVxuICB2YXIgcHJvbSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbSkpO1xuICByZXR1cm4gcHJvbTtcbn07XG5cblByb21pc2UucHJvdG90eXBlWydmaW5hbGx5J10gPSBwcm9taXNlRmluYWxseTtcblxuUHJvbWlzZS5hbGwgPSBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1Byb21pc2UuYWxsIGFjY2VwdHMgYW4gYXJyYXknKSk7XG4gICAgfVxuXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgIHZhciByZW1haW5pbmcgPSBhcmdzLmxlbmd0aDtcblxuICAgIGZ1bmN0aW9uIHJlcyhpLCB2YWwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh2YWwgJiYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdmFyIHRoZW4gPSB2YWwudGhlbjtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoZW4uY2FsbChcbiAgICAgICAgICAgICAgdmFsLFxuICAgICAgICAgICAgICBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgICBpZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICByZXNvbHZlKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICByZWplY3QoZXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzKGksIGFyZ3NbaV0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gUHJvbWlzZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVqZWN0KHZhbHVlKTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJhY2UgPSBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1Byb21pc2UucmFjZSBhY2NlcHRzIGFuIGFycmF5JykpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZShhcnJbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLy8gVXNlIHBvbHlmaWxsIGZvciBzZXRJbW1lZGlhdGUgZm9yIHBlcmZvcm1hbmNlIGdhaW5zXG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9XG4gIC8vIEB0cy1pZ25vcmVcbiAgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiZcbiAgICBmdW5jdGlvbihmbikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc2V0SW1tZWRpYXRlKGZuKTtcbiAgICB9KSB8fFxuICBmdW5jdGlvbihmbikge1xuICAgIHNldFRpbWVvdXRGdW5jKGZuLCAwKTtcbiAgfTtcblxuUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSkge1xuICAgIGNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQcm9taXNlO1xuIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbiAoVU1EKSB0byBzdXBwb3J0IEFNRCwgQ29tbW9uSlMvTm9kZS5qcywgUmhpbm8sIGFuZCBicm93c2Vycy5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ3N0YWNrZnJhbWUnLCBbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5TdGFja0ZyYW1lID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBmdW5jdGlvbiBfaXNOdW1iZXIobikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFN0YWNrRnJhbWUoZnVuY3Rpb25OYW1lLCBhcmdzLCBmaWxlTmFtZSwgbGluZU51bWJlciwgY29sdW1uTnVtYmVyLCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKGZ1bmN0aW9uTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldEZ1bmN0aW9uTmFtZShmdW5jdGlvbk5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QXJncyhhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsZU5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRGaWxlTmFtZShmaWxlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmVOdW1iZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRMaW5lTnVtYmVyKGxpbmVOdW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2x1bW5OdW1iZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRDb2x1bW5OdW1iZXIoY29sdW1uTnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U291cmNlKHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTdGFja0ZyYW1lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgZ2V0RnVuY3Rpb25OYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mdW5jdGlvbk5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEZ1bmN0aW9uTmFtZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25OYW1lID0gU3RyaW5nKHYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEFyZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFyZ3M7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEFyZ3M6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJncyBtdXN0IGJlIGFuIEFycmF5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFyZ3MgPSB2O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE5PVEU6IFByb3BlcnR5IG5hbWUgbWF5IGJlIG1pc2xlYWRpbmcgYXMgaXQgaW5jbHVkZXMgdGhlIHBhdGgsXG4gICAgICAgIC8vIGJ1dCBpdCBzb21ld2hhdCBtaXJyb3JzIFY4J3MgSmF2YVNjcmlwdFN0YWNrVHJhY2VBcGlcbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC93aWtpL0phdmFTY3JpcHRTdGFja1RyYWNlQXBpIGFuZCBHZWNrbydzXG4gICAgICAgIC8vIGh0dHA6Ly9teHIubW96aWxsYS5vcmcvbW96aWxsYS1jZW50cmFsL3NvdXJjZS94cGNvbS9iYXNlL25zSUV4Y2VwdGlvbi5pZGwjMTRcbiAgICAgICAgZ2V0RmlsZU5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVOYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXRGaWxlTmFtZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsZU5hbWUgPSBTdHJpbmcodik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TGluZU51bWJlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZU51bWJlcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0TGluZU51bWJlcjogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIGlmICghX2lzTnVtYmVyKHYpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTGluZSBOdW1iZXIgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5saW5lTnVtYmVyID0gTnVtYmVyKHYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldENvbHVtbk51bWJlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uTnVtYmVyO1xuICAgICAgICB9LFxuICAgICAgICBzZXRDb2x1bW5OdW1iZXI6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICBpZiAoIV9pc051bWJlcih2KSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NvbHVtbiBOdW1iZXIgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb2x1bW5OdW1iZXIgPSBOdW1iZXIodik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U291cmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFNvdXJjZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gU3RyaW5nKHYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSB0aGlzLmdldEZ1bmN0aW9uTmFtZSgpIHx8ICd7YW5vbnltb3VzfSc7XG4gICAgICAgICAgICB2YXIgYXJncyA9ICcoJyArICh0aGlzLmdldEFyZ3MoKSB8fCBbXSkuam9pbignLCcpICsgJyknO1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gdGhpcy5nZXRGaWxlTmFtZSgpID8gKCdAJyArIHRoaXMuZ2V0RmlsZU5hbWUoKSkgOiAnJztcbiAgICAgICAgICAgIHZhciBsaW5lTnVtYmVyID0gX2lzTnVtYmVyKHRoaXMuZ2V0TGluZU51bWJlcigpKSA/ICgnOicgKyB0aGlzLmdldExpbmVOdW1iZXIoKSkgOiAnJztcbiAgICAgICAgICAgIHZhciBjb2x1bW5OdW1iZXIgPSBfaXNOdW1iZXIodGhpcy5nZXRDb2x1bW5OdW1iZXIoKSkgPyAoJzonICsgdGhpcy5nZXRDb2x1bW5OdW1iZXIoKSkgOiAnJztcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbk5hbWUgKyBhcmdzICsgZmlsZU5hbWUgKyBsaW5lTnVtYmVyICsgY29sdW1uTnVtYmVyO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBTdGFja0ZyYW1lO1xufSkpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qKlxuICogTUlUIExpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctcHJlc2VudCwgRWxhc3RpY3NlYXJjaCBCVlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG5cbmltcG9ydCB7IGluaXQsIGFwbSwgYXBtQmFzZSwgQXBtQmFzZSB9IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgeyBUcmFjZXIgfSBmcm9tICdvcGVudHJhY2luZy9saWIvdHJhY2VyJ1xuaW1wb3J0IHsgY3JlYXRlVHJhY2VyIGFzIGNyZWF0ZUVsYXN0aWNUcmFjZXIgfSBmcm9tICdAZWxhc3RpYy9hcG0tcnVtLWNvcmUnXG5cbmZ1bmN0aW9uIGNyZWF0ZVRyYWNlcihhcG1CYXNlKSB7XG4gIC8qKlxuICAgKiBJZiB0aGUgcGxhdGZvcm0gaXMgbm90IHN1cHBvcnRlZCwgcmV0dXJuXG4gICAqIHRoZSBkZWZhdWx0IHRyYWNlciBmcm9tIE9UXG4gICAqL1xuICBpZiAoYXBtQmFzZS5fZGlzYWJsZSkge1xuICAgIHJldHVybiBuZXcgVHJhY2VyKClcbiAgfVxuICByZXR1cm4gY3JlYXRlRWxhc3RpY1RyYWNlcihhcG1CYXNlLnNlcnZpY2VGYWN0b3J5KVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmVsYXN0aWNBcG0pIHtcbiAgd2luZG93LmVsYXN0aWNBcG0uY3JlYXRlVHJhY2VyID0gY3JlYXRlVHJhY2VyLmJpbmQoXG4gICAgd2luZG93LmVsYXN0aWNBcG0sXG4gICAgd2luZG93LmVsYXN0aWNBcG1cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVUcmFjZXJcbmV4cG9ydCB7IGNyZWF0ZVRyYWNlciwgaW5pdCwgYXBtLCBhcG1CYXNlLCBBcG1CYXNlIH1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBREE7QUFHQTtBQVZBO0FBWUE7QUFiQTtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBREE7QUFHQTtBQVZBO0FBWUE7QUFiQTtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQWZBO0FBQ0E7QUFpQkE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFSQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBREE7QUFKQTtBQUpBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7OztBQzFVQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTlCQTtBQWdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdERBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBREE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYQTtBQUNBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuREE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFEQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7OztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUpBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7OztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBRkE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBSkE7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7OztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFOQTtBQVFBO0FBQ0E7QUFEQTtBQVRBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUZBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUZBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQWJBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBVEE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBREE7QUFHQTtBQVpBO0FBQ0E7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7Ozs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqWEE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFSQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSkE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7OztBQ1hBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQURBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRkE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFDQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7OztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFIQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBTkE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQWJBO0FBbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7OztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFGQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7OztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZEE7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQWpCQTtBQW1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7QUM5VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7OztBQ3ZGQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQUE7QUFBQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFEQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7O0FDaFpBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBOzs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN1QkE7QUFDQTtBQWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQVdBO0FBQ0E7QUFJQTtBQUNBO0FBSUE7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUtBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQVNBO0FBTUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQU9BO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFnQkE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlTQTtBQUtBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0E7Ozs7Ozs7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsYUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7O0FDeE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7O0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsYUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTs7Ozs7O0EiLCJzb3VyY2VSb290IjoiIn0=