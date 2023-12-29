function Icon(prop) {
    return (
        <span className="material-symbols-outlined" style={{color:`rgb(${prop.color})`,fontSize:`${prop.size}px`}}>
            {prop.iconName}
        </span>
    )
}

export default Icon