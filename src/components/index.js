import React from 'react'

const InputField = (props) => {
    return (
        <div>
           <input style={{marginRight: "10px"}} disabled={props.fieldActivity} type="text" placeholder="Useless field"/> 
           <input style={{marginRight: "5px"}}onClick={props.toggleActivity} type="checkbox" name="toggleActivity" id="toggleActivity"/>
           <label htmlFor="toggleActivity">Toggle field Activity</label>
        </div>
    )
}

export default InputField
