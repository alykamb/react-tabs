import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import { TabContent, Tabs } from './Tabs';

const colors: any = {};

const getColor = (index: number) => {
  if (!colors[index]) {
    colors[index] = `#${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10
    )}${Math.floor(Math.random() * 10)}`;
  }
  return colors[index];
};

const Page = styled.div<{ index: number }>`
  width: 100%;
  height: 400px;
  background-color: ${({ index }: { index: number }) => getColor(index)};
  position: relative;
  &::after {
    content: "${({ index }: { index: number }) => index}";
    position: absolute;
    color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 6em;
    font-weight: bold;
  }
`;

const pages = Array.from({ length: 6 }).map((_, i) => i);

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        {pages.map((i) => {
          return (
            <button type="button" key={i} onClick={() => setCount(i)}>
              {`Tab ${i}`}
            </button>
          );
        })}
      </div>
      <Tabs selected={count} style={{ width: '300px' }}>
        {pages.map((i) => {
          return (
            <TabContent key={i}>
              <Page index={i} />
            </TabContent>
          );
        })}
      </Tabs>
    </div>
  );
}

export default App;
