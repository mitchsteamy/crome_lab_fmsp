// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, Platform, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName =
  | "medication.fill"
  | "plan.fill"
  | "chevron.left.forwardslash.chevron.right"
  | "chevron.right"
  | "add.circle"
  | "trash"
  | "pencil";

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  "medication.fill": "medication",
  "plan.fill": "text-snippet",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "add.circle": "add-circle",
  trash: "delete",
  pencil: "edit",
};

// Force load Material Icons from CDN on web
if (Platform.OS === "web" && typeof document !== "undefined") {
  // Ensure the font is loaded from CDN
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'MaterialIcons';
      src: url(https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: block;
    }
  `;
  if (!document.querySelector("style[data-material-icons]")) {
    style.setAttribute("data-material-icons", "true");
    document.head.appendChild(style);
  }
}

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
