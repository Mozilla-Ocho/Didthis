import { version } from '../../../package.json';
import Config from '../../config';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import type { Methods } from "./index";

export const Ping: Methods["ping"] = async (api, payload) => {
  api.set("webContentReady", true);
  api.set("contentVersionInfo", payload);
  return {
    version,
    build: Application.nativeBuildVersion,
    tag: Config.buildTag,
    update: Updates.updateId,
    channel: Updates.channel,
  };
};

export default Ping;
