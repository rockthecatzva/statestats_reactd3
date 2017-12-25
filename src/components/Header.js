import React from 'react';
import styled from 'styled-components'

const HeaderDiv = styled.div`
    font-family: CustomFont;
    text-align: center;
    `;

const Header = () => (
    <HeaderDiv>
        <h1>American Community Survey Data from the Census Bureau (census.gov)</h1>
        <p>This is a react & d3.js visualization using the API data from census.gov.</p>
        <p>Select a demographic from the dropdown list:</p>
    </HeaderDiv>
)

export default Header;


