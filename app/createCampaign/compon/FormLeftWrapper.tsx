import React, { useContext } from 'react'
import styled from 'styled-components'
import { FormState, FormContextProps } from '@utils/formContext';

const FormLeftWrapper = () => {
  const Handler = useContext<FormContextProps | undefined>(FormState);
  // Handling the case when Handler is undefined
  if (!Handler) {
    return null;
  }
  return (
    <FormLeft>
        <FormInput>
          <label>Campaign Title</label>
          <Input 
            placeholder='Campaign Title' 
            name='campaignTitle'
            value={Handler.formData.campaignTitle}
            onChange={Handler.FormHandler}
          >
          </Input>
        </FormInput>
        <FormInput>
          <label>Description</label>
          <TextArea 
            name="description" 
            placeholder='Describe Your Story'
            value={Handler.formData.description}
            onChange={Handler.FormHandler}
          >
          </TextArea>
        </FormInput>
    </FormLeft>
  )
}

const FormLeft = styled.div`
  width:48%;
`

const FormInput = styled.div`
  display:flex ;
  flex-direction:column;
  font-family:'Source Sans 3', sans-serif;
  margin-top:10px ;
`
const Input = styled.input`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;
`

const TextArea = styled.textarea`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  font-family: 'Source Sans 3', sans-serif;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none;
  border-radius:8px ;
  outline:none;
  font-size:large;
  max-width:100%;
  min-width:100%;
  min-height:160px;
  resize: vertical;
`

export default FormLeftWrapper
