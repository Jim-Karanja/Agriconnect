import styled from 'styled-components';

export const Box = styled.div`
  padding: 2px 20px; /* Reduced padding to decrease height */
  background: #06402B;
  color: white;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  @media (max-width: 1000px) {
    padding: 10px 20px; /* Adjusted for smaller screens */
  }
`;
