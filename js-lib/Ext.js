'use strict';

const
    js0 = require('js0'),
    spocky = require('spocky'),

    $layouts = require('./$layouts')
;

export default class Ext extends spocky.Ext
{

    constructor()
    { super();

    }

    onParseLayoutNode(layoutNode)
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
        let fullFieldName = `spkForms_${formName}_${fieldName}`;
        let fieldInfo = this._getFieldInfo(layoutNode);

        let layoutContent = this._getFieldLayoutContent(layoutNode.attribs.type[0]);

        spocky.Layout.Replace(layoutContent, '{{formName}}', formName)
        spocky.Layout.Replace(layoutContent, '{{fieldName}}', fieldName);
        spocky.Layout.Replace(layoutContent, '{{fullFieldName}}', fullFieldName);
        spocky.Layout.Replace(layoutContent, '{{fieldInfo}}', `${fieldInfo}`);

        spocky.Layout.Replace(layoutContent, '{{fieldLabel}}', 
                'label' in layoutNode.attribs ? layoutNode.attribs.label[0] : '');
        spocky.Layout.Replace(layoutContent, '{{fieldPlaceholder}}', 
                'placeholder' in layoutNode.attribs ? layoutNode.attribs.placeholder[0] : '');
        spocky.Layout.Replace(layoutContent, '{{fieldRows}}', 
                 'rows' in layoutNode.attribs ? layoutNode.attribs.rows[0] : '3');

        layoutNode.content = [];
        for (let newLayoutNode of layoutContent)
            layoutNode.content.push(newLayoutNode);
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

        if (!(layoutName in $layouts))
            throw new Error(`Field type '${fieldName}' does not exist.`);

        return $layouts[layoutName].Content;
    }

}