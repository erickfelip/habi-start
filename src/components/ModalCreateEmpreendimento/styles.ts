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
