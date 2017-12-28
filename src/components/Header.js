import React from 'react';
import styled from 'styled-components'

const HeaderDiv = styled.div`
    font-family: CustomFont;
    text-align: center;
    `;
const DescriptionP = styled.p`
    width: 70%;
    text-align: left;
    margin-left: auto;
    margin-right: auto;`;

const Header = () => (
    <HeaderDiv>
        <h1>American Community Survey Data from the Census Bureau (census.gov)</h1>
        <DescriptionP>This is a react/redux & d3.js visualization of the American Community Survey from census.gov. Use the drop-down menus to select variables from the survey and interact with the visualizations to view state-level information and grouping.</DescriptionP>
    </HeaderDiv>
)

export default Header;


