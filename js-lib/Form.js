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

        if (!('spk-field' in layout.$data))
            throw new Error('No spk-fields in layout.');

        this._fields = {};
        for (let field of layout.$data['spk-field']) {
            let separatorIndex = field.indexOf(':');
            
            let formName = field.substring(0, separatorIndex);
            if (formName !== formName)
                continue;

            let fieldInfo = JSON.parse(field.substring(separatorIndex + 1));

            this._fields[fieldInfo.name] = new Field(layout, fieldInfo);
        }
    }

    getValues()
    {
        let values = {};

        for (let fieldName in this._fields)
            values[fieldName] = this._fields[fieldName].value;

        return values;
    }

    setValidator(validator)
    {
        for (let fieldName in this._fields)
            this._fields[fieldName].clearValidator();

        for (let fieldName in validator.fields) {
            if (!(fieldName in this._fields)) {
                if (spkForms.debug)
                    console.warn(`Field '${fieldName}' does not exist in form.`)
                continue;
            }

            this._fields[fieldName].setValidator(validator.fields[fieldName]);
        }
    }

    setValues(values, ignoreNotExisting = false)
    {
        js0.args(arguments, 'object', [ 'boolean', js0.Default ]);

        for (let fieldName in values) {
            if (!(fieldName in this._fields)) {
                if (spkForms.debug && !ignoreNotExisting) {
                    console.warn(`Field '${fieldName}' does not exist. Cannot set value.`, 
                            new Error());
                }

                continue;
            }

            this._fields[fieldName].value = values[fieldName];
        }
    }

}