import styled from "styled-components";

export const Grid = styled.div`
  /* padding: 25px 20px; */
  padding-bottom: 0px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1300px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 0px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
    margin-top: 0px;
  }
  grid-column-gap: 30px;
  grid-row-gap: 30px;
  justify-items: stretch;
  align-items: stretch;
`;

export const Label = styled.span`
  font-family: Inter;
  font-weight: 500;
  color: black;
  font-size: 18px;
`;

export const SubLabel = styled.span`
  font-family: Inter;
  font-weight: 300;
  color: black;
  font-size: 18px;
`;
