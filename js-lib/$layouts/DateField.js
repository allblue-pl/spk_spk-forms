'use strict';

const
    spocky = require('spocky')
;

export default class DateField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-group ${{fullFieldName}}.divClass {{fullFieldName}}_Validator.divClass"],"_data-spk-field":["{{formName}}:{{fieldInfo}}"]},["label",{"_show":["{{fullFieldName}}_Label"],"for":["{{fieldName}}"],"class":["${{fullFieldName}}_LabelClass"]},"{{fieldLabel}}"],["div",{"class":["${{fullFieldName}}_FieldClass"]},["div",{"class":["input-group mb-3"]},["input",{"_elem":["{{fullFieldName}}_Field"],"type":["text"],"id":["{{fullFieldName}}"],"name":["{{fieldName}}"],"class":["form-control datetimepicker ${{fullFieldName}}_Validator.fieldClass"],"placeholder":["{{fieldPlaceholder}}"]}],["span",{"class":["input-group-append"]},["span",{"_elem":["{{fullFieldName}}_Calendar"],"class":["input-group-text fa fa-calendar"]}]],["p",{"_repeat":["{{fullFieldName}}_Validator.errors:errorMessage"],"class":["invalid-feedback"]},"$errorMessage"]]]]];
    }


    constructor()
    {
        super(DateField.Content);
    }

}
