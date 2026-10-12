import type { ReactNode } from "react";

import { View } from "@/registry/bases/forme/lib/pdf-primitives";
import type { Style } from "@/registry/types/pdf-components";

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export const KeepTogether = ({ children, style }: KeepTogetherProps) => (
  <View wrap={false} style={style as never}>
    {children}
  </View>
);
