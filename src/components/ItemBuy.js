import React from 'react'
import Icon from './icons/Icon'
function ItemBuy(prop) {

    var isBuy = prop.currentamount >= prop.price ? "rgb(0,128,0)" : "rgb(200,40,110)"
    return (
        <>
            <Icon iconName={prop.iconName} size="15" />
            <span style={{ color: isBuy, fontWeight:"900" }}>{prop.price}  </span>
        </>

    )
}

export default ItemBuy