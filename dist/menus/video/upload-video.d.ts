/**
 * @description 上传视频
 * @author wangfupeng
 */
import Editor from '../../editor/index';
export declare type ResType = {
    errno: number | string;
    data: string[];
};
declare class UploadVideo {
    private editor;
    constructor(editor: Editor);
    /**
     * 插入链接
     * @param iframe html标签
     */
    insertVideo(src: string): void;
    initVideoDomStr(src: string): string;
    /**
     * 上传视频
     * @param files 文件列表
     */
    uploadVideo(files: FileList | File[]): void;
}
export default UploadVideo;
