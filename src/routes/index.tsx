import { component$, Resource, useServerMount$, useClientMount$, useStore } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { getPostList, Post } from "~/lib/client";

export const onGet: RequestHandler<Post[]> = async () => {
  const data = await getPostList();
  return data.contents;
};

export const head: DocumentHead = {
  title: "Qwik Blog",
};

export const PostItem = component$((props: { post: Post }) => {
  const { post } = props;
  return (
    <li>
      <Link href={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  );
});

export const PostItems = component$((props: { posts: Post[] }) => {
  const { posts } = props;
  return (
    <ul>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
});

export default component$(() => {
  const store = useStore({
    posts: [],
  });

  const resource = useEndpoint<Post[]>();

  // SSR
  // https://qwik.builder.io/tutorial/hooks/use-mount/#component-life-cycle-and-ssr
  useServerMount$(async () => {
    // Put code here to fetch data from the server.
    console.log('ssr');
  });

  // CSR
  // https://qwik.builder.io/docs/components/lifecycle/#useclientmount
  useClientMount$(async () => {
    // This code will ONLY run once in the browser, when the component is mounted
    console.log('csr');
    const data = await getPostList();
    store.posts = data.contents;
  });

  return (
    <div>
      <h1>日記一覧</h1>

      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onRejected={(error) => <div>Error: {error.message}</div>}
        onResolved={(posts) => {
          if (!posts || posts.length <= 0) {
            return null;
          }

          return (
            <PostItems posts={posts}/>
          )
        }}
      />
      <PostItems posts={store.posts}/>
    </div>
  );
});