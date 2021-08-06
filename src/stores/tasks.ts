
import { makeAutoObservable, action } from "mobx";
import axios from 'axios'
import _ from 'lodash'
import { api } from '../constant'
import { message } from "antd";

class TasksStore {

    list = []
    isLoading = true
    devices: string[] = []

    constructor() {
        makeAutoObservable(this)
    }

    /** 任务列表 */
    fetchList(params = {}) {
        this.isLoading = true
        axios
            .get(api.task, {
                ...params,
                timeout: 5000,
            })
            .then(
                action('success', res => {
                    this.list = res.data
                    this.isLoading = false
                }),
                action('error', () => {
                    message.error('Server error!')
                    this.isLoading = false
                })
            )
    }
    

    addTask(params: any, callback: any) {

        axios({
            method: 'post',
            url: api.task,
            data: {
                creator: 'lijie67',
                systemWebview: 0,
                ...params,
            }
        }).then(
            action('success', res => {
                const { data } = res
                if (data.code === 0) {
                    message.success('创建成功!')
                    this.fetchList()
                    if (callback) {
                        callback()
                    }
                }
            }),
            action('error', () => {
                message.error('Server error!')
            })
        )
    }

    update(id:string,values:any,callback:any){
        axios({
            method: 'put',
            url: `${api.task}/${id}`,
            data: {
                ...values,
                status: 3,
            }
        }).then(
            action('success', res => {
               
                console.log(res)
              
                    message.success('创建成功!')
                    this.fetchList()
                    if (callback) {
                        callback()
                    }
                
            }),
            action('error', () => {
                message.error('Server error!')
            })
        )
    }
    getDevices() {

        axios
            .get(api.devices)
            .then(
                action('success', res => {
                    const data = res.data
                    if (data.code === 0) {
                        const handlerData = _.filter(data.result, (o: any) => {
                            const ios = o.platform === 'Ios'
                            const valid = o.deviceName.indexOf('合规测试机') < 0
                            return !ios && valid
                        })
                        this.devices = handlerData
                    }
                }),
                action('error', () => {
                    message.error('Server error!')
                })
            )
    }

    renderOrigin(url: string) {
        return axios({
            method: 'post',
            url: api.snapshot,
            
            data: { url }
        })
    }

}

export default new TasksStore();