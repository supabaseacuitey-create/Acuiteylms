import { View } from "@/registry/bases/takumi/lib/pdf-primitives";
import type { PDFComponentProps } from "@/registry/types/pdf-components";

export interface PageBreakProps extends Omit<PDFComponentProps, "children"> {
  children?: never;
}

export const PageBreak = ({ style }: PageBreakProps) => (
  <View style={[{ breakBefore: "page" }, style].filter(Boolean) as never} />
);
