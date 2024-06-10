import { Profile } from "../types";
import { Color, Icon, Image, List } from "@raycast/api";
import React, { useMemo } from "react";
import { ProfileActions } from "./ProfileActions";
import { truthy } from "../utils";
import ImageLike = Image.ImageLike;

type ProfileListItem = {
  profile: Profile;
  onDisconnect: (profile: Profile) => void;
  onConnect: (profile: Profile) => void;
};

export const ProfileListItem: React.FunctionComponent<ProfileListItem> = ({
  profile,
  onConnect,
  onDisconnect,
}) => {
  const {
    id,
    name,
    client_address,
    connected: isConnected,
    run_state,
    status
  } = profile;

  const isActivated = run_state === "Active";
  const isConnecting = status === "Connecting";

  const icon = useMemo<ImageLike | undefined>(() => {
    if(isConnecting) {
      return { source: Icon.Circle, tintColor: Color.SecondaryText }
    }

    if(isConnected) {
      return { source: Icon.FullSignal, tintColor: Color.Green }
    }

    return undefined;
  }, [isConnected, isConnecting]);

  const accessories = useMemo(() => [
    isActivated && { text: status },
    isActivated && { text: client_address },
  ].filter(truthy), [client_address, isActivated, status]);

  return (
    <List.Item
      id={id}
      icon={icon}
      key={id}
      title={name}
      accessories={accessories}
      actions={<ProfileActions
        isActivated={isActivated}
        profile={profile}
        onDisconnect={onDisconnect}
        onConnect={onConnect}
      />}
    />
  )
}
