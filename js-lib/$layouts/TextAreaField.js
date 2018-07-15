'use strict';

const
    spocky = require('spocky')
;

export default class TextAreaField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-group ${{fullFieldName}}.divClass ","$validator.divClass"],"_data-spk-field":["{{formName}}:{{fieldInfo}}"]},["label",{"_show":["{{fullFieldName}}_Label"],"for":["{{fieldName}}"],"class":["${{fullFieldName}}_LabelClass"]},"{{fieldLabel}}"],["div",{"class":["${{fullFieldName}}_FieldClass"]},["textarea",{"_elem":["{{fullFieldName}}_Field"],"id":["{{fullFieldName}}"],"name":["{{fieldName}}"],"placeholder":["{{fieldPlaceholder}}"],"class":["form-control ${{fullFieldName}}_Validator.fieldClass"],"rows":["{{fieldRows}}"]}],["p",{"_repeat":["{{fullFieldName}}_Validator.errors:errorMessage"],"class":["invalid-feedback"]},"$errorMessage"]]]];
    }


    constructor()
    {
        super(TextAreaField.Content);
    }

}
