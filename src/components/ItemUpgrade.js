import React from 'react'
import Icon from "./icons/Icon"
function ItemUpgrade(prop) {


    var isBuy = prop.currentprice >= prop.upgradeprice ? "rgb(0,128,0)" : "rgb(200,40,110)"
    return (


        <>
            <button onClick={() => { prop.buttonclick() }} type="button" className=" d-flex justify-content-center update" style={{ color: isBuy, fontWeight: "900" }}>
                <span>
                    update
                    (</span>  <Icon iconName="local_atm" size="15" color="236, 204, 123" />
                <span>
                    {prop.upgradeprice.toFixed(2)})
                </span>
            </button>
        </>



    )
}

export default ItemUpgrade