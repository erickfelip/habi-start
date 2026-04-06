import { Button } from "antd";
import styled from "styled-components";

export const Container = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
`;

export const Label = styled.span`
  font-family: Inter;
  font-weight: 500;
  font-size: 1.3rem;
  color: #000000;
`;

export const GreetignLabelSub = styled.span`
  font-family: Inter;
  font-weight: 200;
  font-size: 1.2rem;
  color: #5d5d5d;
`;

export const LabelSub = styled.span`
  font-family: Inter;
  font-weight: 200;
  font-size: 1.1rem;
  color: #5d5d5d;
`;

export const WrapperTable = styled.div`
  box-shadow: rgba(14, 63, 126, 0.06) 0px 0px 0px 1px,
    rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px,
    rgba(42, 51, 70, 0.04) 0px 2px 2px -1px,
    rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px,
    rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px,
    rgba(42, 51, 70, 0.03) 0px 10px 10px -5px,
    rgba(42, 51, 70, 0.03) 0px 24px 24px -8px;
  background-color: white;
  border-radius: 20px;
`;

export const LabelJourney = styled.span`
  font-family: Inter;
  font-weight: 500;
  font-size: 1.2rem;
  color: #000000;
`;

export const SubLabelJourney = styled.span`
  font-family: Inter;
  font-weight: 200;
  font-size: 1.1rem;
  color: #5d5d5d;
`;

export const ButtonExport = styled.button`
  background: white;
  color: black;
  display: flex;
  align-items: center;
  /* gap: 10px; */
  height: 40px;
  margin-left: auto;
  border: 0.2px solid #dadada;
  border-radius: 10px;
  cursor: pointer;

  transition: 0.2s ease;
  &:hover {
    background: #f0f0f0;
  }
`;

export const ButtonSolicitation = styled(Button)`
  /* background: #f07620; */

  color: white;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;

  border: 0.2px solid #dadada;
  border-radius: 10px;
  cursor: pointer;

  transition: 0.2s ease;
  /* &:hover {
    background: #2a2a2a;
  } */
`;

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

export const GridSelected = styled.div`
  /* padding: 25px 20px; */
  width: 100%;
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
  grid-row-gap: 30px;
  justify-items: stretch;
  align-items: stretch;
`;

export const SelectableCard = styled.div<any>`
  /* background-color: white; */
  background-color: ${(props) => (props.$selected ? "#76afff" : "white")};
  cursor: pointer;
  min-width: 100%;
  text-align: center;
  transition: all 0.2s ease;
  border-radius: 10px;
  border: 4px solid ${(props) => (props.$selected ? "#1677ff" : "#f0f0f0")};

  &:hover {
    border-color: #1677ff;
  }
`;
