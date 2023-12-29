import React from 'react'
import "./css/Resources.css";
function Resources(prop) {
    return (
        <>
            <div id="resourceHolder" className='container '>
                <div className='row'>
                    <div className='col '><span> R_ A : {prop.resourceA}/{prop.ras}</span></div>
                    <div className='col '><span>R_ B : {prop.resourceB}</span></div>
                    <div className='col'><span>R_ C : {prop.resourceC} </span></div>
                </div>

            </div>

        </>
    )
}

export default Resources