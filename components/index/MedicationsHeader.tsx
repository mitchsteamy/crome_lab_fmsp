import React from "react";
import { Image, Platform, StyleSheet, useWindowDimensions } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";

interface MedicationsHeaderProps {
  medicationCount: number;
}

export default function MedicationsHeader({ medicationCount }: MedicationsHeaderProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768; // Adjust this breakpoint as needed
  
  // Choose logo based on screen size
  const logoSource = isSmallScreen 
    ? require("../../assets/images/logo_small.png")
    : require("../../assets/images/logo.png");
  
  const logoSize = isSmallScreen ? 48 : (Platform.OS === "web" ? 250 : 200);
  const logoHeight = isSmallScreen ? 48 : (Platform.OS === "web" ? 85 : 68);

  return (
    <ThemedView style={styles.header} lightColor="#fff" darkColor="#2a2a2a">
      <ThemedView
        style={styles.headerContent}
        lightColor="#fff"
        darkColor="#2a2a2a"
      >
        {Platform.OS === "web" ? (
          // Web layout: Text left, Logo right
          <>
            <ThemedView
              style={styles.headerTextContainer}
              lightColor="#fff"
              darkColor="#2a2a2a"
            >
              <ThemedText type="title">My Medicines</ThemedText>
              <ThemedText type="default" lightColor="#666" darkColor="#ccc">
                {medicationCount} medicine
                {medicationCount !== 1 ? "s" : ""}
              </ThemedText>
            </ThemedView>
            <Image
              source={logoSource}
              style={[styles.headerLogo, { width: logoSize, height: logoHeight }]}
              resizeMode="contain"
            />
          </>
        ) : (
          // Mobile layout: Logo above, Text below
          <>
            <Image
              source={logoSource}
              style={[styles.headerLogo, { width: logoSize, height: logoHeight }]}
              resizeMode="contain"
            />
            <ThemedView
              style={styles.headerTextContainer}
              lightColor="#fff"
              darkColor="#2a2a2a"
            >
              <ThemedText type="title">My Medicines</ThemedText>
              <ThemedText type="default" lightColor="#666" darkColor="#ccc">
                {medicationCount} medicine
                {medicationCount !== 1 ? "s" : ""}
              </ThemedText>
            </ThemedView>
          </>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? 48 : 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerContent: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    alignItems: "center",
  },
  headerLogo: {
    marginLeft: Platform.OS === "web" ? 15 : 0,
    marginBottom: Platform.OS === "web" ? 0 : 12,
    borderRadius: 8,
  },
  headerTextContainer: {
    flex: Platform.OS === "web" ? 1 : 0,
    alignItems: Platform.OS === "web" ? "flex-start" : "center",
  },
});