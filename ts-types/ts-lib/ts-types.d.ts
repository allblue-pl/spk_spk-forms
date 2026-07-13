import { type TS0ValueType } from "@allblue/ts0";
export type FieldValidator = {
    errors: Array<string>;
    state: string;
    successes: Array<string>;
    valid: boolean;
    value: string;
    warnings: Array<string>;
};
export declare const presets_FieldValidator: TS0ValueType;
export type FormValidator = {
    errors: Array<string>;
    fields: {
        [fieldName: string]: FieldValidator;
    };
    state: string;
    valid: boolean;
};
export declare const presets_FormValidator: TS0ValueType;
