import got, { OptionsOfJSONResponseBody } from 'got';
import { URLSearchParams } from 'url';
import {
  serialize,
  ResponseKind,
  MlApiResponse,
  ApiError,
  REQUEST_OPTS,
  Options,
  OptionsOfThrowMlError,
  defaultOpts,
  handleOptions,
  handleResult,
} from './shared';
import {
  Currency,
  ParticipantId,
  SettlementWindowId,
  ParticipantCurrencyId,
  SettlementState,
  DateTime,
  Settlement,
  ErrorResponse,
  SettlementWindow,
  SettlementWindowState,
  SettlementId,
} from './types';

interface SettlementsQueryBase {
  currency?: Currency;
  participantId?: ParticipantId;
  settlementWindowId?: SettlementWindowId;
  accountId?: ParticipantCurrencyId;
  state?: SettlementState;
  fromDateTime?: DateTime;
  toDateTime?: DateTime;
  fromSettlementWindowDateTime?: DateTime;
  toSettlementWindowDateTime?: DateTime;
}
export interface SettlementsQueryCurrencyRequired extends SettlementsQueryBase { currency: Currency }
export interface SettlementsQueryParticipantIdRequired extends SettlementsQueryBase { participantId: ParticipantId }
export interface SettlementsQuerySettlementWindowIdRequired extends SettlementsQueryBase { settlementWindowId: SettlementWindowId }
export interface SettlementsQueryAccountIdRequired extends SettlementsQueryBase { accountId: ParticipantCurrencyId }
export interface SettlementsQueryStateRequired extends SettlementsQueryBase { state: SettlementState }
export interface SettlementsQueryFromDateTimeRequired extends SettlementsQueryBase { fromDateTime: DateTime }
export interface SettlementsQueryToDateTimeRequired extends SettlementsQueryBase { toDateTime: DateTime }
export interface SettlementsQueryFromSettlementWindowDateTimeRequired extends SettlementsQueryBase { fromSettlementWindowDateTime: DateTime }
export interface SettlementsQueryToSettlementWindowDateTimeRequired extends SettlementsQueryBase { toSettlementWindowDateTime: DateTime }

type GetSettlementsRequest =
  | SettlementsQueryCurrencyRequired
  | SettlementsQueryParticipantIdRequired
  | SettlementsQuerySettlementWindowIdRequired
  | SettlementsQueryAccountIdRequired
  | SettlementsQueryStateRequired
  | SettlementsQueryFromDateTimeRequired
  | SettlementsQueryToDateTimeRequired
  | SettlementsQueryFromSettlementWindowDateTimeRequired
  | SettlementsQueryToSettlementWindowDateTimeRequired;

export async function getSettlements(
  basePath: string,
  query: GetSettlementsRequest,
  opts?: OptionsOfThrowMlError,
): Promise<Settlement[]>;

export async function getSettlements(
  basePath: string,
  query: GetSettlementsRequest,
  opts?: Options,
): Promise<MlApiResponse<Settlement[]>>;

export async function getSettlements(
  basePath: string,
  query: GetSettlementsRequest,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<Settlement[] | MlApiResponse<Settlement[]>> {
  const requestOpts: OptionsOfJSONResponseBody = {
    ...REQUEST_OPTS,
    searchParams: new URLSearchParams(Object.entries(query)),
  };
  const result = await got.get<Settlement[] | ErrorResponse>(
    `${basePath}/v2/settlements`,
    requestOpts,
  );
  if (result.statusCode >= 200 && result.statusCode < 300) {
    if (opts.throwMlError) {
      return result.body as Settlement[];
    }
    return {
      kind: ResponseKind.Okay,
      body: result.body as Settlement[],
    };
  }
  // Need to handle poorly-typed response from central settlement API.
  // See: https://github.com/mojaloop/project/issues/2344
  if (result.statusCode === 400 && (result.body as ErrorResponse).errorInformation !== undefined) {
    return (opts.throwMlError)
      ? [] as Settlement[]
      : {
          kind: ResponseKind.Okay,
          body: [],
        };
  }
  if (opts.throwMlError) {
    throw new ApiError(result.body as ErrorResponse);
  }
  return {
    kind: ResponseKind.MojaloopError,
    body: result.body as ErrorResponse,
  };
}

export async function closeSettlementWindow(
  basePath: string,
  id: SettlementWindowId,
  reason: string,
  opts?: OptionsOfThrowMlError,
): Promise<SettlementWindow>;

export async function closeSettlementWindow(
  basePath: string,
  id: SettlementWindowId,
  reason: string,
  opts?: Options,
): Promise<MlApiResponse<SettlementWindow>>;

// Returns the *new* settlement window, not the closed one
export async function closeSettlementWindow(
  basePath: string,
  id: SettlementWindowId,
  reason: string,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<SettlementWindow | MlApiResponse<SettlementWindow>> {
  const allOpts = handleOptions(opts);
  const requestOpts: OptionsOfJSONResponseBody = {
    ...REQUEST_OPTS,
    body: serialize({
      state: 'CLOSED',
      reason,
    }),
  };
  const apiResult = await got.post<SettlementWindow>(`${basePath}/v2/settlementWindows/${id}`, requestOpts);
  return handleResult<SettlementWindow>(apiResult, allOpts.throwMlError);
}

export interface CreateSettlementRequestBody {
  settlementModel: string;
  reason: string;
  settlementWindows: { id: SettlementWindowId }[];
}

export async function createSettlement(
  basePath: string,
  body: CreateSettlementRequestBody,
  opts?: OptionsOfThrowMlError,
): Promise<Settlement>;

export async function createSettlement(
  basePath: string,
  body: CreateSettlementRequestBody,
  opts?: Options,
): Promise<MlApiResponse<Settlement>>;

export async function createSettlement(
  basePath: string,
  body: CreateSettlementRequestBody,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<Settlement | MlApiResponse<Settlement>> {
  const allOpts = handleOptions(opts);
  const requestOpts: OptionsOfJSONResponseBody = {
    ...REQUEST_OPTS,
    body: serialize(body),
  };
  const result = await got.post<Settlement>(`${basePath}/v2/settlements`, requestOpts);
  return handleResult<Settlement>(result, allOpts.throwMlError);
}

interface SettlementWindowsQueryBase {
  currency?: Currency;
  participantId?: ParticipantId;
  state?: SettlementWindowState;
  fromDateTime?: DateTime;
  toDateTime?: DateTime;
}
export interface SettlementWindowsQueryCurrencyRequired extends SettlementWindowsQueryBase { currency: Currency }
export interface SettlementWindowsQueryParticipantIdRequired extends SettlementWindowsQueryBase { participantId: ParticipantId }
export interface SettlementWindowsQueryStateRequired extends SettlementWindowsQueryBase { state: SettlementWindowState }
export interface SettlementWindowsQueryFromDateTimeRequired extends SettlementWindowsQueryBase { fromDateTime: DateTime }
export interface SettlementWindowsQueryToDateTimeRequired extends SettlementWindowsQueryBase { toDateTime: DateTime }

export type GetSettlementWindowsRequest =
  | SettlementWindowsQueryCurrencyRequired
  | SettlementWindowsQueryParticipantIdRequired
  | SettlementWindowsQueryStateRequired
  | SettlementWindowsQueryFromDateTimeRequired
  | SettlementWindowsQueryToDateTimeRequired

export async function getSettlementWindows(
  basePath: string,
  query: GetSettlementWindowsRequest,
  opts?: OptionsOfThrowMlError,
): Promise<SettlementWindow[]>;

export async function getSettlementWindows(
  basePath: string,
  query: GetSettlementWindowsRequest,
  opts?: Options,
): Promise<MlApiResponse<SettlementWindow[]>>;

export async function getSettlementWindows(
  basePath: string,
  query: GetSettlementWindowsRequest,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<SettlementWindow[] | MlApiResponse<SettlementWindow[]>> {
  const requestOpts: OptionsOfJSONResponseBody = {
    ...REQUEST_OPTS,
    searchParams: new URLSearchParams(Object.entries(query)),
  };
  const result = await got.get<SettlementWindow[] | ErrorResponse>(
    `${basePath}/v2/settlementWindows`,
    requestOpts,
  );
  if (result.statusCode >= 200 && result.statusCode < 300) {
    if (opts.throwMlError) {
      return result.body as SettlementWindow[];
    }
    return {
      kind: ResponseKind.Okay,
      body: result.body as SettlementWindow[],
    };
  }
  // Need to handle poorly-typed response from central settlement API.
  // See: https://github.com/mojaloop/project/issues/2344
  if (result.statusCode === 400 && (result.body as ErrorResponse).errorInformation !== undefined) {
    return (opts.throwMlError)
      ? [] as SettlementWindow[]
      : {
          kind: ResponseKind.Okay,
          body: [],
        };
  }
  if (opts.throwMlError) {
    throw new ApiError(result.body as ErrorResponse);
  }
  return {
    kind: ResponseKind.MojaloopError,
    body: result.body as ErrorResponse,
  };
}

export async function getSettlementWindow(
  basePath: string,
  id: SettlementWindowId,
  opts?: OptionsOfThrowMlError,
): Promise<SettlementWindow>;

export async function getSettlementWindow(
  basePath: string,
  id: SettlementWindowId,
  opts?: Options,
): Promise<MlApiResponse<SettlementWindow>>;

export async function getSettlementWindow(
  basePath: string,
  id: SettlementWindowId,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<SettlementWindow | MlApiResponse<SettlementWindow>> {
  const allOpts = handleOptions(opts);
  const result = await got.get<SettlementWindow | ErrorResponse>(
    `${basePath}/v2/settlementWindows/${id}`,
    REQUEST_OPTS,
  );
  return handleResult<SettlementWindow>(result, allOpts.throwMlError);
}

export async function getSettlement(
  basePath: string,
  id: SettlementId,
  opts?: OptionsOfThrowMlError,
): Promise<Settlement>;

export async function getSettlement(
  basePath: string,
  id: SettlementId,
  opts?: Options,
): Promise<MlApiResponse<Settlement>>;

export async function getSettlement(
  basePath: string,
  id: SettlementId,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<Settlement | MlApiResponse<Settlement>> {
  const allOpts = handleOptions(opts);
  const result = await got.get<Settlement | ErrorResponse>(
    `${basePath}/v2/settlements/${id}`,
    REQUEST_OPTS,
  );
  return handleResult<Settlement>(result, allOpts.throwMlError);
}

export default {
  closeSettlementWindow,
  createSettlement,
  getSettlement,
  getSettlements,
  getSettlementWindow,
  getSettlementWindows,
}
