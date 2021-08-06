import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Drawer, Form, InputNumber, Input } from 'antd'
import axios from 'axios'
import {api} from './constant'
import { observer } from 'mobx-react-lite';
import TasksStore from './stores/tasks'
const { Column } = Table;
import Result from './result'


const List = () => {

    const { isLoading, list } = TasksStore
    const [result, setResult] = useState(null)
    const [showDrawer, setShowDrawer] = useState(false)
    const [editRow, setEditRow] = useState<any>(null)
    const [form] = Form.useForm();
    //open detail
    const open = (row: any) => {
        setResult(row)
    }
    const edit = (row: any) => {
        setShowDrawer(true)
        setEditRow(row)
    }
    const closeEdit = () => {
        setShowDrawer(false)
        setEditRow(null)
    }
    const onFinish = (values: any)=>{
       const id = editRow._id
       TasksStore.update(id, values,closeEdit)
       
    }

    useEffect(() => {

        TasksStore.fetchList()
        
    }, [])
    return (
        <>
            <Table 
                rowKey="_id"
                loading={isLoading}
                dataSource={list}
                expandable={{
                    expandedRowRender: (record: any) => {

                        const result = JSON.parse(record.result)
                        const arr = []

                        for (const key in result.details) {

                            arr.push({
                                key,
                                ...result.details[key]
                            })
                        }

                        return arr.map((item) => {

                            return (<p key={item.key}>{item.key}:{item.errormsg}</p>)
                        })


                    },
                    rowExpandable: record => record.status === 1
                }}
                pagination={{ defaultPageSize: 5 }}>
                <Column title="name" dataIndex="name" key="name" />
                <Column title="url" 
                    dataIndex="activityUrl"
                     key="activityUrl"
                    render={(activityUrl) => (<a href={activityUrl} target="_blank">{activityUrl}</a>)}
                />
                <Column title="origin" dataIndex="origin" key="origin"

                />
                <Column 
                    title="deviceCount"
                    dataIndex="deviceList"
                    key="deviceList"
                    render={(deviceList: string[]) => (<span>{deviceList.length}</span>) }
                />
                <Column title="slideNum" dataIndex="slideNum" key="slideNum" />
                <Column title="status" dataIndex="status" key="status"
                    render={(status) => {
                        if (status === 1) {
                            return (
                                <Tag color="green">成功</Tag>
                            )
                        }
                        if (status === 2) {
                            return (
                                <Tag color="red">失败</Tag>
                            )
                        }
                        if (status === 3) {
                            return (
                                <Tag color="blue">执行中</Tag>
                            )
                        }
                    }}
                />
                <Column title="操作" render={(a, row:any) => (
                    <Space>
                        <Button type="link" disabled={row.status===3} onClick={() => { open(row) }}>详细</Button>
                        <Button type="link" disabled={row.status === 3} onClick={() => { edit(row) }} >修改</Button>

                    </Space>
                )} />
            </Table>
            <Drawer
                title={editRow?.name}
                width={720}
                closable={false}
                onClose={closeEdit}
                visible={showDrawer}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={closeEdit} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={()=>{form.submit()}}>
                            Submit
                        </Button>
                    </div>
                }

            >
            {editRow
             && 
                <Form layout="vertical"
                    hideRequiredMark
                    form={form}
                    initialValues={editRow}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="名称"
                        name="name"
                        rules={[{ required: true, message: 'Please input name!' }]}
                    >
                    <Input />
                    </Form.Item>
                 
                    <Form.Item
                        label="原图地址"
                        name="origin"

                    >
                        <Input />
                    </Form.Item>
                  
                </Form>
                }
            </Drawer>
            <Result data={result} />
        </>
    );
};

export default observer(List);
