import styled, { keyframes } from 'styled-components';
import React, {
  ReactElement,
  useRef,
  useState,
  useEffect,
  HTMLAttributes,
  useCallback,
  FC,
  ReactNode,
  createContext,
} from 'react';

export const TabContent = styled.div`
    flex: 1;
    min-width: 100%;
    max-width: 100%;
    z-index: 1;
`;

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  selected?: number;
  children?: ReactNode;
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
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: none;
  z-index: 2;
  transition: transform 5s ease-in-out;
`;

export const TabNavigation = styled.div`
  display: flex;
`;

export interface TabNavigationContextProps {
  setSelected: (value: number) => void;
  selected: number;
}

const TabNavigationContext = createContext({} as TabNavigationContextProps);
export interface TabNavigationProps {
  children?: ReactNode;
}

type TabChildren = [ReactElement, ReactElement[]];

const useParseTabsChildren = (children: ReactElement[]): TabChildren => {
  const allChildren = React.Children.toArray(children);

  const result = allChildren.reduce(
    (acc: TabChildren, child) => {
      const element = child as ReactElement;
      if (!element.type) {
        return acc;
      }
      if (element.type === TabNavigation) {
        acc[0] = element;
      } else {
        acc[1].push(
          <TabContent>{React.cloneElement(element, element.props)}</TabContent>
        );
      }
      return acc;
    },
    [null as unknown as ReactElement, []]
  );

  return result;
};

export const Tabs = ({ children, ...props }: TabsProps) => {
  const [selected, setSelected] = useState(0);
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

  const [navigation, content] = useParseTabsChildren(
    children as ReactElement[]
  );

  const selectedChild = selected !== undefined && content[selected];

  return (
    <TabsBase {...props}>
      <TabNavigationContext.Provider value={{ selected, setSelected }}>
        {navigation}
      </TabNavigationContext.Provider>
      <TabsSlider ref={sliderRef}>{content}</TabsSlider>
      {selectedChild}
    </TabsBase>
  );
};
