import React from 'react'

function Detail(prop) {
    return (
        <div className="d-flex justify-content-between px-1">
                <span> {prop.title}</span>
                <span>{prop.value}</span>
        </div>
    )
}

export default Detail