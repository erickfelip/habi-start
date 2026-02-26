import styled from "styled-components";
import { Link } from "react-router-dom";

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 20px;
  background-color: #f8f8f8;
  color: #f8f8f8;
`;

export const RouteLabelDrawer = styled(Link)`
  font-family: Inter;
  font-weight: 300;
  color: black;

  &:hover {
    font-weight: 500;
    color: white;
  }
`;

export const NavDrawer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 25px;

  a {
    padding: 10px;
    color: #686868;
    text-decoration: none;
    font-size: 18px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    border-radius: 3px;
    &:hover {
      border-radius: 3px;
      background-color: #d4d4d4;
      color: white;
    }
  }
`;
export const StartLogo = styled.img`
  height: 120px;
  width: 120px;
  object-fit: contain;
  margin-left: 0px;
`;

export const NavLinks = styled.ul`
  display: flex;
  gap: 45px;
  margin-bottom: 0px;

  a {
    color: #686868;
    text-decoration: none;
    font-size: 16px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const RouteLabel = styled(Link)`
  font-family: Inter;
  font-weight: 300;
  color: black;
`;

export const LastElement = styled.div`
  display: flex;
`;

export const HourContainer = styled.div`
  display: flex;
  gap: 12px;
  position: fixed;
  right: 20px;
  top: 10px;
`;
export const WrapperSubtitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
`;

export const HourWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledMoment = styled.span`
  font-size: 2.2rem;
  font-weight: 500;
  font-family: Inter;
  color: #5a5a5a;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

export const SubTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 400;
  color: #979797;
  font-family: Inter;
`;

export const UnderTitle = styled.span`
  font-size: 1rem;
  font-weight: 300;
  color: #979797;
  font-family: Inter;
`;
