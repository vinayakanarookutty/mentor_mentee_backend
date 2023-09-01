import { devConfig } from "./dev/devConfig";
const configEnvMap = {
    'dev': devConfig,
  
}
const config = configEnvMap[process.env.NODE_ENV] || devConfig;
export { config }