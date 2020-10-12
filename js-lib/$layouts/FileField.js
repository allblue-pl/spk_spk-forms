'use strict';

const
    spocky = require('spocky')
;

export default class FileField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-group {{divClass}} {{fullFieldName}}_Validator.divClass"],"_data-spk-field":["{{formName}}:{{fieldInfo}}"]},["label",{"_show":["{{fullFieldName}}_Label"],"for":["{{fullFieldName}}"],"class":["{{labelClass}}"]},"{{fieldLabel}}"],["div",{"class":["{{field.fieldClass}}"]},["input",{"_elem":["{{fullFieldName}}_Field"],"type":["file"],"accept":["${{fullFieldName}}_Accept"],"id":["{{fullFieldName}}"],"name":["{{fieldName}}"],"class":["form-control ","${{fullFieldName}}_Validator.fieldClass"]}],["p",{"_repeat":["{{fullFieldName}}_Validator.errors:errorMessage"],"class":["invalid-feedback"]},"$errorMessage"]]]];
    }


    constructor()
    {
        super(FileField.Content);
    }

}
