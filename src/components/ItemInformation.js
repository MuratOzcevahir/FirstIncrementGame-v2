import React from 'react'
import Icon from './icons/Icon'

function ItemInformation(prop) {
    return (
        <>
            <div id="item_information" className='d-flex align-items-center'>
           <Icon iconName="question_mark" size="15" color="0,0,205" />   
            
             <span>{prop.description}.</span>
            </div>
            <hr />
        </>

    )
}

export default ItemInformation