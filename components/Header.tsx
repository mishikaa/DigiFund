import styled from "styled-components";
import HeaderLogo from "@components/HeaderLogo";
import HeaderCenter from "@components/HeaderCenter";
import HeaderRight from "@components/HeaderRight";
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderWrapper className={`z-40 ${isMenuOpen ? 'open' : ''}`}>
      <HeaderLogo />
      <HeaderCenter />
      <HeaderRight />
      <MenuButton onClick={toggleMenu}>
        <div className={`bar ${isMenuOpen ? 'bar1-open' : ''}`}></div>
        <div className={`bar ${isMenuOpen ? 'bar2-open' : ''}`}></div>
        <div className={`bar ${isMenuOpen ? 'bar3-open' : ''}`}></div>
      </MenuButton>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  position: relative;

  @media (max-width: 768px) {
    height: auto;
    flex-direction: column;

    &.open {
      .bar {
        &.bar1-open {
          transform: rotate(-45deg) translate(-5px, 6px);
        }
        &.bar2-open {
          opacity: 0;
        }
        &.bar3-open {
          transform: rotate(45deg) translate(-5px, -6px);
        }
      }
    }
  }
`;

const MenuButton = styled.div`
  display: none; /* Hide by default on larger screens */

  @media (max-width: 768px) {
    display: block; /* Show on smaller screens */
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;

    .bar {
      width: 25px;
      height: 3px;
      background-color: #333;
      margin: 6px 0;
      transition: 0.4s;
    }
  }
`;

export default Header;
