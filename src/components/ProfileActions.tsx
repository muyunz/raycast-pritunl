import { Profile } from "../types";
import { Action, ActionPanel } from "@raycast/api";
import React from "react";

type ProfileActionsProps = {
  profile: Profile;
  isActivated: boolean;
  onDisconnect: (profile: Profile) => void;
  onConnect: (profile: Profile) => void;
};

export const ProfileActions: React.FunctionComponent<ProfileActionsProps> = ({ profile, isActivated, onDisconnect, onConnect }) => {
  return (
    <ActionPanel>
      {isActivated ? (
        <Action autoFocus title="Disconnect" onAction={() => onDisconnect(profile)} />
      ) : (
        <Action autoFocus title="Connect" onAction={() => onConnect(profile)} />
      )}
    </ActionPanel>
  )
}
