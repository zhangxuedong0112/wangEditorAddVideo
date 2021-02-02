/**
 * @description 视频相关的配置
 * @author hutianhao
 */
import { EMPTY_FN } from '../utils/const';
import Editor from '@/editor';
import { ResType } from '@/menus/img/upload-img';
export declare type UploadVideoHooksType = {
    before?: (xhr: XMLHttpRequest, editor: Editor, files: File[]) => {
        prevent: boolean;
        msg: string;
    } | void;
    success?: (xhr: XMLHttpRequest, editor: Editor, result: ResType) => void;
    fail?: (xhr: XMLHttpRequest, editor: Editor, err: ResType | string) => void;
    error?: (xhr: XMLHttpRequest, editor: Editor) => void;
    timeout?: (xhr: XMLHttpRequest, editor: Editor) => void;
    customInsert?: (inserVideo: (this: Editor, src: string) => void, result: ResType, editor: Editor) => void;
};
declare const _default: {
    showLinkVideo: boolean;
    uploadVideoAccept: string[];
    uploadVideoServer: string;
    uploadVideoShowBase64: boolean;
    uploadVideoMaxSize: number;
    uploadVideoMaxLength: number;
    uploadVideoName: string;
    uploadVideoParams: {};
    uploadVideoHeaders: {};
    uploadVideoHooks: {};
    uploadVideoTimeout: number;
    customUploadVideo: null;
    onlineVideoCheck: (video: string) => string | boolean;
    onlineVideoCallback: typeof EMPTY_FN;
};
export default _default;
