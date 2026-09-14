/**
 * CloudFront viewer-request function for Astro's directory-style static output.
 *
 * It redirects unprefixed public URLs to the visitor's preferred supported
 * language, then maps localized directory routes to their index documents.
 * Requests that already name a file are
 * unchanged. A missing route therefore asks S3 for a missing
 * <route>/index.html and retains the origin's real 404 response.
 */
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
  var locale = 'ko';
  var bestQuality = -1;

  for (var index = 0; index < ranges.length; index += 1) {
    var parts = ranges[index].trim().split(';');
    var language = parts[0].trim().split('-')[0];
    if (language !== 'ko' && language !== 'en') continue;

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

  var aliases = {
    '/online-judge': '/work/bear-oj/',
    '/outta-certificate': '/work/outta-certificates/',
    '/yonsei-mileage': '/work/yonsei-mileage/',
    '/process-management': '/work/coryose-process/',
    '/clubroom': '/work/clubroom/',
    '/9c-account-recovery': '/work/#nine-corporation',
    '/zible': '/work/#zible',
    '/spacey-passion': '/work/spacey-passion/'
  };
  var legacy = uri.replace(/\/$/, '');
  var localized = {
    '': '/',
    '/about': '/about/',
    '/privacy': '/privacy/',
    '/work': '/work/',
    '/work/archive': '/work/archive/',
    '/work/blis': '/work/blis/',
    '/work/coryose-process': '/work/coryose-process/',
    '/work/rp2040-hub75': '/work/rp2040-hub75/',
    '/work/bear-oj': '/work/bear-oj/',
    '/work/yonsei-mileage': '/work/yonsei-mileage/',
    '/work/outta-certificates': '/work/outta-certificates/',
    '/work/monika': '/work/monika/',
    '/work/cadence': '/work/cadence/',
    '/work/shepherd': '/work/shepherd/',
    '/work/fairtrade': '/work/fairtrade/',
    '/work/spacey-passion': '/work/spacey-passion/',
    '/work/clubroom': '/work/clubroom/'
  };
  if (localized[legacy] !== undefined) {
    return localeRedirect(request, localized[legacy]);
  }
  if (aliases[legacy]) {
    return localeRedirect(request, aliases[legacy]);
  }

  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.split('/').pop().includes('.')) {
    request.uri += '/index.html';
  }

  return request;
}
