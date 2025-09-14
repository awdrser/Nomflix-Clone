import { styled } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    };
  }
}

export const Wrapper = styled.div`
  background-color: rgb(30, 30, 30);
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0), rgba(30, 30, 30, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

export const Title = styled.h2`
  font-size: 4vw;
  margin-bottom: 1.5vw;
  width: 40%;
`;

export const Overview = styled.p`
  font-size: 1.5vw;
  width: 40%;
  max-height: 300px;
  overflow-y: hidden;
`;
