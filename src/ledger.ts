import got from 'got';
import {
  MlApiResponse,
  REQUEST_OPTS,
  Options,
  OptionsOfThrowMlError,
  defaultOpts,
  handleOptions,
  handleResult,
} from './shared';
import {
  LedgerParticipant,
  ParticipantLimit,
  AccountWithPosition,
  FspName,
} from './types';

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
  opts: Options,
): Promise<MlApiResponse<AccountWithPosition[]>>;

export async function getParticipantAccounts(
  basePath: string,
  participant: FspName,
  opts: Options,
): Promise<AccountWithPosition[]>;

export async function getParticipantAccounts(
  basePath: string,
  participant: FspName,
  opts: Options,
): Promise<AccountWithPosition[] | MlApiResponse<AccountWithPosition[]>> {
  const allOpts = handleOptions(opts);
  const result = await got.get<AccountWithPosition[]>(`${basePath}/participants/${participant}/accounts`, REQUEST_OPTS);
  return handleResult<AccountWithPosition[]>(result, allOpts.throwMlError);
}

export default {
  getParticipants,
  getParticipantsLimits,
  getParticipantAccounts,
}
