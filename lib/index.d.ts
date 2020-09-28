import express, { Application } from 'express';
declare type Disabled = {
    helmet?: boolean;
    bodyParser?: boolean;
    responseTime?: boolean;
    timeout?: boolean;
    compression?: boolean;
    healthz?: boolean;
};
export declare function applyCommonMiddlewares(application: ReturnType<typeof express> | Application, disabled?: Disabled): void;
export {};
