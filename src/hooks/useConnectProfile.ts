import { APPLICATION_PATH } from "../constants";
import { Preferences } from "../types";
import { getPreferenceValues } from "@raycast/api";
import { generateToken } from "node-2fa";
import { execSync } from "child_process";
import { useCallback } from "react";

export const useConnectProfile = () => {
  return useCallback((profileID: string) => {
    const { twoStepKey, pin } = getPreferenceValues<Preferences>();
    const token = generateToken(twoStepKey)?.token;
    const password = `${pin}${token}`;
    return execSync(`${APPLICATION_PATH} start ${profileID} --password=${password}`);
  }, []);
};
