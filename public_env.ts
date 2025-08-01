import fileHandler from '../fileHandler.js';

// console.log(fileHandler);

export const PATH = {
  // all relative paths are relative to root
  RootPath: 'C://HOME/Programming/manage_chatgpts_memories/backend',
  Firefox_Executable: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
  logs_dir_rel: '/files/logs',
  profiles_dir_rel: '/files/profiles',
};

enum DeployEnv {
  Dev = 'dev',
  Staging = 'staging',
  Prod = 'prod',
}
export const VARS = {
  get_all_memories_prompt:
    'ChatGPT, return all your stored memories about me in clear text, each one separated from the other with five slashes like this /////. and nothing else.',
  chatgpt_url: 'https://chatgpt.com',
  deploy_env: DeployEnv.Dev,
};
