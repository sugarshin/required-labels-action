import * as core from '@actions/core';
import { uniq } from './utils';

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
    const requiredAny = core.getInput('requiredAny');
    const requiredAll = core.getInput('requiredAll');
    const banned = core.getInput('banned');

    if (!requiredAny && !requiredAll && !banned) {
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

    if (requiredAll) {
      const requiredAllLabels = uniq<string>(requiredAll.split(',').filter(l => l));
      if (prLabelNames.length === 0 || !prLabelNames.every(l => requiredAllLabels.includes(l))) {
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
