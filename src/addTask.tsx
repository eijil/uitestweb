import React, { useEffect, useMemo, useState } from "react";
import { Form, Drawer, Row, Col, Select, Input, Button, InputNumber, message } from 'antd';

import { observer } from 'mobx-react-lite';
import TasksStore from './stores/tasks'

const { Option } = Select;

const AddTask = () => {

    const [form] = Form.useForm();
    const { devices } = TasksStore

    const [renderLoading, setRenderLoading] = useState(false)

    const [showDrawer, setShowDrawer] = useState(false)

    const closeAdd = () => {
        setShowDrawer(false)
    }
    const open = () => {
        setShowDrawer(true)
    }

    const select = () => {
        TasksStore.getDevices()
    }

    const render = () => {
     
        const url = form.getFieldValue('activityUrl')
        if (!url) {
            message.error('先填活动链接')
            return
        }
        setRenderLoading(true)
        TasksStore.renderOrigin(url).then(
            ({ data }) => {
             
                if(data.code ===0){
                    form.setFieldsValue({
                        origin:data.result
                    })
                }
                setRenderLoading(false)
            },
            () => {
                message.error('Server error')
                setRenderLoading(false)
            }
        )
    }


    const deviceOptions = useMemo(() => {
        return devices.map((item: any) => {
            return <Option key={item.serial} value={item.serial}>{item.deviceName} ({item.resolution})</Option>
        })
    }, [devices])

    const onSubmit = (values: any) => {

       
        TasksStore.addTask(values, () => closeAdd())
    };

    return (
        <div className="add-tasks">
            <Button
                type="primary"
                size="large"
                onClick={open}
            >添加任务</Button>
            <Drawer
                title="创建测试任务"
                width={500}
                closable={false}
                onClose={closeAdd}
                visible={showDrawer}
                placement="left"
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={closeAdd} style={{ marginRight: 20 }}>
                            关闭
                        </Button>
                        <Button type="primary" onClick={() => { form.submit() }}>
                            提交
                        </Button>
                    </div>
                }

            >
                <Form
                    form={form}
                    layout="vertical"
                    hideRequiredMark
                    onFinish={onSubmit}
                    initialValues={{
                        activityUrl: 'https://m.jd.com',
                        slideNum: 5
                    }}
                >
                    <Form.Item
                        label="名称"
                        name="name"
                        rules={[{ required: true, message: 'Please input name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="活动链接"
                        name="activityUrl"
                        rules={[{ required: true, message: 'Please input url' }]}
                    >
                        <Input />
                    </Form.Item>
                   
                    <Row >
                        <Col span={20}>
                            <Form.Item
                                extra="填写图片地址或通过无头浏览器生成活动图"
                                label="对比图片"
                                name="origin"
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label=" "
                            >
                            <Button loading={renderLoading} onClick={render} type="primary" >生成</Button>
                            </Form.Item>

                        </Col>
                    </Row>
                   
                   

                    <Form.Item
                        label="选择机型"
                        name="deviceList"
                        rules={[{ required: true, message: 'Please select' }]}
                    >
                        {devices.length ?
                            <Select
                                mode="multiple"
                                placeholder="选择机型"

                            >
                                {deviceOptions}
                            </Select> :
                            <Button type="primary" onClick={select}>选择</Button>
                        }
                    </Form.Item>
                    <Form.Item
                        label="滑动次数"
                        name="slideNum"
                    >
                        <InputNumber min={2} max={50} />
                    </Form.Item>
                </Form>

            </Drawer>
        </div>
    );
};

export default observer(AddTask)
