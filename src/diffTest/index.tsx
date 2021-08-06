import React, { useEffect, useState } from "react";
import {Table,Row,Col} from 'antd'
import openCV from 'react-opencvjs';
import a from './img/origin.jpeg'
import b from './img/2.jpg'
import c from './img/t1.jpg'
const DiffTest = () => {
    const [ready,setReady] = useState(false)

    useEffect(() => {
        openCV({
            onLoaded: () => {
                console.log('open cv loaded')
                setReady(true)
            },
            onFailed: () => console.log('open cv failed to load'),
            version: '4.5.1'
        })
    }, [])

    useEffect(() => {
        if(ready){
            let src = cv.imread('input')
            let templ = cv.imread('tempinput');


            const dst = new cv.Mat()
            let mask = new cv.Mat();
           
            
          

            //cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
            // // You can try more different parameters
            // cv.Canny(src, src, 50, 100, 3, false);
            // //cv.imshow('output', dst);
           
            //cv.cvtColor(templ, templ, cv.COLOR_RGB2GRAY, 0);
            // // You can try more different parameters
            // cv.Canny(templ, templ, 50, 100, 3, false);
            // //cv.imshow('output', dst);

          
            
            cv.matchTemplate(src, templ, dst, cv.TM_CCORR_NORMED, mask);
            let result = cv.minMaxLoc(dst, mask);
            let maxPoint = result.maxLoc;
            let color = new cv.Scalar(255, 0, 0, 255);
            let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
            cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);
            cv.imshow('output', src);
            src.delete(); dst.delete(); mask.delete();
            console.log({ result, maxPoint, point})
            console.log(result.maxVal)

        }
    }, [ready])

    const data = [{
        origin:a,
        template: c
    }]
    const columns = [
        {
            title: 'origin',
            dataIndex: 'origin',
            key: 'origin',
            render:(path)=>(
                
                <img src={path} id="input"  />
            )
        },
        {
            title: 'template',
            dataIndex: 'template',
            key: 'template',
            render: (path) => (
                <img src={path} id="tempinput"  />
            )
        },
        {
            title:'result',
            render: (path) => (
                <canvas id="output"></canvas>
            )
            
        }
    ]

   
    return (
       <div>
           <Table dataSource={data} columns={columns}></Table>
       </div>
    );
};

export default DiffTest;
