/**
 * CloudFront viewer-request function generated from Astro's static output.
 *
 * Route data is injected by scripts/generate-cloudfront-function.mjs after
 * Astro finishes building. Edit the behavior here, not the generated file in
 * dist/.
 */
var supportedLocales = __SUPPORTED_LOCALES__;
var defaultLocale = __DEFAULT_LOCALE__;
var redirects = __REDIRECTS__;

function preferredLocale(headers) {
  var header = headers && headers['accept-language'];
  var headerValues = header && header.multiValue ? header.multiValue : (header ? [header] : []);
  var raw = '';
  for (var headerIndex = 0; headerIndex < headerValues.length; headerIndex += 1) {
    if (headerValues[headerIndex].value) {
      raw += (raw ? ',' : '') + headerValues[headerIndex].value.toLowerCase();
    }
  }
  var ranges = raw.split(',');
  var locale = defaultLocale;
  var bestQuality = -1;

  for (var index = 0; index < ranges.length; index += 1) {
    var parts = ranges[index].trim().split(';');
    var language = parts[0].trim().split('-')[0];
    if (supportedLocales.indexOf(language) === -1) continue;

    var quality = 1;
    for (var parameterIndex = 1; parameterIndex < parts.length; parameterIndex += 1) {
      var parameter = parts[parameterIndex].trim();
      if (/^q\s*=/.test(parameter)) quality = parseFloat(parameter.replace(/^q\s*=\s*/, ''));
    }
    if (!(quality > 0)) continue;
    if (quality > bestQuality) {
      locale = language;
      bestQuality = quality;
    }
  }

  return locale;
}

function serializedQueryString(querystring) {
  var pairs = [];
  if (!querystring) return '';
  for (var key in querystring) {
    if (!Object.prototype.hasOwnProperty.call(querystring, key)) continue;
    var parameter = querystring[key];
    var values = parameter.multiValue || [parameter];
    for (var index = 0; index < values.length; index += 1) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(values[index].value || ''));
    }
  }
  return pairs.length ? '?' + pairs.join('&') : '';
}

function localeRedirect(request, path) {
  var splitPath = path.split('#');
  var fragment = splitPath[1] ? '#' + splitPath[1] : '';
  var destination = '/' + preferredLocale(request.headers) + splitPath[0] + serializedQueryString(request.querystring) + fragment;
  return {
    statusCode: 302,
    statusDescription: 'Found',
    headers: {
      location: { value: destination },
      'cache-control': { value: 'private, no-store' },
      vary: { value: 'Accept-Language' }
    }
  };
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var route = uri.replace(/\/$/, '');

  if (Object.prototype.hasOwnProperty.call(redirects, route)) {
    return localeRedirect(request, redirects[route]);
  }

  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.split('/').pop().includes('.')) {
    request.uri += '/index.html';
  }

  return request;
}
