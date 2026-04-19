import { Action, ActionPanel, List, showHUD, popToRoot } from "@raycast/api";
import { useState, useEffect } from "react";
import { HistoryEntry, looksLikeDoi, relativeTime, addToHistory } from "./utils";

const STORAGE_KEY = "doi2bib-history";

export default function Command() {
  const [doi, setDoi] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBib, setCurrentBib] = useState<string | null>(null);

  async function fetchBib(rawDoi: string) {
    // implemented in Task 5
  }

  const showFetchItem = looksLikeDoi(doi) && doi !== history[0]?.doi;

  return (
    <List
      isLoading={isLoading}
      isShowingDetail
      filtering={false}
      searchText={doi}
      onSearchTextChange={setDoi}
      searchBarPlaceholder="Paste or type a DOI…"
    >
      {showFetchItem && (
        <List.Item
          title={`↩ Fetch: ${doi}`}
          detail={
            <List.Item.Detail
              isLoading={isLoading}
              markdown={currentBib ? `\`\`\`bibtex\n${currentBib}\n\`\`\`` : ""}
            />
          }
          actions={
            <ActionPanel>
              <Action title="Fetch BibTeX" onAction={() => fetchBib(doi)} />
            </ActionPanel>
          }
        />
      )}

      {history.length > 0 && (
        <List.Section title="History">
          {history.map((entry) => (
            <List.Item
              key={entry.doi}
              title={entry.doi}
              subtitle={relativeTime(entry.fetchedAt)}
              detail={<List.Item.Detail markdown={`\`\`\`bibtex\n${entry.bib}\n\`\`\``} />}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard
                    title="Copy BibTeX"
                    content={entry.bib}
                    onCopy={async () => {
                      await showHUD("Copied!");
                      await popToRoot();
                    }}
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      )}
    </List>
  );
}
