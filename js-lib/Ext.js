'use strict';

const
    js0 = require('js0'),
    spocky = require('spocky'),

    $layouts = require('./$layouts'),
    spkForms = require('.');
;

export default class Ext extends spocky.Ext
{

    constructor()
    { super();
        spkForms.extInitialized = true;
    }

    onParseLayoutNode(layoutNode)
    {
        this._onParseLayoutNode_Field(layoutNode);
        this._onParseLayoutNode_Message(layoutNode);
    }


    _getFieldInfo(layoutNode)
    {
        let dataTypes = [ 'input-type', 'label', 'placeholder', 'label-class', 
                'field-class' ];
        let data = {};

        for (let attrName in layoutNode.attribs) {
            data[attrName] = layoutNode.attribs[attrName]
                .join('')
                .replace(/"/g, '\\"')
                .replace(/\$/, '\\$');
        }

        return JSON.stringify(data);
    }

    _getFieldLayoutContent(fieldName)
    {
        let layoutName = `${fieldName}Field`;

        if (layoutName === 'DateTimeField')
            layoutName = 'DateField';

        if (!(layoutName in $layouts))
            throw new Error(`Field type '${fieldName}' does not exist.`);

        return $layouts[layoutName].Content;
    }

    _onParseLayoutNode_Field(layoutNode)
    {
        if (layoutNode.type !== 'spk-form-field')
            return;

        if (!('form' in layoutNode.attribs))    
            throw new Error(`No 'form' set for 'spk-form-field'.`);
        if (!('name' in layoutNode.attribs))    
            throw new Error(`No 'name' set for 'spk-form-field'.`);
        if (!('type' in layoutNode.attribs))
            throw new Error(`No 'type' set for 'spk-form-field' '${layoutNode.attribs.name[0]}.`);

        let formName = layoutNode.attribs.form[0];
        let fieldName = layoutNode.attribs.name[0];
        let fullFieldName = `spkForms_${formName}_Fields_${fieldName}`;
        let fieldInfo = this._getFieldInfo(layoutNode);

        let layoutContent = this._getFieldLayoutContent(layoutNode.attribs.type[0]);

        spocky.Layout.Replace(layoutContent, '{{formName}}', formName)
        spocky.Layout.Replace(layoutContent, '{{fieldName}}', fieldName);
        spocky.Layout.Replace(layoutContent, '{{fullFieldName}}', fullFieldName);
        spocky.Layout.Replace(layoutContent, '{{fieldInfo}}', `${fieldInfo}`);

        spocky.Layout.Replace(layoutContent, '{{fieldLabel}}', 
                'label' in layoutNode.attribs ? layoutNode.attribs.label.join('') : '');
        spocky.Layout.Replace(layoutContent, '{{fieldPlaceholder}}', 
                'placeholder' in layoutNode.attribs ? layoutNode.attribs.placeholder.join('') : '');

        spocky.Layout.Replace(layoutContent, '{{labelClass}}', 
                'label-class' in layoutNode.attribs ? layoutNode.attribs['label-class'].join('') : '');
        spocky.Layout.Replace(layoutContent, '{{fieldClass}}', 
                'field-class' in layoutNode.attribs ? layoutNode.attribs['field-class'].join('') : '');
        spocky.Layout.Replace(layoutContent, '{{divClass}}', 
                'div-class' in layoutNode.attribs ? layoutNode.attribs['div-class'].join('') : '');

        spocky.Layout.Replace(layoutContent, '{{fieldRows}}', 
                 'rows' in layoutNode.attribs ? layoutNode.attribs.rows.join('') : '3');

        /* Special */
        if (layoutNode.attribs.type[0] === 'Input') {
            spocky.Layout.Replace(layoutContent, '{{inputType}}',
                    'input-type' in layoutNode.attribs ? 
                    layoutNode.attribs['input-type'][0] : 'text');
        }

        layoutNode.content = [];
        for (let newLayoutNode of layoutContent)
            layoutNode.content.push(newLayoutNode);
    }

    _onParseLayoutNode_Message(layoutNode)
    {
        if (layoutNode.type !== 'spk-form-message')
            return;

        let layoutContent = $layouts.Message.Content;

        if (!('form' in layoutNode.attribs)) {
            console.warn(`No 'form' attribute in '${layoutNode.type}'.`);
            return;
        }

        let formName = layoutNode.attribs.form[0];
        let fullFormName = `spkForms_${formName}`;

        spocky.Layout.Replace(layoutContent, '{{formName}}', formName);
        spocky.Layout.Replace(layoutContent, '{{fullFormName}}', fullFormName);

        layoutNode.content = [];
        for (let newLayoutNode of layoutContent)
            layoutNode.content.push(newLayoutNode);
    }

}