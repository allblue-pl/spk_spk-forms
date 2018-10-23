'use strict';

const
    spocky = require('spocky')
;

export default class TextField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-group {{divClass}} ","$validator.divClass"],"_data-spk-field":["{{formName}}:{{fieldInfo}}"]},["label",{"_show":["{{fullFieldName}}_Label"],"for":["{{fieldName}}"],"class":["{{labelClass}}}"]},"{{fieldLabel}}"],["div",{"class":["textField {{field.fieldClass}}"]},["span",{"_elem":["{{fullFieldName}}_Field"]}],["p",{"_show":["validator.hasErrors"],"_repeat":["validator.errors:errorMessage"],"class":["error"]},"{{errorMessage}}"]]]];
    }


    constructor()
    {
        super(TextField.Content);
    }

}
