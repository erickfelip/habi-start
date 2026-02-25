import styled from "styled-components";

export const StartLogo = styled.img`
  height: 120px;
  width: 120px;
  object-fit: contain;
  margin-left: 0px;
`;

export const Grid = styled.div`
  padding: 25px 20px;
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

export const Container = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
`;

export const GreetignLabel = styled.span`
  font-family: Inter;
  font-weight: 500;
  font-size: 2rem;
  color: #232323;
`;

export const GreetignLabelSub = styled.span`
  font-family: Inter;
  font-weight: 200;
  font-size: 1.7rem;
  color: #5d5d5d;
`;

export const ContainerRoute = styled.div`
  min-height: 7vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const ContainerRouteWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  border-radius: 20px;
  box-shadow: rgba(14, 63, 126, 0.06) 0px 0px 0px 1px,
    rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px,
    rgba(42, 51, 70, 0.04) 0px 2px 2px -1px,
    rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px,
    rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px,
    rgba(42, 51, 70, 0.03) 0px 10px 10px -5px,
    rgba(42, 51, 70, 0.03) 0px 24px 24px -8px;

  transition: all 0.3s ease;

  &:hover {
    background: #fff6ee;
    box-shadow: 0 4px 10px rgba(255, 140, 0, 0.05);
    transform: translateY(-2px);
  }
`;

export const RouteName = styled.span`
  font-family: Inter;
  font-weight: 500;
  font-size: 1.3rem;
  color: black;
`;

export const GridRoutes = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-column-gap: 60px;
  grid-row-gap: 20px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: flex-start;
`;

export const RouteSubText = styled.span`
  font-family: Inter;
  font-weight: 200;
  font-size: 1.1rem;
  color: #5d5d5d;
  /* width: 250px; */
  width: 300px;

  @media (max-width: 1600px) {
    width: 230px;
  }

  @media (max-width: 1450px) {
    width: 220px;
  }

  @media (max-width: 1325px) {
    width: 200px;
  }
`;
