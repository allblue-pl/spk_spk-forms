'use strict';

const
    js0 = require('js0'),
    spocky = require('spocky'),

    spkForms = require('.'),
    Field = require('./Field')
;

export default class Form
{

    get fields() {
        return this._fields;
    }


    constructor(layout, formName)
    {
        js0.args(arguments, spocky.Layout, 'string');

        if (!spkForms.extInitialized)
            throw new Error('Ext not initialized.');

        this.l = layout;
        this.formName = formName;
        this.fullFormName = `spkForms_${formName}`;

        this._fields = {};

        if (!('spk-field' in layout.$data)) {
            if (spocky.Debug)
                console.warn('No spk-fields in layout.', new Error());
            return;
        }

        for (let field of layout.$data['spk-field']) {
            let separatorIndex = field.indexOf(':');
            
            let formName = field.substring(0, separatorIndex);
            if (formName !== this.formName)
                continue;

            let fieldInfo = JSON.parse(field.substring(separatorIndex + 1));
            for (let attrName in fieldInfo) {
                fieldInfo[attrName] = fieldInfo[attrName]
                    .replace(/\\"/g, '"')
                    .replace(/\\\$/g, '$');
            }

            this._fields[fieldInfo.name] = new Field(layout, fieldInfo);
        }
    }

    clear()
    {
        for (let fieldName in this._fields)
            this._fields[fieldName].clear();

        this.clearValidator();
        this.clearMessage();
    }

    clearMessage()
    {
        let messageFound = false;
        if ('spk-form-message' in this.l.$data) {
            if (this.l.$data['spk-form-message'].includes(this.formName))
                messageFound = true;
        }
        if (!messageFound)
            return;

        this.l.$fields = {
            [`${this.fullFormName}_Message_Class`]: '',
            [`${this.fullFormName}_Message`]: '',
            [`${this.fullFormName}_Message_Show`]: false,
        };
    }

    clearValidator()
    {
        for (let fieldName in this._fields)
            this._fields[fieldName].clearValidator();
    }

    getValues()
    {
        let values = {};

        for (let fieldName in this._fields) {
            if (this._fields[fieldName].info.type === 'Message')
                continue;
            if (this._fields[fieldName].info.type === 'Text')
                continue;

            values[fieldName] = this._fields[fieldName].value;
        }

        return values;
    }

    setDisabled(disabled)
    {
        js0.args(arguments, 'boolean');

        for (let fieldName in this._fields)
            this._fields[fieldName].setDisabled(disabled);
    }

    setMessage(message, messageClass)
    {
        js0.args(arguments, 'string', 'string');

        let messageFound = false;
        if ('spk-form-message' in this.l.$data) {
            if (this.l.$data['spk-form-message'].includes(this.formName))
                messageFound = true;
        }
        if (!messageFound)
            throw new Error(`Message not found in form '${this.formName}'.`);

        this.l.$fields = {
            [`${this.fullFormName}_Message_Class`]: messageClass,
            [`${this.fullFormName}_Message`]: message,
            [`${this.fullFormName}_Message_Show`]: true,
        };
    }

    setMessage_Error(message)
    {
        this.setMessage(message, 'alert-danger');
    }

    setMessage_Success(message)
    {
        this.setMessage(message, 'alert-success');
    }

    setValidator(validator)
    {
        this.clearMessage();
        this.clearValidator();

        for (let fieldName in validator.fields) {
            if (!(fieldName in this._fields)) {
                if (spkForms.debug)
                    console.warn(`Field '${fieldName}' does not exist in form.`)
                continue;
            }

            this._fields[fieldName].setValidator(validator.fields[fieldName]);
        }

        if (validator.errors.length > 0) {
            this.setMessage_Error(validator.errors.join(' '));
        }
    }

    setValues(values, ignoreNotExisting = false)
    {
        js0.args(arguments, 'object', [ 'boolean', js0.Default ]);

        for (let fieldName in values) {
            if (!(fieldName in this._fields)) {
                if (spkForms.debug && !ignoreNotExisting) {
                    console.log('Test', ignoreNotExisting);
                    console.warn(`Field '${fieldName}' does not exist. Cannot set value.`, 
                            new Error());
                }

                continue;
            }

            this._fields[fieldName].value = values[fieldName];
        }
    }

}