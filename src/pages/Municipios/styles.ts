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
  background: #f07620;

  color: white;
  display: flex;
  align-items: center;

  height: 40px;
  margin-left: auto;
  border: 0.2px solid #dadada;
  border-radius: 10px;
  cursor: pointer;

  transition: 0.2s ease;
  &:hover {
    background: #2a2a2a;
  }
`;
