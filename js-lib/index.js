'use strict';

const
    spocky = require('spocky'),

    $layouts = require('./$layouts')
;

export class Ext extends spocky.Ext
{

    constructor()
    { super();

    }

    parseLayout(element)
    {
        if (element.type !== 'ab-form-field')
            return;

        let layoutSource = this._getFieldLayoutSource(element.attribs.type);
        layoutSource = Layout.Replace('{{field.name}}', element.attribs.name);

        element.content = [];
        for (let layoutNode of layoutSource)
            element.content.push(layoutNode);
    }


    _getFieldLayoutSource(fieldName)
    {
        let layoutName = fieldName[0].toUpperCase() + fieldName.substring(1) + 
                'Field';

        if (!(layoutName in $layouts))
            throw new Error(`Field type '${fieldName}' does not exist.`);

        return $layouts[layoutName].Source;
    }

}