import { APPLICATION_PATH } from "../constants";
import { useCallback } from "react";
import { execSync } from "child_process";

export const useDisconnectProfile = () => {
  return useCallback((profileID: string) => {
    return execSync(`${APPLICATION_PATH} stop ${profileID}`);
  }, []);
};
