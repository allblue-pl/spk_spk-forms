'use strict';

const
    spocky = require('spocky')
;

export default class CheckboxField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-check my-4 {{divClass}} {{fullFieldName}}_Validator.divClass {{divClass}"],"_data-spk-field":["{{formName}}:{{fieldInfo}}"]},["div",{"class":["{{fieldClass}}"]},["input",{"_elem":["{{fullFieldName}}_Field"],"type":["checkbox"],"id":["{{fullFieldName}}"],"name":["{{fieldName}}"],"class":["form-check-input ","${{fullFieldName}}_Validator.fieldClass"],"placeholder":["{{fieldPlaceholder}}"]}]],["label",{"_show":["{{fullFieldName}}_Label"],"for":["{{fullFieldName}}"],"class":["form-check-label {{labelClass}}"]},["p",{"_repeat":["{{fullFieldName}}_Validator.errors:errorMessage"],"class":["text-danger"]},"$errorMessage"],"{{fieldLabel}}"]]];
    }


    constructor()
    {
        super(CheckboxField.Content);
    }

}
