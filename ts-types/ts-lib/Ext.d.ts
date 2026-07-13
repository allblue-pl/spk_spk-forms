import { SpockyExt } from "spocky";
export default class Ext extends SpockyExt {
    constructor();
    onParseLayoutNode(layoutNode: any): void;
    _getFieldInfo(layoutNode: any): string;
    _getFieldLayoutContent(fieldName: string): Array<any>;
    _onParseLayoutNode_Field(layoutNode: any): void;
    _onParseLayoutNode_Message(layoutNode: any): void;
}
