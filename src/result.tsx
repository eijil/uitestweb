import React, { useMemo, useEffect } from "react";

import { Image, Row, Col, Button, message } from 'antd'
import { api } from './constant'
import axios from 'axios'



const Result = (props: any) => {


    const { data } = props


    if (!data) {
        return null
    }

    console.log(data)


    const diff = (taskId: string, device: string, origin: string, template: string) => {

        axios({
            method: 'post',
            url: api.diff,
            data: {
                taskId,
                device,
                origin,
                template,
                threshold: 0.6
            }
        }).then(res => {

            console.log(res)
            message.success('diff success')
        })
    }

    const details = useMemo(() => {


        const arr = []


        const result = JSON.parse(data.result)

        for (const key in result.details) {

            arr.push({
                key,
                ...result.details[key]
            })
        }

        return arr.map((item) => {
            return (

                <div key={item.key}>
                    <h2>{item.key}</h2>
                    {item.errormsg ? <h3>{item.errormsg}</h3> :
                        <>
                            <h3>解屏</h3>
                            <Image.PreviewGroup
                            >
                                {item.images.map((src: string, i) => (
                                    <Image
                                        key={i}
                                        width={50}
                                        src={src}
                                    />
                                ))}
                            </Image.PreviewGroup>

                            <h3>长图</h3>
                            <Row gutter={16}>
                                <Col>

                                    <Image

                                        width={100}
                                        src={item.merge}
                                    />

                                </Col>
                                <Col>

                                    <Image

                                        width={100}
                                        src={data.origin}
                                    />

                                </Col>
                                <Col>
                                    <Image
                                        width={100}
                                        src={item.diff?.url}
                                    />
                                </Col>

                                <Col>
                                    <p>templateMath:{item.diff?.templateMath}</p>
                                    <p>pixelsDiff:{1 - item.diff?.pixelsDiff}</p>
                                    <p>threshold:{item.diff?.threshold}</p>
                                    <Button onClick={() => {

                                        diff(data._id, item.key, data.origin, item.merge)
                                    }}>diff</Button>
                                </Col>
                            </Row>
                        </>
                    }
                </div>
            )
        })

    }, [data])

    return (
        <>
            {details}
        </>
    );
};

export default Result;
