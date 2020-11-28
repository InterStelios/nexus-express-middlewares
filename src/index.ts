import express, { Application } from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import probe from 'kube-probe';
import responseTime from 'response-time';
import timeout from 'connect-timeout';
import rateLimit from 'express-rate-limit';

type Disabled = {
  helmet?: boolean;
  bodyParser?: boolean;
  responseTime?: boolean;
  timeout?: boolean;
  compression?: boolean;
  healthz?: boolean;
  version?: boolean;
  rateLimit?: boolean | { windowMs: number; max: number; skip: string };
};

export function applyCommonMiddlewares(
  application: ReturnType<typeof express>,
  disabled?: Disabled,
) {
  if (!disabled?.helmet) {
    application.use(helmet());
  }

  if (!disabled?.bodyParser) {
    application.use(bodyParser.urlencoded({ extended: true }));
    application.use(bodyParser.json());
  }

  if (!disabled?.compression) {
    application.use(compression());
  }

  if (!disabled?.responseTime) {
    application.use(responseTime());
  }

  if (!disabled?.timeout) {
    application.use(timeout('15s'));
  }

  if (!disabled?.healthz) {
    probe(application, {
      readinessURL: '/healthz',
      livenessURL: '/healthz',
    });
  }

  if (!disabled?.version) {
    application.get('/_version', (request, response) => {
      return response.json({
        env: process.env.NODE_ENV || 'not_provided',
        version: process.env.COMMIT_SHA || 'not_provided',
      });
    });
  }
  if (disabled && typeof disabled.rateLimit !== 'undefined') {
    if (typeof disabled.rateLimit === 'object') {
      const { windowMs, max, skip } = disabled.rateLimit;
      application.use(
        rateLimit({
          windowMs,
          max,
          skip(req) {
            const uriPaths = req.url.split('/');
            return !(uriPaths[uriPaths.length - 1] === skip);
          },
        }),
      );
    } else {
      application.use(
        rateLimit({
          windowMs: 1000 * 60 * 15,
          max: 200,
          skip(req) {
            const uriPaths = req.url.split('/');
            return !(uriPaths[uriPaths.length - 1] === 'graphql');
          },
        }),
      );
    }
  }
}
