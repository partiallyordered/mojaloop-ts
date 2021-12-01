import got, { OptionsOfJSONResponseBody } from 'got';
import {
  MlApiResponse,
  REQUEST_OPTS,
  Options,
  OptionsOfThrowMlError,
  defaultOpts,
  handleOptions,
  handleResult,
  serialize,
} from './shared';
import {
  AccountId,
  LedgerParticipant,
  ParticipantLimit,
  AccountWithPosition,
  FspName,
  Currency,
  Limit,
} from './types';
import { strict as assert } from 'assert';
import { v4 as uuidv4 } from 'uuid';

type UUIDv4 = typeof uuidv4;

export async function getParticipants(
  basePath: string,
): Promise<LedgerParticipant[]>;

export async function getParticipants(
  basePath: string,
  opts: OptionsOfThrowMlError,
): Promise<LedgerParticipant[]>;

export async function getParticipants(
  basePath: string,
  opts: Options,
): Promise<MlApiResponse<LedgerParticipant[]>>;

export async function getParticipants(
  basePath: string,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<LedgerParticipant[] | MlApiResponse<LedgerParticipant[]>> {
  const allOpts = handleOptions(opts);
  const result = await got.get<LedgerParticipant[]>(`${basePath}/participants`, REQUEST_OPTS);
  return handleResult<LedgerParticipant[]>(result, allOpts.throwMlError);
}

export async function getParticipantsLimits(
  basePath: string,
): Promise<ParticipantLimit[]>;

export async function getParticipantsLimits(
  basePath: string,
  opts: OptionsOfThrowMlError,
): Promise<ParticipantLimit[]>;

export async function getParticipantsLimits(
  basePath: string,
  opts: Options,
): Promise<MlApiResponse<ParticipantLimit[]>>;

export async function getParticipantsLimits(
  basePath: string,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<ParticipantLimit[] | MlApiResponse<ParticipantLimit[]>> {
  const allOpts = handleOptions(opts);
  const result = await got.get<ParticipantLimit[]>(`${basePath}/participants/limits`, REQUEST_OPTS);
  return handleResult<ParticipantLimit[]>(result, allOpts.throwMlError);
}

export async function getParticipantAccounts(
  basePath: string,
  participant: FspName,
): Promise<AccountWithPosition[]>;

export async function getParticipantAccounts(
  basePath: string,
  participant: FspName,
  opts: OptionsOfThrowMlError,
): Promise<AccountWithPosition[]>;

export async function getParticipantAccounts(
  basePath: string,
  participant: FspName,
  opts: Options,
): Promise<MlApiResponse<AccountWithPosition[]>>;

export async function getParticipantAccounts(
  basePath: string,
  participant: FspName,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<AccountWithPosition[] | MlApiResponse<AccountWithPosition[]>> {
  const allOpts = handleOptions(opts);
  const result = await got.get<AccountWithPosition[]>(`${basePath}/participants/${participant}/accounts`, REQUEST_OPTS);
  return handleResult<AccountWithPosition[]>(result, allOpts.throwMlError);
}

export async function createParticipant(
  basePath: string,
  name: FspName,
): Promise<null>;

export async function createParticipant(
  basePath: string,
  name: FspName,
  opts: OptionsOfThrowMlError,
): Promise<null>;

export async function createParticipant(
  basePath: string,
  name: FspName,
  opts: Options,
): Promise<MlApiResponse<null>>;

export async function createParticipant(
  basePath: string,
  name: FspName,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<null | MlApiResponse<null>> {
  const allOpts = handleOptions(opts);
  const re = /^[0-9a-zA-Z]{2,30}$/;
  assert(re.test(name), `Participant name must match ${re}`);
  const requestOpts: OptionsOfJSONResponseBody = {
    ...REQUEST_OPTS,
    body: serialize({
      name,
    }),
  };
  const apiResult = await got.post<null>(`${basePath}/participants`, requestOpts);
  return handleResult<null>(apiResult, allOpts.throwMlError);
}


export async function postInitialPositionAndLimits(
  basePath: string,
  name: FspName,
  currency: Currency,
  limit: Limit,
  initialPosition: number,
): Promise<null>;

export async function postInitialPositionAndLimits(
  basePath: string,
  name: FspName,
  currency: Currency,
  limit: Limit,
  initialPosition: number,
  opts: OptionsOfThrowMlError,
): Promise<null>;

export async function postInitialPositionAndLimits(
  basePath: string,
  name: FspName,
  currency: Currency,
  limit: Limit,
  initialPosition: number,
  opts: Options,
): Promise<MlApiResponse<null>>;

export async function postInitialPositionAndLimits(
  basePath: string,
  name: FspName,
  currency: Currency,
  limit: Limit,
  initialPosition: number,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<null | MlApiResponse<null>> {
  const allOpts = handleOptions(opts);
  const requestOpts: OptionsOfJSONResponseBody = {
    ...REQUEST_OPTS,
    body: serialize({
      currency,
      limit,
      initialPosition,
    }),
  };
  const apiResult = await got.post<null>(`${basePath}/participants/${name}/initialPositionAndLimits`, requestOpts);
  return handleResult<null>(apiResult, allOpts.throwMlError);
}

export type FundsInOutAction = 'recordFundsIn' | 'recordFundsOutPrepareReserve' | 'recordFundsOutCommit';
export interface FundsInOutRequest {
  externalReference: string;
  action: FundsInOutAction;
  reason: string;
  amount: {
    amount: number;
    currency: Currency;
  };
  transferId: UUIDv4;
}

export async function fundsInOut(
  basePath: string,
  participant: FspName,
  account: AccountId,
  request: FundsInOutRequest,
): Promise<null>;

export async function fundsInOut(
  basePath: string,
  participant: FspName,
  account: AccountId,
  request: FundsInOutRequest,
  opts: OptionsOfThrowMlError,
): Promise<null>;

export async function fundsInOut(
  basePath: string,
  participant: FspName,
  account: AccountId,
  request: FundsInOutRequest,
  opts: Options,
): Promise<MlApiResponse<null>>;

export async function fundsInOut(
  basePath: string,
  participant: FspName,
  account: AccountId,
  request: FundsInOutRequest,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<null | MlApiResponse<null>> {
  const allOpts = handleOptions(opts);
  const requestOpts: OptionsOfJSONResponseBody = {
    ...REQUEST_OPTS,
    body: serialize(request),
  };
  const apiResult = await got.post<null>(`${basePath}/participants/${participant}/accounts/${account}`, requestOpts);
  return handleResult<null>(apiResult, allOpts.throwMlError);
}

export default {
  getParticipants,
  getParticipantsLimits,
  getParticipantAccounts,
  createParticipant,
  postInitialPositionAndLimits,
  fundsInOut,
}
