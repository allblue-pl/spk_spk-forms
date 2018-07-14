'use strict';

const
    spocky = require('spocky')
;

export default class CheckboxField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-check my-4 ${{fullFieldName}}.divClass {{fullFieldName}}_Validator.divClass"],"_data-spk-field":["{{formName}}:{{fieldInfo}}"]},["input",{"_elem":["{{fullFieldName}}_Field"],"type":["checkbox"],"id":["{{fullFieldName}}"],"name":["{{fieldName}}"],"class":["form-check-input"],"placeholder":["{{fieldPlaceholder}}"]}],["label",{"_show":["{{fullFieldName}}_Label"],"for":["{{fullFieldName}}"],"class":["form-check-label ${{fullFieldName}}_LabelClass"]},"{{fieldLabel}}"],["p",{"_repeat":["{{fullFieldName}}_Validator.errors:errorMessage"],"class":["error"]},"$errorMessage"]]];
    }


    constructor()
    {
        super(CheckboxField.Content);
    }

}
