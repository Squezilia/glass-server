import {
  IncomingHttpHeaders as NodeHTTPIncomingHttpHeaders,
  OutgoingHttpHeaders as NodeHTTPOutgoingHttpHeaders,
} from "http2";

export type ExtractKeySignature<T, O> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: O;
};

export type IncomingHttpHeaders = ExtractKeySignature<
  NodeHTTPIncomingHttpHeaders,
  string | undefined
>;
export type OutgoingHttpHeaders = ExtractKeySignature<
  NodeHTTPOutgoingHttpHeaders,
  string | undefined
>;
