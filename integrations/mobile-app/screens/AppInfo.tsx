import { View, Text, ScrollView, StyleSheet, Button } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import * as Application from "expo-application";
import * as Updates from "expo-updates";
import Config from "../lib/config";
import useAppShellHost from "../lib/appShellHost";
import TopNav from "../components/TopNav";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { siteBaseUrl } = Config;

export type RouteParams = {};

export type AppInfoScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "AppInfo"
>;

export default function AppInfoScreen({ navigation }: AppInfoScreenProps) {
  const [lastLogEntries, setLastLogEntries] =
    useState<Updates.UpdatesLogEntry[]>();
  const [lastUpdateCheckResult, setLastUpdateCheckResult] =
    useState<Updates.UpdateCheckResult>();
  const [lastUpdateFetchResult, setLastUpdateFetchResult] =
    useState<Updates.UpdateFetchResult>();
  const insets = useSafeAreaInsets();

  const api = useAppShellHost();
  const { contentVersionInfo = {} } = api.state || {};

  const checkUpdateDisplay = lastUpdateCheckResult
    ? ` (${lastUpdateCheckResult.manifest?.id} - ${lastUpdateCheckResult.manifest?.createdAt})`
    : "...";

  const forceUpdateDisplay = lastUpdateFetchResult
    ? ` (${lastUpdateFetchResult.manifest?.id} - ${lastUpdateFetchResult.manifest?.createdAt})`
    : "...";

  const handleCheckUpdate = async () => {
    try {
      const result = await Updates.checkForUpdateAsync();
      setLastUpdateCheckResult(result);
    } catch (reason) {
      alert(reason);
    }
  };

  const handleForceUpdate = async () => {
    try {
      const result = await Updates.fetchUpdateAsync();
      setLastUpdateFetchResult(result);
      await Updates.reloadAsync();
    } catch (reason) {
      alert(reason);
    }
  };

  const handleReadLogEntries = async () => {
    try {
      const entries = await Updates.readLogEntriesAsync();
      setLastLogEntries(entries);
    } catch (reason) {
      alert(reason);
    }
  };

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        // Skip top margin, taken care of by ConditionalTopNav
        marginLeft: insets.left,
        marginRight: insets.right,
        marginBottom: insets.bottom,
      }}
    >
      <TopNav
        title="Application Info"
        leftLabel="Back"
        leftIsBack={true}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView>
        <InfoTable
          title="Content Version"
          rows={{
            "Site base URL": siteBaseUrl,
            Version: contentVersionInfo.version,
            Tag: contentVersionInfo.tag,
            "Build Date": contentVersionInfo.build && new Date(contentVersionInfo.build).toISOString(),
          }}
        />
        <InfoTable
          title="App Version"
          rows={{
            Version: Config.packageVersion,
            Tag: Config.buildTag,
            Update: Updates.updateId,
            Channel: Updates.channel,
            NativeBuildVersion: Application.nativeBuildVersion,
            CheckAutomatically: Updates.checkAutomatically,
            CreatedAt: "" + Updates.createdAt,
            IsEmbeddedLaunch: "" + Updates.isEmbeddedLaunch,
            IsEmergencyLaunch: "" + Updates.isEmergencyLaunch,
          }}
        />
        <Button
          title={`Check Update${checkUpdateDisplay}`}
          onPress={handleCheckUpdate}
        />
        <Button
          title={`Force Update${forceUpdateDisplay}`}
          onPress={handleForceUpdate}
        />
        <Button title="Read Update Log" onPress={handleReadLogEntries} />
        {lastLogEntries && <UpdateLog entries={lastLogEntries} />}
      </ScrollView>
    </View>
  );
}

function InfoTable({
  title,
  rows,
}: {
  title: string;
  rows: Record<string, string>;
}) {
  return (
    <View style={styles.infoTable}>
      <Text style={styles.infoTableTitle}>{title}</Text>
      {Object.entries(rows).map(([name, value], idx) => (
        <View key={`info-table-${idx}`} style={styles.infoRow}>
          <Text style={[styles.infoColumn, styles.infoHeader]}>{name}</Text>
          <Text style={styles.infoColumn}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function UpdateLog({ entries }: { entries: Updates.UpdatesLogEntry[] }) {
  // TODO: maybe format these entries more nicely?
  const entriesSorted = [...entries];
  entriesSorted.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <View style={styles.updateLog}>
      {entriesSorted.map((entry, idx) => (
        <UpdateEntry key={`update-log-entry-${idx}`} entry={entry} />
      ))}
    </View>
  );
}

function UpdateEntry({ entry }: { entry: Updates.UpdatesLogEntry }) {
  const { timestamp, level, code, message /*, stacktrace */ } = entry;
  return (
    <View style={styles.updateLogEntry}>
      <Text style={styles.updateLogEntryMeta}>
        {level}: {new Date(timestamp).toISOString()} {code}
      </Text>
      <Text style={styles.updateLogEntryMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoTable: {
    padding: 12,
    textAlign: "left",
    flexDirection: "column",
  },
  infoTableTitle: {
    textAlign: "left",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 4,
    paddingTop: 4,
    borderBottomColor: "lightgray"
  },
  infoColumn: {
    flex: 1,
    flexDirection: "column",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  infoHeader: {
    fontWeight: "600",
    textAlign: "left",
  },
  updateLog: {
    padding: 12,
  },
  updateLogEntry: {
    marginVertical: 4,
  },
  updateLogEntryMeta: {
    opacity: 0.5,
  },
  updateLogEntryMessage: {
    padding: 4,
  },
});
