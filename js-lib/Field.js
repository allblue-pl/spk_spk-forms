'use strict';


export default class Field
{

    constructor(layout, fieldInfo)
    {
        this._layout = layout;
        this._info = fieldInfo;

        this._fullName = `spkForms_${fieldInfo.form}_${fieldInfo.name}`;

        let lFields = {};
        lFields[`${this._fullName}_Label`] = 'label' in this._info ? this._info.label : '';        

        this._layout.$fields = lFields;
    }

}