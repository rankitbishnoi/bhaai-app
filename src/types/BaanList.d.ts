/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Baan = Baan1 & Baan2;
export type Baan1 = BaanBase;
export type BaanList = Baan[];

export interface BaanBase {
    firstName: string;
    lastName: string;
    fathersName: string;
    address: string;
    nickName: string;
    amount: number;
}
export interface Baan2 {
    _id: string;
    bhaaiId?: string;
}
