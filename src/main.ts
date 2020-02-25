import * as core from '@actions/core';
import { uniq, includesOneof } from './utils';

type LabelsItem = {
  color: string;
  default: boolean;
  description: string;
  id: number;
  name: string;
  node_id: string;
  url: string;
};

type GitHubEvent = {
  pull_request: {
    labels: LabelsItem[];
  };
}

export async function run(): Promise<void> {
  try {
    const requiredAny = core.getInput('required_any');
    const requiredAll = core.getInput('required_all');
    const requiredOneof = core.getInput('required_oneof');
    const banned = core.getInput('banned');

    if (!requiredAny && !requiredAll && !requiredOneof && !banned) {
      console.log('nothing labels to check');
      process.exit(0);
    }

    const { GITHUB_EVENT_PATH } = process.env;

    if (!GITHUB_EVENT_PATH) {
      throw new Error('`GITHUB_EVENT_PATH` must be required');
    }

    const event = require(GITHUB_EVENT_PATH) as GitHubEvent;
    const prLabelNames = event.pull_request.labels.map(l => l.name);

    if (requiredAny) {
      const requiredAnyLabels = uniq<string>(requiredAny.split(',').filter(l => l));
      if (!prLabelNames.some(l => requiredAnyLabels.includes(l))) {
        throw new Error(`required label at least one of \`${requiredAny}\``);
      }
    }

    if (requiredOneof) {
      const requiredOneofLabels = uniq<string>(requiredOneof.split(',').filter(l => l));
      if (requiredOneofLabels.length < 2) {
        throw new Error('required set at least two labels to use `required_oneof`');
      }
      if (!includesOneof(requiredOneofLabels, prLabelNames)) {
        throw new Error(`required label one of \`${requiredOneof}\``);
      }
    }

    if (requiredAll) {
      const requiredAllLabels = uniq<string>(requiredAll.split(',').filter(l => l));
      if (prLabelNames.length === 0 || !requiredAllLabels.every(l => prLabelNames.includes(l))) {
        throw new Error(`required label must be all of \`${requiredAll}\``);
      }
    }

    if (banned) {
      const bannedLabels = uniq<string>(banned.split(',').filter(l => l));
      if (prLabelNames.some(l => bannedLabels.includes(l))) {
        throw new Error(`${banned} must be unlabelled`);
      }
    }

    console.log('ok!');
  } catch (error) {
    core.setFailed(error.message);
  }
}
