import styled, { keyframes } from 'styled-components';
import React, {
  ReactElement,
  useRef,
  useState,
  useEffect,
  HTMLAttributes,
  useCallback,
} from 'react';

export const TabContent = styled.div`
    flex: 1;
    min-width: 100%;
    max-width: 100%;
    background-color: white;
    z-index: 1;
`;

TabContent.defaultProps = {
  isVisible: false,
};

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  selected?: number;
  children?: ReactElement[];
}

export const TabsBase = styled.div<TabsProps>`
    display: flex;
    flex-direction: row;
    max-width: 100vw;
    overflow-x: hidden;
    position: relative;
    margin: 0 auto;
`;

const TabsSlider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: none;
  z-index: 2;
  transition: transform 5s ease-in-out;
`;

export const Tabs = ({ selected, children, ...props }: TabsProps) => {
  const [tempSelected, setTempSelected] = useState(selected || 0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const slide = useCallback(
    (from: number, to: number) => {
      if (!sliderRef.current) {
        return;
      }

      const slider = sliderRef.current;
      slider.style.display = 'flex';
      slider.style.transitionDuration = `${Math.abs(from - to) / 5}s`;
      setTimeout(() => {
        slider.style.transform = `translateX(-${to * 100}%)`;
      }, 0);
    },
    [children]
  );

  useEffect(() => {
    if (selected !== undefined && selected !== tempSelected) {
      slide(tempSelected, selected);
    }

    if (sliderRef.current) {
      const slider = sliderRef.current;
      const onEnd = () => {
        if (selected === undefined) {
          return;
        }

        setTempSelected(selected);
        slider.style.display = 'none';
      };

      slider.addEventListener('transitionend', onEnd);
      return () => {
        slider.removeEventListener('transitionend', onEnd);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, slide]);

  const selectedChild =
    selected !== undefined &&
    (React.Children.toArray(children)[selected] as ReactElement);

  return (
    <TabsBase {...props}>
      <TabsSlider ref={sliderRef}>{children}</TabsSlider>
      {selectedChild}
    </TabsBase>
  );
};
