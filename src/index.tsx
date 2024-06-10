import { Form, List, showToast, Toast } from "@raycast/api";
import path from 'path';
import { useListProfiles } from "./hooks/useListProfiles";
import React, { useCallback, useEffect, useState } from "react";
import { ProfileListItem } from "./components/ProfileListItem";
import { useConnectProfile } from "./hooks/useConnectProfile";
import { useDisconnectProfile } from "./hooks/useDisconnectProfile";
import { UPDATE_INTERVAL } from "./constants";
import { Profile } from "./types";
import { useImportProfile } from "./hooks/useImportProfile";
import Style = Toast.Style;

type WatchProfile = {
  toast: Toast;
  profile: Profile;
  successText: string;
  changeHandler: (prev: Profile, current: Profile) => boolean;
};


export default function Command() {
  const { isLoading, data: profiles, revalidate: revalidateProfiles } = useListProfiles();
  const [watchProfile, setWatchProfile] = useState<WatchProfile | null>(null);
  const [importFileError, setImportFileError] = useState<string>();
  const isEmpty = profiles.length === 0;
  const connectProfile = useConnectProfile();
  const disconnectProfile = useDisconnectProfile();
  const importProfile = useImportProfile();

  const handleConnectProfile = useCallback(
    async (profile: Profile) => {
      connectProfile(profile.id);

      const toast = await showToast(Style.Animated, `Connecting to ${profile.name}`);

      setWatchProfile({
        toast,
        profile,
        successText: `Connected to ${profile.name} successfully`,
        changeHandler: (prev: Profile, current: Profile) => prev.connected !== current.connected
      })
    },
    [connectProfile],
  );

  const handleDisconnectProfile = useCallback(
    async (profile: Profile) => {
      disconnectProfile(profile.id);
      await showToast(Style.Success, `${profile.name} Disconnected`);
    },
    [disconnectProfile],
  );

  const handleImportFile = useCallback(async (filePath: string) => {
    const ext = path.extname(filePath);

    if(ext !== '.tar') {
      setImportFileError("Please select .tar file");
      return;
    }

    setImportFileError(undefined);
    const toast = await showToast(Style.Animated, `Importing profile file.`)
    try {
      importProfile(filePath);

      toast.style = Style.Success;
      toast.title = 'Import successfully, refreshing...';
    } catch(e) {
      toast.style = Style.Failure;
      toast.title = 'Failed to import profile file';

      if(e instanceof Error) {
        toast.message = e.message || 'Unknown error';
      } else {
        toast.message = 'Unknown error';
      }

    } finally {
      revalidateProfiles();
    }
  }, [importProfile]);

  useEffect(() => {
    const intervalID = setInterval(() => revalidateProfiles(), UPDATE_INTERVAL);
    return () => clearInterval(intervalID);
  }, [revalidateProfiles]);

  useEffect(() => {
    if(watchProfile) {
      const { profile, changeHandler, toast, successText  } = watchProfile;
      const newProfile = profiles.find(p => p.id === watchProfile.profile.id);
      if(newProfile && changeHandler(profile, newProfile)) {
        toast.style = Style.Success;
        toast.title = successText;
      }
    }
  }, [profiles, watchProfile]);

  if(isEmpty) {
    return (
      <Form>
        <Form.Description title="" text="Profiles not found, please import profiles first." />
        <Form.FilePicker
          id="profileFile"
          title="Profile file (.tar)"
          error={importFileError}
          onChange={files => handleImportFile(files[0])}
          allowMultipleSelection={false}
        />
      </Form>
    )
  }

  return (
    <List isLoading={isLoading}>
      {
        profiles.map((profile) => (
          <ProfileListItem
            key={profile.id}
            profile={profile}
            onConnect={handleConnectProfile}
            onDisconnect={handleDisconnectProfile}
          />
        ))
      }
    </List>
  );
}
