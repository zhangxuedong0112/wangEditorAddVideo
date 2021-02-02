/**
 * @description 上传视频
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import { arrForEach, forEach } from '../../utils/util'
import post from '../../editor/upload/upload-core'
import Progress from '../../editor/upload/progress'

export type ResType = {
    errno: number | string
    data: string[]
}

class UploadVideo {
    private editor: Editor

    constructor(editor: Editor) {
        this.editor = editor
    }

    /**
     * 插入链接
     * @param iframe html标签
     */
    public insertVideo(src: string): void {
        const editor = this.editor

        editor.cmd.do(
            'insertHTML',
            '<p><br /></p>' + this.initVideoDomStr(src) + '<p><br /></p>'
        )

        // video添加后的回调
        editor.config.onlineVideoCallback(this.initVideoDomStr(src))
    }

    public initVideoDomStr(src: string): string {
        return `<video style="width:100%;max-height: 80%;"  src="${src}" controls="controls"></video>`
        // return `<iframe style="width:740px; min-height: 308px" src="${src}"></iframe>`
    }

    /**
     * 上传视频
     * @param files 文件列表
     */
    public uploadVideo(files: FileList | File[]): void {
        if (!files.length) {
            return
        }

        const editor = this.editor
        const config = editor.config

        // ------------------------------ i18next ------------------------------

        const i18nPrefix = 'validate.'
        const t = (text: string): string => {
            return editor.i18next.t(i18nPrefix + text)
        }

        // ------------------------------ 获取配置信息 ------------------------------

        // 服务端地址
        let uploadVideoServer = config.uploadVideoServer
        // base64 格式
        const uploadVideoShowBase64 = config.uploadVideoShowBase64
        // 视频最大体积
        const maxSize = config.uploadVideoMaxSize
        const maxSizeM = maxSize / 1024 / 1024
        // 一次最多上传视频数量
        const maxLength = config.uploadVideoMaxLength
        // 自定义 fileName
        const uploadFileName = config.uploadVideoName
        // 自定义参数
        const uploadVideoParams = config.uploadVideoParams

        // 自定义 header
        const uploadImgHeaders = config.uploadImgHeaders
        // 钩子函数
        const hooks = config.uploadVideoHooks
        // 上传视频超时时间
        const timeout = config.uploadVideoTimeout
        // // 跨域带 cookie
        const withCredentials = config.withCredentials
        // // 自定义上传视频
        const customUploadVideo = config.customUploadVideo

        if (!customUploadVideo) {
            // 没有 customUploadVideo 的情况下，需要如下两个配置才能继续进行视频上传
            if (!uploadVideoServer && !uploadVideoShowBase64) {
                return
            }
        }

        // ------------------------------ 验证文件信息 ------------------------------
        const resultFiles: File[] = []
        const errInfos: string[] = []
        arrForEach(files, file => {
            const name = file.name
            const size = file.size

            // chrome 低版本 name === undefined
            if (!name || !size) {
                return
            }

            if (/\.(mp4)$/i.test(name) === false) {
                // 后缀名不合法，不是视频
                errInfos.push(`【${name}】${t('不是视频')}`)
                return
            }

            if (maxSize < size) {
                // 上传视频过大
                errInfos.push(`【${name}】${t('大于')} ${maxSizeM}M`)
                return
            }

            // 验证通过的加入结果列表
            resultFiles.push(file)
        })
        // 抛出验证信息
        if (errInfos.length) {
            config.customAlert(`${t('视频验证未通过')}: \n` + errInfos.join('\n'), 'warning')
            return
        }
        if (resultFiles.length > maxLength) {
            config.customAlert(t('一次最多上传') + maxLength + t('个视频'), 'warning')
            return
        }

        // ------------------------------ 自定义上传 ------------------------------
        if (customUploadVideo && typeof customUploadVideo === 'function') {
            customUploadVideo(resultFiles, this.insertVideo.bind(this))

            // 阻止以下代码执行，重要！！！
            return
        }

        // ------------------------------ 上传视频 ------------------------------

        // 添加视频数据
        const formData = new FormData()
        resultFiles.forEach((file: File, index: number) => {
            let name = uploadFileName || file.name
            if (resultFiles.length > 1) {
                // 多个文件时，filename 不能重复
                name = name + (index + 1)
            }
            formData.append(name, file)
        })
        if (uploadVideoServer) {
            // 添加自定义参数
            const uploadVideoServerArr = uploadVideoServer.split('#')
            uploadVideoServer = uploadVideoServerArr[0]
            const uploadVideoServerHash = uploadVideoServerArr[1] || ''
            forEach(uploadVideoParams, (key: string, val: string) => {
                // 第二，将参数添加到 formData 中
                formData.append(key, val)
            })
            if (uploadVideoServerHash) {
                uploadVideoServer += '#' + uploadVideoServerHash
            }

            // 开始上传
            const xhr = post(uploadVideoServer, {
                timeout,
                formData,
                headers: uploadImgHeaders,
                withCredentials: !!withCredentials,
                beforeSend: xhr => {
                    if (hooks.before) return hooks.before(xhr, editor, resultFiles)
                },
                onTimeout: xhr => {
                    config.customAlert(t('上传视频超时'), 'error')
                    if (hooks.timeout) hooks.timeout(xhr, editor)
                },
                onProgress: (percent, e) => {
                    const progressBar = new Progress(editor)
                    if (e.lengthComputable) {
                        percent = e.loaded / e.total
                        progressBar.show(percent)
                    }
                },
                onError: xhr => {
                    config.customAlert(
                        t('上传视频错误'),
                        'error',
                        `${t('上传视频错误')}，${t('服务器返回状态')}: ${xhr.status}`
                    )
                    if (hooks.error) hooks.error(xhr, editor)
                },
                onFail: (xhr, resultStr) => {
                    config.customAlert(
                        t('上传视频失败'),
                        'error',
                        t('上传视频返回结果错误') + `，${t('返回结果')}: ` + resultStr
                    )
                    if (hooks.fail) hooks.fail(xhr, editor, resultStr)
                },
                onSuccess: (xhr, result: ResType) => {
                    if (hooks.customInsert) {
                        // 自定义插入视频
                        hooks.customInsert(this.insertVideo.bind(this), result, editor)
                        return
                    }
                    if (result.errno != '0') {
                        // 返回格式不对，应该为 { errno: 0, data: [...] }
                        config.customAlert(
                            t('上传视频失败'),
                            'error',
                            `${t('上传视频返回结果错误')}，${t('返回结果')} errno=${result.errno}`
                        )
                        if (hooks.fail) hooks.fail(xhr, editor, result)
                        return
                    }

                    // 成功，插入视频
                    const data = result.data
                    data.forEach(link => {
                        this.insertVideo(link)
                    })

                    // 钩子函数
                    if (hooks.success) hooks.success(xhr, editor, result)
                },
            })
            if (typeof xhr === 'string') {
                // 上传被阻止
                config.customAlert(xhr, 'error')
            }

            // 阻止以下代码执行，重要！！！
            return
        }

        // ------------------------------ 显示 base64 格式 ------------------------------
        if (uploadVideoShowBase64) {
            arrForEach(files, file => {
                const _this = this
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function () {
                    if (!this.result) return
                    _this.insertVideo(this.result.toString())
                }
            })
        }
    }
}

export default UploadVideo
