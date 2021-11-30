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
import { LedgerParticipant, Limit } from './types';

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
): Promise<Limit[]>;

export async function getParticipantsLimits(
  basePath: string,
  opts: OptionsOfThrowMlError,
): Promise<Limit[]>;

export async function getParticipantsLimits(
  basePath: string,
  opts: Options,
): Promise<MlApiResponse<Limit[]>>;

export async function getParticipantsLimits(
  basePath: string,
  opts: OptionsOfThrowMlError | Options = defaultOpts,
): Promise<Limit[] | MlApiResponse<Limit[]>> {
  const allOpts = handleOptions(opts);
  const result = await got.get<Limit[]>(`${basePath}/participants/limits`, REQUEST_OPTS);
  return handleResult<Limit[]>(result, allOpts.throwMlError);
}

export default {
  getParticipants,
  getParticipantsLimits,
}
