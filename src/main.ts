import { getInput, setOutput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { uniq, includesOneof } from './utils';

type LabelsItem = {
  color: string;
  default: boolean;
  description: string;
  id: number;
  name: string;
  node_id: string;
  url: string;
}

export async function run(): Promise<void> {
  try {
    const requiredAny = getInput('required_any', { required: false });
    const requiredAll = getInput('required_all', { required: false });
    const requiredOneof = getInput('required_oneof', { required: false });
    const banned = getInput('banned', { required: false });

    if (!requiredAny && !requiredAll && !requiredOneof && !banned) {
      console.log('nothing labels to check');
      process.exit(0);
    }

    const { pull_request: pullRequest } = context.payload;
    if (!pullRequest || !pullRequest.labels) {
      throw new Error('there is no `pull_request.labels` in event data');
    }

    const labels: LabelsItem[] = pullRequest.labels;
    const prLabelNames = labels.map(l => l.name);

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

    setOutput('required_labels', 'ok');
  } catch (error) {
    setFailed(error.message);
  }
}
