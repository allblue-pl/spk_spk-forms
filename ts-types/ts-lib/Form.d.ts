import "./Ext.ts";
import { Layout } from "spocky";
import { type FormValidator } from "./ts-types.ts";
export default class Form {
    #private;
    get fields(): {
        [fieldName: string]: any;
    };
    get l(): Layout;
    get layout(): Layout;
    constructor(layout: Layout, formName: string);
    clear(): void;
    clearMessage(): void;
    clearValidator(): void;
    getField(fieldName: string): any;
    getFiles(): {
        [fieldName: string]: any;
    };
    getValues(): {
        [fieldName: string]: any;
    };
    setDisabled(disabled: boolean): void;
    setMessage(message: string, messageClass: string): void;
    setMessage_Error(message: string): void;
    setMessage_Success(message: string): void;
    setValidator(validatorInfo: FormValidator): void;
    setValues(values: {
        [fieldName: string]: any;
    }, ignoreNotExisting?: boolean): void;
}
