/// <reference types="express" />
declare module "kube-probe" {
    import { RequestHandler, Application } from "express";
    interface KubeProbeOptions {
        readinessURL?: string;
        livenessURL?: string;
        readinessCallback?: RequestHandler;
        livenessCallback?: RequestHandler;
    }
    function probe(app: Application, options: KubeProbeOptions): void;
    export = probe;
}
