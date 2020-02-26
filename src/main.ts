import * as fs from 'fs';
import * as core from '@actions/core';
import { GitHub, context } from '@actions/github';
import { uniq, includesOneof } from './utils';

export async function run(): Promise<void> {
  try {
    const requiredAny = core.getInput('required_any', { required: false });
    const requiredAll = core.getInput('required_all', { required: false });
    const requiredOneof = core.getInput('required_oneof', { required: false });
    const banned = core.getInput('banned', { required: false });

    if (!requiredAny && !requiredAll && !requiredOneof && !banned) {
      console.log('nothing labels to check');
      process.exit(0);
    }

    const { GITHUB_EVENT_PATH } = process.env;
    if (!GITHUB_EVENT_PATH) {
      throw new Error('`GITHUB_EVENT_PATH` must be required');
    }

    const token = core.getInput('github_token', { required: true });
    const client = new GitHub(token);

    const event = JSON.parse(
      fs.readFileSync(GITHUB_EVENT_PATH, 'utf8')
    ) as { pull_request?: { number?: number }};

    if (!event.pull_request || !event.pull_request.number) {
      throw new Error('there is no pull request data in event');
    }

    const { data: pullRequest } = await client.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: event.pull_request.number, // eslint-disable-line @typescript-eslint/camelcase
    });

    const prLabelNames = pullRequest.labels.map(l => l.name);

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
