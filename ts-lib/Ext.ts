import { Layout, SpockyExt } from "spocky";
import $layouts from "../$layouts/index.ts";

export default class Ext extends SpockyExt {
    constructor() { 
        super();
    }

    onParseLayoutNode(layoutNode: any): void {
        this._onParseLayoutNode_Field(layoutNode);
        this._onParseLayoutNode_Message(layoutNode);
    }


    _getFieldInfo(layoutNode: any): string {
        // let dataTypes = [ 'input-type', 'label', 'placeholder', 'label-class', 
        //         'field-class' ];
        let data: {[attrName: string]: string} = {};

        for (let attrName in layoutNode.attribs) {
            data[attrName] = layoutNode.attribs[attrName]
                .join('')
                .replace(/"/g, '\\"')
                .replace(/\$/g, '\\$')
                .replace(/\?/g, '\\?');
        }

        return JSON.stringify(data);
    }

    _getFieldLayoutContent(fieldName: string): Array<any> {
        let layoutName = `${fieldName}Field`;

        if (layoutName === 'DateTimeField')
            layoutName = 'DateField';

        if (!(layoutName in $layouts))
            throw new Error(`Field type '${fieldName}' does not exist.`);

        return $layouts.getContent(layoutName);
    }

    _onParseLayoutNode_Field(layoutNode: any): void {
        if (layoutNode.type !== 'spk-form-field')
            return;

        if (!('form' in layoutNode.attribs))    
            throw new Error(`No 'form' set for 'spk-form-field'.`);
        if (!('name' in layoutNode.attribs))    
            throw new Error(`No 'name' set for 'spk-form-field'.`);
        if (!('type' in layoutNode.attribs))
            throw new Error(`No 'type' set for 'spk-form-field' '${layoutNode.attribs.name[0]}.`);

        let formName = layoutNode.attribs.form[0];
        let fullFormName = 'spkForms_' + layoutNode.attribs.form[0];
        let fieldName = layoutNode.attribs.name[0];
        let fullFieldName = `spkForms_${formName}_Fields_${fieldName}`;
        let fieldInfo = this._getFieldInfo(layoutNode);

        let layoutContent = this._getFieldLayoutContent(layoutNode.attribs.type[0]);

        let replaceArr = [
            [ '{{formName}}', formName ],
            [ '{{fullFormName}}', fullFormName ],
            [ '{{fieldName}}', fieldName ],
            [ '{{fullFieldName}}', fullFieldName ],
            [ '{{fieldInfo}}', fieldInfo ],

            [ '{{showLabel}}', 'show-label' in layoutNode.attribs 
                    ? layoutNode.attribs['show-label'].join('') : '?(true)' ],
            [ '{{fieldLabel}}', 'label' in layoutNode.attribs ? 
                    layoutNode.attribs.label.join('') : '\'\'' ],
            [ '{{fieldPlaceholder}}', 'placeholder' in layoutNode.attribs ? 
                    layoutNode.attribs.placeholder.join('') : '' ],

            [ '{{labelClass}}', 'label-class' in layoutNode.attribs ? 
                    layoutNode.attribs['label-class'].join('') : '' ],
            [ '{{fieldClass}}', 'field-class' in layoutNode.attribs ? 
                    layoutNode.attribs['field-class'].join('') : '' ],
            [ '{{divClass}}', 'div-class' in layoutNode.attribs ? 
                    layoutNode.attribs['div-class'].join('') : '' ],

            [ '{{fieldRows}}', 'rows' in layoutNode.attribs ? 
                    layoutNode.attribs.rows.join('') : '3' ],
        ];

        /* Special */
        if (layoutNode.attribs.type[0] === 'Input') {
            replaceArr.push(
                [ '{{inputType}}', 'input-type' in layoutNode.attribs ? 
                        layoutNode.attribs['input-type'].join('') : 'text' ]
            );
        }

        Layout.Replace(layoutContent, replaceArr);

        layoutNode.content = [];
        for (let newLayoutNode of layoutContent)
            layoutNode.content.push(newLayoutNode);
    }

    _onParseLayoutNode_Message(layoutNode: any): void {
        if (layoutNode.type !== 'spk-form-message')
            return;

        let layoutContent = $layouts.Message.Content;

        if (!('form' in layoutNode.attribs)) {
            console.warn(`No 'form' attribute in '${layoutNode.type}'.`);
            return;
        }

        let formName = layoutNode.attribs.form[0];
        let fullFormName = `spkForms_${formName}`;

        let replaceArr = [
            [ '{{formName}}', formName ],
            [ '{{fullFormName}}', fullFormName ],
        ];
        Layout.Replace(layoutContent, replaceArr);

        layoutNode.content = [];
        for (let newLayoutNode of layoutContent)
            layoutNode.content.push(newLayoutNode);
    }
}