import { useMemo } from "react";
import { Profile } from "../types";
import { useExec } from "@raycast/utils";
import { APPLICATION_PATH } from "../constants";

export const useListProfiles = () => {
  const { data, ...restExecReturn } = useExec(APPLICATION_PATH, ["list", "--json"]);
  const profiles = useMemo<Profile[]>(() => JSON.parse(data || "[]"), [data]);
  return {
    data: profiles,
    ...restExecReturn
  };
};
