import React from 'react'

const InputField = (props) => {
    return (
        <div>
           <input disabled={props.fieldActivity} type="text" placeholder="Useless field"/> 
           <input onClick={props.toggleActivity} type="checkbox" name="toggleActivity" id="toggleActivity"/>
           <label htmlFor="toggleActivity">Toggle field Activity</label>
        </div>
    )
}

export default InputField
