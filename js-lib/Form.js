'use strict';

const
    js0 = require('js0'),
    spocky = require('spocky'),

    Field = require('./Field')
;

export default class Form
{

    constructor(layout, formName)
    {
        js0.args(arguments, spocky.Layout, 'string');

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

}