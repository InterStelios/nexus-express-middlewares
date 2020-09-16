import express, { Application } from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import probe from 'kube-probe';
import responseTime from 'response-time';
import timeout from 'connect-timeout';

export function applyCommonMiddlewares(application: ReturnType<typeof express> | Application) {
  application.use(helmet());
  application.use(compression());
  application.use(bodyParser.urlencoded({ extended: true }));
  application.use(bodyParser.json());
  application.use(responseTime());
  application.use(timeout('15s'));
  probe(application, {
    readinessURL: '/healthz',
    livenessURL: '/healthz',
  });
}
