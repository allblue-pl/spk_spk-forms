import "./Ext.ts";
import spocky, { Layout } from "spocky";

import spkForms from "./index.ts";
import Field from "./Field.ts";

import { type FormValidator } from "./ts-types.ts";
import type { TS0RawObject } from "@allblue/ts0";

export default class Form {
    #fields: {[fieldName: string]: Field};
    #formName: string;
    #fullFormName: string;
    #layout: Layout;


    get fields(): {[fieldName: string]: Field} {
        return this.#fields;
    }

    get l(): Layout {
        console.warn(`'l() is deprecated. Use layout() instead.'`, new Error());

        return this.#layout;
    }

    get layout(): Layout {
        return this.#layout;
    }


    constructor(layout: Layout, formName: string) {
        this.#layout = layout;
        this.#formName = formName;
        this.#fullFormName = `spkForms_${formName}`;

        this.#fields = {};

        if (!('spk-field' in layout.$data)) {
            if (spocky.Debug)
                console.warn('No spk-fields in layout.', new Error());
            return;
        }

        for (let field of layout.$data['spk-field']) {
            let separatorIndex = field.indexOf(':');
            
            let formName = field.substring(0, separatorIndex);
            if (formName !== this.#formName)
                continue;

            let fieldInfo = JSON.parse(field.substring(separatorIndex + 1));

            for (let attrName in fieldInfo) {
                fieldInfo[attrName] = fieldInfo[attrName]
                    .replace(/\\"/g, '"')
                    .replace(/\\\$/g, '$');
            }

            this.#fields[fieldInfo.name] = new Field(this, layout, fieldInfo);
        }
    }

    clear(): void {
        for (let fieldName in this.#fields)
            this.#fields[fieldName].clear();

        this.clearValidator();
        this.clearMessage();
    }

    clearMessage(): void {
        let messageFound = false;
        if ('spk-form-message' in this.#layout.$data) {
            if (this.#layout.$data['spk-form-message'].includes(this.#formName))
                messageFound = true;
        }
        if (!messageFound)
            return;

        this.#layout.$fields = {
            [`${this.#fullFormName}_Message_Class`]: '',
            [`${this.#fullFormName}_Message`]: '',
            [`${this.#fullFormName}_Message_Show`]: false,
        };
    }

    clearValidator(): void {
        for (let fieldName in this.#fields)
            this.#fields[fieldName].clearValidator();
    }

    getField(fieldName: string): Field {
        if (!(fieldName in this.#fields))
            throw new Error(`Field '${fieldName}' does not exist.`);

        return this.#fields[fieldName];
    }

    getFiles(): {[fieldName: string]: any} {
        let values: {[fieldName: string]: any} = {};

        for (let fieldName in this.#fields) {
            if (this.#fields[fieldName].info.type === 'Message')
                continue;
            if (this.#fields[fieldName].info.type === 'Text')
                continue;

            let value = this.#fields[fieldName].value;
            if (!(value instanceof File))
                continue;

            values[fieldName] = this.#fields[fieldName].value;
        }

        return values;
    }

    getValues(): TS0RawObject {
        let values: TS0RawObject = {};

        for (let fieldName in this.#fields) {
            if (this.#fields[fieldName].info.type === 'Message')
                continue;
            if (this.#fields[fieldName].info.type === 'Text')
                continue;

            let value = this.#fields[fieldName].value;
            if (value instanceof File)
                continue;

            values[fieldName] = this.#fields[fieldName].value;
        }

        return values;
    }

    setDisabled(disabled: boolean): void {
        for (let fieldName in this.#fields)
            this.#fields[fieldName].setDisabled(disabled);
    }

    setMessage(message: string, messageClass: string): void {
        let messageFound = false;
        if ('spk-form-message' in this.layout.$data) {
            if (this.layout.$data['spk-form-message'].includes(this.#formName))
                messageFound = true;
        }
        if (!messageFound) {
            if (spkForms.debug)
                console.warn(`Message field not found in form '${this.#formName}'.`);
        }

        this.layout.$fields = {
            [`${this.#fullFormName}_Message_Class`]: messageClass,
            [`${this.#fullFormName}_Message`]: message,
            [`${this.#fullFormName}_Message_Show`]: true,
        };
    }

    setMessage_Error(message: string): void {
        this.setMessage(message, 'alert-danger');
    }

    setMessage_Success(message: string): void {
        this.setMessage(message, 'alert-success');
    }

    setValidator(validatorInfo: FormValidator): void {
        this.clearMessage();
        this.clearValidator();

        for (let fieldName in validatorInfo.fields) {
            if (!(fieldName in this.#fields)) {
                if (spkForms.debug)
                    console.warn(`Field '${fieldName}' does not exist in form.`)
                continue;
            }

            this.#fields[fieldName].setValidator(validatorInfo.fields[fieldName]);
        }

        if (validatorInfo.errors.length > 0) {
            this.setMessage_Error(validatorInfo.errors.join(' '));
        }
    }

    setValues(values: {[fieldName: string]: any}, ignoreNotExisting: boolean = false): void {
        for (let fieldName in values) {
            if (!(fieldName in this.#fields)) {
                if (spkForms.debug && !ignoreNotExisting) {
                    console.warn(`Field '${fieldName}' does not exist. Cannot set value.`, 
                            new Error());
                }

                continue;
            }

            this.#fields[fieldName].value = values[fieldName];
        }
    }

}