import { protocol } from 'mojaloop-voodoo-client';
import { OptionsOfJSONResponseBody, Response } from 'got';
type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<ObjectType, Exclude<keyof ObjectType, KeysType>>;
type Merge<FirstType, SecondType> = Except<FirstType, Extract<keyof FirstType, keyof SecondType>> & SecondType;

export function serialize(body: any): string {
  return JSON.stringify(body);
}

export enum ResponseKind {
  MojaloopError,
  Okay,
}

export type MlApiResponse<T> =
  | { kind: ResponseKind.MojaloopError; body: protocol.ErrorResponse }
  | { kind: ResponseKind.Okay; body: T };

export class ApiError extends Error {
  response: protocol.ErrorResponse;
  constructor(response: protocol.ErrorResponse) {
    super(response.errorInformation.errorDescription);
    this.response = response;
  }
}

export const REQUEST_OPTS: OptionsOfJSONResponseBody = {
  isStream: false,
  resolveBodyOnly: false,
  responseType: 'json',
  throwHttpErrors: false,
  headers: {
    'content-type': 'application/json',
    'accept': 'application/json',
  },
};

export interface Options {
  throwMlError?: boolean;
}

export type RequiredOptions = Required<Options>;

export declare type OptionsOfThrowMlError = Merge<Options, {
  throwMlError?: true;
}>;

export const defaultOpts: OptionsOfThrowMlError = {
  throwMlError: true,
}

export function handleOptions(opts: Options): RequiredOptions {
  return {
    throwMlError: opts.throwMlError === undefined ? true : opts.throwMlError,
  };
}

export function handleResult<T>(result: Response<T | protocol.ErrorResponse>, throwMlError: boolean): T | MlApiResponse<T> {
  if (result.statusCode >= 200 && result.statusCode < 300) {
    if (throwMlError) {
      return result.body as T;
    }
    return {
      kind: ResponseKind.Okay,
      body: result.body as T,
    };
  }
  if (throwMlError) {
    throw new ApiError(result.body as protocol.ErrorResponse);
  }
  return {
    kind: ResponseKind.MojaloopError,
    body: result.body as protocol.ErrorResponse,
  };
}
