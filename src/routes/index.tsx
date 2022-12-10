import { component$, useServerMount$, useClientMount$, useStore } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';

// https://qwik.builder.io/docs/components/events/
export const Counter = component$(() => {
  const store = useStore({ count: 0 });

  return <button onClick$={() => store.count++}>{store.count}</button>;
});

export default component$(() => {
  const github = useStore({
    org: 'BuilderIO',
    repos: null as string[] | null,
  });

  // SSR
  useServerMount$(async () => {
    // Put code here to fetch data from the server.
    github.repos = await getRepositories('hisasann');
    console.log('ssr');
  });

  useClientMount$(() => {
    // This code will ONLY run once in the browser, when the component is mounted
    console.log('csr');
  });

  return (
    <div>
      <Counter />
      <span>GitHub username: {github.org}</span>
      <div>
        {github.repos ? (
          <ul>
            {github.repos.map((repo) => (
              <li>
                <a href={`https://github.com/${github.org}/${repo}`}>{repo}</a>
              </li>
            ))}
          </ul>
        ) : (
          'loading...'
        )}
      </div>
      <Link class="mindblow" href="/flower/">
        Blow my mind 🤯
      </Link>
    </div>
  );
});

export async function getRepositories(username: string, controller?: AbortController) {
  const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
    signal: controller?.signal,
  });
  const json = await resp.json();
  return Array.isArray(json) ? json.map((repo: { name: string }) => repo.name) : null;
}

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
