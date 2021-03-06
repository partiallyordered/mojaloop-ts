import { protocol } from 'mojaloop-voodoo-client';
import { Merge } from 'type-fest';

export import ParticipantId = protocol.ParticipantId;
export import SettlementWindowId = protocol.SettlementWindowId;
export import ParticipantCurrencyId = protocol.ParticipantCurrencyId;
export import SettlementState = protocol.SettlementState;
export import DateTime = protocol.DateTime;
export import ErrorResponse = protocol.ErrorResponse;
export import SettlementWindow = protocol.SettlementWindow;
export import SettlementSettlementWindow = protocol.SettlementSettlementWindow;
export import SettlementWindowState = protocol.SettlementWindowState;
export import SettlementId = protocol.SettlementId;

export type IsActive = 1 | 0;

export type MinorUnit = 0 | 2 | 3 | 4 | '.';

export interface CurrencyData {
  alpha: Currency;
  numeric: number;
  minorUnit: MinorUnit;
}

export interface LedgerParticipant {
  name: FspName;
  id: string;
  created: string; // This is an annoyingly nested json string. I.e. { "created": "\"2021-08-20T08:27:30.000Z\"" }
  isActive: IsActive;
  accounts: LedgerAccount[];
}

export type LedgerAccountType = 'INTERCHANGE_FEE' | 'POSITION' | 'SETTLEMENT';

export type FspId = number;
export type FspName = string;
export type AccountId = number;

export interface LedgerAccount {
  id: AccountId;
  ledgerAccountType: LedgerAccountType;
  currency: Currency;
  isActive: IsActive;
}

export interface Limit {
  type: 'NET_DEBIT_CAP';
  value: number;
  alarmPercentage: number;
}

export interface ParticipantLimit {
  name: FspName;
  currency: Currency;
  limit: Limit;
}

// TODO: upstream this? Is it better as an enum, or a union?
export enum SettlementStatus {
  PendingSettlement = 'PENDING_SETTLEMENT',
  PsTransfersRecorded = 'PS_TRANSFERS_RECORDED',
  PsTransfersReserved = 'PS_TRANSFERS_RESERVED',
  PsTransfersCommitted = 'PS_TRANSFERS_COMMITTED',
  Settling = 'SETTLING',
  Settled = 'SETTLED',
  Aborted = 'ABORTED',
}

// TODO upstream this. Carefully. This was written with speed in mind, not accuracy. Are these
// properties definitely present in the spec?
export declare type Settlement = Merge<protocol.Settlement, {
  reason: string;
  state: SettlementStatus;
  participants: SettlementParticipant[];
}>;

export interface NetSettlementAmount {
  amount: number;
  currency: Currency;
}

export interface SettlementParticipantAccount {
  id: ParticipantCurrencyId;
  state: SettlementStatus;
  reason: string;
  netSettlementAmount: NetSettlementAmount;
}

// TODO: This needs to be reconciled with SettlementParticipant in mojaloop-voodoo-client. In
// particular, the type in mojaloop-voodoo-client should probably be called
// SettlementParticipantAccount instead of SettlementAccount
export interface SettlementParticipant {
  id: number;
  accounts: SettlementParticipantAccount[];
}

export interface AccountWithPosition extends LedgerAccount {
  value: number;
}

// TODO: this should be pushed upstream into mojaloop-voodoo-client
export type Currency =
  | 'AED'
  | 'AFN'
  | 'ALL'
  | 'AMD'
  | 'ANG'
  | 'AOA'
  | 'ARS'
  | 'AUD'
  | 'AWG'
  | 'AZN'
  | 'BAM'
  | 'BBD'
  | 'BDT'
  | 'BGN'
  | 'BHD'
  | 'BIF'
  | 'BMD'
  | 'BND'
  | 'BOB'
  | 'BOV'
  | 'BRL'
  | 'BSD'
  | 'BTN'
  | 'BWP'
  | 'BYN'
  | 'BZD'
  | 'CAD'
  | 'CDF'
  | 'CHE'
  | 'CHF'
  | 'CHW'
  | 'CLF'
  | 'CLP'
  | 'CNY'
  | 'COP'
  | 'COU'
  | 'CRC'
  | 'CUC'
  | 'CUP'
  | 'CVE'
  | 'CZK'
  | 'DJF'
  | 'DKK'
  | 'DOP'
  | 'DZD'
  | 'EGP'
  | 'ERN'
  | 'ETB'
  | 'EUR'
  | 'FJD'
  | 'FKP'
  | 'GBP'
  | 'GEL'
  | 'GHS'
  | 'GIP'
  | 'GMD'
  | 'GNF'
  | 'GTQ'
  | 'GYD'
  | 'HKD'
  | 'HNL'
  | 'HRK'
  | 'HTG'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'IQD'
  | 'IRR'
  | 'ISK'
  | 'JMD'
  | 'JOD'
  | 'JPY'
  | 'KES'
  | 'KGS'
  | 'KHR'
  | 'KMF'
  | 'KPW'
  | 'KRW'
  | 'KWD'
  | 'KYD'
  | 'KZT'
  | 'LAK'
  | 'LBP'
  | 'LKR'
  | 'LRD'
  | 'LSL'
  | 'LYD'
  | 'MAD'
  | 'MDL'
  | 'MGA'
  | 'MKD'
  | 'MMK'
  | 'MNT'
  | 'MOP'
  | 'MRU'
  | 'MUR'
  | 'MVR'
  | 'MWK'
  | 'MXN'
  | 'MXV'
  | 'MYR'
  | 'MZN'
  | 'NAD'
  | 'NGN'
  | 'NIO'
  | 'NOK'
  | 'NPR'
  | 'NZD'
  | 'OMR'
  | 'PAB'
  | 'PEN'
  | 'PGK'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'PYG'
  | 'QAR'
  | 'RON'
  | 'RSD'
  | 'RUB'
  | 'RWF'
  | 'SAR'
  | 'SBD'
  | 'SCR'
  | 'SDG'
  | 'SEK'
  | 'SGD'
  | 'SHP'
  | 'SLL'
  | 'SOS'
  | 'SRD'
  | 'SSP'
  | 'STN'
  | 'SVC'
  | 'SYP'
  | 'SZL'
  | 'THB'
  | 'TJS'
  | 'TMT'
  | 'TND'
  | 'TOP'
  | 'TRY'
  | 'TTD'
  | 'TWD'
  | 'TZS'
  | 'UAH'
  | 'UGX'
  | 'USD'
  | 'USN'
  | 'UYI'
  | 'UYU'
  | 'UYW'
  | 'UZS'
  | 'VED'
  | 'VES'
  | 'VND'
  | 'VUV'
  | 'WST'
  | 'XAF'
  | 'XAG'
  | 'XAU'
  | 'XBA'
  | 'XBB'
  | 'XBC'
  | 'XBD'
  | 'XCD'
  | 'XDR'
  | 'XOF'
  | 'XPD'
  | 'XPF'
  | 'XPT'
  | 'XSU'
  | 'XTS'
  | 'XUA'
  | 'XXX'
  | 'YER'
  | 'ZAR'
  | 'ZMW'
  | 'ZWL';
