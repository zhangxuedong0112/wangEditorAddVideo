/**
 * @description 视频相关的配置
 * @author hutianhao
 */

import { EMPTY_FN } from '../utils/const'
import Editor from '@/editor'
import { ResType } from '@/menus/img/upload-img'

export type UploadVideoHooksType = {
    before?: (
        xhr: XMLHttpRequest,
        editor: Editor,
        files: File[]
    ) => { prevent: boolean; msg: string } | void
    success?: (xhr: XMLHttpRequest, editor: Editor, result: ResType) => void
    fail?: (xhr: XMLHttpRequest, editor: Editor, err: ResType | string) => void
    error?: (xhr: XMLHttpRequest, editor: Editor) => void
    timeout?: (xhr: XMLHttpRequest, editor: Editor) => void
    customInsert?: (
        inserVideo: (this: Editor, src: string) => void,
        result: ResType,
        editor: Editor
    ) => void
}

export default {
    // 显示“插入网络视频”
    showLinkVideo: true,

    // accept
    uploadVideoAccept: ['audio/mp4', 'video/mp4'],

    // 服务端地址
    uploadVideoServer: '',

    // 使用 base64 存储视频
    uploadVideoShowBase64: false,

    // 上传视频的最大体积，默认 50M
    uploadVideoMaxSize: 50 * 1024 * 1024,

    // 一次最多上传多少个视频
    uploadVideoMaxLength: 1,

    // 自定义上传视频的名称
    uploadVideoName: '',

    // 上传视频自定义参数
    uploadVideoParams: {},

    // 上传视频自定义 header
    uploadVideoHeaders: {},

    // 钩子函数
    uploadVideoHooks: {},

    // 上传图片超时时间 ms
    uploadVideoTimeout: 60 * 1000,

    // 自定义上传
    customUploadVideo: null,

    // 插入网络视频前的回调函数
    onlineVideoCheck: (video: string): string | boolean => {
        return true
    },

    // 插入网络视频成功之后的回调函数
    onlineVideoCallback: EMPTY_FN,
}
