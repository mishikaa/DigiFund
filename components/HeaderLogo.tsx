import React from 'react'
import styled from 'styled-components'

const HeaderLogo = () => {
  return (
      <Logo>DigiFund</Logo>
  )
}

const Logo = styled.div`
    font-weight: bolder;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60%;
    letter-spacing: 0.02rem;
    font-size: 1.5rem;
    margin-left: 8px;
    /* font-family: 'Playfair Display', serif; */
    font-family: 'Libre Baskerville', serif;
    font-style: italic;
`
export default HeaderLogo
