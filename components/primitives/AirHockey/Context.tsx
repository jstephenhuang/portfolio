import { createContext, PropsWithChildren, RefObject, useContext } from "react";

import type { CanvasView, ItemRect } from "./physics";

export type AirHockeyPhysics = {
  friction: number;
  bounce: number;
};

interface AirHockeyContextValue {
  physics: AirHockeyPhysics;
  off: boolean;
  rinkRef: RefObject<HTMLDivElement | null>;
  view: CanvasView;
  register: (element: HTMLDivElement, measure: () => ItemRect) => () => void;
  setZoom: (zoom: number) => void;
  fitAll: () => void;
}

export type ProviderProps = Omit<AirHockeyContextValue, "off"> & { off?: boolean };

const AirHockeyContext = createContext<AirHockeyContextValue | null>(null);

export const Provider: React.FC<PropsWithChildren<ProviderProps>> = ({ children, off = false, ...value }) => {
  return (
    <AirHockeyContext.Provider
      value={{
        ...value,
        off,
      }}
    >
      {children}
    </AirHockeyContext.Provider>
  );
};

export const useAirHockeyContext = () => {
  const context = useContext(AirHockeyContext);

  if (!context) {
    throw new Error("useAirHockeyContext must be used within AirHockeyContext.");
  }

  return context;
};
