import { APPLICATION_PATH } from "../constants";
import { execSync } from "child_process";
import { useCallback } from "react";

export const useImportProfile = () => {
  return useCallback((filePath: string) => {
    return execSync(`${APPLICATION_PATH} add "${filePath}"`);
  }, []);
};
