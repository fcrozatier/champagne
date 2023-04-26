import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
	return navigator?.connection?.effectiveType ?? '';
}

/**
 * @typedef Options
 * @type {object}
 * @property {{ [s: string]: any; } | ArrayLike<any>} params
 * @property {string} path
 * @property {string} analyticsId
 * @property {boolean} [debug] optional debug mode
 */

/**
 * @param {import("web-vitals").Metric} metric
 * @param {Options} options
 */
function sendToAnalytics(metric, options) {
	const page = Object.entries(options.params).reduce(
		(acc, [key, value]) => acc.replace(value, `[${key}]`),
		options.path
	);

	const body = {
		dsn: options.analyticsId, // qPgJqYH9LQX5o31Ormk8iWhCxZO
		id: metric.id, // v2-1653884975443-1839479248192
		page, // /blog/[slug]
		href: location.href, // https://{my-example-app-name-here}/blog/my-test
		event_name: metric.name, // TTFB
		value: metric.value.toString(), // 60.20000000298023
		speed: getConnectionSpeed() // 4g
	};

	if (options.debug) {
		console.log('[Analytics]', metric.name, JSON.stringify(body, null, 2));
	}

	const blob = new Blob([new URLSearchParams(body).toString()], {
		// This content type is necessary for `sendBeacon`
		type: 'application/x-www-form-urlencoded'
	});
	if (navigator.sendBeacon) {
		navigator.sendBeacon(vitalsUrl, blob);
	} else
		fetch(vitalsUrl, {
			body: blob,
			method: 'POST',
			credentials: 'omit',
			keepalive: true
		});
}

/**
 * @param {Options} options
 */
export function webVitals(options) {
	try {
		onFID((metric) => sendToAnalytics(metric, options));
		onTTFB((metric) => sendToAnalytics(metric, options));
		onLCP((metric) => sendToAnalytics(metric, options));
		onCLS((metric) => sendToAnalytics(metric, options));
		onFCP((metric) => sendToAnalytics(metric, options));
	} catch (err) {
		console.error('[Analytics]', err);
	}
}
