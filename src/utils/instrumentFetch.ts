

import {
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  getClient,
  getCurrentScope,
  getDynamicSamplingContextFromClient,
  getDynamicSamplingContextFromSpan,
  getIsolationScope,
  hasTracingEnabled,
  setHttpStatus,
  spanToTraceHeader,
  startInactiveSpan,
} from '@sentry/core';
import type { Client, HandlerDataFetch, Scope, Span, SpanOrigin } from '@sentry/types';
import {
  BAGGAGE_HEADER_NAME,
  dynamicSamplingContextToSentryBaggageHeader,
  generateSentryTraceHeader,
  isInstanceOf,
  parseUrl,
} from '@sentry/utils';

type PolymorphicRequestHeaders =
  | Record<string, string | undefined>
  | Array<[string, string]>
  | {
      [key: string]: any;
      append: (key: string, value: string) => void;
      get: (key: string) => string | null | undefined;
    };

export function instrumentFetchRequest(
  handlerData: HandlerDataFetch,
  shouldCreateSpan: (url: string) => boolean,
  shouldAttachHeaders: (url: string) => boolean,
  spans: Record<string, Span>,
  spanOrigin: SpanOrigin = 'auto.http.browser',
): Span | undefined {
  if (!hasTracingEnabled() || !handlerData.fetchData) {
    return undefined;
  }

  const shouldCreateSpanResult = shouldCreateSpan(handlerData.fetchData.url);

  if (handlerData.endTimestamp && shouldCreateSpanResult) {
    const spanId = handlerData.fetchData.__span;
    if (!spanId) return;

    const span = spans[spanId];
    if (span) {
      endSpan(span, handlerData);
      delete spans[spanId];
    }
    return undefined;
  }

  const scope = getCurrentScope();
  const client = getClient();

  const { method, url } = handlerData.fetchData;

  const fullUrl = getFullURL(url);
  const host = fullUrl ? parseUrl(fullUrl).host : undefined;

  const span = shouldCreateSpanResult
    ? startInactiveSpan({
        name: `${method} ${url}`,
        onlyIfParent: true,
        attributes: {
          url,
          type: 'fetch',
          'http.method': method,
          'http.url': fullUrl,
          'server.address': host,
          [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin,
        },
        op: 'http.client',
      })
    : undefined;

  if (span) {
    handlerData.fetchData.__span = span.spanContext().spanId;
    spans[span.spanContext().spanId] = span;
  }

  if (shouldAttachHeaders(handlerData.fetchData.url) && client) {
    const request: string | Request = handlerData.args[0];
    handlerData.args[1] = handlerData.args[1] || {};
    const options: { [key: string]: any } = handlerData.args[1];
    options.headers = addTracingHeadersToFetchRequest(request, client, scope, options, span);
  }

  return span;
}

export function addTracingHeadersToFetchRequest(
  request: string | unknown,
  client: Client,
  scope: Scope,
  options: {
    headers?: {
      [key: string]: string[] | string | undefined;
    } | PolymorphicRequestHeaders;
  },
  requestSpan?: Span,
): PolymorphicRequestHeaders | undefined {
  const span = requestSpan || scope.getSpan();

  const isolationScope = getIsolationScope();
  const { traceId, spanId, sampled, dsc } = {
    ...isolationScope.getPropagationContext(),
    ...scope.getPropagationContext(),
  };

  const sentryTraceHeader = span
    ? spanToTraceHeader(span)
    : generateSentryTraceHeader(traceId, spanId, sampled);

  const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(
    dsc || (span ? getDynamicSamplingContextFromSpan(span) : getDynamicSamplingContextFromClient(traceId, client, scope))
  );

  const headers =
    options.headers ||
    (typeof Request !== 'undefined' && isInstanceOf(request, Request) ? (request as Request).headers : undefined);

  if (!headers) {
    return { 'sentry-trace': sentryTraceHeader, baggage: sentryBaggageHeader };
  } else if (typeof Headers !== 'undefined' && isInstanceOf(headers, Headers)) {
    const newHeaders = new Headers(headers as Headers);
    newHeaders.append('sentry-trace', sentryTraceHeader);
    if (sentryBaggageHeader) {
      newHeaders.append(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
    }
    return newHeaders as PolymorphicRequestHeaders;
  } else if (Array.isArray(headers)) {
    const newHeaders = [...headers, ['sentry-trace', sentryTraceHeader]];
    if (sentryBaggageHeader) {
      newHeaders.push([BAGGAGE_HEADER_NAME, sentryBaggageHeader]);
    }
    return newHeaders as PolymorphicRequestHeaders;
  } else {
    const existingBaggageHeader = 'baggage' in headers ? headers.baggage : undefined;
    const newBaggageHeaders: string[] = [];

    if (Array.isArray(existingBaggageHeader)) {
      newBaggageHeaders.push(...existingBaggageHeader);
    } else if (existingBaggageHeader) {
      newBaggageHeaders.push(existingBaggageHeader);
    }

    if (sentryBaggageHeader) {
      newBaggageHeaders.push(sentryBaggageHeader);
    }

    return {
      ...(headers as Exclude<typeof headers, Headers>),
      'sentry-trace': sentryTraceHeader,
      baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(',') : undefined,
    };
  }
}

function getFullURL(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return undefined;
  }
}

function endSpan(span: Span, handlerData: HandlerDataFetch): void {
  if (handlerData.response) {
    setHttpStatus(span, handlerData.response.status);

    const contentLength =
      handlerData.response?.headers?.get('content-length');

    if (contentLength) {
      const contentLengthNum = parseInt(contentLength);
      if (contentLengthNum > 0) {
        span.setAttribute('http.response_content_length', contentLengthNum);
      }
    }
  } else if (handlerData.error) {
    span.setStatus('internal_error');
  }

  span.end();
}