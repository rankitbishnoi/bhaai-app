/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

import { Pariwar } from "./Pariwar";

export type Profile = Profile1 & Profile2;
export type Profile1 = CustomerBase;
export type PariwarRole = PariwarRole1 & PariwarRole2;
export type PariwarRole1 = PariwarRoleBase;

export interface CustomerBase {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email: string;
    phoneNumber?: string;
    password: string;
}
export interface Profile2 {
    pariwarRoles: PariwarRole[];
}
export interface PariwarRoleBase {
    role: string;
    customerId?: string;
}
export interface PariwarRole2 {
    _id: string;
    pariwarId: Pariwar;
}
