/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type BhaaiTotal = BhaaiTotal1 & BhaaiTotal2;
export type BhaaiTotal1 = Bhaai;
export type Bhaai = Bhaai1 & Bhaai2;
export type Bhaai1 = BhaaiBase;

export interface BhaaiBase {
    marriage: string;
    date: string;
}
export interface Bhaai2 {
    _id: string;
}
export interface BhaaiTotal2 {
    total?: number;
}
