import styled from "styled-components";

export const Grid = styled.div`
  /* padding: 25px 20px; */
  padding-bottom: 0px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  @media (max-width: 1600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1300px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
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
  /* grid-row-gap: 30px; */
  justify-items: stretch;
  align-items: stretch;
`;


export const Grid3x3 = styled.div`
  /* padding: 25px 20px; */
  padding-bottom: 0px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
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
  /* grid-row-gap: 30px; */
  justify-items: stretch;
  align-items: stretch;
`;

export const SelectableCard = styled.div<any>`
  cursor: pointer;
  min-width: 100%;
  text-align: center;
  transition: all 0.2s ease;
  border-radius: 10px;
  border: 2px solid ${(props) => (props.$selected ? "#1677ff" : "#f0f0f0")};

  &:hover {
    border-color: #1677ff;
  }
`;
