/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type PariwarRole = PariwarRole1 & PariwarRole2;
export type PariwarRole1 = PariwarRoleBase;
export type PariwarRoleList = PariwarRole[];

export interface PariwarRoleBase {
    role: string;
    customerId?: string;
}
export interface PariwarRole2 {
    _id: string;
    pariwarId: string;
}
