import DigestClient from "digest-fetch";
import {TIDBCLOUD_API_HOST} from "../api";
import {loadEnvConfig} from "../env";

export class TiDBCloudClient {

  private client: DigestClient;
  constructor(publicKey: string, privateKey: string) {
    this.client = new DigestClient(publicKey, privateKey);
  }

  async getProjects() {
    const resp = await this.client.fetch(`${TIDBCLOUD_API_HOST}/api/v1beta/projects`);
    if (resp.status !== 200) {
      throw new Error(`request invalid, code : ${resp.status}, message : ${resp.statusText}`);
    }
    return resp.json();
  }

  async createProject(name: string, awsCmekEnabled: boolean = false) {
    const resp = await this.client.fetch(`${TIDBCLOUD_API_HOST}/api/v1beta/projects`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        aws_cmek_enabled: awsCmekEnabled,
      }),
    });
    if (resp.status !== 200) {
      throw new Error(`request invalid, code : ${resp.status}, message : ${resp.statusText}`);
    }
    return resp.json();
  }

}

async function main() {
  const envConfig = loadEnvConfig();
  const client = new TiDBCloudClient(envConfig.TIDB_CLOUD_PUBLIC_KEY, envConfig.TIDB_CLOUD_PRIVATE_KEY);
  const res = await client.createProject('test');
  console.log(res);

  const projects = await client.getProjects();
  console.log(projects);
}

main().catch(console.error);