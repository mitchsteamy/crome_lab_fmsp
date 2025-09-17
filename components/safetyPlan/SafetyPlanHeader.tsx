import { Image, Platform, StyleSheet } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import { DateUtils } from "../../utils/dateUtils";

interface SafetyPlanHeaderProps {
  stats: {
    totalMedications: number;
    activeMedications: number;
    expiredMedications: number;
    patients: string[];
  };
}

export default function SafetyPlanHeader({ stats }: SafetyPlanHeaderProps) {
  return (
    <ThemedView style={styles.header} lightColor="#fff" darkColor="#2a2a2a">
      <ThemedView style={styles.title} lightColor="#fff" darkColor="#2a2a2a">
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
                <ThemedText
                  type="title"
                  style={styles.titleText}
                  lightColor="#333"
                  darkColor="#fff"
                >
                  Medication Safety Plan
                </ThemedText>
                <ThemedView style={styles.titleAccent} />

                <ThemedText
                  style={styles.subtitle}
                  lightColor="#666"
                  darkColor="#999"
                >
                  Generated on {DateUtils.formatDate(new Date(), "long")}
                </ThemedText>
              </ThemedView>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </>
          ) : (
            // Mobile layout: Logo above, Text below
            <>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <ThemedView
                style={styles.headerTextContainer}
                lightColor="#fff"
                darkColor="#2a2a2a"
              >
                <ThemedText
                  type="title"
                  style={styles.titleText}
                  lightColor="#333"
                  darkColor="#fff"
                >
                  Medication Safety Plan
                </ThemedText>
                <ThemedView style={styles.titleAccent} />

                <ThemedText
                  style={styles.subtitle}
                  lightColor="#666"
                  darkColor="#999"
                >
                  Generated on {DateUtils.formatDate(new Date(), "long")}
                </ThemedText>
              </ThemedView>
            </>
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView
        style={styles.statsContainer}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedView style={styles.statCard} lightColor="#fff" darkColor="#333">
          <ThemedText
            style={styles.statNumber}
            lightColor="#333"
            darkColor="#fff"
          >
            {stats.activeMedications}
          </ThemedText>
          <ThemedText
            style={styles.statLabel}
            lightColor="#666"
            darkColor="#999"
          >
            Active Medications
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard} lightColor="#fff" darkColor="#333">
          <ThemedText
            style={styles.statNumber}
            lightColor="#333"
            darkColor="#fff"
          >
            {stats.expiredMedications}
          </ThemedText>
          <ThemedText
            style={styles.statLabel}
            lightColor="#666"
            darkColor="#999"
          >
            Inactive Medications
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    alignItems: "center",
  },
  headerLogo: {
    width: Platform.OS === "web" ? 250 : 200,
    height: Platform.OS === "web" ? 85 : 68,
    marginLeft: Platform.OS === "web" ? 15 : 0,
    marginBottom: 24,
    borderRadius: 8,
  },
  headerTextContainer: {
    flex: Platform.OS === "web" ? 1 : 0,
    alignItems: Platform.OS === "web" ? "flex-start" : "center",
  },
  infoContainer: {
    marginBottom: 8,
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
  },
  title: {},
  titleText: {
    marginBottom: 4,
  },
  titleAccent: {
    width: 48,
    height: 3,
    backgroundColor: "#f78b33",
    borderRadius: 2,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
});
